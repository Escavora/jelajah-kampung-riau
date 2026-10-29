import { Music, VolumeX } from 'lucide-react'
import { setMusikHidup, useMusikHidup } from '../lib/musik'

/**
 * Tombol musik: menyalakan atau mematikan lagu latar, suara latar, dan efek.
 * Suara Badrul (voice over) tidak ikut mati, karena itu bagian dari pelajaran.
 */
export function TombolMusik({ className = '' }: { className?: string }) {
  const hidup = useMusikHidup()
  return (
    <button
      type="button"
      aria-pressed={hidup}
      aria-label={hidup ? 'Musik menyala, ketuk untuk mematikan' : 'Musik mati, ketuk untuk menyalakan'}
      onClick={() => setMusikHidup(!hidup)}
      className={`tap inline-flex size-16 shrink-0 items-center justify-center rounded-full border-2 border-emas-400 shadow-rest transition-colors duration-150 active:scale-95 ${
        hidup ? 'bg-gading-50 text-marun-700' : 'bg-marun-900/60 text-gading-50'
      } ${className}`}
    >
      {hidup ? <Music aria-hidden size={28} strokeWidth={2.5} /> : <VolumeX aria-hidden size={28} strokeWidth={2.5} />}
    </button>
  )
}

/** Tombol musik di pojok kanan atas untuk layar yang tidak punya bilah atas (Beranda, Setup, Ringkasan). */
export function PojokMusik() {
  return <TombolMusik className="absolute top-3 right-3 z-30" />
}
