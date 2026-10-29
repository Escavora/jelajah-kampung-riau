import { elemenById, konten } from '../../content'

/** Jumlah kartu pengecoh per elemen, diambil dari manfaat elemen lain. */
export const PENGECOH = 3
/** prd.md 5.3: tiap elemen minimal 2 kartu manfaat. */
export const MIN_KARTU = 2

/** Hash kecil supaya urutan kartu sama setiap kali layar dibuka ulang. */
function hash(text: string): number {
  let h = 2166136261
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619)
  return h >>> 0
}

const byHash = (seed: string) => (a: string, b: string) => hash(seed + a) - hash(seed + b)

/** Kartu untuk satu elemen: semua manfaat yang tepat plus pengecoh, diacak tetap per sesi. */
export function benefitOptions(elementId: string, seed: string): string[] {
  const tepat = elemenById.get(elementId)?.manfaat ?? []
  const lain = konten.manfaat.map((m) => m.id).filter((id) => !tepat.includes(id))
  const pengecoh = [...lain].sort(byHash(`${seed}:${elementId}:x`)).slice(0, PENGECOH)
  return [...tepat, ...pengecoh].sort(byHash(`${seed}:${elementId}`))
}
