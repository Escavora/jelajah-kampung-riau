import { konten as defaultKonten, type Konten } from '../content'
import { eventProgress } from '../features/phase5-event/meter'
import { canvasAt } from './derive'
import type { LogEntry } from './logger'

export interface ReportSummary {
  alam: number
  buatan: number
  /** Kejadian yang akhirnya ditangani dengan tindakan tepat. */
  tindakan: number
}

/** Angka untuk kalimat rapor siswa. Kategori diambil dari kunci konten, bukan dari label anak. */
export function reportSummary(log: readonly LogEntry[], k: Konten = defaultKonten): ReportSummary {
  const kategori = new Map(k.elemen.map((e) => [e.id, e.kategori]))
  const ids = [...canvasAt(log)]
  const tindakan = [...eventProgress(log, k).values()].filter((p) => p.resolvedBy).length
  return {
    alam: ids.filter((id) => kategori.get(id) === 'alam').length,
    buatan: ids.filter((id) => kategori.get(id) === 'buatan').length,
    tindakan,
  }
}

/** Kalimat hasil kampung (prd.md 5.3). Tanpa angka skor; "cara" menggantikan "tindakan" supaya mudah dipahami anak. */
export function reportSentence({ alam, buatan, tindakan }: ReportSummary): string {
  const jaga = tindakan > 0 ? `, dan kalian sudah menjaganya dengan ${tindakan} cara` : ''
  return `Kampung kalian punya ${alam} lingkungan alam dan ${buatan} lingkungan buatan${jaga}.`
}
