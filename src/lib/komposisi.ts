/**
 * Komposisi lagu latar "Kampung Ceria". Data murni (tanpa API browser) supaya bisa dites.
 *
 * Tangga nada C mayor pentatonik yang riang, tempo 108 BPM, 8 birama berulang, tiap birama 16 langkah
 * (nada keenam belas). Urutan akor I - vi - IV - V dua kali: C, Am, F, G.
 */

export const BPM = 108
/** Lama satu langkah (nada keenam belas), dalam detik. */
export const DURASI_LANGKAH = 60 / BPM / 4
export const LANGKAH_PER_BIRAMA = 16
export const JUMLAH_BIRAMA = 8
export const JUMLAH_LANGKAH = LANGKAH_PER_BIRAMA * JUMLAH_BIRAMA

/** Nomor MIDI ke frekuensi (A4 = 69 = 440 Hz). */
export const mtof = (midi: number) => 440 * 2 ** ((midi - 69) / 12)

export interface Akor {
  nama: string
  /** Nada dasar untuk bass. */
  bass: number
  /** Empat nada arpeggio yang diputar bergantian tiap not kedelapan. */
  arpeggio: [number, number, number, number]
}

export const AKOR: Record<'C' | 'Am' | 'F' | 'G', Akor> = {
  C: { nama: 'C', bass: 36, arpeggio: [60, 64, 67, 64] },
  Am: { nama: 'Am', bass: 33, arpeggio: [57, 60, 64, 60] },
  F: { nama: 'F', bass: 41, arpeggio: [53, 57, 60, 57] },
  G: { nama: 'G', bass: 43, arpeggio: [55, 59, 62, 59] },
}

export const URUTAN_AKOR: (keyof typeof AKOR)[] = ['C', 'Am', 'F', 'G', 'C', 'Am', 'F', 'G']

/** Satu not melodi: [langkah dalam birama, nomor MIDI, panjang dalam langkah]. */
export type NotMelodi = [langkah: number, midi: number, panjang: number]

export const MELODI: NotMelodi[][] = [
  [[0, 76, 2], [2, 79, 2], [4, 81, 2], [6, 79, 2], [8, 76, 4], [12, 74, 2], [14, 72, 2]],
  [[0, 69, 2], [2, 72, 2], [4, 76, 2], [6, 72, 2], [8, 69, 4], [12, 67, 2], [14, 69, 2]],
  [[0, 69, 2], [2, 72, 2], [4, 77, 4], [8, 76, 2], [10, 72, 2], [12, 69, 4]],
  [[0, 74, 2], [2, 71, 2], [4, 67, 2], [6, 71, 2], [8, 74, 4], [12, 79, 2], [14, 74, 2]],
  [[0, 79, 2], [2, 81, 2], [4, 84, 2], [6, 81, 2], [8, 79, 4], [12, 76, 2], [14, 74, 2]],
  [[0, 69, 2], [2, 72, 2], [4, 76, 2], [6, 72, 2], [8, 69, 4], [12, 67, 2], [14, 69, 2]],
  [[0, 69, 2], [2, 72, 2], [4, 77, 4], [8, 76, 2], [10, 72, 2], [12, 69, 4]],
  [[0, 74, 2], [2, 71, 2], [4, 79, 4], [8, 72, 8]],
]

/** Langkah bass dalam satu birama: [langkah, selisih nada dari nada dasar, panjang]. */
export const POLA_BASS: [number, number, number][] = [
  [0, 0, 3],
  [6, 0, 1],
  [8, 7, 3],
  [12, 0, 2],
]

/** Kocokan di not kedelapan yang jatuh pada ketukan lemah, supaya lagunya terasa melompat. */
export const LANGKAH_KOCOKAN = [2, 6, 10, 14]
/** Dentuman lembut di ketukan satu dan tiga. */
export const LANGKAH_DENTUM = [0, 8]
