import { ArrowRight, MapPin, Star, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../../components/Button'
import { MapFrame } from '../../components/KampungMap'
import { PucukRebungBand } from '../../components/Ornamen'
import { SpeakerButton } from '../../components/SpeakerButton'
import { WorkScreen } from '../../components/WorkScreen'
import { elemenById, konten } from '../../content'
import type { Elemen } from '../../content/types'
import { entriesOf } from '../../lib/logger'
import { bereaksi } from '../../store/badrulStore'
import { usePhaseFrame } from '../game/usePhaseFrame'

/** prd.md 5.3: minimal 5 pin dikunjungi untuk lanjut. */
export const MIN_PIN = 5

const PINS = konten.elemen.filter((e) => e.pin)

/** Bangunan tampil sebagai ilustrasi kecil di peta. Alam (dan danau) sudah tergambar di peta, jadi cukup pin. */
const berilustrasi = (e: Elemen) => e.kategori === 'buatan' && !!e.gambar

/** Kartu info sebagai lembar dari bawah setinggi 60% (design.md 7.4), peta tetap terlihat di atasnya. */
function InfoSheet({ elemen, onClose }: { elemen: Elemen; onClose: () => void }) {
  return (
    <div
      role="dialog"
      aria-label={elemen.nama}
      className="absolute inset-x-0 bottom-0 z-20 flex h-[60%] gap-4 rounded-t-lg bg-gading-50 p-4 shadow-lift animate-[naik_250ms_cubic-bezier(0.16,1,0.3,1)] sm:gap-6 sm:p-8 pendek:h-[92%] pendek:p-3"
    >
      <div aria-hidden className="pointer-events-none absolute inset-x-8 -top-3">
        <PucukRebungBand height={12} inner="var(--color-gading-50)" />
      </div>
      <div className="flex aspect-square h-full shrink-0 items-center justify-center rounded-lg bg-gading-200 text-marun-700 max-sm:hidden pendek:hidden">
        {elemen.gambar ? (
          <img src={elemen.gambar} alt="" className="size-full rounded-lg object-cover" />
        ) : (
          <MapPin aria-hidden size={72} strokeWidth={2.5} />
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2 sm:gap-4 pendek:gap-1">
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-display text-sub text-marun-700 sm:text-fase pendek:text-sub">{elemen.nama}</h2>
          <button
            type="button"
            aria-label="Tutup"
            onClick={onClose}
            className="tap inline-flex shrink-0 items-center justify-center rounded-full border-2 border-marun-700 text-marun-700"
          >
            <X aria-hidden size={30} strokeWidth={2.5} />
          </button>
        </div>
        <p className="max-w-[60ch] font-body text-[19px] leading-snug text-tanah-900 sm:text-isi sm:leading-[1.5] pendek:text-[18px] pendek:leading-snug">{elemen.info}</p>
        <SpeakerButton src={elemen.audio} label={`Dengar tentang ${elemen.nama}`} autoPlay />
      </div>
    </div>
  )
}

export function Phase0Explore() {
  const { log, record, donePhases, finish } = usePhaseFrame(0)
  const [openId, setOpenId] = useState<string | null>(null)
  const [lompat, setLompat] = useState<{ id: string; n: number } | null>(null)
  const visited = new Set(entriesOf(log, 'pin_opened').map((e) => e.payload.elementId))
  const count = Math.min(visited.size, MIN_PIN)
  const open = openId ? elemenById.get(openId) : undefined

  const openPin = (id: string) => {
    setOpenId(id)
    record('pin_opened', { elementId: id })
    setLompat({ id, n: Date.now() })
    if (!visited.has(id)) bereaksi('senang')
  }

  return (
    <WorkScreen
      phase={0}
      perluMendatar
      donePhases={donePhases}
      instruction={
        visited.size >= MIN_PIN
          ? 'Hebat! Kalian sudah mengumpulkan 5 stiker.'
          : 'Ketuk tempat di peta untuk mengenalnya.'
      }
      voiceSrc="/audio/instruksi/fase-0.mp3"
      primary={
        <Button icon={ArrowRight} disabled={visited.size < MIN_PIN} onClick={finish}>
          Lanjut
        </Button>
      }
    >

      <div
        aria-live="polite"
        className="absolute top-2 right-3 z-10 flex items-center gap-2 rounded-full bg-gading-50 px-4 py-1.5 shadow-rest sm:top-3 sm:right-6"
      >
        <Star aria-hidden size={24} strokeWidth={2.5} className="fill-emas-400 text-emas-600" />
        <span key={count} className="font-body text-kecil text-marun-900 animate-[bump_340ms_ease-out]">
          Stiker: {count} dari {MIN_PIN}
        </span>
      </div>

      {/* Peta SVG dan pin berbagi satu kotak 3:2, jadi posisi pin (persen) selalu tepat. */}
      <MapFrame variant="peta" className="absolute inset-0 px-3 pt-14 pb-3 sm:px-6 sm:pt-16 sm:pb-4 pendek:pt-12">
        {PINS.map((e) => {
          const isVisited = visited.has(e.id)
          const ilustrasi = berilustrasi(e)
          return (
            <button
              key={e.id}
              type="button"
              onClick={() => openPin(e.id)}
              aria-label={`${e.nama}${isVisited ? ', sudah dikunjungi' : ''}`}
              style={{ left: `${e.pin!.x}%`, top: `${e.pin!.y}%`, width: ilustrasi ? '10%' : undefined }}
              // Area ketuk minimal 72 px (design.md 5).
              className="group absolute z-10 flex min-h-[72px] min-w-[72px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center transition-transform duration-150 active:scale-95"
            >
              <span key={lompat?.id === e.id ? lompat.n : 'diam'} className={`relative flex w-full flex-col items-center ${lompat?.id === e.id ? 'animate-[lompat_480ms_ease-out]' : ''}`}>
                <MapPin
                  aria-hidden
                  size={40}
                  strokeWidth={2.5}
                  className={`fill-emas-400 text-marun-900 drop-shadow ${ilustrasi ? 'absolute -top-9 z-10' : ''}`}
                />
                {ilustrasi && (
                  <img
                    src={e.gambar}
                    alt=""
                    draggable={false}
                    className="aspect-[4/3] w-full rounded-md border-[3px] border-gading-50 object-cover shadow-rest"
                  />
                )}
                {isVisited && (
                  <Star
                    aria-hidden
                    size={28}
                    strokeWidth={2.5}
                    className="absolute -top-3 -right-3 z-10 fill-emas-400 text-emas-600 animate-[cap_420ms_cubic-bezier(0.2,0.9,0.3,1)]"
                  />
                )}
              </span>
              <span className="mt-1 rounded-sm bg-gading-50/95 px-2 py-0.5 font-body text-kecil whitespace-nowrap text-marun-900 shadow-rest">
                {e.nama}
              </span>
            </button>
          )
        })}
      </MapFrame>

      {open && <InfoSheet elemen={open} onClose={() => setOpenId(null)} />}
    </WorkScreen>
  )
}
