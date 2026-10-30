import { useEffect, useSyncExternalStore } from 'react'
import { currentVoiceSrc, subscribeAudio } from './audio'
import {
  AKOR,
  DURASI_LANGKAH,
  JUMLAH_BIRAMA,
  JUMLAH_LANGKAH,
  LANGKAH_DENTUM,
  LANGKAH_KOCOKAN,
  LANGKAH_PER_BIRAMA,
  MELODI,
  mtof,
  POLA_BASS,
  URUTAN_AKOR,
} from './komposisi'
import { konteks } from './konteks'

/**
 * Musik latar, suara latar, dan efek suara, semuanya dibuat langsung di browser (Web Audio),
 * jadi tidak ada berkas besar yang harus diunduh atau disimpan untuk mode offline.
 *
 * Suasana:
 * - `meriah`: lagu penuh (melodi marimba, arpeggio, bass, kocokan), untuk Beranda, Setup, dan Ringkasan.
 * - `tenang`: arpeggio dan bass pelan saja, untuk layar kerja, supaya anak tetap fokus (design.md 11).
 * Suara latar (sungai dan kicau burung) dinyalakan terpisah. Saat Badrul bicara, semuanya merendah.
 *
 * Musik dicoba bunyi langsung saat dibuka. Browser umumnya baru mengizinkan suara setelah anak
 * menyentuh layar, jadi kalau ditolak, musik mulai pada sentuhan pertama.
 */

export type Suasana = 'meriah' | 'tenang'

const KUNCI = 'jkr-musik'
const LOOKAHEAD = 0.28

let hidup = bacaPilihan()
let suasana: Suasana = 'meriah'
let latar = false
let sudahDisentuh = false
let merendah = false
let timerJadwal: number | null = null
let timerBurung: number | null = null
let langkahBerikut = 0
let waktuBerikut = 0
const pendengar = new Set<() => void>()

function bacaPilihan() {
  try {
    return localStorage.getItem(KUNCI) !== 'mati'
  } catch {
    return true
  }
}

const kabar = () => pendengar.forEach((fn) => fn())

export const musikHidup = () => hidup
export function subscribeMusik(fn: () => void) {
  pendengar.add(fn)
  return () => {
    pendengar.delete(fn)
  }
}

export function setMusikHidup(nilai: boolean) {
  hidup = nilai
  try {
    localStorage.setItem(KUNCI, nilai ? 'hidup' : 'mati')
  } catch {
    // Penyimpanan diblokir: pilihan hanya berlaku selama aplikasi terbuka.
  }
  sinkron()
  kabar()
  if (nilai) efek('klik')
}

export const useMusikHidup = () => useSyncExternalStore(subscribeMusik, musikHidup)

// ---- Graf audio ---------------------------------------------------------------------------

interface Graf {
  master: GainNode
  melodi: GainNode
  arpeggio: GainNode
  bass: GainNode
  kocokan: GainNode
  latar: GainNode
  efek: GainNode
  derau: AudioBuffer
  sungai: AudioBufferSourceNode | null
}

let graf: Graf | null = null

function buatGraf(): Graf {
  const c = konteks()
  const simpul = (nilai: number, tujuan: AudioNode) => {
    const g = c.createGain()
    g.gain.value = nilai
    g.connect(tujuan)
    return g
  }
  const master = simpul(0, c.destination)
  const derau = c.createBuffer(1, c.sampleRate * 2, c.sampleRate)
  const data = derau.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  return {
    master,
    melodi: simpul(0, master),
    arpeggio: simpul(0, master),
    bass: simpul(0, master),
    kocokan: simpul(0, master),
    latar: simpul(0, c.destination),
    efek: simpul(0.9, c.destination),
    derau,
    sungai: null,
  }
}

const ambil = () => (graf ??= buatGraf())

