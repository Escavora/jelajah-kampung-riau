import { useEffect, useState } from 'react'
import { useBadrul, type Reaksi } from '../store/badrulStore'

/**
 * Maskot pemandu berpakaian Melayu (public/maskot.png, latar dibuang dari maskot.png di root).
 * `size` adalah tinggi gambar dalam piksel.
 *
 * Hidup lewat tiga gerak: bernapas pelan saat diam, mengangguk saat bicara, dan bereaksi
 * (meloncat senang atau memiringkan kepala) pada kejadian di `badrulStore`.
 * Reaksi yang sudah lewat sebelum komponen ini muncul tidak diputar ulang.
 */
export function Badrul({ talking = false, size = 80, hidup = true }: { talking?: boolean; size?: number | string; hidup?: boolean }) {
  const [reaksi, setReaksi] = useState<{ jenis: Reaksi; n: number } | null>(null)

  useEffect(() => {
    if (!hidup) return
    return useBadrul.subscribe((s, prev) => {
      if (s.n !== prev.n) setReaksi({ jenis: s.reaksi, n: s.n })
    })
  }, [hidup])

  const gerak = reaksi
    ? reaksi.jenis === 'senang'
      ? 'animate-[loncat_720ms_cubic-bezier(0.3,0.7,0.3,1)]'
      : 'animate-[miring_1100ms_ease-in-out]'
    : talking
      ? 'animate-[angguk_600ms_ease-in-out_infinite]'
      : ''

  return (
    <span className={`inline-block shrink-0 origin-bottom ${hidup ? 'ambient-bernapas' : ''}`} style={{ height: size }}>
      <img
        // Ganti key tiap reaksi baru supaya animasinya mulai dari awal.
        key={reaksi?.n ?? 'diam'}
        src="/maskot.png"
        alt=""
        aria-hidden
        draggable={false}
        height={typeof size === 'number' ? size : undefined}
        width={typeof size === 'number' ? Math.round((size * 209) / 400) : undefined}
        style={{ height: size, width: 'auto' }}
        className={`block origin-bottom drop-shadow-[0_2px_3px_rgba(74,16,25,0.3)] ${gerak}`}
      />
    </span>
  )
}
