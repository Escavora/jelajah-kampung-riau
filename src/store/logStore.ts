import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { LogEntry } from '../lib/logger'

interface LogState {
  /** Log per sesi. Hanya ditambah, tidak pernah diubah, karena skor dihitung ulang dari sini. */
  logs: Record<string, LogEntry[]>
  append: (entry: LogEntry) => void
  removeSession: (sessionId: string) => void
}

export const useLogStore = create<LogState>()(
  persist(
    (set) => ({
      logs: {},
      append: (entry) =>
        set((state) => ({
          logs: { ...state.logs, [entry.sessionId]: [...(state.logs[entry.sessionId] ?? []), entry] },
        })),
      removeSession: (sessionId) =>
        set((state) => {
          const { [sessionId]: _removed, ...rest } = state.logs
          return { logs: rest }
        }),
    }),
    { name: 'jkr-log', version: 1, storage: createJSONStorage(() => localStorage) },
  ),
)

const EMPTY: LogEntry[] = []

export const useSessionLog = (sessionId: string | null | undefined) =>
  useLogStore((state) => (sessionId ? (state.logs[sessionId] ?? EMPTY) : EMPTY))
