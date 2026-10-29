import { useEffect, useRef, useState, type ComponentType } from 'react'
import { Navigate } from 'react-router-dom'
import { AvatarPicker } from '../../components/Avatar'
import { LebahBergantung, PucukRebungBand, SongketGround } from '../../components/Ornamen'
import { RoleBadge } from '../../components/RoleBadge'
import { PojokMusik } from '../../components/TombolMusik'
import { judulLangkah, nomorLangkah } from '../../content/istilah'
import { efek, useSuasana } from '../../lib/musik'
import type { PhaseNumber } from '../../lib/logger'
import { eligibleActors, PHASE_ROLE, ROLES } from '../../lib/roles'
import { useActiveSession, useSessionStore } from '../../store/sessionStore'
import { Phase0Explore } from '../phase0-explore/Phase0Explore'
import { Phase1Build } from '../phase1-build/Phase1Build'
import { Phase2Label } from '../phase2-label/Phase2Label'
import { Phase3Benefit } from '../phase3-benefit/Phase3Benefit'
import { Phase4Citizen } from '../phase4-citizen/Phase4Citizen'
import { Phase5Event } from '../phase5-event/Phase5Event'
import { ReflectionScreen } from '../reflection/ReflectionScreen'
import { ReportScreen } from '../report/ReportScreen'


const PHASE_SCREENS: Record<number, ComponentType> = {
  0: Phase0Explore,
  1: Phase1Build,
  2: Phase2Label,
  3: Phase3Benefit,
  4: Phase4Citizen,
  5: Phase5Event,
}

/** Layar giliran (design.md 7.3). Anak yang sudah kebagian tampil redup dan belum bisa dipilih. */
function TurnScreen({ phase }: { phase: PhaseNumber }) {
  const session = useActiveSession()!
  const assignTurn = useSessionStore((s) => s.assignTurn)
  const setStep = useSessionStore((s) => s.setStep)
  const role = PHASE_ROLE[phase]!
  useSuasana('meriah', false)
  const ids = session.members.map((m) => m.id)
  const eligible = eligibleActors(ids, session.turns.filter((t) => t.phase !== phase))

  return (
    <div className="relative flex h-full flex-col items-center justify-center gap-5 overflow-y-auto bg-gading-100 px-4 pt-12 pb-6 sm:gap-8 pendek:gap-2 pendek:pt-10">
      <div className="absolute inset-x-0 top-0 h-6 bg-marun-700" />
      <PojokMusik />
      <LebahBergantung className="absolute inset-x-0 top-6" />
      <h1 className="font-display text-fase text-marun-700">
        Langkah {nomorLangkah(phase)}: {judulLangkah(phase)}
      </h1>
      <p className="flex items-center gap-3 font-body text-instruksi text-tanah-900">
        Sekarang giliran <RoleBadge role={role} />
      </p>
      <p className="font-body text-isi text-tanah-600">
        Tugasnya: {ROLES[role].tugas}. Siapa yang mau?
      </p>
      <AvatarPicker
        label={`Pilih ${ROLES[role].nama}`}
        selected={[]}
        options={session.members.map((m) => {
          const boleh = eligible.includes(m.id)
          return { id: m.id, caption: boleh ? m.nama : `${m.nama} (sudah kebagian)`, dimmed: !boleh, disabled: !boleh }
        })}
        onSelect={(id) => {
          assignTurn(phase, id)
          setStep({ screen: 'fase', phase })
        }}
      />
    </div>
  )
}

/**
 * Tirai songket meluncur ke kiri tiap layar berganti, membuka layar berikutnya.
 * Layar baru sudah ada di bawahnya, jadi tirai tidak membuat anak menunggu. Tidak diputar saat
 * pertama dimuat (misalnya setelah refresh). Di reduce motion berganti jadi pudar.
 */
function Tirai({ kunci }: { kunci: string }) {
  // Dibandingkan dengan kunci sebelumnya (bukan penanda "pertama kali"), supaya aman dari
  // efek ganda StrictMode dan tidak terputar saat layar pertama dimuat.
  const sebelumnya = useRef(kunci)
  const [n, setN] = useState(0)
  useEffect(() => {
    if (sebelumnya.current === kunci) return
    sebelumnya.current = kunci
    efek('whoosh')
    setN((x) => x + 1)
  }, [kunci])
  if (n === 0) return null
  return (
    <div key={n} aria-hidden className="tirai-songket pointer-events-none fixed inset-0 z-40 border-r-[10px] border-emas-400 bg-marun-700">
      <SongketGround opacity={0.2} />
      <PucukRebungBand height={26} className="absolute inset-x-0 bottom-0" />
    </div>
  )
}

export function GamePage() {
  const session = useActiveSession()
  if (!session) return <Navigate to="/" replace />
  return (
    <>
      <Tirai kunci={JSON.stringify(session.step)} />
      <Layar session={session} />
    </>
  )
}

function Layar({ session }: { session: NonNullable<ReturnType<typeof useActiveSession>> }) {
  const { step } = session

  switch (step.screen) {
    case 'setup':
      return <Navigate to="/setup" replace />
    case 'giliran':
      return <TurnScreen key={`g${step.phase}`} phase={step.phase} />
    case 'fase': {
      const Screen = PHASE_SCREENS[step.phase]
      return <Screen key={`f${step.phase}`} />
    }
    case 'refleksi':
      return <ReflectionScreen key={`r${step.memberIndex}`} memberIndex={step.memberIndex} />
    case 'rapor':
      return <ReportScreen />
  }
}
