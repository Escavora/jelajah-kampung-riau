import { ChevronDown, ChevronLeft, ChevronRight, Pause } from 'lucide-react'
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { playVoice } from '../lib/audio'
import { useSuasana } from '../lib/musik'
import type { RoleId } from '../lib/roles'
import { bereaksi } from '../store/badrulStore'
import { AvatarIcon } from './Avatar'
import { Badrul } from './Badrul'
import { LebahBergantung, PucukRebungBand } from './Ornamen'
import { PhaseProgress } from './PhaseProgress'
import { RoleBadge } from './RoleBadge'
import { SpeakerButton, useVoice } from './SpeakerButton'
import { TombolMusik } from './TombolMusik'

interface WorkScreenProps {
  phase: number
  donePhases: Iterable<number>
  /** Anak yang sedang memegang peran utama. Kosong di fase yang dikerjakan bersama. */
  actor?: { avatarId: string; nama: string; role: RoleId }
  instruction: string
  voiceSrc: string
  /** Satu aksi utama di kanan bawah. Posisinya tidak pernah berpindah antar fase. */
  primary: ReactNode
  /** Daftar bangunan: di kanan pada layar mendatar, di bawah (baki) pada layar tegak. */
  drawer?: ReactNode
  /**
   * Langkah yang memakai peta kampung 6 x 4 butuh layar yang cukup lebar. Di HP yang dipegang tegak
   * layar diganti ajakan memutar HP. Tablet dan laptop tidak terpengaruh.
   */
  perluMendatar?: boolean
  onPause?: () => void
  children: ReactNode
}

/**
 * Kerangka layar kerja (design.md 7.1). Tinggi bilah atas dan bawah mengikuti ukuran layar lewat
 * variabel `--atas`, `--bawah`, dan `--badrul` di index.css: besar di tablet, kecil di HP mendatar.
 */
