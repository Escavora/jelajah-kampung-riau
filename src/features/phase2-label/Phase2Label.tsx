import { ArrowRight, Handshake } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../../components/Button'
import { ConfirmDialog } from '../../components/ConfirmDialog'
import { ElementToken, ukuranPetakLencana } from '../../components/ElementToken'
import { MapFrame } from '../../components/KampungMap'
import { KartuPilihan, KartuTerkunci } from '../../components/KartuPilihan'
import { LabelBadge } from '../../components/LabelBadge'
import { WorkScreen } from '../../components/WorkScreen'
import { elemenById } from '../../content'
import type { Kategori } from '../../content/types'
import { canvasAt, currentLabels, isLabelLocked, placedCells } from '../../lib/derive'
import { bereaksi } from '../../store/badrulStore'
import { usePhaseFrame } from '../game/usePhaseFrame'
import { ALAM_CELLS, COLS } from '../phase1-build/layout'

const KATEGORI: Kategori[] = ['alam', 'buatan']

export function Phase2Label() {
  const { log, record, donePhases, actor, finish } = usePhaseFrame(2)
  const ids = [...canvasAt(log)]
  const cells = placedCells(log)
  const labels = currentLabels(log)
  const locked = isLabelLocked(log)
  const allLabeled = ids.length > 0 && ids.every((id) => labels[id])

  // Dua arah: pilih tempat lalu Alam/Buatan, atau pilih Alam/Buatan lalu ketuk beberapa tempat.
  const [pickedEl, setPickedEl] = useState<string | null>(null)
  const [pickedLabel, setPickedLabel] = useState<Kategori | null>(null)
  const [hint, setHint] = useState<string | null>(null)
  const [confirming, setConfirming] = useState(false)

  const apply = (elementId: string, to: Kategori) => {
    const from = labels[elementId] ?? null
    setPickedEl(null)
    if (from === to) return
    record('label_changed', { elementId, from, to })
    const e = elemenById.get(elementId)
    // Cerita, bukan penilaian (design.md 12). Hanya untuk elemen diskusi yang memancing debat.
    if (e?.diskusi && to === 'alam') bereaksi('berpikir')
    setHint(e?.diskusi && to === 'alam' ? `Hmm, ${e.nama.toLowerCase()} ini siapa yang membuat ya? Coba diskusikan lagi.` : null)
  }

  const tapElement = (id: string) => {
    if (locked) return
    if (pickedLabel) apply(id, pickedLabel)
    else setPickedEl((p) => (p === id ? null : id))
  }

  const tapLabel = (k: Kategori) => {
    if (pickedEl) apply(pickedEl, k)
    else setPickedLabel((p) => (p === k ? null : k))
  }

  const lock = () => {
    record('label_locked', { labels: Object.fromEntries(ids.map((id) => [id, labels[id]])) })
    setConfirming(false)
    setPickedLabel(null)
    bereaksi('senang')
  }

  const instruction = locked
    ? 'Pilihan sudah dikunci. Kampung kalian makin rapi!'
    : hint
      ? hint
      : pickedEl
        ? `${elemenById.get(pickedEl)?.nama} itu Alam atau Buatan? Pilih di kanan.`
        : pickedLabel
          ? `Ketuk tempat yang termasuk lingkungan ${pickedLabel === 'alam' ? 'alam' : 'buatan'}.`
          : allLabeled
            ? 'Semua sudah dipilih. Kalau sudah yakin, tekan Kami Yakin.'
            : 'Tiap tempat itu Alam atau Buatan? Ketuk satu tempat, lalu pilih.'

  return (
    <WorkScreen
      phase={2}
      perluMendatar
      donePhases={donePhases}
      actor={actor}
      instruction={instruction}
      voiceSrc="/audio/instruksi/fase-2.mp3"
      primary={
        locked ? (
          <Button icon={ArrowRight} onClick={finish}>
            Lanjut
          </Button>
        ) : (
          <Button icon={Handshake} disabled={!allLabeled} onClick={() => setConfirming(true)}>
            Kami Yakin
          </Button>
        )
      }
    >
      {/* Mendatar: peta di kiri, kartu pilihan di kanan. Tegak: peta di atas, kartu di bawah. */}
      <div className="absolute inset-0 flex gap-2 p-2 sm:gap-4 sm:p-3 portrait:flex-col">
      <MapFrame variant="kanvas" className="min-h-0 min-w-0 flex-1">
      <div className="absolute inset-0 grid grid-cols-6 grid-rows-4">
        {ids.map((id) => {
          const e = elemenById.get(id)!
          const cell = ALAM_CELLS[id] ?? cells.get(id)!
          return (
            <div
              key={id}
              style={{ gridColumn: (cell % COLS) + 1, gridRow: Math.floor(cell / COLS) + 1, containerType: 'size' }}
              className="flex items-center justify-center"
            >
              <button
                type="button"
                disabled={locked}
                onClick={() => tapElement(id)}
                aria-label={`${e.nama}, ${labels[id] ?? 'belum dipilih'}`}
                className="flex flex-col items-center"
              >
                <ElementToken
                  elemen={e}
                  state={e.kategori === 'alam' ? 'alam-found' : 'buatan-placed'}
                  selected={pickedEl === id}
                  size={ukuranPetakLencana}
                  badge={<LabelBadge key={`${labels[id] ?? 'x'}-${locked}`} kategori={labels[id] ?? null} locked={locked} compact />}
                />
              </button>
            </div>
          )
        })}
      </div>
      </MapFrame>

      {/* Dua kartu berukuran sama, atau kartu "Sudah dikunci" dengan lebar yang sama. */}
      <div className="flex shrink-0 flex-col items-center justify-center gap-3 landscape:w-[224px]" role="group" aria-label="Pilih Alam atau Buatan">
        {locked ? (
          <KartuTerkunci />
        ) : (
          <>
            <p className="max-w-[208px] text-center font-body text-kecil leading-tight text-marun-900" aria-live="polite">
              {pickedEl ? `Untuk ${elemenById.get(pickedEl)?.nama}, pilih satu` : pickedLabel ? 'Sekarang ketuk tempatnya' : 'Pilih satu'}
            </p>
            <div className="flex gap-3 landscape:flex-col">
            {KATEGORI.map((k) => (
              <KartuPilihan key={k} kategori={k} dipilih={pickedLabel === k} menunggu={!!pickedEl} onClick={() => tapLabel(k)} />
            ))}
            </div>
          </>
        )}
      </div>
      </div>

      {confirming && (
        <ConfirmDialog title="Sudah yakin?" confirmLabel="Kami Yakin" onConfirm={lock} onCancel={() => setConfirming(false)}>
          Kalau sudah dikunci, pilihan Alam atau Buatan tidak bisa diganti lagi.
        </ConfirmDialog>
      )}
    </WorkScreen>
  )
}
