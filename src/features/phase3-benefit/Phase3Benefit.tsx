import { ArrowRight, Check, Pencil, Star } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Burst } from '../../components/Burst'
import { Button } from '../../components/Button'
import { ElementToken } from '../../components/ElementToken'
import { ShortTextInput } from '../../components/ShortTextInput'
import { WorkScreen } from '../../components/WorkScreen'
import { elemenById, manfaatById } from '../../content'
import { playVoice } from '../../lib/audio'
import { attachedBenefits, canvasAt, CUSTOM_BENEFIT_ID } from '../../lib/derive'
import { bereaksi } from '../../store/badrulStore'
import { useActiveSession } from '../../store/sessionStore'
import { usePhaseFrame } from '../game/usePhaseFrame'
import { ikonGuna } from './ikonGuna'
import { benefitOptions, MIN_KARTU } from './options'

/** Jumlah kotak guna di bawah tempat. Dua wajib diisi, yang ketiga boleh. */
const KOTAK = 3

type Titik = { x: number; y: number }
type Terbang = { id: string; dari: Titik; ke: Titik }

/** Gelembung kartu guna. Isi sama dengan kartu yang terbang, supaya perpindahannya terasa mulus. */
function IsiKartu({ id }: { id: string }) {
  const Icon = ikonGuna(id)
  return (
    <>
      <span className="inline-flex size-[58px] shrink-0 pendek:size-11 items-center justify-center rounded-full bg-emas-100 text-marun-700 ring-2 ring-emas-600/40">
        <Icon aria-hidden size={32} strokeWidth={2.5} />
      </span>
      <span className="font-body text-[18px] leading-tight font-semibold text-balance text-tanah-900">{manfaatById.get(id)?.teks}</span>
    </>
  )
}

const kelasKartu =
  'flex h-[150px] w-[168px] flex-col items-center justify-center gap-1.5 rounded-[40px] border-[3px] border-emas-400 bg-gading-50 px-1.5 text-center shadow-rest pendek:h-[118px] pendek:w-[150px]'

/** Kartu yang meluncur dari gelembung ke kotak guna (animasi Web Animations, selesai lalu memanggil `onSelesai`). */
function KartuTerbang({ id, dari, ke, onSelesai }: Terbang & { onSelesai: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return onSelesai()
    const a = ref.current!.animate(
      [
        { transform: `translate(${dari.x}px, ${dari.y}px) translate(-50%, -50%) scale(1) rotate(0deg)` },
        { transform: `translate(${(dari.x + ke.x) / 2}px, ${Math.min(dari.y, ke.y) - 70}px) translate(-50%, -50%) scale(1.12) rotate(-6deg)`, offset: 0.45 },
        { transform: `translate(${ke.x}px, ${ke.y}px) translate(-50%, -50%) scale(0.5) rotate(0deg)` },
      ],
      { duration: 520, easing: 'cubic-bezier(0.3, 0.7, 0.3, 1)', fill: 'forwards' },
    )
    a.onfinish = onSelesai
    return () => a.cancel()
    // Dipasang sekali per kartu terbang.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div ref={ref} aria-hidden className={`${kelasKartu} pointer-events-none fixed top-0 left-0 z-50 shadow-lift`}>
      <IsiKartu id={id} />
    </div>
  )
}

