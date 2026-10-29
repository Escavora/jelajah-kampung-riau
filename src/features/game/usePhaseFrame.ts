import { completedPhases } from '../../lib/derive'
import type { PhaseNumber } from '../../lib/logger'
import { PHASE_ROLE } from '../../lib/roles'
import { useSessionLog } from '../../store/logStore'
import { useActiveSession, useSessionStore, type Step } from '../../store/sessionStore'
import { useGameLog } from '../../store/useGameLog'

const LAST_PHASE = 5

/** Layar sesudah fase `phase` selesai: giliran fase berikut, atau refleksi setelah Fase 5. */
export function nextStep(phase: PhaseNumber): Step {
  if (phase >= LAST_PHASE) return { screen: 'refleksi', memberIndex: 0 }
  const next = (phase + 1) as PhaseNumber
  return PHASE_ROLE[next] ? { screen: 'giliran', phase: next } : { screen: 'fase', phase: next }
}

/** Data bersama tiap layar fase: pelaku, progres, pencatat log, dan aksi selesai. */
export function usePhaseFrame(phase: PhaseNumber) {
  const session = useActiveSession()!
  const log = useSessionLog(session.id)
  const setStep = useSessionStore((s) => s.setStep)
  const record = useGameLog(phase)
  const turn = session.turns.find((t) => t.phase === phase)
  const member = turn && session.members.find((m) => m.id === turn.actorId)

  return {
    log,
    record,
    donePhases: completedPhases(log),
    actor: turn && member ? { avatarId: member.id, nama: member.nama, role: turn.role } : undefined,
    finish: () => {
      record('phase_completed', {})
      setStep(nextStep(phase))
    },
  }
}
