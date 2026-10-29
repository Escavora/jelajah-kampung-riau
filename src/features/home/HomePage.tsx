import { Play, RotateCcw } from 'lucide-react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/Button'
import { Badrul } from '../../components/Badrul'
import { LebahBergantung, PucukRebungBand, Selembayung, SongketGround } from '../../components/Ornamen'
import { PojokMusik } from '../../components/TombolMusik'
import { useSuasana } from '../../lib/musik'
import { bereaksi } from '../../store/badrulStore'
import { useActiveSession } from '../../store/sessionStore'

/** Atap pelana Selaso: lisplang emas di kedua sisi, bunga di tengah segitiga pelana. */
function AtapSelaso() {
  return (
    <svg aria-hidden viewBox="0 0 760 140" className="block w-full">
      <path d="M0 140 L380 4 L760 140 Z" fill="var(--color-marun-900)" />
      <path d="M26 134 L380 12 L734 134" fill="none" stroke="var(--color-emas-400)" strokeWidth="7" strokeLinejoin="round" />
      <path d="M58 136 L380 26 L702 136" fill="none" stroke="var(--color-emas-600)" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M380 54 L262 138 L498 138 Z" fill="var(--color-marun-500)" />
      <g transform="translate(380 108)" fill="var(--color-emas-400)">
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <ellipse key={deg} cx="0" cy="-11" rx="5.5" ry="11" transform={`rotate(${deg})`} />
        ))}
        <circle r="5" fill="var(--color-marun-900)" />
      </g>
    </svg>
  )
}

/** Beranda: memulai sesi baru atau melanjutkan sesi yang tersimpan di perangkat. */
export function HomePage() {
  const navigate = useNavigate()
  const active = useActiveSession()
  const resumable = active && !active.finishedAt
  useSuasana('meriah', false)

  // Badrul menyapa setelah rumah selesai berdiri.
  useEffect(() => {
    const t = window.setTimeout(() => bereaksi('senang'), 1100)
    return () => window.clearTimeout(t)
  }, [])

  return (
    <div className="h-full overflow-x-hidden overflow-y-auto bg-marun-700">
    <div className="relative flex min-h-full flex-col items-center justify-center px-4 pt-16 pb-12 sm:px-8 sm:pt-8 sm:pb-10">
      <SongketGround />
      <PojokMusik />

      <div className="relative flex w-full max-w-[700px] flex-col items-center">
        {/* Atap jatuh memantul dulu, lalu panel naik: rumah yang sedang dibangun. */}
        <div className="flex w-full animate-[jatuh_760ms_cubic-bezier(0.2,0.8,0.3,1)_120ms_both] flex-col items-center">
          {/* Kaki selembayung menumpang di puncak atap, jadi harus digambar di atas atap. */}
          <Selembayung width={150} className="relative z-10 -mb-[34px]" />
          <div className="w-[calc(100%+40px)] sm:w-[calc(100%+80px)]">
            <AtapSelaso />
          </div>
        </div>
        <div className="masuk-bergilir relative w-full rounded-b-lg bg-gading-50 px-6 pt-8 pb-10 shadow-lift" style={{ ['--tunda' as string]: '420ms' }}>
          <LebahBergantung className="absolute inset-x-0 top-0" height={20} />
          <div className="flex flex-col items-center gap-4 text-center sm:gap-6 pendek:flex-row pendek:text-left">
            {/* Mengetuk Badrul membuatnya meloncat. */}
            <button type="button" aria-label="Sapa Badrul" onClick={() => bereaksi('senang')} className="tap rounded-md active:scale-95">
              <Badrul size="min(160px, 28vh)" />
            </button>
            <div>
              <h1 className="font-display text-fase text-marun-700 text-balance sm:text-display pendek:text-fase">Jelajah Kampung Riau</h1>
              <p className="mt-2 font-body text-instruksi text-tanah-600">Kenali lingkungan alam dan buatan di sekitar kita.</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {resumable && (
                <Button variant="secondary" icon={RotateCcw} onClick={() => navigate('/main')}>
                  Lanjutkan {active.groupName}
                </Button>
              )}
              <span className="ambient-bernapas inline-block">
                <Button icon={Play} onClick={() => navigate('/setup')}>
                  Mulai Jelajah
                </Button>
              </span>
            </div>
          </div>
        </div>
      </div>

      <PucukRebungBand height={30} className="absolute inset-x-0 bottom-0" />
    </div>
    </div>
  )
}