/** Terapkan volume sesuai suasana, pilihan anak, dan apakah Badrul sedang bicara. */
function terapkan() {
  if (!graf) return
  const t = konteks().currentTime
  const aktif = hidup && sudahDisentuh
  const turun = merendah ? 0.42 : 1
  const meriah = suasana === 'meriah'
  graf.master.gain.setTargetAtTime(aktif ? (meriah ? 0.17 : 0.1) * turun : 0, t, 0.35)
  graf.melodi.gain.setTargetAtTime(meriah ? 1 : 0, t, 0.5)
  graf.kocokan.gain.setTargetAtTime(meriah ? 1 : 0, t, 0.5)
  graf.arpeggio.gain.setTargetAtTime(meriah ? 0.8 : 1, t, 0.5)
  graf.bass.gain.setTargetAtTime(meriah ? 0.9 : 0.7, t, 0.5)
  graf.latar.gain.setTargetAtTime(aktif && latar ? turun : 0, t, 0.6)
  graf.efek.gain.setTargetAtTime(aktif ? 0.9 : 0, t, 0.05)
}

/** Jalankan atau hentikan penjadwal dan suara latar sesuai keadaan sekarang. */
function sinkron() {
  if (!sudahDisentuh) return
  const c = konteks()
  ambil()
  terapkan()
  const harusBunyi = hidup && !document.hidden
  if (harusBunyi) {
    void c.resume()
    mulaiPenjadwal()
    if (latar) mulaiLatar()
    else hentikanLatar()
  } else {
    hentikanPenjadwal()
    hentikanLatar()
    // Hemat baterai: konteks ditidurkan saat musik mati atau tab tersembunyi.
    if (!hidup || document.hidden) void c.suspend()
  }
}

export function aturSuasana(baru: Suasana, denganLatar: boolean) {
  suasana = baru
  latar = denganLatar
  sinkron()
}

/** Dipakai layar untuk menyatakan suasananya. Layar berikutnya yang tampil menang. */
export function useSuasana(baru: Suasana, denganLatar = false) {
  useEffect(() => {
    aturSuasana(baru, denganLatar)
  }, [baru, denganLatar])
}

// ---- Instrumen ----------------------------------------------------------------------------

function not(tujuan: AudioNode, t: number, midi: number, panjang: number, volume: number, jenis: OscillatorType) {
  const c = konteks()
  const o = c.createOscillator()
  const g = c.createGain()
  o.type = jenis
  o.frequency.value = mtof(midi)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(volume, t + 0.008)
  g.gain.exponentialRampToValueAtTime(0.0001, t + panjang)
  o.connect(g).connect(tujuan)
  o.start(t)
  o.stop(t + panjang + 0.05)
}

/** Marimba sederhana: nada dasar sinus ditambah nada tinggi pendek di dua oktaf di atasnya. */
function marimba(tujuan: AudioNode, t: number, midi: number, panjang: number, volume: number) {
  not(tujuan, t, midi, panjang, volume, 'sine')
  not(tujuan, t, midi + 24, Math.min(panjang, 0.14), volume * 0.22, 'sine')
}

function kocok(tujuan: AudioNode, t: number, volume: number) {
  const c = konteks()
  const s = c.createBufferSource()
  s.buffer = ambil().derau
  const f = c.createBiquadFilter()
  f.type = 'highpass'
  f.frequency.value = 6500
  const g = c.createGain()
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(volume, t + 0.004)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05)
  s.connect(f).connect(g).connect(tujuan)
  s.start(t, Math.random())
  s.stop(t + 0.07)
}

function dentum(tujuan: AudioNode, t: number, volume: number) {
  const c = konteks()
  const o = c.createOscillator()
  const g = c.createGain()
  o.type = 'sine'
  o.frequency.setValueAtTime(120, t)
  o.frequency.exponentialRampToValueAtTime(48, t + 0.12)
  g.gain.setValueAtTime(volume, t)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16)
  o.connect(g).connect(tujuan)
  o.start(t)
  o.stop(t + 0.2)
}

