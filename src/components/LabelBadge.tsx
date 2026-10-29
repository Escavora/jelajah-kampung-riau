import { BrickWall, Leaf, Lock } from 'lucide-react'
import type { Kategori } from '../content/types'

/**
 * Label kategori (design.md 3.4): warna, ikon, dan bentuk tepi sekaligus,
 * supaya anak buta warna merah-hijau tetap bisa membedakan.
 * Alam: hijau, daun, bentuk bulat atau daun. Buatan: oranye, bata, kotak bersudut membulat sama rata.
 *
 * `compact` hanya ikon di pojok token, tanpa teks yang bisa terpotong; nama kategori tetap
 * terbaca pembaca layar dan tertulis di dua tombol label besar.
 */
export function LabelBadge({
  kategori,
  locked = false,
  large = false,
  compact = false,
}: {
  kategori: Kategori | null
  locked?: boolean
  large?: boolean
  compact?: boolean
}) {
  if (compact) {
    const nama = kategori === 'alam' ? 'Alam' : kategori === 'buatan' ? 'Buatan' : 'belum dipilih'
    // Tiap lencana baru (parent memberi key berbeda) muncul membal supaya perubahan label terasa.
    const base = 'relative inline-flex size-10 items-center justify-center shadow-rest animate-[tumbuh_320ms_cubic-bezier(0.34,1.4,0.64,1)]'
    if (!kategori) {
      return (
        <span role="img" aria-label={nama} className={`${base} rounded-full border-2 border-dashed border-tanah-600 bg-gading-50 font-display text-sub leading-none text-tanah-600`}>
          ?
        </span>
      )
    }
    const Icon = kategori === 'alam' ? Leaf : BrickWall
    return (
      <span
        role="img"
        aria-label={`${nama}${locked ? ', terkunci' : ''}`}
        className={`${base} ${kategori === 'alam' ? 'rounded-full bg-alam-700 text-white' : 'rounded-[12px] bg-buatan-500 text-tanah-900'}`}
      >
        <Icon aria-hidden size={24} strokeWidth={2.5} />
        {locked && (
          <span className="absolute -right-1.5 -bottom-1.5 inline-flex size-5 items-center justify-center rounded-full bg-marun-700 text-gading-50">
            <Lock aria-hidden size={12} strokeWidth={3} />
          </span>
        )}
      </span>
    )
  }

  const size = large ? 'h-16 px-6 text-tombol gap-3' : 'h-9 px-3 text-kecil gap-1.5'
  const icon = large ? 30 : 20

  if (!kategori) {
    return (
      <span className={`inline-flex items-center rounded-sm border-2 border-dashed border-tanah-600 bg-gading-50/90 font-body text-tanah-600 ${size}`}>
        Pilih
      </span>
    )
  }

  const Icon = kategori === 'alam' ? Leaf : BrickWall
  const style =
    kategori === 'alam'
      ? 'rounded-full bg-alam-700 text-white'
      : 'rounded-md bg-buatan-500 text-tanah-900'

  return (
    <span className={`inline-flex items-center font-body font-semibold shadow-rest ${style} ${size}`}>
      <Icon aria-hidden size={icon} strokeWidth={2.5} />
      {kategori === 'alam' ? 'Alam' : 'Buatan'}
      {locked && <Lock aria-label="terkunci" size={icon * 0.8} strokeWidth={2.5} />}
    </span>
  )
}
