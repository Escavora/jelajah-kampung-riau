import { ArrowRight, Check, UserRound } from 'lucide-react'
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { Button } from '../../components/Button'
import { ElementToken } from '../../components/ElementToken'
import { SpeakerButton } from '../../components/SpeakerButton'
import { VillageView } from '../../components/VillageView'
import { WorkScreen } from '../../components/WorkScreen'
import { konten } from '../../content'
import type { Warga } from '../../content/types'
import { playVoice } from '../../lib/audio'
import { canvasAt, placedCells } from '../../lib/derive'
import { useActiveSession } from '../../store/sessionStore'
import { bereaksi } from '../../store/badrulStore'
import { usePhaseFrame } from '../game/usePhaseFrame'
import { citizenStatus, firstFreeCell, isCorrectLink } from './citizens'

type Point = { x: number; y: number }
const DRAG_THRESHOLD = 8

/** Garis melengkung lembut seperti tali dari warga ke tempat. */
function curve(a: Point, b: Point) {
  const mx = (a.x + b.x) / 2
  return `M${a.x} ${a.y} C${mx} ${a.y}, ${mx} ${b.y}, ${b.x} ${b.y}`
}

function CitizenCard({
  warga,
  linked,
  selected,
  onSelect,
  onDragStart,
}: {
  warga: Warga
  linked: boolean
  selected: boolean
  onSelect: () => void
  onDragStart: (e: ReactPointerEvent) => void
}) {
  return (
    <div
      className={
        'relative flex flex-col gap-2 rounded-lg border-[3px] bg-gading-50 p-3 pr-10 shadow-rest transition-colors duration-150 portrait:min-w-[220px] portrait:flex-1 portrait:pr-3 pendek:gap-1 pendek:p-2 pendek:pr-9 ' +
        (linked ? 'border-marun-700' : selected ? 'border-marun-700 ring-4 ring-emas-400' : 'border-emas-400')
      }
    >
      <div className="flex items-center gap-3">
        <span className="relative inline-flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-emas-400 bg-emas-100 text-marun-900 pendek:hidden">
          <UserRound aria-hidden size={28} strokeWidth={2.5} />
          {linked && (
            <span className="absolute -right-1 -bottom-1 inline-flex size-6 items-center justify-center rounded-full bg-marun-700 text-gading-50">
              <Check aria-hidden size={16} strokeWidth={3} />
            </span>
          )}
        </span>
        <span className="flex-1 font-body text-kecil text-marun-700">{warga.nama}</span>
        <SpeakerButton src={warga.audio} label={`Dengar ${warga.nama}`} className="pendek:hidden" />
      </div>
      {/* Balon kata selebar kartu; mengetuknya memilih warga ini. */}
      <button
        type="button"
        disabled={linked}
        onClick={onSelect}
        aria-pressed={selected}
        aria-label={`${warga.nama}: ${warga.kata}`}
        className="relative rounded-md bg-gading-100 px-3 py-2 text-left font-body text-isi leading-snug text-tanah-900 pendek:py-1 pendek:text-[18px] before:absolute before:-top-2 before:left-5 before:border-x-8 before:border-b-8 before:border-x-transparent before:border-b-gading-100"
      >
        “{warga.kata}”
      </button>
      {/* Titik tarik: area ketuk 64 px, menonjol di tepi kanan kartu. */}
      <button
        type="button"
        data-anchor={warga.id}
        disabled={linked}
        aria-label={`Tarik garis dari ${warga.nama}`}
        onPointerDown={onDragStart}
        className="absolute top-1/2 -right-8 inline-flex size-16 -translate-y-1/2 touch-none items-center justify-center portrait:top-auto portrait:right-auto portrait:-bottom-9 portrait:left-1/2 portrait:-translate-x-1/2 portrait:translate-y-0"
      >
        <span
          className={`size-7 rounded-full border-4 ${linked ? 'border-marun-700 bg-emas-400' : 'border-marun-700 bg-gading-50 animate-[denyut_1600ms_ease-in-out_infinite]'}`}
        />
      </button>
    </div>
  )
}