/** Jadwalkan semua not pada satu langkah lagu. Lapisan yang sedang dimatikan dilewati. */
function jadwalkan(langkah: number, t: number) {
  const g = ambil()
  const birama = Math.floor(langkah / LANGKAH_PER_BIRAMA) % JUMLAH_BIRAMA
  const dalam = langkah % LANGKAH_PER_BIRAMA
  const akor = AKOR[URUTAN_AKOR[birama]]
  const meriah = suasana === 'meriah'

  if (dalam % 2 === 0) marimba(g.arpeggio, t, akor.arpeggio[(dalam / 2) % 4], 0.32, 0.05)
  for (const [mulai, selisih, panjang] of POLA_BASS) {
    if (mulai === dalam) not(g.bass, t, akor.bass + selisih, panjang * DURASI_LANGKAH * 0.9, 0.1, 'triangle')
  }
  if (!meriah) return
  for (const [mulai, midi, panjang] of MELODI[birama]) {
    if (mulai === dalam) marimba(g.melodi, t, midi, Math.max(0.2, panjang * DURASI_LANGKAH * 1.1), 0.085)
  }
  if (LANGKAH_KOCOKAN.includes(dalam)) kocok(g.kocokan, t, 0.02)
  if (LANGKAH_DENTUM.includes(dalam)) dentum(g.kocokan, t, 0.07)
}

function mulaiPenjadwal() {
  if (timerJadwal !== null) return
  const c = konteks()
  waktuBerikut = c.currentTime + 0.06
  timerJadwal = window.setInterval(() => {
    while (waktuBerikut < c.currentTime + LOOKAHEAD) {
      jadwalkan(langkahBerikut, waktuBerikut)
      langkahBerikut = (langkahBerikut + 1) % JUMLAH_LANGKAH
      waktuBerikut += DURASI_LANGKAH
    }
  }, 70)
}

function hentikanPenjadwal() {
  if (timerJadwal !== null) window.clearInterval(timerJadwal)
  timerJadwal = null
}

// ---- Suara latar: sungai dan kicau burung -------------------------------------------------

function mulaiLatar() {
  const g = ambil()
  const c = konteks()
  if (!g.sungai) {
    const s = c.createBufferSource()
    s.buffer = g.derau
    s.loop = true
    const band = c.createBiquadFilter()
    band.type = 'bandpass'
    band.frequency.value = 520
    band.Q.value = 0.5
    const low = c.createBiquadFilter()
    low.type = 'lowpass'
    low.frequency.value = 1300
    const vol = c.createGain()
    vol.gain.value = 0.06
    s.connect(band).connect(low).connect(vol).connect(g.latar)
    s.start()
    g.sungai = s
  }
  if (timerBurung === null) jadwalBurung()
}

function hentikanLatar() {
  if (graf?.sungai) {
    try {
      graf.sungai.stop()
    } catch {
      // sudah berhenti
    }
    graf.sungai = null
  }
  if (timerBurung !== null) window.clearTimeout(timerBurung)
  timerBurung = null
}

function jadwalBurung() {
  timerBurung = window.setTimeout(() => {
    if (hidup && latar && !document.hidden) kicau()
    jadwalBurung()
  }, 3500 + Math.random() * 5500)
}

/** Dua sampai tiga kicauan pendek, tiap kicau menaik cepat. */
function kicau() {
  const c = konteks()
  const g = ambil()
  const dasar = 2300 + Math.random() * 1300
  const jumlah = 2 + Math.floor(Math.random() * 2)
  for (let i = 0; i < jumlah; i++) {
    const t = c.currentTime + 0.02 + i * 0.13
    const o = c.createOscillator()
    const v = c.createGain()
    o.type = 'sine'
    o.frequency.setValueAtTime(dasar, t)
    o.frequency.exponentialRampToValueAtTime(dasar * 1.4, t + 0.07)
    v.gain.setValueAtTime(0.0001, t)
    v.gain.exponentialRampToValueAtTime(0.035, t + 0.012)
    v.gain.exponentialRampToValueAtTime(0.0001, t + 0.09)
    o.connect(v).connect(g.latar)
    o.start(t)
    o.stop(t + 0.12)
  }
}

// ---- Efek suara ---------------------------------------------------------------------------

export type NamaEfek = 'pop' | 'plop' | 'chime' | 'hmm' | 'whoosh' | 'klik'

