import { elemenById } from '../../content'

/** Grid tak terlihat 6 x 4 (design.md 7.5). Sel dihitung dari kiri atas. */
export const COLS = 6
export const ROWS = 4
/** Baris tempat Sungai Siak mengalir dari kiri ke kanan. */
export const RIVER_ROW = 1

/** Posisi tetap elemen alam. Alam ditemukan, bukan dipindah. */
export const ALAM_CELLS: Record<string, number> = {
  'sungai-siak': 7,
  'anak-sungai': 10,
  hutan: 5,
  rawa: 18,
  'tanah-lapang': 21,
}

/** Syarat lanjut yang disepakati: minimal 3 elemen di kanvas. Target 3 + 3 + 1 hanya tantangan. */
export const MIN_ELEMEN_LANJUT = 3
export const TARGET = { alam: 3, buatan: 3, diskusi: 1 }

export const rowOf = (cell: number) => Math.floor(cell / COLS)

const ALAM_SET = new Set(Object.values(ALAM_CELLS))

/** Jembatan hanya di atas sungai; bangunan lain hanya di darat; petak alam dan petak terisi tidak boleh. */
export function canPlace(elementId: string, cell: number, occupied: ReadonlySet<number>): boolean {
  if (cell < 0 || cell >= COLS * ROWS) return false
  if (ALAM_SET.has(cell) || occupied.has(cell)) return false
  const onRiver = rowOf(cell) === RIVER_ROW
  return elementId === 'jembatan' ? onRiver : !onRiver
}

export function countTarget(ids: Iterable<string>) {
  let alam = 0
  let buatan = 0
  let diskusi = 0
  for (const id of ids) {
    const e = elemenById.get(id)
    if (!e) continue
    if (e.kategori === 'alam') alam++
    else buatan++
    if (e.diskusi) diskusi++
  }
  return { alam, buatan, diskusi }
}
