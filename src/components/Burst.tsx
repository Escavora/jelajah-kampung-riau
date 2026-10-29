import { Leaf, Star } from 'lucide-react'
import { useEffect, useState } from 'react'

type Jenis = 'daun' | 'debu' | 'bintang'

const JUMLAH: Record<Jenis, number> = { daun: 9, debu: 7, bintang: 8 }

/**
 * Semburan partikel sekali jalan dari titik tengah induknya (induk harus `relative`).
 * Arah dibuat tetap (bukan acak) supaya render stabil, dan dilepas dari DOM setelah selesai.
 * Dimatikan oleh prefers-reduced-motion lewat kelas `partikel`.
 */
export function Burst({ jenis }: { jenis: Jenis }) {
  const [selesai, setSelesai] = useState(false)
  useEffect(() => {
    const t = window.setTimeout(() => setSelesai(true), 1000)
    return () => window.clearTimeout(t)
  }, [])
  if (selesai) return null

  const n = JUMLAH[jenis]
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
      <span className="riak-tanah absolute size-full rounded-full border-[3px] border-emas-400" />
      {Array.from({ length: n }, (_, i) => {
        const sudut = (i / n) * Math.PI * 2 + (jenis === 'debu' ? Math.PI / n : 0)
        // Daun terbang lebih jauh dan sedikit ke atas; debu menyebar rendah ke samping.
        const jarak = jenis === 'debu' ? 46 + (i % 2) * 14 : 54 + (i % 3) * 14
        const dx = Math.cos(sudut) * jarak
        const dy = Math.sin(sudut) * jarak * (jenis === 'debu' ? 0.35 : 1) - (jenis === 'daun' ? 14 : 0)
        const rot = (i % 2 ? 1 : -1) * (120 + i * 25)
        return (
          <span
            key={i}
            className="partikel absolute"
            style={{ ['--dx' as string]: `${dx}px`, ['--dy' as string]: `${dy}px`, ['--rot' as string]: `${rot}deg`, animationDelay: `${(i % 3) * 30}ms` }}
          >
            {jenis === 'daun' && <Leaf size={16} strokeWidth={2.5} className="fill-alam-500 text-alam-700" />}
            {jenis === 'bintang' && <Star size={16} strokeWidth={2.5} className="fill-emas-400 text-emas-600" />}
            {jenis === 'debu' && <span className="block size-3 rounded-full bg-gading-200 ring-1 ring-emas-600/40" />}
          </span>
        )
      })}
    </span>
  )
}
