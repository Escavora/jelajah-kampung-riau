import { Star } from 'lucide-react'
import { useId } from 'react'

/**
 * Ornamen Melayu Riau yang disederhanakan untuk layar anak.
 * Bentuknya perlu dicek ahli budaya sebelum uji coba (PRODUCT.md, Brand Commitments).
 */

/** Id pola SVG. Titik dua dari useId bisa merusak rujukan url(#...) di sebagian browser. */
const useSvgId = () => `pola-${useId().replace(/[^a-zA-Z0-9]/g, '')}`

interface BandProps {
  height?: number
  className?: string
  /** Pucuk menghadap ke bawah, misalnya di kelim atas. */
  flip?: boolean
  color?: string
  /** Warna garis daun di dalam pucuk, biasanya warna latar di belakang pita. */
  inner?: string
}

/** Pucuk rebung: deret segitiga rebung seperti kelim kain tenun. Melambangkan tumbuh. */
export function PucukRebungBand({
  height = 16,
  className = '',
  flip = false,
  color = 'var(--color-emas-400)',
  inner = 'var(--color-marun-700)',
}: BandProps) {
  const id = useSvgId()
  const w = Math.round(height * 1.1)
  const h = height
  return (
    <svg
      aria-hidden
      width="100%"
      height={h}
      className={`block ${className}`}
      style={flip ? { transform: 'scaleY(-1)' } : undefined}
    >
      <defs>
        <pattern id={id} width={w} height={h} patternUnits="userSpaceOnUse">
          <path d={`M0 ${h} L${w / 2} 0 L${w} ${h} Z`} fill={color} />
          <path
            d={`M${w * 0.28} ${h} L${w / 2} ${h * 0.38} L${w * 0.72} ${h}`}
            fill="none"
            stroke={inner}
            strokeWidth={Math.max(1.5, h / 9)}
            strokeLinejoin="round"
          />
        </pattern>
      </defs>
      <rect width="100%" height={h} fill={`url(#${id})`} />
    </svg>
  )
}

/** Lebah bergantung: hiasan tetesan yang menggantung di lisplang rumah Melayu. */
export function LebahBergantung({ height = 18, className = '', color = 'var(--color-emas-400)' }: Omit<BandProps, 'flip' | 'inner'>) {
  const id = useSvgId()
  const w = 28
  const s = height / 18
  return (
    <svg aria-hidden width="100%" height={height} className={`block ${className}`}>
      <defs>
        <pattern id={id} width={w * s} height={height} patternUnits="userSpaceOnUse">
          <g transform={`scale(${s})`} fill={color}>
            <rect x="0" y="0" width={w} height="3" />
            <rect x="13" y="3" width="2" height="4" />
            <path d="M14 6 C19 10 18.5 15.5 14 17 C9.5 15.5 9 10 14 6 Z" />
            <circle cx="0" cy="6" r="1.8" />
            <circle cx={w} cy="6" r="1.8" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height={height} fill={`url(#${id})`} />
    </svg>
  )
}

/** Selembayung: hiasan bersilang di puncak atap Selaso Jatuh Kembar. */
export function Selembayung({ width = 120, color = 'var(--color-emas-400)', className = '' }: { width?: number; color?: string; className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 120 84" width={width} height={(width * 84) / 120} className={className}>
      <g fill="none" stroke={color} strokeWidth="6" strokeLinecap="round">
        <path d="M68 82 C58 58 42 42 31 18 C27 10 33 3 40 8 C44 11 42 17 37 16" />
        <path d="M52 82 C62 58 78 42 89 18 C93 10 87 3 80 8 C76 11 78 17 83 16" />
      </g>
      <path d="M60 52 L66 60 L60 68 L54 60 Z" fill={color} />
    </svg>
  )
}

/** Bunga tabur: motif kecil yang ditabur di kain songket. Dipakai sebagai latar marun di layar pembuka. */
export function SongketGround({ className = '', opacity = 0.16 }: { className?: string; opacity?: number }) {
  const id = useSvgId()
  return (
    <svg aria-hidden className={`pointer-events-none absolute inset-0 size-full ${className}`}>
      <defs>
        <pattern id={id} width="72" height="72" patternUnits="userSpaceOnUse">
          <g fill="var(--color-emas-400)" opacity={opacity}>
            <g transform="translate(36 36)">
              {[0, 90, 180, 270].map((deg) => (
                <ellipse key={deg} cx="0" cy="-8" rx="4.5" ry="8" transform={`rotate(${deg})`} />
              ))}
              <circle r="3" fill="var(--color-marun-700)" />
            </g>
            {[
              [0, 0],
              [72, 0],
              [0, 72],
              [72, 72],
            ].map(([x, y]) => (
              <path key={`${x}-${y}`} d={`M${x} ${y - 5} L${x + 5} ${y} L${x} ${y + 5} L${x - 5} ${y} Z`} />
            ))}
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}

/** Posisi kilau tetap [kiri %, bawah %, tunda detik, ukuran px], supaya render stabil. */
const KILAU: [number, number, number, number][] = [
  [6, 4, 0, 18], [14, 22, 1.4, 14], [24, 6, 2.6, 16], [35, 30, 0.7, 12], [46, 2, 3.1, 18], [57, 18, 1.9, 14],
  [66, 8, 0.4, 16], [75, 26, 2.3, 12], [84, 4, 3.5, 18], [92, 20, 1.1, 14], [40, 12, 2.9, 12], [96, 8, 0.9, 16],
]

/**
 * Kilau emas yang melayang naik pelan di latar rapor. Hiasan murni: tidak bisa diketuk,
 * disembunyikan dari pembaca layar, dan mati saat reduce motion (kelas `ambient-kilau`).
 */
export function Kilau({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {KILAU.map(([x, y, tunda, ukuran], i) => (
        <Star
          key={i}
          size={ukuran}
          strokeWidth={2.5}
          className="ambient-kilau absolute fill-emas-400 text-emas-600 opacity-0"
          style={{ left: `${x}%`, bottom: `${y}%`, animationDelay: `${tunda}s` }}
        />
      ))}
    </div>
  )
}
