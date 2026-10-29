import { House } from 'lucide-react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AvatarIcon } from '../../components/Avatar'
import { Badrul } from '../../components/Badrul'
import { Button } from '../../components/Button'
import { Kilau, LebahBergantung, PucukRebungBand, Selembayung, SongketGround } from '../../components/Ornamen'
import { RoleBadge } from '../../components/RoleBadge'
import { SpeakerButton } from '../../components/SpeakerButton'
import { PojokMusik } from '../../components/TombolMusik'
import { VillageView } from '../../components/VillageView'
import { konten } from '../../content'
import { canvasAt, placedCells } from '../../lib/derive'
import { useSuasana } from '../../lib/musik'
import { reportSentence, reportSummary } from '../../lib/report'
import { rolesHeld } from '../../lib/roles'
import { bereaksi } from '../../store/badrulStore'
import { useSessionLog } from '../../store/logStore'
import { useActiveSession, useSessionStore } from '../../store/sessionStore'
import { eventProgress } from '../phase5-event/meter'
import { PapanAksi } from '../phase5-event/Phase5Event'

const tunda = (ms: number) => ({ ['--tunda' as string]: `${ms}ms` })

/**
 * Ringkasan kampung (design.md 7.11): foto kenangan kampung, kalimat ringkasan, dan tugas tiap anggota.
 * Tanpa angka skor. Dua kolom di layar lebar; satu kolom yang bisa digulir di layar sempit.
 */
export function ReportScreen() {
  const navigate = useNavigate()
  const session = useActiveSession()!
  const leaveSession = useSessionStore((s) => s.leaveSession)
  const log = useSessionLog(session.id)
  const sentence = reportSentence(reportSummary(log))
  const progress = eventProgress(log)
  useSuasana('meriah', false)

  // Momen pembuka: setelah kampung terisi, Badrul meloncat gembira.
  useEffect(() => {
    const t = window.setTimeout(() => bereaksi('senang'), 2200)
    return () => window.clearTimeout(t)
  }, [])

  const papan = konten.kejadian
    .map((e) => e.tindakan.find((t) => t.id === progress.get(e.id)?.resolvedBy)?.label)
    .filter((l): l is string => !!l)

  return (
    <div className="relative h-full overflow-x-hidden overflow-y-auto bg-marun-700">
      <SongketGround />
      <Kilau />
      <PojokMusik />

      <div className="relative mx-auto grid min-h-full w-full max-w-[1240px] grid-cols-1 content-center items-center gap-6 px-5 pt-14 pb-16 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-10 lg:px-10">
        {/* Kiri: foto kenangan kampung, dibingkai seperti rumah Selaso. */}
        <figure className="mx-auto flex w-full max-w-[760px] animate-[jatuh_700ms_cubic-bezier(0.2,0.8,0.3,1)_both] flex-col items-center">
          <Selembayung width={96} className="relative z-10 -mb-5" />
          <div className="relative w-full rounded-lg border-4 border-emas-400 bg-gading-100 p-3 pt-7 shadow-lift sm:p-4 sm:pt-8">
            <LebahBergantung className="absolute inset-x-0 top-0" />
            <VillageView ids={[...canvasAt(log)]} cells={placedCells(log)} showNames={false} masuk className="aspect-[3/2] w-full" />
            {papan.length > 0 && (
              <div className="masuk-bergilir mt-3 flex flex-wrap justify-center gap-x-3 gap-y-1" style={tunda(2000)} aria-label="Papan hasil">
                {papan.map((label) => (
                  <PapanAksi key={label} label={label} />
                ))}
              </div>
            )}
          </div>
          <figcaption className="mt-3 text-center font-display text-sub text-emas-400">Kampung {session.groupName}</figcaption>
        </figure>

        {/* Kanan: judul, kalimat dari Badrul, tugas tiap anggota, tombol selesai. */}
        <section className="mx-auto flex w-full max-w-[560px] flex-col gap-5">
          <h1 className="masuk-bergilir text-center font-display text-fase text-gading-50 sm:text-display lg:text-left" style={tunda(500)}>
            Ringkasan
          </h1>

          <div className="masuk-bergilir flex items-center gap-4 rounded-lg bg-gading-50 p-4 shadow-rest sm:p-5" style={tunda(1000)}>
            <Badrul size={88} />
            <div className="flex min-w-0 flex-1 flex-col items-start gap-3">
              <p className="font-body text-isi text-tanah-900">{sentence}</p>
              <SpeakerButton src="/audio/rapor/kalimat.mp3" label="Dengar ringkasan" autoPlay />
            </div>
          </div>

          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1" aria-label="Tugas tiap anggota">
            {session.members.map((m, i) => (
              <li
                key={m.id}
                className="masuk-bergilir flex items-center gap-3 rounded-[22px] border-2 border-emas-400/50 bg-marun-900/35 p-3"
                style={tunda(1500 + i * 180)}
              >
                <AvatarIcon id={m.id} size={52} />
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <span className="font-display text-sub leading-tight text-gading-50 [overflow-wrap:anywhere]">{m.nama}</span>
                  <span className="flex flex-wrap gap-1.5">
                    {rolesHeld(m.id, session.turns).map((r) => (
                      <RoleBadge key={r} role={r} />
                    ))}
                  </span>
                </div>
              </li>
            ))}
          </ul>

          <Button
            icon={House}
            className="masuk-bergilir w-full sm:w-auto sm:self-start"
            style={tunda(2300)}
            onClick={() => {
              leaveSession()
              navigate('/')
            }}
          >
            Selesai
          </Button>
        </section>
      </div>

      <PucukRebungBand height={26} className="pointer-events-none absolute inset-x-0 bottom-0" />
    </div>
  )
}
