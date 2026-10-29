export type Kategori = 'alam' | 'buatan'

/** Posisi dalam persen terhadap lebar dan tinggi peta Fase 0. */
export interface PinPeta {
  x: number
  y: number
}

export interface Elemen {
  id: string
  nama: string
  kategori: Kategori
  /** Elemen pemicu debat kelompok. Kuncinya tetap `kategori`. */
  diskusi: boolean
  info: string
  audio: string
  /** Id manfaat yang dianggap tepat, merujuk ke benefits.json. */
  manfaat: string[]
  pin?: PinPeta
  /** Ilustrasi elemen. Sementara dipotong dari poster peta PDF acuan (image.png). */
  gambar?: string
  /** Sumber fakta muatan lokal. Wajib diisi sebelum validasi ahli. */
  rujukan: string
}

export interface Manfaat {
  id: string
  teks: string
  audio: string
}

export interface Warga {
  id: string
  nama: string
  kata: string
  audio: string
  /** Lebih dari satu id berarti semua diterima dan jadi pemicu diskusi. */
  elemenTepat: string[]
  petunjuk: string
  audioPetunjuk: string
}

export type JenisTindakan = 'tepat' | 'netral' | 'merusak'

export interface Tindakan {
  id: string
  /** Teks tombol, maksimal 3 kata. */
  label: string
  jenis: JenisTindakan
  umpanBalik: string
  audio: string
}

export interface Kejadian {
  id: string
  judul: string
  cerita: string
  audio: string
  tindakan: Tindakan[]
}

export type Level = 'mulai' | 'berkembang' | 'mahir'

export type IndikatorId = 'I1' | 'I2' | 'I3' | 'I4' | 'I5'

export interface Indikator {
  id: IndikatorId
  nama: string
  level: Record<Level, string>
}

export interface Avatar {
  id: string
  nama: string
}
