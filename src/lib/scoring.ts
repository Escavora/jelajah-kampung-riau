import { konten as defaultKonten, type Konten } from '../content'
import type { IndikatorId, Level } from '../content/types'
import {
  attachedBenefits,
  canvasAt,
  CUSTOM_BENEFIT_ID,
  currentLabels,
  labelChangeCounts,
} from './derive'
import { entriesOf, type LogEntry } from './logger'

/**
 * Tafsiran rubrik prd.md bagian 6. Ambang di sini perlu divalidasi ahli materi.
 * Skor selalu dihitung ulang dari log dan konten, tidak pernah disimpan.
 */
export const THRESHOLDS = {
  /** I1: jenis minimal untuk Berkembang dan Mahir. */
  ragamMin: 3,
  ragamMahir: 6,
  /** I1: "seimbang" berarti tiap kategori punya minimal sekian elemen. */
  seimbangPerKategori: 3,
  /** I2: proporsi label benar. Mahir harus lebih dari batas atas. */
  labelBawah: 0.5,
  labelAtas: 0.8,
  /** I2: lebih dari sekian kali ubah pada satu elemen menahan level di Berkembang. */
  maksUbahLabel: 2,
  /** I3: kartu benar minimal per elemen. */
  manfaatPerElemen: 2,
  /** I4 dan I5: jumlah warga dan kejadian per sesi. */
  wargaPerSesi: 3,
  kejadianPerSesi: 3,
} as const

export interface IndicatorResult {
  level: Level
  /** Ringkasan angka dasar penilaian. */
  detail: string
  /** Bagian yang hanya bisa dinilai guru, misalnya relevansi manfaat versi sendiri. */
  perluCekGuru?: boolean
}

export type ScoreReport = Record<IndikatorId, IndicatorResult>

export function scoreSession(log: readonly LogEntry[], k: Konten = defaultKonten): ScoreReport {
  return {
    I1: scoreRagam(log, k),
    I2: scoreKlasifikasi(log, k),
    I3: scoreManfaat(log, k),
    I4: scoreWarga(log, k),
    I5: scoreTindakan(log, k),
  }
}

function kategoriOf(k: Konten) {
  const map = new Map(k.elemen.map((e) => [e.id, e]))
  return (id: string) => map.get(id)
}

/** I1 dinilai dari kanvas di akhir Fase 1. Elemen yang ditambah di Fase 4 masuk ke I4. */
export function scoreRagam(log: readonly LogEntry[], k: Konten = defaultKonten): IndicatorResult {
  const elemen = kategoriOf(k)
  const ids = [...canvasAt(log, 1)]
  const alam = ids.filter((id) => elemen(id)?.kategori === 'alam').length
  const buatan = ids.filter((id) => elemen(id)?.kategori === 'buatan').length
  const n = ids.length
  const detail = `${n} jenis (${alam} alam, ${buatan} buatan)`
  const seimbang = alam >= THRESHOLDS.seimbangPerKategori && buatan >= THRESHOLDS.seimbangPerKategori
  if (n < THRESHOLDS.ragamMin) return { level: 'mulai', detail }
  if (n >= THRESHOLDS.ragamMahir && seimbang) return { level: 'mahir', detail }
  return { level: 'berkembang', detail }
}

export function scoreKlasifikasi(log: readonly LogEntry[], k: Konten = defaultKonten): IndicatorResult {
  const elemen = kategoriOf(k)
  const labels = currentLabels(log)
  const ids = Object.keys(labels)
  if (ids.length === 0) return { level: 'mulai', detail: 'Belum ada label' }

  const benar = ids.filter((id) => elemen(id)?.kategori === labels[id])
  const pct = benar.length / ids.length
  const diskusi = ids.filter((id) => elemen(id)?.diskusi)
  const diskusiBenar = diskusi.length > 0 && diskusi.every((id) => benar.includes(id))
  const changes = labelChangeCounts(log)
  const seringUbah = benar.some((id) => (changes.get(id) ?? 0) > THRESHOLDS.maksUbahLabel)

  const detail =
    `${benar.length} dari ${ids.length} label benar (${Math.round(pct * 100)}%)` +
    `, elemen diskusi ${diskusiBenar ? 'benar' : diskusi.length ? 'kurang tepat' : 'tidak ada'}` +
    (seringUbah ? `, ada label benar setelah lebih dari ${THRESHOLDS.maksUbahLabel} kali ubah` : '')

  if (pct < THRESHOLDS.labelBawah) return { level: 'mulai', detail }
  if (pct > THRESHOLDS.labelAtas && diskusiBenar && !seringUbah) return { level: 'mahir', detail }
  return { level: 'berkembang', detail }
}

