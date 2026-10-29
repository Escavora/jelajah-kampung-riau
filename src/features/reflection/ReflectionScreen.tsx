import { ArrowRight, Check, Hammer, Map as MapIcon, NotebookPen, Sprout, Tag, Users, type LucideIcon } from 'lucide-react'
import { useState } from 'react'
import { AvatarIcon } from '../../components/Avatar'
import { Badrul } from '../../components/Badrul'
import { Button } from '../../components/Button'
import { PucukRebungBand } from '../../components/Ornamen'
import { TombolMusik } from '../../components/TombolMusik'
import { useSuasana } from '../../lib/musik'
import { ShortTextInput } from '../../components/ShortTextInput'
import { NAMA_BAGIAN_SERU } from '../../content/istilah'
import { PHASE_REFLEKSI } from '../../lib/logger'
import { useActiveSession, useSessionStore } from '../../store/sessionStore'
import { useGameLog } from '../../store/useGameLog'

/** Ubin bergambar fase, bukan emoji wajah, supaya pilihannya bermakna (design.md 7.10). */
const IKON_BAGIAN: LucideIcon[] = [MapIcon, Hammer, Tag, NotebookPen, Users, Sprout]
const UBIN = NAMA_BAGIAN_SERU.map((nama, phase) => ({ phase, nama, icon: IKON_BAGIAN[phase] }))

/** Refleksi individu: satu layar per anak, sapaan "kamu" (design.md 12). */
export function ReflectionScreen({ memberIndex }: { memberIndex: number }) {
  const session = useActiveSession()!
  const setStep = useSessionStore((s) => s.setStep)
  const finishSession = useSessionStore((s) => s.finishSession)
  const member = session.members[memberIndex]
  const record = useGameLog(PHASE_REFLEKSI, member?.id)
  useSuasana('meriah', false)
  const [fav, setFav] = useState<number | null>(null)
  const [janji, setJanji] = useState<string | null>(null)
  const isLast = memberIndex >= session.members.length - 1

  if (!member) return null

  const submit = () => {
    if (fav === null || !janji) return
    record('reflection_submitted', { favoritePhase: fav, text: janji })
    if (isLast) {
      finishSession()
      setStep({ screen: 'rapor' })
    } else setStep({ screen: 'refleksi', memberIndex: memberIndex + 1 })
  }

  const instruction = fav === null ? 'Pilih bagian yang paling seru menurutmu.' : !janji ? 'Tulis satu hal yang akan kamu lakukan.' : 'Terima kasih! Tekan tombol untuk lanjut.'

  return (
    <div className="grid h-full grid-rows-[auto_minmax(0,1fr)_var(--bawah)] bg-gading-100">
      <header className="relative z-10 flex items-center gap-3 bg-marun-700 px-4 py-3 sm:gap-5 sm:px-8 sm:py-4">
        <AvatarIcon id={member.id} size={80} />
        <div>
          <p className="font-body text-kecil text-emas-100">
            Cerita {memberIndex + 1} dari {session.members.length}
          </p>
          <h1 className="font-display text-sub text-gading-50 sm:text-fase">Giliran {member.nama} bercerita</h1>
        </div>
        <TombolMusik className="ml-auto" />
        <PucukRebungBand flip height={14} className="pointer-events-none absolute inset-x-0 top-full" />
      </header>

      <main className="flex min-h-0 flex-col items-center justify-center gap-6 overflow-y-auto px-4 py-4 sm:gap-8 sm:px-8 sm:py-6">
        <section className="flex flex-col items-center gap-4">
          <h2 className="font-display text-sub text-marun-700">Bagian mana yang paling seru?</h2>
          <div role="radiogroup" aria-label="Bagian paling seru" className="flex flex-wrap justify-center gap-3">
            {UBIN.map((u) => (
              <button
                key={u.phase}
                type="button"
                role="radio"
                aria-checked={fav === u.phase}
                onClick={() => setFav(u.phase)}
                className={
                  'flex w-[132px] flex-col items-center gap-2 rounded-md border-[3px] p-3 font-body text-kecil shadow-rest transition-transform duration-150 active:scale-95 ' +
                  (fav === u.phase ? 'border-marun-700 bg-emas-100 text-marun-900' : 'border-emas-400 bg-gading-50 text-tanah-900')
                }
              >
                <u.icon aria-hidden size={40} strokeWidth={2.5} className="text-marun-700" />
                {u.nama}
              </button>
            ))}
          </div>
        </section>

        <section className="flex w-full max-w-2xl flex-col items-center gap-4">
          <h2 className="text-center font-display text-sub text-marun-700">Apa satu hal yang akan kamu lakukan untuk menjaga lingkungan?</h2>
          {janji ? (
            <p className="flex items-center gap-2 rounded-md bg-emas-100 px-4 py-3 font-body text-isi text-marun-900">
              <Check aria-hidden size={24} strokeWidth={3} />
              “{janji}”
            </p>
          ) : (
            <ShortTextInput onSave={setJanji} placeholder="Contoh: buang sampah di tempatnya" />
          )}
        </section>
      </main>

      <footer className="relative z-10 flex items-center gap-2 bg-marun-700 px-3 sm:gap-4 sm:px-6 max-sm:flex-wrap max-sm:content-center">
        <PucukRebungBand className="pointer-events-none absolute inset-x-0 bottom-full" />
        <Badrul size="var(--badrul)" />
        <p className="flex-1 font-body text-[18px] leading-snug text-gading-50 sm:text-instruksi max-sm:order-first max-sm:basis-full">{instruction}</p>
        <Button icon={ArrowRight} disabled={fav === null || !janji} onClick={submit} className="max-sm:ml-auto">
          {isLast ? 'Lihat Ringkasan' : 'Berikutnya'}
        </Button>
      </footer>
    </div>
  )
}