export function WorkScreen({
  phase,
  donePhases,
  actor,
  instruction,
  voiceSrc,
  primary,
  drawer,
  perluMendatar = false,
  onPause,
  children,
}: WorkScreenProps) {
  const [drawerOpen, setDrawerOpen] = useState(true)
  const { playing } = useVoice(voiceSrc, { autoPlay: true })
  // Di layar kerja musiknya tenang dan ditemani suara sungai dan burung, supaya anak tetap fokus.
  useSuasana('tenang', true)

  // Petunjuk gulir: anak tahu masih ada isi di bawah laci yang terpotong tinggi layar.
  const scroller = useRef<HTMLDivElement>(null)
  const [masihAda, setMasihAda] = useState(false)
  const ukur = useCallback(() => {
    const el = scroller.current
    if (el) setMasihAda(el.scrollHeight - el.scrollTop - el.clientHeight > 8)
  }, [])
  useEffect(() => {
    const el = scroller.current
    if (!el) return
    ukur()
    const ro = new ResizeObserver(ukur)
    ro.observe(el)
    const mo = new MutationObserver(ukur)
    mo.observe(el, { childList: true, subtree: true })
    return () => {
      ro.disconnect()
      mo.disconnect()
    }
  }, [ukur, drawer, drawerOpen])

  return (
    <div className="grid h-full grid-rows-[var(--atas)_minmax(0,1fr)_var(--bawah)] bg-gading-100">
      {/* Bilah atas seperti lisplang rumah Melayu: marun dengan lebah bergantung emas di bawahnya. */}
      <header className="relative z-10 flex items-center justify-between gap-2 bg-marun-700 px-3 sm:gap-4 sm:px-6">
        <PhaseProgress current={phase} done={donePhases} />
        {actor && (
          // Di HP tegak bilah atas sudah penuh, jadi siapa yang bertugas hanya tampil di layar yang lebih lebar.
          <div className="flex min-w-0 items-center gap-3 max-sm:hidden" aria-label={`Giliran ${actor.nama}`}>
            <AvatarIcon id={actor.avatarId} size={56} />
            <span className="font-display text-sub text-gading-50 [overflow-wrap:anywhere] max-md:hidden">{actor.nama}</span>
            <RoleBadge role={actor.role} className="max-lg:hidden" />
          </div>
        )}
        <div className="flex items-center gap-2 sm:gap-4">
          <TombolMusik />
          <SpeakerButton src={voiceSrc} label="Dengar instruksi lagi" />
          {onPause && (
            <button
              type="button"
              aria-label="Jeda"
              onClick={onPause}
              className="tap inline-flex size-16 items-center justify-center rounded-full border-2 border-emas-400 bg-gading-50 text-marun-700 shadow-rest active:scale-95"
            >
              <Pause aria-hidden size={28} strokeWidth={2.5} />
            </button>
          )}
        </div>
        <LebahBergantung className="pointer-events-none absolute inset-x-0 top-full" />
      </header>

      {/* Mendatar: kanvas di kiri, daftar di kanan. Tegak: kanvas di atas, daftar menjadi baki di bawah. */}
      <div className="flex min-h-0 overflow-hidden portrait:flex-col">
        <main className="relative min-h-0 min-w-0 flex-1 overflow-hidden">{children}</main>
        {drawer && (
          <aside
            aria-label="Daftar bangunan"
            className={`relative flex shrink-0 border-l-2 border-emas-400 bg-gading-50 transition-[width,height] duration-250 ease-out portrait:w-full portrait:border-t-2 portrait:border-l-0 ${
              drawerOpen ? 'w-[288px] portrait:h-[196px]' : 'w-0 portrait:h-0'
            }`}
          >
            <button
              type="button"
              aria-label={drawerOpen ? 'Tutup daftar bangunan' : 'Buka daftar bangunan'}
              aria-expanded={drawerOpen}
              onClick={() => setDrawerOpen((open) => !open)}
              className="tap absolute top-1/2 -left-16 inline-flex -translate-y-1/2 items-center justify-center rounded-l-md border-2 border-r-0 border-emas-400 bg-gading-50 text-marun-700 portrait:top-auto portrait:-top-16 portrait:left-1/2 portrait:-translate-x-1/2 portrait:translate-y-0 portrait:rounded-t-md portrait:rounded-b-none portrait:border-r-2 portrait:border-b-0"
            >
              {/* Panah diputar 90 derajat di layar tegak: kanan menjadi bawah (tutup), kiri menjadi atas (buka). */}
              {drawerOpen ? (
                <ChevronRight aria-hidden size={32} strokeWidth={2.5} className="portrait:rotate-90" />
              ) : (
                <ChevronLeft aria-hidden size={32} strokeWidth={2.5} className="portrait:rotate-90" />
              )}
            </button>
            {/* pb-24 supaya item terakhir tidak tertutup petunjuk gulir dan kelim pucuk rebung. */}
            <div
              ref={scroller}
              onScroll={ukur}
              className={`w-[288px] overflow-y-auto p-4 pb-24 portrait:w-full portrait:overflow-x-auto portrait:overflow-y-hidden portrait:p-3 portrait:pb-3 ${drawerOpen ? '' : 'invisible'}`}
            >
              {drawer}
            </div>
            {drawerOpen && masihAda && (
              <>
                <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-gading-50 via-gading-50/90 to-transparent portrait:hidden" />
                <button
                  type="button"
                  aria-label="Gulir ke bawah, masih ada yang lain"
                  onClick={() => scroller.current?.scrollBy({ top: scroller.current.clientHeight * 0.8, behavior: 'smooth' })}
                  className="tap absolute bottom-5 left-1/2 inline-flex size-16 -translate-x-1/2 animate-[denyut_1600ms_ease-in-out_infinite] items-center justify-center rounded-full border-2 border-marun-700 bg-emas-400 text-marun-900 shadow-rest portrait:hidden"
                >
                  <ChevronDown aria-hidden size={36} strokeWidth={3} />
                </button>
              </>
            )}
          </aside>
        )}
      </div>

      {/* Bilah bawah dengan kelim pucuk rebung seperti tepi kain tenun. Di HP tegak instruksi di baris sendiri. */}
      <footer className="relative z-10 flex items-center gap-2 bg-marun-700 px-3 sm:gap-4 sm:px-6 max-sm:flex-wrap max-sm:content-center">
        <PucukRebungBand className="pointer-events-none absolute inset-x-0 bottom-full" />
        <p className="flex-1 font-body text-[18px] leading-snug text-gading-50 sm:text-instruksi sm:leading-[1.4] max-sm:order-first max-sm:basis-full pendek:text-[18px] pendek:leading-snug">
          {instruction}
        </p>
        {/* Mengetuk Badrul mengulang instruksi, jadi dia juga tombol suara kedua. */}
        <button
          type="button"
          aria-label="Dengar instruksi lagi dari Badrul"
          onClick={() => {
            playVoice(voiceSrc)
            bereaksi('senang')
          }}
          className="tap inline-flex shrink-0 items-end justify-center rounded-md px-2 active:scale-95 sm:order-first"
        >
          <Badrul talking={playing} size="var(--badrul)" />
        </button>
        <div className="shrink-0 max-sm:ml-auto">{primary}</div>
      </footer>

      {perluMendatar && (
        <div
          role="alert"
          className="fixed inset-0 z-50 hidden flex-col items-center justify-center gap-5 bg-marun-700 p-8 text-center portrait:max-sm:flex"
        >
          <Badrul size={150} hidup={false} />
          <p className="font-display text-fase text-emas-400">Putar HP ke samping</p>
          <p className="max-w-xs font-body text-isi text-gading-50">Peta kampung lebih luas dan enak dimainkan kalau HP dipegang mendatar.</p>
        </div>
      )}
    </div>
  )
}
