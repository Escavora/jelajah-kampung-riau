import { Axe, Brush, Check, Droplets, EyeOff, HandHeart, Meh, Sprout, Trash2, type LucideIcon } from 'lucide-react'
import type { Tindakan } from '../../content/types'

/** Ikon tiap pilihan. Placeholder sampai ilustrasi kejadian (design.md 15) tersedia. */
const IKON: Record<string, LucideIcon> = {
  'pungut-sampah': HandHeart,
  biarkan: EyeOff,
  'ikut-buang': Trash2,
  'tanam-pohon': Sprout,
  'tebang-lagi': Axe,
  'tidak-peduli': Meh,
  'bersihkan-selokan': Brush,
  'buang-ke-selokan': Trash2,
  'main-genangan': Droplets,
}

/**
 * Kartu pilihan "cara menjaga kampung" di Langkah 6. Ketiganya selalu berukuran sama dan berwarna
 * sama; hanya ikon dan tulisannya yang berbeda, jadi tidak ada pilihan yang tampak seperti "jawaban".
 * Pilihan yang sudah dicoba memudar pelan dan tidak pernah merah (design.md 1 dan 12).
 */
export function KartuTindakan({
  tindakan,
  sudahDicoba,
  terpilih,
  selesai,
  onPilih,
}: {
  tindakan: Tindakan
  /** Sudah dipilih sebelumnya dan belum cocok, jadi kartu ini memudar. */
  sudahDicoba: boolean
  /** Pilihan yang akhirnya dipakai kelompok. */
  terpilih: boolean
  /** Kejadian ini sudah beres, jadi kartu lain tidak bisa dipilih lagi. */
  selesai: boolean
  onPilih: () => void
}) {
  const Icon = IKON[tindakan.id] ?? Sprout
  const mati = selesai && !terpilih
  const nonaktif = selesai || sudahDicoba

  return (
    <button
      type="button"
      disabled={nonaktif}
      aria-pressed={terpilih}
      aria-label={sudahDicoba && !terpilih ? `${tindakan.label}, sudah dicoba` : tindakan.label}
      onClick={onPilih}
      className={
        'group relative flex h-[104px] min-w-0 flex-1 items-center gap-3 overflow-hidden rounded-[26px] border-[3px] px-4 text-left shadow-rest transition-[transform,box-shadow,background-color] duration-150 ease-out ' +
        (terpilih
          ? 'scale-[1.03] border-emas-600 bg-emas-400 text-marun-900 shadow-lift'
          : sudahDicoba
            ? 'border-dashed border-kabut-400 bg-gading-100 text-tanah-600 opacity-70'
            : mati
              ? 'border-gading-200 bg-gading-50 text-tanah-600 opacity-45'
              : 'border-emas-400 bg-gading-50 text-tanah-900 hover:-translate-y-0.5 active:scale-95')
      }
    >
      <span
        className={`inline-flex size-[64px] shrink-0 items-center justify-center rounded-full ring-2 ${
          terpilih ? 'bg-gading-50 text-marun-700 ring-marun-700/40 animate-[loncat_600ms_ease-out]' : 'bg-emas-100 text-marun-700 ring-emas-600/50 transition-transform duration-150 group-hover:scale-105'
        }`}
      >
        <Icon aria-hidden size={34} strokeWidth={2.5} />
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="font-body text-[21px] leading-tight font-semibold text-balance">{tindakan.label}</span>
        {sudahDicoba && !terpilih && <span className="font-body text-kecil leading-tight">sudah dicoba</span>}
      </span>
      {terpilih && (
        <span className="absolute top-2 right-2 inline-flex size-8 animate-[tumbuh_280ms_cubic-bezier(0.34,1.4,0.64,1)] items-center justify-center rounded-full bg-marun-700 text-gading-50">
          <Check aria-hidden size={20} strokeWidth={3} />
        </span>
      )}
    </button>
  )
}