/** I3 dinilai untuk semua elemen yang ada di kanvas saat Fase 3. */
export function scoreManfaat(log: readonly LogEntry[], k: Konten = defaultKonten): IndicatorResult {
  const elemen = kategoriOf(k)
  const ids = [...canvasAt(log, 3)]
  if (ids.length === 0) return { level: 'mulai', detail: 'Belum ada elemen' }

  const attached = attachedBenefits(log)
  const cukup = ids.filter((id) => {
    const tepat = new Set(elemen(id)?.manfaat ?? [])
    const benar = [...(attached.get(id) ?? [])].filter((b) => tepat.has(b))
    return benar.length >= THRESHOLDS.manfaatPerElemen
  })
  const adaVersiKami = [...attached.values()].some((set) => set.has(CUSTOM_BENEFIT_ID))
  const detail =
    `${cukup.length} dari ${ids.length} elemen punya ${THRESHOLDS.manfaatPerElemen} kartu benar` +
    `, manfaat versi kami ${adaVersiKami ? 'ada' : 'belum ada'}`

  if (cukup.length < ids.length) return { level: 'mulai', detail }
  if (adaVersiKami) return { level: 'mahir', detail, perluCekGuru: true }
  return { level: 'berkembang', detail }
}

/**
 * I4: warga dihitung benar kalau akhirnya terhubung ke elemen yang tepat.
 * Mahir berarti 3 benar tanpa petunjuk dan tanpa garis keliru. Elemen yang kurang sudah pasti
 * ditambah kelompok, karena warga itu tidak bisa terhubung benar tanpanya.
 */
export function scoreWarga(log: readonly LogEntry[], k: Konten = defaultKonten): IndicatorResult {
  const tepat = new Map(k.warga.map((w) => [w.id, new Set(w.elemenTepat)]))
  const links = entriesOf(log, 'citizen_linked')
  const isCorrect = (citizenId: string, elementId: string) => tepat.get(citizenId)?.has(elementId) ?? false

  const benar = new Set(links.filter((l) => isCorrect(l.payload.citizenId, l.payload.elementId)).map((l) => l.payload.citizenId))
  const keliru = links.filter((l) => !isCorrect(l.payload.citizenId, l.payload.elementId)).length
  const petunjuk = entriesOf(log, 'hint_used').filter((h) => h.phase === 4).length
  const ditambah = entriesOf(log, 'element_placed').filter((e) => e.phase === 4 && e.payload.fromCell === undefined).length
  const total = THRESHOLDS.wargaPerSesi

  const detail =
    `${benar.size} dari ${total} warga terhubung benar, ${keliru} garis keliru, ${petunjuk} petunjuk` +
    `, ${ditambah} elemen ditambah di Fase 4`

  if (benar.size >= total && petunjuk === 0 && keliru === 0) return { level: 'mahir', detail }
  if (benar.size >= total - 1) return { level: 'berkembang', detail }
  return { level: 'mulai', detail }
}

export function scoreTindakan(log: readonly LogEntry[], k: Konten = defaultKonten): IndicatorResult {
  const jenis = new Map(k.kejadian.flatMap((ev) => ev.tindakan.map((t) => [`${ev.id}/${t.id}`, t.jenis] as const)))
  const isTepat = (eventId: string, actionId: string) => jenis.get(`${eventId}/${actionId}`) === 'tepat'

  const byEvent = new Map<string, boolean[]>()
  for (const entry of entriesOf(log, 'event_action_chosen')) {
    const list = byEvent.get(entry.payload.eventId) ?? []
    list.push(isTepat(entry.payload.eventId, entry.payload.actionId))
    byEvent.set(entry.payload.eventId, list)
  }
  const attempts = [...byEvent.values()]
  const benar = attempts.filter((list) => list.includes(true)).length
  const pertamaBenar = attempts.filter((list) => list[0] === true).length
  const total = THRESHOLDS.kejadianPerSesi
  const detail = `${benar} dari ${total} kejadian ditangani benar, ${pertamaBenar} pada percobaan pertama`

  if (benar >= total && pertamaBenar >= total) return { level: 'mahir', detail }
  if (benar >= total - 1) return { level: 'berkembang', detail }
  return { level: 'mulai', detail }
}
