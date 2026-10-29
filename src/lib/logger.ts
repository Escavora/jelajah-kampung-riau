import type { Kategori } from '../content/types'
import type { RoleId } from './roles'

/** Bentuk payload tiap aksi. Daftar minimal dari prd.md 9.3, ditambah `role_assigned` dan `benefit_detached`. */
export interface PayloadMap {
  role_assigned: { role: RoleId }
  pin_opened: { elementId: string }
  element_found: { elementId: string }
  /** `cell` adalah indeks petak grid 6 x 4, dihitung dari kiri atas. `fromCell` ada kalau elemen dipindah. */
  element_placed: { elementId: string; cell: number; fromCell?: number }
  element_removed: { elementId: string }
  label_changed: { elementId: string; from: Kategori | null; to: Kategori | null }
  label_locked: { labels: Record<string, Kategori> }
  /** Kartu "Manfaat versi kami" memakai `benefitId` CUSTOM_BENEFIT_ID dan mengisi `custom`. */
  benefit_attached: {
    elementId: string
    benefitId: string
    custom?: { text: string }
  }
  benefit_detached: { elementId: string; benefitId: string }
  /** `correct` dicatat supaya CSV mudah dibaca. Scoring tetap menghitung ulang dari konten. */
  citizen_linked: { citizenId: string; elementId: string; correct: boolean }
  hint_used: { citizenId?: string; eventId?: string }
  event_action_chosen: { eventId: string; actionId: string; correct: boolean; attempt: number }
  reflection_submitted: { favoritePhase: number; text: string }
  phase_completed: Record<string, never>
}

export type ActionType = keyof PayloadMap

export const ACTIONS = [
  'role_assigned',
  'pin_opened',
  'element_found',
  'element_placed',
  'element_removed',
  'label_changed',
  'label_locked',
  'benefit_attached',
  'benefit_detached',
  'citizen_linked',
  'hint_used',
  'event_action_chosen',
  'reflection_submitted',
  'phase_completed',
] as const satisfies readonly ActionType[]

// Gagal dikompilasi kalau ada aksi di PayloadMap yang lupa dimasukkan ke ACTIONS.
const _actionsComplete: Exclude<ActionType, (typeof ACTIONS)[number]> extends never ? true : never = true
void _actionsComplete

/** Fase 0 sampai 5 sesuai PRD. Refleksi memakai 6. */
export type PhaseNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6
export const PHASE_REFLEKSI: PhaseNumber = 6

/** Dipakai saat aksi dilakukan bersama, misalnya di Fase 0 yang tidak punya peran utama. */
export const GROUP_ACTOR = 'kelompok'

export type LogRole = RoleId | typeof GROUP_ACTOR

interface LogBase {
  sessionId: string
  groupId: string
  phase: PhaseNumber
  role: LogRole
  actorId: string
  timestamp: string
}

export type LogEntryOf<A extends ActionType> = LogBase & { action: A; payload: PayloadMap[A] }

export type LogEntry = { [A in ActionType]: LogEntryOf<A> }[ActionType]

export type LogInput<A extends ActionType = ActionType> = Omit<LogEntryOf<A>, 'timestamp'>

export function createLogEntry<A extends ActionType>(input: LogInput<A>, now: Date = new Date()): LogEntry {
  // TypeScript tidak bisa menyempitkan generik A ke salah satu anggota union, jadi perlu cast.
  return { ...input, payload: { ...input.payload }, timestamp: formatLocalIso(now) } as unknown as LogEntry
}

export function entriesOf<A extends ActionType>(log: readonly LogEntry[], action: A): LogEntryOf<A>[] {
  return log.filter((entry) => entry.action === action) as unknown as LogEntryOf<A>[]
}

const pad = (n: number) => String(Math.trunc(Math.abs(n))).padStart(2, '0')

/** ISO 8601 dengan offset zona waktu perangkat, misalnya 2026-11-03T08:14:22+07:00. */
export function formatLocalIso(date: Date): string {
  const offsetMin = -date.getTimezoneOffset()
  const sign = offsetMin >= 0 ? '+' : '-'
  const offset = `${sign}${pad(offsetMin / 60)}:${pad(offsetMin % 60)}`
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}${offset}`
  )
}

/** "Kelompok 3" menjadi "kelompok-3". */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** "2026-11-03" + "Kelompok 3" menjadi "2026-11-03-k3". Akhiran -2, -3 ditambah kalau sudah dipakai. */
export function createSessionId(groupName: string, date: Date, existing: Iterable<string> = []): string {
  const slug = slugify(groupName)
  const short = slug.replace(/^kelompok-?/, 'k').replace(/-/g, '') || 'k'
  const base = `${formatLocalIso(date).slice(0, 10)}-${short}`
  const taken = new Set(existing)
  if (!taken.has(base)) return base
  let n = 2
  while (taken.has(`${base}-${n}`)) n++
  return `${base}-${n}`
}
