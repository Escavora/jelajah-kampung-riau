import type { ReactNode } from 'react'

/**
 * Peta kampung bergaya poster acuan (image.png): rumput hijau muda, Sungai Siak berkelok,
 * jalan setapak berpasir, dan pohon bulat. Digambar sebagai SVG supaya tajam di tablet.
 *
 * Ukuran tetap 1200 x 800 (rasio 3:2). Grid 6 x 4 di Fase 1–5 menumpang tepat di atasnya,
 * jadi tiap petak 200 x 200 dan Sungai Siak mengalir di baris kedua (y 200–400).
 */
export const MAP_W = 1200
export const MAP_H = 800

const WARNA = {
  rumput: '#DCEFC0',
  rumputMuda: '#E8F5D4',
  rumputTua: '#C9E4A6',
  jumput: '#A7CF7C',
  pasir: '#F2E4B8',
  pasirTepi: '#E0CB91',
  tebing: '#EADBA6',
  airDalam: '#5DB6E6',
  air: '#83CBF0',
  daun: '#6CBF5B',
  daunMuda: '#93D47E',
  daunGaris: '#3F8A3C',
  batang: '#8A5A33',
  bayang: '#A9CF86',
} as const

const SUNGAI = 'M-40 300 C 150 240, 330 360, 560 300 S 950 250, 1240 315'

/** Angka acak tetap supaya rumput dan bunga selalu di tempat yang sama. */
function acak(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

const r = acak(7)
const JUMPUT = Array.from({ length: 70 }, () => ({ x: r() * MAP_W, y: r() * MAP_H, s: 0.7 + r() * 0.6 })).filter(
  // Jangan menumbuhkan rumput di atas sungai.
  (j) => j.y < 215 || j.y > 395,
)
const BUNGA = Array.from({ length: 34 }, (_, i) => ({
  x: r() * MAP_W,
  y: r() * MAP_H,
  warna: ['#F6A6B9', '#FFE07A', '#FFFFFF', '#F9C08A'][i % 4],
})).filter((b) => b.y < 215 || b.y > 395)

function Pohon({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g>
      <ellipse cx={x} cy={y + 24 * s} rx={24 * s} ry={7 * s} fill={WARNA.bayang} opacity={0.8} />
      <rect x={x - 4 * s} y={y + 4 * s} width={8 * s} height={20 * s} rx={3 * s} fill={WARNA.batang} />
      <circle cx={x} cy={y - 6 * s} r={24 * s} fill={WARNA.daun} stroke={WARNA.daunGaris} strokeWidth={2} />
      <circle cx={x - 8 * s} cy={y - 14 * s} r={10 * s} fill={WARNA.daunMuda} />
    </g>
  )
}

function JalanSetapak({ d }: { d: string }) {
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke={WARNA.pasirTepi} strokeWidth={44} />
      <path d={d} stroke={WARNA.pasir} strokeWidth={34} />
      <path d={d} stroke={WARNA.pasirTepi} strokeWidth={3} strokeDasharray="2 18" opacity={0.7} />
    </g>
  )
}

function Air({ d, lebar }: { d: string; lebar: number }) {
  return (
    <g fill="none" strokeLinecap="round">
      <path d={d} stroke={WARNA.tebing} strokeWidth={lebar + 32} />
      <path d={d} stroke={WARNA.airDalam} strokeWidth={lebar + 10} />
      <path d={d} stroke={WARNA.air} strokeWidth={lebar - 14} />
    </g>
  )
}

/** Pohon hias di sudut petak, bukan di tengah, supaya tidak tertutup token. */
const POHON_KANVAS: [number, number, number][] = [
  [28, 40, 1], [205, 185, 0.8], [1000, 190, 0.85], [1175, 175, 0.9],
  [30, 470, 0.9], [395, 455, 0.75], [1172, 470, 0.9], [610, 470, 0.7],
  [200, 785, 0.8], [600, 780, 0.75], [1000, 785, 0.85], [1180, 760, 0.9],
]

/** Hutan rapat di kanan atas, hanya di peta Fase 0. */
const HUTAN: [number, number, number][] = [
  [950, 60, 0.9], [1010, 40, 1.1], [1075, 55, 1], [1140, 40, 1.15], [1185, 90, 0.9],
  [975, 125, 1], [1045, 115, 1.2], [1115, 120, 1], [1170, 150, 0.95], [920, 150, 0.8],
]

