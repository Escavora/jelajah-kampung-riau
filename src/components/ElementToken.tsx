import {
  Bridge,
  Droplets,
  Flower2,
  Hospital,
  House,
  LandPlot,
  Landmark,
  MoonStar,
  Route,
  School,
  Trees,
  Waves,
  type LucideIcon,
} from 'lucide-react'
import type { ReactNode } from 'react'
import type { Elemen } from '../content/types'
import { Burst } from './Burst'

/** Placeholder untuk elemen yang belum punya ilustrasi (design.md 15). */
const ICONS: Record<string, LucideIcon> = {
  'sungai-siak': Waves,
  'anak-sungai': Droplets,
  hutan: Trees,
  rawa: Droplets,
  'tanah-lapang': LandPlot,
  rumah: House,
  'selaso-jatuh-kembar': Landmark,
  'masjid-an-nur': MoonStar,
  sekolah: School,
  puskesmas: Hospital,
  jalan: Route,
  jembatan: Bridge,
  taman: Flower2,
  'danau-lembah-sari': Waves,
}

export type TokenState = 'alam-hidden' | 'alam-found' | 'buatan-idle' | 'buatan-placed'

/** Tinggi dua baris nama (18 px) ditambah jarak, dicadangkan di bawah kotak gambar. */
const NAMA_CADANGAN_PX = 52
/** Ruang tambahan di atas kotak untuk lencana yang menonjol di pojok. */
const LENCANA_CADANGAN_PX = 14

const petak = (cadangan: number) => `max(56px, min(86cqw, calc(100cqh - ${cadangan}px)))`

/**
 * Ukuran kotak gambar yang menyesuaikan petak grid: selebar 86% petak, tapi tidak lebih tinggi
 * dari sisa ruang setelah nama. Petak harus menjadi container (`container-type: size`).
 */
export const ukuranPetak = petak(NAMA_CADANGAN_PX)
/** Sama, dengan ruang tambahan supaya lencana di pojok tidak terpotong bingkai peta. */
export const ukuranPetakLencana = petak(NAMA_CADANGAN_PX + LENCANA_CADANGAN_PX)

/**
 * Token elemen (design.md 9). Bentuk tepi kotak ikut menjelaskan aturan:
 * alam tertanam dengan tepi lembut hijau, buatan seperti blok dengan tepi lurus oranye,
 * elemen diskusi bertepi ungu putus-putus.
 *
 * Nama ditulis di bawah kotak, bukan di dalamnya, supaya nama panjang seperti
 * "Selaso Jatuh Kembar" tidak pernah terpotong.
 */
export function ElementToken({
  elemen,
  state,
  selected = false,
  size = 96,
  showName = true,
  badge,
  arrive,
}: {
  elemen: Elemen
  state: TokenState
  selected?: boolean
  /** Piksel, atau ukuran CSS seperti `ukuranPetak`. */
  size?: number | string
  /** Matikan untuk token kecil yang tidak muat nama 18 px, misalnya foto kenangan di rapor. */
  showName?: boolean
  /** Penanda kecil di pojok kanan atas kotak, misalnya label kategori. */
  badge?: ReactNode
  /**
   * Gerak tiba untuk elemen yang baru muncul: alam `tumbuh` dengan daun beterbangan,
   * bangunan `jatuh` memantul dengan debu. Hanya diberikan pada elemen yang baru berubah,
   * bukan setiap kali layar digambar ulang.
   */
  arrive?: 'tumbuh' | 'jatuh'
}) {
  const Icon = ICONS[elemen.id] ?? House
  const nameVisible = showName && state !== 'alam-hidden'
  const box = typeof size === 'number' ? `${size}px` : size
  const shape =
    state === 'alam-hidden'
      ? 'rounded-[34%] border-2 border-dashed border-kabut-400 bg-gading-200/60 text-kabut-400 opacity-60 shadow-tertanam'
      : state === 'alam-found'
        ? 'rounded-[34%] border-[3px] border-alam-500 bg-alam-100 text-alam-700 shadow-tertanam'
        : elemen.diskusi
          ? 'rounded-sm border-[3px] border-dashed border-diskusi-500 bg-diskusi-100 text-tanah-900 shadow-rest'
          : 'rounded-sm border-[3px] border-buatan-500 bg-buatan-100 text-buatan-700 shadow-rest'

  const gerakTiba =
    arrive === 'tumbuh'
      ? 'animate-[tumbuh_420ms_cubic-bezier(0.34,1.4,0.64,1)]'
      : arrive === 'jatuh'
        ? 'animate-[jatuh_520ms_cubic-bezier(0.2,0.8,0.3,1)]'
        : ''

  return (
    <span className="inline-flex flex-col items-center gap-1" style={{ maxWidth: 'min(10rem, 100%)' }}>
      <span
        className={`relative flex shrink-0 items-center justify-center ${gerakTiba} ${shape} ${selected ? 'ring-4 ring-marun-700 ring-offset-2 ring-offset-gading-100' : ''}`}
        style={{ width: box, height: box }}
      >
        {elemen.gambar ? (
          <img
            src={elemen.gambar}
            alt=""
            draggable={false}
            className={`size-[84%] rounded-[8px] object-cover ${state === 'alam-hidden' ? 'opacity-40 grayscale' : ''}`}
          />
        ) : (
          <Icon aria-hidden size="52%" strokeWidth={2.5} />
        )}
        {badge && <span className="absolute -top-2 -right-2 z-10">{badge}</span>}
        {arrive && <Burst jenis={arrive === 'tumbuh' ? 'daun' : 'debu'} />}
      </span>
      {nameVisible ? (
        <span className="w-max max-w-full text-center font-body text-kecil leading-tight text-balance text-tanah-900">
          {elemen.nama}
        </span>
      ) : (
        <span className="sr-only">{elemen.nama}</span>
      )}
    </span>
  )
}
