import { ArrowLeftRight, ArrowRight, BrickWall, Leaf, Undo2 } from 'lucide-react'
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { Button } from '../../components/Button'
import { ElementToken, ukuranPetak } from '../../components/ElementToken'
import { MapFrame } from '../../components/KampungMap'
import { WorkScreen } from '../../components/WorkScreen'
import { elemenById, konten } from '../../content'
import { canvasAt, placedCells } from '../../lib/derive'
import { efek } from '../../lib/musik'
import { bereaksi } from '../../store/badrulStore'
import { usePhaseFrame } from '../game/usePhaseFrame'
import { ALAM_CELLS, canPlace, COLS, countTarget, MIN_ELEMEN_LANJUT, ROWS, TARGET } from './layout'

const BUATAN = konten.elemen.filter((e) => e.kategori === 'buatan')
const ALAM_BY_CELL = new Map(Object.entries(ALAM_CELLS).map(([id, cell]) => [cell, id]))
/** Jarak gerak sebelum tekanan dianggap seret, bukan ketukan. */
const DRAG_THRESHOLD = 8

/** Bangunan yang gagal ditaruh meluncur pulang ke asalnya, tanpa tanda salah (design.md 10). */
function Pulang({ id, dari, ke, onSelesai }: { id: string; dari: Titik; ke: Titik; onSelesai: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return onSelesai()
    const a = ref.current!.animate(
      [
        { transform: `translate(${dari.x}px, ${dari.y}px) translate(-50%, -50%) scale(1.1) rotate(3deg)`, opacity: 1 },
        { transform: `translate(${ke.x}px, ${ke.y}px) translate(-50%, -50%) scale(1) rotate(0deg)`, opacity: 0.85 },
      ],
      { duration: 420, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'forwards' },
    )
    a.onfinish = onSelesai
    return () => a.cancel()
    // Dipasang sekali per kepulangan.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div ref={ref} aria-hidden className="pointer-events-none fixed top-0 left-0 z-50 drop-shadow-[0_8px_16px_rgba(74,16,25,0.2)]">
      <ElementToken elemen={elemenById.get(id)!} state="buatan-idle" size={92} />
    </div>
  )
}

type Titik = { x: number; y: number }
type Drag = { id: string; fromCell?: number; x: number; y: number; startX: number; startY: number; moved: boolean }

