import { BrickWall, Check, Leaf, Lock } from 'lucide-react'
import type { Kategori } from '../content/types'

/**
 * Kartu pilihan Alam atau Buatan di Langkah 3. Dua kartu selalu berukuran sama; yang berbeda
 * hanya warna, bentuk sudut, pola, dan ikon (design.md 3.4), jadi pilihan tidak bergantung pada warna:
 * Alam berbentuk daun dengan urat daun, Buatan berbentuk kotak dengan susunan bata.
 */
export const KARTU_PILIHAN_LEBAR = 208

const ISI: Record<Kategori, { judul: string; arti: string }> = {
  alam: { judul: 'Alam', arti: 'Sudah ada sendiri' },
  buatan: { judul: 'Buatan', arti: 'Dibuat manusia' },
}

export function KartuPilihan({
  kategori,
  dipilih,
  menunggu,
  onClick,
}: {
  kategori: Kategori
  /** Kartu ini sedang dipegang (ketuk kartu dulu, lalu ketuk beberapa tempat). */
  dipilih: boolean
  /** Ada tempat yang sedang dipilih dan menunggu kartu, jadi kedua kartu bernapas pelan. */
  menunggu: boolean
  onClick: () => void
}) {
  const alam = kategori === 'alam'
  const Icon = alam ? Leaf : BrickWall
  const bentuk = alam
    ? 'rounded-tl-[52px] rounded-br-[52px] rounded-tr-xl rounded-bl-xl bg-alam-700 text-white'
    : 'rounded-[26px] bg-buatan-500 text-tanah-900'

  return (
    <button
      type="button"
      aria-pressed={dipilih}
      onClick={onClick}
      style={{ width: KARTU_PILIHAN_LEBAR }}
      className={
        `group relative flex h-[148px] shrink-0 flex-col items-center justify-center gap-1 overflow-hidden px-3 pendek:h-[84px] pendek:flex-row pendek:gap-3 shadow-rest transition-[transform,box-shadow] duration-150 ease-out active:scale-95 ${bentuk} ` +
        (dipilih
          ? 'scale-[1.06] shadow-lift ring-4 ring-marun-700 ring-offset-4 ring-offset-gading-100'
          : menunggu
            ? 'animate-[napas_1400ms_ease-in-out_infinite]'
            : 'hover:-translate-y-0.5')
      }
    >
      {/* Pola tipis: urat daun untuk Alam, susunan bata untuk Buatan. */}
      <svg aria-hidden className="pointer-events-none absolute inset-0 size-full opacity-[0.16]">
        <defs>
          {alam ? (
            <pattern id="pola-alam" width="44" height="44" patternUnits="userSpaceOnUse">
              <path d="M0 44 Q22 22 44 0 M-22 22 Q0 0 22 -22 M22 66 Q44 44 66 22" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="30" cy="30" r="2.6" fill="#fff" />
            </pattern>
          ) : (
            <pattern id="pola-buatan" width="52" height="28" patternUnits="userSpaceOnUse">
              <path d="M0 0 H52 M0 14 H52 M0 28 H52 M26 0 V14 M0 14 V28 M52 14 V28" fill="none" stroke="#2B2A26" strokeWidth="2.5" />
            </pattern>
          )}
        </defs>
        <rect width="100%" height="100%" fill={`url(#${alam ? 'pola-alam' : 'pola-buatan'})`} />
      </svg>

      <span
        className={`relative inline-flex size-[68px] pendek:size-[52px] shrink-0 items-center justify-center rounded-full ${alam ? 'bg-white/20 ring-2 ring-white/50' : 'bg-tanah-900/10 ring-2 ring-tanah-900/30'} ${dipilih ? 'animate-[loncat_600ms_ease-out]' : 'transition-transform duration-150 group-hover:scale-105'}`}
      >
        <Icon aria-hidden size={38} strokeWidth={2.5} />
      </span>
      <span className="relative flex flex-col items-center gap-1 pendek:items-start">
        <span className="font-display text-sub leading-none font-bold">{ISI[kategori].judul}</span>
        <span className="font-body text-kecil leading-tight">{ISI[kategori].arti}</span>
      </span>

      {dipilih && (
        <span className="absolute top-2 right-2 inline-flex size-9 animate-[tumbuh_280ms_cubic-bezier(0.34,1.4,0.64,1)] items-center justify-center rounded-full bg-gading-50 text-marun-900 shadow-rest">
          <Check aria-hidden size={22} strokeWidth={3} />
        </span>
      )}
    </button>
  )
}

/** Pengganti dua kartu setelah pilihan dikunci, dengan ukuran lebar yang sama supaya letaknya tidak bergeser. */
export function KartuTerkunci() {
  return (
    <div
      style={{ width: KARTU_PILIHAN_LEBAR }}
      className="flex h-[148px] pendek:h-[84px] flex-col items-center justify-center gap-2 rounded-lg border-[3px] border-dashed border-marun-700 bg-gading-50 px-3 text-center text-marun-900"
    >
      <span className="inline-flex size-[68px] items-center justify-center rounded-full bg-emas-100 ring-2 ring-emas-600">
        <Lock aria-hidden size={34} strokeWidth={2.5} />
      </span>
      <span className="font-display text-sub leading-none font-bold">Sudah dikunci</span>
    </div>
  )
}
