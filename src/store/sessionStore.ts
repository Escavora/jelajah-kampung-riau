import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { konten } from '../content'
import { createLogEntry, createSessionId, GROUP_ACTOR, slugify, type LogRole, type PhaseNumber } from '../lib/logger'
import { PHASE_ROLE, type Turn } from '../lib/roles'
import { useLogStore } from './logStore'

export interface Member {
  /** Id avatar, sekaligus `actorId` di log. */
  id: string
  nama: string
}

/** Posisi kelompok dalam alur prd.md 5. Disimpan supaya refresh kembali ke layar yang sama. */
export type Step =
  | { screen: 'setup' }
  | { screen: 'giliran'; phase: PhaseNumber }
  | { screen: 'fase'; phase: PhaseNumber }
  | { screen: 'refleksi'; memberIndex: number }
  | { screen: 'rapor' }

export interface Session {
  id: string
  groupId: string
  groupName: string
  createdAt: string
  members: Member[]
  turns: Turn[]
  step: Step
  /** 3 warga Fase 4 diundi saat sesi dibuat supaya tetap sama setelah refresh. */
  citizenIds: string[]
  finishedAt?: string
}

export const MIN_MEMBERS = 3
export const MAX_MEMBERS = 4
export const MAX_NAMA = 10
export const WARGA_PER_SESI = 3

interface SessionState {
  sessions: Record<string, Session>
  activeId: string | null
  createSession: (groupName: string, now?: Date, random?: () => number) => string
  setMembers: (members: Member[]) => void
  assignTurn: (phase: PhaseNumber, actorId: string) => void
  setStep: (step: Step) => void
  finishSession: () => void
  /** Keluar dari sesi aktif tanpa menghapus data. */
  leaveSession: () => void
  deleteSession: (id: string) => void
}

function pickRandom<T>(items: T[], count: number, random: () => number): T[] {
  const pool = [...items]
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool.slice(0, count)
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => {
      const updateActive = (fn: (session: Session) => Session) => {
        const { activeId, sessions } = get()
        if (!activeId || !sessions[activeId]) return
        set({ sessions: { ...sessions, [activeId]: fn(sessions[activeId]) } })
      }

      return {
        sessions: {},
        activeId: null,

        createSession: (groupName, now = new Date(), random = Math.random) => {
          const id = createSessionId(groupName, now, Object.keys(get().sessions))
          const session: Session = {
            id,
            groupId: slugify(groupName),
            groupName: groupName.trim(),
            createdAt: now.toISOString(),
            members: [],
            turns: [],
            step: { screen: 'setup' },
            citizenIds: pickRandom(konten.warga, WARGA_PER_SESI, random).map((w) => w.id),
          }
          set({ sessions: { ...get().sessions, [id]: session }, activeId: id })
          return id
        },

        setMembers: (members) => updateActive((s) => ({ ...s, members })),

        assignTurn: (phase, actorId) => {
          const role = PHASE_ROLE[phase]
          if (!role) return
          updateActive((s) => ({
            ...s,
            turns: [...s.turns.filter((t) => t.phase !== phase), { phase, role, actorId }],
          }))
          const session = get().sessions[get().activeId!]
          useLogStore.getState().append(
            createLogEntry({
              sessionId: session.id,
              groupId: session.groupId,
              phase,
              role,
              actorId,
              action: 'role_assigned',
              payload: { role },
            }),
          )
        },

        setStep: (step) => updateActive((s) => ({ ...s, step })),

        finishSession: () => updateActive((s) => ({ ...s, finishedAt: new Date().toISOString() })),

        leaveSession: () => set({ activeId: null }),

        deleteSession: (id) => {
          const { [id]: _removed, ...rest } = get().sessions
          set({ sessions: rest, activeId: get().activeId === id ? null : get().activeId })
          useLogStore.getState().removeSession(id)
        },
      }
    },
    { name: 'jkr-session', version: 1, storage: createJSONStorage(() => localStorage) },
  ),
)

export const useActiveSession = () => useSessionStore((s) => (s.activeId ? s.sessions[s.activeId] : undefined))

/** Pemegang peran utama fase tertentu, atau kelompok bila fase itu dikerjakan bersama. */
export function actorFor(session: Session, phase: PhaseNumber): { role: LogRole; actorId: string } {
  const turn = session.turns.find((t) => t.phase === phase)
  return turn ? { role: turn.role, actorId: turn.actorId } : { role: GROUP_ACTOR, actorId: GROUP_ACTOR }
}