export function Phase4Citizen() {
  const session = useActiveSession()!
  const { log, record, donePhases, actor, finish } = usePhaseFrame(4)
  const citizens = session.citizenIds.map((id) => konten.warga.find((w) => w.id === id)!).filter(Boolean)
  const { linked, needsMissing } = citizenStatus(log, session.citizenIds)
  const ids = [...canvasAt(log)]
  const cells = placedCells(log)

  const [selected, setSelected] = useState<string | null>(null)
  const [drag, setDrag] = useState<{ citizenId: string; start: Point; at: Point; moved: boolean } | null>(null)
  const dragRef = useRef(drag)
  dragRef.current = drag
  const [fading, setFading] = useState<{ citizenId: string; elementId: string; key: number } | null>(null)
  const [hint, setHint] = useState<string | null>(null)

  // Posisi ujung garis diukur dari DOM supaya tetap tepat di semua ukuran layar.
  const areaRef = useRef<HTMLDivElement>(null)
  const [anchors, setAnchors] = useState<Record<string, Point>>({})
  const measure = useCallback(() => {
    const area = areaRef.current
    if (!area) return
    const base = area.getBoundingClientRect()
    const next: Record<string, Point> = {}
    area.querySelectorAll<HTMLElement>('[data-anchor]').forEach((el) => {
      const r = el.getBoundingClientRect()
      next[`c:${el.dataset.anchor}`] = { x: r.left + r.width / 2 - base.left, y: r.top + r.height / 2 - base.top }
    })
    area.querySelectorAll<HTMLElement>('[data-element]').forEach((el) => {
      const r = el.getBoundingClientRect()
      next[`e:${el.dataset.element}`] = { x: r.left + r.width / 2 - base.left, y: r.top + r.height / 2 - base.top }
    })
    setAnchors(next)
  }, [])
  const layoutKey = `${ids.join()}|${[...linked].join()}`
  useLayoutEffect(measure, [measure, layoutKey])
  useEffect(() => {
    const ro = new ResizeObserver(measure)
    if (areaRef.current) ro.observe(areaRef.current)
    return () => ro.disconnect()
  }, [measure])

  const toLocal = (x: number, y: number): Point => {
    const base = areaRef.current!.getBoundingClientRect()
    return { x: x - base.left, y: y - base.top }
  }

  const link = (citizenId: string, elementId: string) => {
    const warga = citizens.find((w) => w.id === citizenId)!
    const correct = isCorrectLink(citizenId, elementId)
    record('citizen_linked', { citizenId, elementId, correct })
    setSelected(null)
    if (correct) {
      setHint(null)
      bereaksi('senang')
      return
    }
    bereaksi('berpikir')
    // Garis kurang tepat memudar pelan, lalu Badrul bercerita (design.md 7.8).
    record('hint_used', { citizenId })
    setHint(warga.petunjuk)
    playVoice(warga.audioPetunjuk)
    const key = Date.now()
    setFading({ citizenId, elementId, key })
    window.setTimeout(() => setFading((f) => (f?.key === key ? null : f)), 900)
  }

  const startDrag = (citizenId: string, e: ReactPointerEvent) => {
    e.preventDefault()
    const p = toLocal(e.clientX, e.clientY)
    setDrag({ citizenId, start: { x: e.clientX, y: e.clientY }, at: p, moved: false })
  }

  useEffect(() => {
    if (!drag) return
    const move = (e: PointerEvent) => {
      const d = dragRef.current!
      const moved = d.moved || Math.hypot(e.clientX - d.start.x, e.clientY - d.start.y) > DRAG_THRESHOLD
      setDrag({ ...d, at: toLocal(e.clientX, e.clientY), moved })
    }
    const up = (e: PointerEvent) => {
      const d = dragRef.current!
      setDrag(null)
      if (!d.moved) {
        setSelected((s) => (s === d.citizenId ? null : d.citizenId))
        return
      }
      const target = document.elementFromPoint(e.clientX, e.clientY)?.closest<HTMLElement>('[data-element]')
      if (target?.dataset.element) link(d.citizenId, target.dataset.element)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up, { once: true })
    window.addEventListener('pointercancel', () => setDrag(null), { once: true })
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
    // Hanya dipasang sekali per tarikan.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drag?.citizenId])

  const addElement = (elementId: string) => {
    const cell = firstFreeCell(elementId, log)
    if (cell !== null) record('element_placed', { elementId, cell })
  }

  const allLinked = citizens.length > 0 && citizens.every((w) => linked.has(w.id))
  const selectedWarga = citizens.find((w) => w.id === selected)
  const instruction = hint
    ? hint
    : selectedWarga
      ? `Ketuk tempat yang dibutuhkan ${selectedWarga.nama}.`
      : allLinked
        ? 'Semua warga sudah terbantu. Kampung kalian makin rapi!'
        : needsMissing.length > 0
          ? 'Kampung kita masih kurang sesuatu nih. Pilih bangunan di kanan, lalu tarik garisnya.'
          : 'Tarik garis dari warga ke tempat yang mereka butuhkan.'

  const linkedNames = (elementId: string) =>
    citizens.filter((w) => linked.get(w.id) === elementId).map((w) => w.nama)

  const drawerItems = konten.elemen.filter((e) => e.kategori === 'buatan' && !ids.includes(e.id))

  return (
    <WorkScreen
      phase={4}
      perluMendatar
      donePhases={donePhases}
      actor={actor}
      instruction={instruction}
      voiceSrc="/audio/instruksi/fase-4.mp3"
      primary={
        <Button icon={ArrowRight} disabled={!allLinked} onClick={finish}>
          Lanjut
        </Button>
      }
      drawer={
        needsMissing.length > 0 && !allLinked ? (
          <div className="grid grid-cols-2 justify-items-center gap-x-3 gap-y-4">
            {drawerItems.map((e) => (
              <button key={e.id} type="button" aria-label={`Tambah ${e.nama}`} onClick={() => addElement(e.id)}>
                <ElementToken elemen={e} state="buatan-idle" size={92} />
              </button>
            ))}
          </div>
        ) : undefined
      }
    >
      <div ref={areaRef} className="absolute inset-0 flex gap-3 p-2 sm:p-3 portrait:flex-col">
        <div className="relative z-10 flex shrink-0 gap-3 landscape:w-[352px] landscape:flex-col landscape:justify-center landscape:overflow-y-auto landscape:py-1 landscape:pr-9 portrait:overflow-x-auto portrait:pb-10">
          {citizens.map((w) => (
            <CitizenCard
              key={w.id}
              warga={w}
              linked={linked.has(w.id)}
              selected={selected === w.id}
              onSelect={() => setSelected((s) => (s === w.id ? null : w.id))}
              onDragStart={(e) => startDrag(w.id, e)}
            />
          ))}
        </div>

        <VillageView
          ids={ids}
          cells={cells}
          onTap={(id) => selected && link(selected, id)}
          decorate={(id) => {
            const names = linkedNames(id)
            // Tanda centang saja; siapa yang terbantu terlihat dari benang emasnya dan terbaca pembaca layar.
            return names.length ? (
              <span
                role="img"
                aria-label={`Dibutuhkan ${names.join(', ')}`}
                className="inline-flex size-9 animate-[tumbuh_320ms_cubic-bezier(0.34,1.4,0.64,1)_350ms_both] items-center justify-center rounded-full border-2 border-marun-700 bg-emas-400 text-marun-900 shadow-rest"
              >
                <Check aria-hidden size={20} strokeWidth={3} />
              </span>
            ) : null
          }}
          className="min-h-0 min-w-0 flex-1"
        />

        {/* Garis warga: benang emas untuk yang tepat, tali putus-putus saat ditarik. */}
        <svg aria-hidden className="pointer-events-none absolute inset-0 z-20 size-full overflow-visible">
          {[...linked].map(([cid, eid]) => {
            const a = anchors[`c:${cid}`]
            const b = anchors[`e:${eid}`]
            if (!a || !b) return null
            return (
              <g key={cid}>
                <path d={curve(a, b)} pathLength={1} strokeDasharray={1} fill="none" stroke="var(--color-marun-900)" strokeWidth="9" strokeLinecap="round" opacity="0.45" className="animate-[tarik_650ms_cubic-bezier(0.16,1,0.3,1)_both]" />
                <path d={curve(a, b)} pathLength={1} strokeDasharray={1} fill="none" stroke="var(--color-emas-400)" strokeWidth="5" strokeLinecap="round" className="animate-[tarik_650ms_cubic-bezier(0.16,1,0.3,1)_both]" />
              </g>
            )
          })}
          {fading && anchors[`c:${fading.citizenId}`] && anchors[`e:${fading.elementId}`] && (
            <path
              key={fading.key}
              d={curve(anchors[`c:${fading.citizenId}`], anchors[`e:${fading.elementId}`])}
              fill="none"
              stroke="var(--color-kabut-400)"
              strokeWidth="5"
              strokeDasharray="10 10"
              strokeLinecap="round"
              className="animate-[pudar_900ms_ease-out_forwards]"
            />
          )}
          {drag?.moved && anchors[`c:${drag.citizenId}`] && (
            <path
              d={curve(anchors[`c:${drag.citizenId}`], drag.at)}
              fill="none"
              stroke="var(--color-marun-700)"
              strokeWidth="5"
              strokeDasharray="10 10"
              strokeLinecap="round"
            />
          )}
        </svg>
      </div>
    </WorkScreen>
  )
}