function Rawa() {
  return (
    <g>
      <ellipse cx={130} cy={530} rx={115} ry={62} fill="#B9D8A2" stroke="#9DC683" strokeWidth={3} />
      <ellipse cx={95} cy={520} rx={40} ry={16} fill={WARNA.air} opacity={0.85} />
      <ellipse cx={170} cy={548} rx={34} ry={13} fill={WARNA.air} opacity={0.85} />
      {[60, 80, 130, 150, 205, 215].map((x, i) => (
        <g key={x} stroke="#5E8F45" strokeWidth={3} strokeLinecap="round">
          <path d={`M${x} ${560 - (i % 2) * 40} l0 -26`} />
          <ellipse cx={x} cy={534 - (i % 2) * 40} rx={3.5} ry={8} fill="#8A5A33" stroke="none" />
        </g>
      ))}
    </g>
  )
}

function Danau() {
  return (
    <g>
      <ellipse cx={1030} cy={668} rx={132} ry={78} fill={WARNA.tebing} />
      <ellipse cx={1030} cy={668} rx={116} ry={64} fill={WARNA.airDalam} />
      <ellipse cx={1030} cy={664} rx={100} ry={52} fill={WARNA.air} />
      <path d="M970 650 q15 -8 30 0 M1040 690 q15 -8 30 0" stroke="#fff" strokeWidth={3} fill="none" opacity={0.7} />
    </g>
  )
}

export function KampungMap({ variant }: { variant: 'peta' | 'kanvas' }) {
  const peta = variant === 'peta'
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${MAP_W} ${MAP_H}`}
      preserveAspectRatio="none"
      className="absolute inset-0 size-full"
    >
      <rect width={MAP_W} height={MAP_H} fill={WARNA.rumput} />
      <g opacity={0.9}>
        <ellipse cx={240} cy={110} rx={260} ry={90} fill={WARNA.rumputMuda} />
        <ellipse cx={760} cy={700} rx={330} ry={110} fill={WARNA.rumputMuda} />
        <ellipse cx={980} cy={500} rx={200} ry={80} fill={WARNA.rumputTua} opacity={0.5} />
        <ellipse cx={200} cy={640} rx={180} ry={70} fill={WARNA.rumputTua} opacity={0.4} />
      </g>

      {JUMPUT.map((j, i) => (
        <path
          key={i}
          d={`M${j.x} ${j.y} l${-5 * j.s} ${-10 * j.s} M${j.x} ${j.y} l0 ${-13 * j.s} M${j.x} ${j.y} l${5 * j.s} ${-10 * j.s}`}
          stroke={WARNA.jumput}
          strokeWidth={2.2}
          strokeLinecap="round"
        />
      ))}

      {/* Jalan setapak di garis antar petak, jadi tidak menutupi tempat token. */}
      <JalanSetapak d="M-20 600 C 300 588, 700 614, 1220 598" />
      <JalanSetapak d="M400 820 L400 650 C 400 560, 406 470, 400 405" />
      <JalanSetapak d="M800 600 C 806 520, 794 460, 800 400" />
      <JalanSetapak d="M600 -20 C 600 80, 606 150, 600 215" />

      {peta && <Rawa />}
      {peta && <Air d="M262 345 C 232 420, 180 450, 150 500" lebar={18} />}
      <Air d={SUNGAI} lebar={100} />
      <path d={SUNGAI} stroke="#fff" strokeWidth={3} strokeDasharray="34 70" fill="none" opacity={0.6} transform="translate(0 -20)" className="ambient-aliran" />
      <path d={SUNGAI} stroke="#fff" strokeWidth={3} strokeDasharray="22 82" strokeDashoffset={40} fill="none" opacity={0.5} transform="translate(0 22)" className="ambient-aliran" style={{ animationDuration: '9s' }} />
      {peta && <Danau />}

      {BUNGA.map((b, i) => (
        <g key={i}>
          <circle cx={b.x} cy={b.y} r={4.5} fill={b.warna} />
          <circle cx={b.x} cy={b.y} r={1.8} fill="#E8A13A" />
        </g>
      ))}

      {(peta ? [...POHON_KANVAS.filter(([x, y]) => !(x > 900 && y < 250)), ...HUTAN] : POHON_KANVAS).map(([x, y, s], i) => (
        <Pohon key={i} x={x} y={y} s={s} />
      ))}
    </svg>
  )
}

/**
 * Bingkai peta: selalu 3:2 dan selebar mungkin di ruang yang ada.
 * Anak-anaknya ditaruh absolut di atas peta, dengan koordinat persen yang sama dengan SVG.
 */
export function MapFrame({
  variant,
  children,
  className = 'size-full',
}: {
  variant: 'peta' | 'kanvas'
  children?: ReactNode
  className?: string
}) {
  return (
    <div className={`flex items-center justify-center ${className}`} style={{ containerType: 'size' }}>
      <div
        className="relative overflow-hidden rounded-lg border-4 border-gading-50 shadow-rest"
        style={{ width: 'min(100cqw, calc(100cqh * 1.5))', aspectRatio: '3 / 2' }}
      >
        <KampungMap variant={variant} />
        {children}
      </div>
    </div>
  )
}