export function Phase1Build() {
  const { log, record, donePhases, actor, finish } = usePhaseFrame(1)
  const onCanvas = canvasAt(log)
  const cells = placedCells(log)
  const elementAtCell = new Map([...cells].map(([id, cell]) => [cell, id]))
  const occupied = new Set(cells.values())

  /** Elemen yang dipilih lewat ketukan, menunggu ketukan petak tujuan. */
  const [selected, setSelected] = useState<string | null>(null)
  const [drag, setDrag] = useState<Drag | null>(null)
  const dragRef = useRef<Drag | null>(null)
  dragRef.current = drag
  /** Elemen yang baru saja muncul, supaya hanya yang baru ini mendapat gerak tiba. */
  const [baru, setBaru] = useState<{ id: string; n: number } | null>(null)
  const [hoverCell, setHoverCell] = useState<number | null>(null)
  const [pulang, setPulang] = useState<{ id: string; dari: Titik; ke: Titik } | null>(null)

  const active = drag?.moved ? drag.id : selected
  const ownCell = active ? cells.get(active) : undefined
  const validCells = new Set(
    active
      ? Array.from({ length: COLS * ROWS }, (_, c) => c).filter(
          (c) => canPlace(active, c, new Set([...occupied].filter((o) => o !== ownCell))),
        )
      : [],
  )

  const place = (id: string, cell: number) => {
    const from = cells.get(id)
    if (from === cell) return
    record('element_placed', from === undefined ? { elementId: id, cell } : { elementId: id, cell, fromCell: from })
    setSelected(null)
    setBaru({ id, n: Date.now() })
    efek('plop')
    bereaksi('senang')
  }

  const startDrag = (id: string, e: ReactPointerEvent) => {
    e.preventDefault()
    setDrag({ id, fromCell: cells.get(id), x: e.clientX, y: e.clientY, startX: e.clientX, startY: e.clientY, moved: false })
  }

  useEffect(() => {
    if (!drag) return
    const move = (e: PointerEvent) => {
      const d = dragRef.current!
      const moved = d.moved || Math.hypot(e.clientX - d.startX, e.clientY - d.startY) > DRAG_THRESHOLD
      setDrag({ ...d, x: e.clientX, y: e.clientY, moved })
      // Petak di bawah jari menyala lebih terang, seperti magnet yang menarik bangunan.
      const c = moved ? document.elementFromPoint(e.clientX, e.clientY)?.closest<HTMLElement>('[data-cell]') : null
      setHoverCell(c ? Number(c.dataset.cell) : null)
    }
    const up = (e: PointerEvent) => {
      const d = dragRef.current!
      setDrag(null)
      setHoverCell(null)
      if (!d.moved) {
        // Ketukan: pilih atau batal pilih.
        setSelected((s) => (s === d.id ? null : d.id))
        return
      }
      const target = document.elementFromPoint(e.clientX, e.clientY)?.closest<HTMLElement>('[data-cell]')
      const cell = target ? Number(target.dataset.cell) : NaN
      const others = new Set([...occupied].filter((o) => o !== d.fromCell))
      // Dilepas di luar petak sah: kembali pelan ke tempat asal, tanpa tanda salah.
      if (!Number.isNaN(cell) && canPlace(d.id, cell, others)) return place(d.id, cell)
      const asal = document.querySelector<HTMLElement>(`[data-asal="${d.id}"]`)?.getBoundingClientRect()
      if (asal) setPulang({ id: d.id, dari: { x: e.clientX, y: e.clientY }, ke: { x: asal.left + asal.width / 2, y: asal.top + asal.height / 2 } })
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up, { once: true })
    window.addEventListener('pointercancel', () => setDrag(null), { once: true })
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
    // Hanya dipasang sekali per seret.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drag?.id])

  const target = countTarget(onCanvas)
  const enough = onCanvas.size >= MIN_ELEMEN_LANJUT
  const targetMet = target.alam >= TARGET.alam && target.buatan >= TARGET.buatan && target.diskusi >= TARGET.diskusi
  const instruction = selected
    ? `Ketuk kotak yang menyala untuk menaruh ${elemenById.get(selected)?.nama}.`
    : targetMet
      ? 'Kampung kalian makin rapi! Lanjut kalau sudah siap.'
      : onCanvas.size === 0
        ? 'Ketuk bayangan abu-abu untuk menemukan alam. Seret bangunan dari daftar ke peta.'
        : enough
          ? 'Bagus! Coba punya 3 alam, 3 buatan, dan 1 tempat teka-teki.'
          : 'Temukan alam dan bangun kampung kalian.'

  const drawerItems = BUATAN.filter((e) => !onCanvas.has(e.id))

  return (
    <WorkScreen
      phase={1}
      perluMendatar
      donePhases={donePhases}
      actor={actor}
      instruction={instruction}
      voiceSrc="/audio/instruksi/fase-1.mp3"
      primary={
        <Button icon={ArrowRight} disabled={!enough} onClick={finish}>
          Lanjut
        </Button>
      }
      drawer={
        <div className="flex flex-col items-center gap-4 portrait:w-max portrait:flex-row portrait:items-stretch portrait:gap-3">
          {/* Target sebagai tantangan, bukan syarat. Tiap kategori punya ikon sendiri, bukan hanya warna. */}
          <div className="flex w-full flex-col gap-1.5 portrait:w-44 portrait:shrink-0 portrait:justify-center" aria-label="Target kampung">
            {(
              [
                ['Alam', Leaf, target.alam, TARGET.alam, 'text-alam-700'],
                ['Buatan', BrickWall, target.buatan, TARGET.buatan, 'text-buatan-700'],
                ['Teka-teki', ArrowLeftRight, target.diskusi, TARGET.diskusi, 'text-diskusi-500'],
              ] as const
            ).map(([nama, Icon, n, t, color]) => (
              <span key={nama} className="flex items-center gap-2 rounded-full bg-gading-100 px-3 py-1 font-body text-kecil text-tanah-900">
                <Icon aria-hidden size={22} strokeWidth={2.5} className={color} />
                <span className="flex-1">{nama}</span>
                {Math.min(n, t)}/{t}
              </span>
            ))}
          </div>
          {selected && cells.has(selected) && (
            <Button
              variant="secondary"
              icon={Undo2}
              className="w-full !px-4 portrait:w-auto portrait:shrink-0"
              onClick={() => {
                record('element_removed', { elementId: selected })
                setSelected(null)
              }}
            >
              Kembalikan
            </Button>
          )}
          <div className="grid w-full grid-cols-2 justify-items-center gap-x-3 gap-y-4 portrait:flex portrait:w-max portrait:gap-3">
          {drawerItems.map((e) => (
            <button
              key={e.id}
              type="button"
              aria-label={`${e.nama}, seret atau ketuk`}
              aria-pressed={selected === e.id}
              data-asal={e.id}
              onPointerDown={(ev) => startDrag(e.id, ev)}
              className={`shrink-0 touch-none ${drag?.moved && drag.id === e.id ? 'opacity-30' : ''}`}
            >
              <ElementToken elemen={e} state="buatan-idle" selected={selected === e.id} size={92} />
            </button>
          ))}
          </div>
          {drawerItems.length === 0 && <p className="font-body text-kecil text-tanah-600">Semua bangunan sudah dipakai.</p>}
        </div>
      }
    >
      {/* Grid 6 x 4 menumpang tepat di atas peta; Sungai Siak sudah tergambar di baris kedua. */}
      <MapFrame variant="kanvas" className="absolute inset-0 px-3 pt-4 pb-3 sm:px-6 sm:pt-8 sm:pb-6">
      <div className="absolute inset-0 grid grid-cols-6 grid-rows-4">
        {Array.from({ length: COLS * ROWS }, (_, cell) => {
          const alamId = ALAM_BY_CELL.get(cell)
          const placedId = elementAtCell.get(cell)
          const valid = validCells.has(cell)
          const style = { gridColumn: (cell % COLS) + 1, gridRow: Math.floor(cell / COLS) + 1 }

          if (alamId) {
            const found = onCanvas.has(alamId)
            const e = elemenById.get(alamId)!
            return (
              <div key={cell} style={{ ...style, containerType: 'size' }} className="flex items-center justify-center">
                <button
                  type="button"
                  disabled={found}
                  aria-label={found ? e.nama : 'Bayangan, ketuk untuk menemukan'}
                  onClick={() => {
                    record('element_found', { elementId: alamId })
                    setBaru({ id: alamId, n: Date.now() })
                    efek('pop')
                    bereaksi('senang')
                  }}
                  className="active:scale-95"
                >
                  <ElementToken
                    elemen={e}
                    state={found ? 'alam-found' : 'alam-hidden'}
                    size={ukuranPetak}
                    arrive={baru?.id === alamId ? 'tumbuh' : undefined}
                  />
                </button>
              </div>
            )
          }

          return (
            <div
              key={cell}
              data-cell={cell}
              style={{ ...style, containerType: 'size' }}
              onClick={() => selected && valid && place(selected, cell)}
              className={`m-1 flex items-center justify-center rounded-md transition-[background-color,scale] duration-150 ${valid ? (hoverCell === cell && drag?.moved ? 'scale-[1.06] bg-emas-400/45 outline-[3px] outline-solid outline-emas-600' : 'animate-[napas_1400ms_ease-in-out_infinite] bg-emas-100/70 outline-[3px] outline-dashed outline-emas-600') : ''}`}
            >
              {placedId && (
                <button
                  type="button"
                  aria-label={`${elemenById.get(placedId)?.nama}, ketuk untuk pindah`}
                  data-asal={placedId}
                  onPointerDown={(ev) => startDrag(placedId, ev)}
                  className={`touch-none ${drag?.moved && drag.id === placedId ? 'opacity-30' : ''}`}
                >
                  <ElementToken
                    elemen={elemenById.get(placedId)!}
                    state="buatan-placed"
                    selected={selected === placedId}
                    size={ukuranPetak}
                    arrive={baru?.id === placedId ? 'jatuh' : undefined}
                  />
                </button>
              )}
            </div>
          )
        })}
      </div>
      </MapFrame>

      {pulang && <Pulang key={pulang.id} {...pulang} onSelesai={() => setPulang(null)} />}

      {drag?.moved && (
        <div
          aria-hidden
          className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2 scale-110 rotate-3 drop-shadow-[0_12px_24px_rgba(74,16,25,0.26)]"
          style={{ left: drag.x, top: drag.y }}
        >
          <ElementToken elemen={elemenById.get(drag.id)!} state="buatan-idle" size={112} />
        </div>
      )}
    </WorkScreen>
  )
}
