import { useId } from 'react'
import { JUMLAH_LANGKAH, nomorLangkah } from '../content/istilah'

export const PHASES = [0, 1, 2, 3, 4, 5] as const

interface PhaseProgressProps {
  current: number
  done: Iterable<number>
}

const OUTER = (w: number, h: number) => `M${w / 2} 2 L${w - 2} ${h - 2} L2 ${h - 2} Z`
/** Garis daun hanya di bagian atas pucuk supaya angka di pangkal tetap bersih. */
const INNER = (w: number, h: number) => `M${w * 0.38} ${h * 0.52} L${w / 2} ${h * 0.2} L${w * 0.62} ${h * 0.52}`

/**
 * Progres 6 fase sebagai deret pucuk rebung di atas bilah marun.
 * Pucuk yang selesai berwarna emas; pucuk yang baru selesai disepuh dari pangkal ke ujung.
 */
export function PhaseProgress({ current, done }: PhaseProgressProps) {
  const doneSet = new Set(done)
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  return (
    <div className="flex items-center gap-4">
      <span className="font-display text-kecil whitespace-nowrap text-gading-50 max-sm:hidden max-md:text-[18px]">
        Langkah {nomorLangkah(current)} dari {JUMLAH_LANGKAH}
      </span>
      <ol aria-label="Progres langkah" className="flex items-end gap-1 border-b-[3px] border-emas-400 pb-0.5 max-sm:origin-left max-sm:-mr-[84px] max-sm:scale-[0.72]">
        {PHASES.map((phase) => {
          const isCurrent = phase === current
          const isDone = doneSet.has(phase) && !isCurrent
          const justDone = isDone && phase === current - 1
          const w = isCurrent ? 54 : 42
          const h = isCurrent ? 56 : 44
          const clip = `rebung-${uid}-${phase}`
          return (
            <li
              key={phase}
              aria-current={isCurrent ? 'step' : undefined}
              aria-label={`Langkah ${nomorLangkah(phase)}${isDone ? ', selesai' : isCurrent ? ', sedang dikerjakan' : ''}`}
              className="relative flex justify-center"
            >
              <svg aria-hidden width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="block overflow-visible">
                <defs>
                  <clipPath id={clip}>
                    <path d={OUTER(w, h)} />
                  </clipPath>
                </defs>
                <path
                  d={OUTER(w, h)}
                  fill={isCurrent ? 'var(--color-gading-50)' : 'transparent'}
                  stroke="var(--color-emas-400)"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                  opacity={isDone || isCurrent ? 1 : 0.6}
                />
                {isDone && (
                  <rect
                    clipPath={`url(#${clip})`}
                    width={w}
                    height={h}
                    fill="var(--color-emas-400)"
                    style={{
                      transformOrigin: 'bottom',
                      transformBox: 'fill-box',
                      animation: justDone ? 'sepuh var(--motion-slow) cubic-bezier(0.16, 1, 0.3, 1) 300ms both' : undefined,
                    }}
                  />
                )}
                <path
                  d={INNER(w, h)}
                  fill="none"
                  stroke={isDone ? 'var(--color-emas-600)' : isCurrent ? 'var(--color-emas-100)' : 'var(--color-emas-400)'}
                  strokeWidth="2"
                  strokeLinejoin="round"
                  opacity={isDone || isCurrent ? 1 : 0.45}
                />
              </svg>
              <span
                className={
                  'absolute bottom-1.5 font-display font-bold leading-none ' +
                  (isCurrent ? 'text-[22px] text-marun-700' : isDone ? 'text-[18px] text-marun-900' : 'text-[18px] text-gading-100')
                }
              >
                {nomorLangkah(phase)}
              </span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
