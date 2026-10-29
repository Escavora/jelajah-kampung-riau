import { useCallback } from 'react'
import { createLogEntry, type ActionType, type PayloadMap, type PhaseNumber } from '../lib/logger'
import { useLogStore } from './logStore'
import { actorFor, useActiveSession } from './sessionStore'

/**
 * Pencatat aksi untuk satu fase. Peran dan `actorId` diambil dari giliran fase itu,
 * sehingga komponen fase tidak perlu tahu siapa yang sedang memegang peran.
 */
export function useGameLog(phase: PhaseNumber, actorOverride?: string) {
  const session = useActiveSession()
  const append = useLogStore((s) => s.append)

  return useCallback(
    <A extends ActionType>(action: A, payload: PayloadMap[A]) => {
      if (!session) return
      const actor = actorFor(session, phase)
      append(
        createLogEntry({
          sessionId: session.id,
          groupId: session.groupId,
          phase,
          role: actor.role,
          actorId: actorOverride ?? actor.actorId,
          action,
          payload,
        }),
      )
    },
    [session, phase, actorOverride, append],
  )
}
