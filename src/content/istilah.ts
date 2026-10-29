/**
 * Daftar istilah untuk anak kelas 4 SD. Semua tulisan di layar siswa memakai kata-kata ini
 * supaya konsisten. Nomor fase di kode tetap 0 sampai 5; anak melihatnya sebagai Langkah 1 sampai 6.
 *
 * | Istilah dewasa            | Dipakai di layar        |
 * |---------------------------|-------------------------|
 * | Fase                      | Langkah                 |
 * | Arsitek                   | Pembangun               |
 * | Juru Label                | Pemilah                 |
 * | Pencatat Manfaat          | Pencari Guna            |
 * | label, elemen, petak      | pilihan, tempat, kotak  |
 * | manfaat                   | guna                    |
 * | tempat diskusi            | tempat teka-teki        |
 * | Kami Sepakat              | Kami Yakin              |
 * | Refleksi / Rapor          | Cerita Kita / Ringkasan |
 */

export const JUDUL_LANGKAH = [
  'Jelajah Peta',
  'Bangun Kampung',
  'Alam atau Buatan?',
  'Apa Gunanya?',
  'Bantu Warga',
  'Jaga Kampung',
] as const

export const JUMLAH_LANGKAH = JUDUL_LANGKAH.length

/** Fase 0 tampil sebagai Langkah 1. */
export const nomorLangkah = (phase: number) => phase + 1

export const judulLangkah = (phase: number) => JUDUL_LANGKAH[phase] ?? ''

/** Nama bagian yang bisa dipilih di Cerita Kita ("bagian paling seru"). */
export const NAMA_BAGIAN_SERU = [
  'Jelajah Peta',
  'Membangun Kampung',
  'Alam atau Buatan',
  'Apa Gunanya',
  'Membantu Warga',
  'Menjaga Kampung',
] as const