/** Efek pendek (di bawah 600 ms), bunyi alami dan lembut. Tidak ada bunyi "salah". */
export function efek(nama: NamaEfek) {
  if (!hidup || !sudahDisentuh) return
  const c = konteks()
  if (c.state === 'suspended') void c.resume()
  const g = ambil()
  const t = c.currentTime
  switch (nama) {
    case 'pop': {
      const o = c.createOscillator()
      const v = c.createGain()
      o.frequency.setValueAtTime(520, t)
      o.frequency.exponentialRampToValueAtTime(820, t + 0.08)
      v.gain.setValueAtTime(0.0001, t)
      v.gain.exponentialRampToValueAtTime(0.2, t + 0.01)
      v.gain.exponentialRampToValueAtTime(0.0001, t + 0.14)
      o.connect(v).connect(g.efek)
      o.start(t)
      o.stop(t + 0.16)
      break
    }
    case 'plop': {
      const o = c.createOscillator()
      const v = c.createGain()
      o.frequency.setValueAtTime(320, t)
      o.frequency.exponentialRampToValueAtTime(130, t + 0.16)
      v.gain.setValueAtTime(0.22, t)
      v.gain.exponentialRampToValueAtTime(0.0001, t + 0.2)
      o.connect(v).connect(g.efek)
      o.start(t)
      o.stop(t + 0.22)
      kocok(g.efek, t, 0.05)
      break
    }
    case 'chime':
      ;[72, 76, 79].forEach((m, i) => marimba(g.efek, t + i * 0.085, m, 0.38, 0.16))
      break
    case 'hmm':
      ;[67, 64].forEach((m, i) => not(g.efek, t + i * 0.14, m, 0.3, 0.1, 'triangle'))
      break
    case 'whoosh': {
      const s = c.createBufferSource()
      s.buffer = g.derau
      const f = c.createBiquadFilter()
      f.type = 'bandpass'
      f.Q.value = 0.8
      f.frequency.setValueAtTime(260, t)
      f.frequency.exponentialRampToValueAtTime(2400, t + 0.5)
      const v = c.createGain()
      v.gain.setValueAtTime(0.0001, t)
      v.gain.exponentialRampToValueAtTime(0.12, t + 0.18)
      v.gain.exponentialRampToValueAtTime(0.0001, t + 0.55)
      s.connect(f).connect(v).connect(g.efek)
      s.start(t, Math.random())
      s.stop(t + 0.6)
      break
    }
    case 'klik':
      kocok(g.efek, t, 0.12)
      break
  }
}

// ---- Pengait ke aplikasi ------------------------------------------------------------------

/**
 * Gerakan yang dianggap browser sebagai "sentuhan pengguna". Pada layar sentuh, `pointerdown`
 * tidak dihitung, hanya `pointerup`, `touchend`, dan `click`, jadi semuanya didengarkan.
 */
const GERAKAN = ['pointerdown', 'pointerup', 'touchend', 'click', 'keydown'] as const

/**
 * Pasang sekali di awal. Musik dicoba langsung bunyi saat aplikasi dibuka. Kalau browser menolak
 * (aturan autoplay), dicoba lagi di setiap sentuhan sampai berhasil, jadi sentuhan pertama di mana pun
 * sudah cukup tanpa harus menekan tombol musik.
 */
export function mulaiMusikSetelahSentuhan() {
  const coba = () => {
    sudahDisentuh = true
    sinkron()
    if (!hidup) return lepas()
    void konteks()
      .resume()
      .then(() => {
        if (konteks().state === 'running') lepas()
      })
      .catch(() => {})
  }
  const lepas = () => GERAKAN.forEach((g) => window.removeEventListener(g, coba))
  GERAKAN.forEach((g) => window.addEventListener(g, coba))
  coba()
  document.addEventListener('visibilitychange', sinkron)
  // Voice over berbicara: musik dan suara latar merendah supaya suara Badrul jelas.
  subscribeAudio(() => {
    const bicara = currentVoiceSrc() !== null
    if (bicara !== merendah) {
      merendah = bicara
      terapkan()
    }
  })
}