export function Phase3Benefit() {
  const session = useActiveSession()!
  const { log, record, donePhases, actor, finish } = usePhaseFrame(3)
  const ids = [...canvasAt(log)]
  const attached = attachedBenefits(log)
  const terisiDi = (elementId: string) => [...(attached.get(elementId) ?? [])].filter((b) => b !== CUSTOM_BENEFIT_ID)

  // Mulai dari tempat pertama yang belum punya 2 kartu, supaya refresh kembali ke tempat yang sama.
  const firstOpen = ids.findIndex((x) => terisiDi(x).length < MIN_KARTU)
  const [index, setIndex] = useState(firstOpen === -1 ? Math.max(ids.length - 1, 0) : firstOpen)
  const [isian, setIsian] = useState(false)
  const [terbang, setTerbang] = useState<Terbang | null>(null)
  const [baru, setBaru] = useState<string | null>(null)
  const [catatan, setCatatan] = useState<string | null>(null)

  const id = ids[index]
  const elemen = elemenById.get(id)!
  const terisi = terisiDi(id).slice(0, KOTAK)
  const adaJawabanKami = attached.get(id)?.has(CUSTOM_BENEFIT_ID) ?? false
  const options = benefitOptions(id, session.id)
  const tepat = new Set(elemen.manfaat)
  const cukup = terisi.length >= MIN_KARTU
  const penuh = terisi.length >= KOTAK
  const isLast = index === ids.length - 1

  /** Ketuk gelembung: kartunya terbang ke kotak kosong berikutnya, lalu benar-benar dipasang. */
  const ambil = (benefitId: string, el: HTMLElement) => {
    if (terbang || penuh) return
    const tujuan = document.querySelector<HTMLElement>(`[data-kotak="${terisi.length}"]`)?.getBoundingClientRect()
    const asal = el.getBoundingClientRect()
    if (!tujuan) return
    setCatatan(null)
    setTerbang({
      id: benefitId,
      dari: { x: asal.left + asal.width / 2, y: asal.top + asal.height / 2 },
      ke: { x: tujuan.left + 44, y: tujuan.top + tujuan.height / 2 },
    })
  }

  /** Dipanggil saat kartu mendarat. */
  const mendarat = (benefitId: string) => {
    setTerbang(null)
    record('benefit_attached', { elementId: id, benefitId })
    const m = manfaatById.get(benefitId)
    if (m) playVoice(m.audio)
    setBaru(benefitId)
    // Umpan balik berupa cerita, bukan penilaian (design.md 12).
    if (tepat.has(benefitId)) {
      bereaksi('senang')
    } else {
      bereaksi('berpikir')
      setCatatan(`Hmm, ${m?.teks.toLowerCase()} untuk ${elemen.nama}? Kalau ragu, ketuk kartu di kotak untuk menukarnya.`)
    }
  }

  const kembalikan = (benefitId: string) => {
    record('benefit_detached', { elementId: id, benefitId })
    setCatatan(null)
    setBaru(null)
  }

  const saveCustom = (text: string) => {
    record('benefit_attached', { elementId: id, benefitId: CUSTOM_BENEFIT_ID, custom: { text } })
    setIsian(false)
    bereaksi('senang')
  }

  const jumlahTepat = terisi.filter((b) => tepat.has(b)).length
  const instruction =
    catatan ??
    (cukup
      ? jumlahTepat >= MIN_KARTU
        ? 'Hebat! Mau menambah guna menurut kalian sendiri?'
        : 'Sudah terisi. Kalau yakin, lanjut. Atau tukar kartu yang ragu.'
      : terisi.length === 0
        ? `Apa gunanya ${elemen.nama} bagi warga? Ketuk kartu yang cocok.`
        : `Satu lagi! Apa guna ${elemen.nama} yang lain?`)

  return (
    <WorkScreen
      phase={3}
      donePhases={donePhases}
      actor={actor}
      instruction={instruction}
      voiceSrc="/audio/instruksi/fase-3.mp3"
      primary={
        <Button
          icon={ArrowRight}
          disabled={!cukup}
          onClick={() => {
            setIsian(false)
            setCatatan(null)
            setBaru(null)
            if (isLast) finish()
            else setIndex(index + 1)
          }}
        >
          {isLast ? 'Lanjut' : 'Berikutnya'}
        </Button>
      }
    >
      <div className="absolute inset-0 overflow-y-auto">
      <div className="flex min-h-full gap-6 px-3 pt-4 pb-4 sm:px-6 sm:pt-5 max-md:flex-col max-md:items-center portrait:flex-col portrait:items-center">
        {/* Kiri: tempat yang sedang ditanya, tiga kotak guna, dan jawaban kami. */}
        <section className="flex w-[330px] shrink-0 flex-col items-center gap-2.5 max-md:w-full max-md:max-w-[380px] portrait:w-full portrait:max-w-[380px]" aria-label={`Guna ${elemen.nama}`}>
          <ol aria-label="Tempat" className="flex gap-2">
            {ids.map((x, i) => (
              <li
                key={x}
                aria-label={`Tempat ${i + 1}${i === index ? ', sedang dikerjakan' : terisiDi(x).length >= MIN_KARTU ? ', selesai' : ''}`}
                className={`size-3.5 rounded-full border-2 ${i === index ? 'border-marun-700 bg-marun-700' : terisiDi(x).length >= MIN_KARTU ? 'border-emas-600 bg-emas-400' : 'border-emas-600/60 bg-gading-50'}`}
              />
            ))}
          </ol>
          <ElementToken elemen={elemen} state={elemen.kategori === 'alam' ? 'alam-found' : 'buatan-placed'} size="min(132px, 24vh)" />

          <div className="flex w-full flex-col gap-2" role="group" aria-label="Kotak guna">
            {Array.from({ length: KOTAK }, (_, i) => {
              const bid = terisi[i]
              if (!bid) {
                return (
                  <div
                    key={i}
                    data-kotak={i}
                    className="flex h-[60px] pendek:h-[48px] items-center gap-3 rounded-[22px] border-[3px] border-dashed border-emas-600/60 bg-gading-100 px-3 font-body text-kecil text-tanah-600"
                  >
                    <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-gading-200 font-display text-sub leading-none">{i + 1}</span>
                    {i < MIN_KARTU ? `Guna ke-${i + 1}` : 'Boleh tambah satu lagi'}
                  </div>
                )
              }
              const Icon = ikonGuna(bid)
              const cocok = tepat.has(bid)
              return (
                <button
                  key={bid}
                  type="button"
                  data-kotak={i}
                  onClick={() => kembalikan(bid)}
                  aria-label={`${manfaatById.get(bid)?.teks}${cocok ? '' : ', ragu'}. Ketuk untuk menukar`}
                  className="relative flex h-[60px] pendek:h-[48px] items-center gap-3 rounded-[22px] border-[3px] border-emas-600 bg-emas-100 px-3 text-left shadow-rest transition-transform duration-150 active:scale-95"
                >
                  <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-gading-50 text-marun-700 ring-2 ring-emas-600/40">
                    <Icon aria-hidden size={22} strokeWidth={2.5} />
                  </span>
                  <span className="min-w-0 flex-1 font-body text-[18px] leading-tight font-semibold text-marun-900">{manfaatById.get(bid)?.teks}</span>
                  <span
                    className={`inline-flex size-7 shrink-0 items-center justify-center rounded-full font-display text-kecil leading-none ${cocok ? 'bg-emas-400 text-marun-900' : 'bg-gading-50 text-tanah-600 ring-2 ring-dashed ring-tanah-600/50'}`}
                  >
                    {cocok ? <Star aria-hidden size={16} strokeWidth={2.5} className="fill-marun-900" /> : '?'}
                  </span>
                  {baru === bid && cocok && <Burst jenis="bintang" />}
                </button>
              )
            })}
          </div>

          {/* "Guna menurut kami": satu kalimat pendek yang diketik sendiri. */}
          {adaJawabanKami ? (
            <div className="flex h-[60px] pendek:h-[48px] w-full items-center gap-3 rounded-[22px] border-[3px] border-dashed border-marun-700 bg-gading-50 px-3 font-body text-kecil text-marun-900">
              <Check aria-hidden size={24} strokeWidth={3} className="shrink-0" />
              Jawaban kami tersimpan
            </div>
          ) : isian ? (
            <div className="w-full rounded-[22px] border-[3px] border-dashed border-marun-700 bg-gading-50 p-3">
              <ShortTextInput onSave={saveCustom} placeholder={`Guna ${elemen.nama} menurut kami`} />
            </div>
          ) : (
            <button
              type="button"
              disabled={!cukup}
              onClick={() => setIsian(true)}
              className="flex h-[60px] pendek:h-[48px] w-full items-center gap-3 rounded-[22px] border-[3px] border-dashed border-marun-700 bg-gading-50 px-3 text-left font-body text-kecil font-semibold text-marun-700 transition-opacity active:scale-95 disabled:opacity-45"
            >
              <Pencil aria-hidden size={24} strokeWidth={2.5} className="shrink-0" />
              Guna menurut kami
            </button>
          )}
        </section>

        {/* Kanan: gelembung kartu guna yang mengapung pelan. Ketuk untuk menangkap. */}
        <section className="flex min-w-0 flex-1 flex-col items-center justify-center gap-3" aria-label="Kartu guna">
          <p className="font-display text-sub text-marun-700">Ketuk kartu yang cocok</p>
          <div className="flex w-full max-w-[640px] flex-wrap justify-center gap-3 sm:gap-5">
            {options.map((bid, i) => {
              const dipakai = terisi.includes(bid)
              const sedangTerbang = terbang?.id === bid
              const sel = ''
              if (dipakai || sedangTerbang) {
                // Tempat gelembung dikosongkan supaya susunan tidak bergeser.
                return <div key={bid} className={`${sel} h-[150px] w-[168px] pendek:h-[118px] pendek:w-[150px] rounded-[40px] border-[3px] border-dashed border-emas-600/30`} aria-hidden />
              }
              return (
                <button
                  key={bid}
                  type="button"
                  disabled={penuh || !!terbang}
                  onClick={(e) => ambil(bid, e.currentTarget)}
                  aria-label={`Kartu ${manfaatById.get(bid)?.teks}`}
                  className={`${sel} ${kelasKartu} ambient-apung transition-[scale] duration-150 hover:scale-105 active:scale-95 disabled:opacity-50`}
                  style={{ ['--dur' as string]: `${4.2 + (i % 3) * 0.9}s`, ['--tunda' as string]: `${i * -0.7}s` }}
                >
                  {/* Animasi muncul di isi kartu, karena kartunya sendiri sudah memakai animasi mengapung. */}
                  <span className="flex flex-col items-center gap-1.5 animate-[tumbuh_320ms_cubic-bezier(0.34,1.4,0.64,1)_both]">
                    <IsiKartu id={bid} />
                  </span>
                </button>
              )
            })}
          </div>
          {penuh && <p className="font-body text-kecil text-tanah-600">Kotak sudah penuh. Ketuk kartu di kotak untuk menukar.</p>}
        </section>
      </div>
      </div>

      {terbang && <KartuTerbang {...terbang} onSelesai={() => mendarat(terbang.id)} />}
    </WorkScreen>
  )
}
