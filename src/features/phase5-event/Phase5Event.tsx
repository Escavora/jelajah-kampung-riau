import { ArrowRight, Axe, CloudRain, Route, Signpost, Trash2, TreeDeciduous, Waves, type LucideIcon } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../../components/Button'
import { HealthMeter } from '../../components/HealthMeter'
import { SpeakerButton } from '../../components/SpeakerButton'
import { WorkScreen } from '../../components/WorkScreen'
import { konten } from '../../content'
import type { Tindakan } from '../../content/types'
import { playVoice } from '../../lib/audio'
import { Burst } from '../../components/Burst'
import { bereaksi } from '../../store/badrulStore'
import { usePhaseFrame } from '../game/usePhaseFrame'
import { KartuTindakan } from './KartuTindakan'
import { eventProgress, healthMeter } from './meter'

/** Placeholder ilustrasi kejadian sampai 3 ilustrasi WebP tersedia (design.md 15). */
const SCENE: Record<string, { latar: LucideIcon; masalah: LucideIcon; warna: string }> = {
  'sungai-sampah': { latar: Waves, masalah: Trash2, warna: 'bg-sungai-300' },
  'pohon-ditebang': { latar: TreeDeciduous, masalah: Axe, warna: 'bg-alam-100' },
  'jalan-tergenang': { latar: Route, masalah: CloudRain, warna: 'bg-gading-200' },
}

/** Papan aksi yang tertancap di lokasi kejadian dan tetap ada sampai rapor (design.md 7.9). */
export function PapanAksi({ label }: { label: string }) {
  return (
    <span className="inline-flex flex-col items-center">
      <span className="flex items-center gap-1.5 rounded-sm border-2 border-emas-400 bg-marun-700 px-3 py-1.5 font-body text-kecil text-gading-50 shadow-rest">
        <Signpost aria-hidden size={20} strokeWidth={2.5} className="text-emas-400" />
        {label}
      </span>
      <span aria-hidden className="h-5 w-1.5 rounded-b-sm bg-marun-900" />
    </span>
  )
}

export function Phase5Event() {
  const { log, record, donePhases, actor, finish } = usePhaseFrame(5)
  const events = konten.kejadian
  const progress = eventProgress(log)
  const meter = healthMeter(log)

  const firstOpen = events.findIndex((e) => !progress.get(e.id)?.resolvedBy)
  const [index, setIndex] = useState(firstOpen === -1 ? events.length - 1 : firstOpen)
  const [feedback, setFeedback] = useState<string | null>(null)

  const ev = events[index]
  const p = progress.get(ev.id)!
  const resolved = ev.tindakan.find((t) => t.id === p.resolvedBy)
  const isLast = index === events.length - 1
  const scene = SCENE[ev.id] ?? SCENE['sungai-sampah']

  const choose = (t: Tindakan) => {
    record('event_action_chosen', { eventId: ev.id, actionId: t.id, correct: t.jenis === 'tepat', attempt: p.tried.length + 1 })
    // Pilihan kurang tepat dibalas cerita, bukan tanda silang (prd.md 5.3).
    setFeedback(t.umpanBalik)
    bereaksi(t.jenis === 'tepat' ? 'senang' : 'berpikir')
    playVoice(t.audio)
  }

  const instruction = feedback ?? resolved?.umpanBalik ?? 'Apa yang akan kalian lakukan?'

  return (
    <WorkScreen
      phase={5}
      donePhases={donePhases}
      actor={actor}
      instruction={instruction}
      voiceSrc="/audio/instruksi/fase-5.mp3"
      primary={
        <Button
          icon={ArrowRight}
          disabled={!resolved}
          onClick={() => {
            setFeedback(null)
            if (isLast) finish()
            else setIndex(index + 1)
          }}
        >
          {isLast ? 'Lanjut' : 'Berikutnya'}
        </Button>
      }
    >
      <div className="absolute inset-0 overflow-y-auto">
      <div className="flex min-h-full flex-col gap-4 px-4 pt-4 pb-4 sm:gap-5 sm:px-8 sm:pt-8 sm:pb-6">
        <div className="flex flex-wrap items-center gap-3 sm:gap-6">
          <div className="flex-1">
            <HealthMeter value={meter} />
          </div>
          <ol aria-label="Kejadian" className="flex gap-2">
            {events.map((e, i) => {
              const done = progress.get(e.id)?.resolvedBy
              return (
                <li
                  key={e.id}
                  aria-label={`Kejadian ${i + 1}${done ? ', selesai' : ''}`}
                  className={`inline-flex size-11 items-center justify-center rounded-full border-2 font-display font-bold ${
                    i === index ? 'border-marun-700 bg-gading-50 text-marun-700' : done ? 'border-emas-600 bg-emas-400 text-marun-900' : 'border-gading-200 bg-gading-50 text-tanah-600'
                  }`}
                >
                  {done ? <Signpost aria-hidden size={20} strokeWidth={2.5} /> : i + 1}
                </li>
              )
            })}
          </ol>
        </div>

        <section key={ev.id} className="flex min-h-[200px] flex-1 flex-col gap-4 rounded-lg border-[3px] border-emas-400 bg-gading-50 p-4 shadow-rest sm:flex-row sm:gap-6 sm:p-6 animate-[tumbuh_250ms_cubic-bezier(0.16,1,0.3,1)]">
          <div className={`relative flex h-32 w-full shrink-0 items-center justify-center rounded-md sm:aspect-square sm:h-full sm:max-h-[280px] sm:w-auto ${scene.warna}`}>
            <scene.latar aria-hidden size={140} strokeWidth={2} className="text-marun-900/25" />
            {!resolved && (
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="inline-flex size-24 items-center justify-center rounded-full border-4 border-marun-700 bg-gading-50/90 animate-[denyut_1600ms_ease-in-out_infinite]">
                  <scene.masalah aria-hidden size={48} strokeWidth={2.5} className="text-marun-700" />
                </span>
              </span>
            )}
            {resolved && (
              <span className="absolute bottom-3 animate-[tumbuh_400ms_cubic-bezier(0.34,1.4,0.64,1)]">
                <PapanAksi label={resolved.label} />
                <Burst jenis="bintang" />
              </span>
            )}
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <h2 className="font-display text-fase text-marun-700">{ev.judul}</h2>
            <p className="max-w-[60ch] font-body text-isi text-tanah-900">{ev.cerita}</p>
            <SpeakerButton src={ev.audio} label="Dengar cerita kejadian" />
          </div>
        </section>

        <div className="flex flex-col items-center gap-2" role="group" aria-label="Pilihan kalian">
          <span className="font-body text-instruksi text-tanah-900">Kalian pilih yang mana?</span>
          <div className="flex w-full max-w-[860px] flex-col gap-3 sm:flex-row sm:gap-4">
            {ev.tindakan.map((t) => (
              <KartuTindakan
                key={t.id}
                tindakan={t}
                sudahDicoba={p.tried.includes(t.id)}
                terpilih={resolved?.id === t.id}
                selesai={!!resolved}
                onPilih={() => !resolved && !p.tried.includes(t.id) && choose(t)}
              />
            ))}
          </div>
        </div>
      </div>
      </div>
    </WorkScreen>
  )
}
