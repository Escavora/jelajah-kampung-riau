import { createLogEntry, type ActionType, type LogEntry, type LogRole, type PayloadMap, type PhaseNumber } from './logger'

/** Pembuat log untuk tes. Waktu dibuat berurutan satu detik per aksi. */
export function logBuilder(actorId = 'avatar-kucing', role: LogRole = 'kelompok') {
  const log: LogEntry[] = []
  const builder = {
    log,
    add<A extends ActionType>(phase: PhaseNumber, action: A, payload: PayloadMap[A]) {
      const entry = createLogEntry(
        { sessionId: '2026-11-03-k3', groupId: 'kelompok-3', phase, role, actorId, action, payload },
        new Date(2026, 10, 3, 8, 0, log.length),
      )
      log.push(entry)
      return builder
    },
    found(...ids: string[]) {
      ids.forEach((id) => builder.add(1, 'element_found', { elementId: id }))
      return builder
    },
    placed(...ids: string[]) {
      ids.forEach((id, i) => builder.add(1, 'element_placed', { elementId: id, cell: i }))
      return builder
    },
    label(elementId: string, from: PayloadMap['label_changed']['from'], to: PayloadMap['label_changed']['to']) {
      return builder.add(2, 'label_changed', { elementId, from, to })
    },
  }
  return builder
}
