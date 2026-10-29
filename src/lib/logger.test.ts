import { describe, expect, it } from 'vitest'
import { ACTIONS, createLogEntry, createSessionId, formatLocalIso, slugify } from './logger'

describe('formatLocalIso', () => {
  it('memakai jam lokal dan menulis offset zona waktu', () => {
    const date = new Date(2026, 10, 3, 8, 14, 22)
    const iso = formatLocalIso(date)
    expect(iso).toMatch(/^2026-11-03T08:14:22[+-]\d{2}:\d{2}$/)
  })

  it('offset sesuai getTimezoneOffset perangkat', () => {
    const date = new Date(2026, 0, 1, 0, 0, 0)
    const offsetMin = -date.getTimezoneOffset()
    const [, sign, hh, mm] = formatLocalIso(date).match(/([+-])(\d{2}):(\d{2})$/)!
    expect((sign === '-' ? -1 : 1) * (Number(hh) * 60 + Number(mm))).toBe(offsetMin)
  })
})

describe('createLogEntry', () => {
  it('mengisi timestamp dan menyalin payload', () => {
    const payload = { elementId: 'taman', from: 'alam' as const, to: 'buatan' as const }
    const entry = createLogEntry(
      {
        sessionId: '2026-11-03-k3',
        groupId: 'kelompok-3',
        phase: 2,
        role: 'juru-label',
        actorId: 'avatar-kucing',
        action: 'label_changed',
        payload,
      },
      new Date(2026, 10, 3, 8, 14, 22),
    )
    expect(entry.timestamp.startsWith('2026-11-03T08:14:22')).toBe(true)
    expect(entry.payload).toEqual(payload)
    expect(entry.payload).not.toBe(payload)
  })

  it('memuat semua aksi minimal dari PRD', () => {
    const prd = [
      'pin_opened', 'element_found', 'element_placed', 'element_removed', 'label_changed', 'label_locked',
      'benefit_attached', 'citizen_linked', 'hint_used', 'event_action_chosen',
      'reflection_submitted', 'phase_completed',
    ]
    expect(ACTIONS).toEqual(expect.arrayContaining(prd))
  })
})

describe('slugify dan createSessionId', () => {
  it('membuat slug dari nama kelompok', () => {
    expect(slugify('Kelompok 3')).toBe('kelompok-3')
    expect(slugify('  Kelompok Bunga Melati! ')).toBe('kelompok-bunga-melati')
  })

  it('mengikuti format contoh PRD', () => {
    expect(createSessionId('Kelompok 3', new Date(2026, 10, 3, 9))).toBe('2026-11-03-k3')
  })

  it('menambah akhiran kalau id sudah dipakai', () => {
    const date = new Date(2026, 10, 3, 9)
    expect(createSessionId('Kelompok 3', date, ['2026-11-03-k3'])).toBe('2026-11-03-k3-2')
    expect(createSessionId('Kelompok 3', date, ['2026-11-03-k3', '2026-11-03-k3-2'])).toBe('2026-11-03-k3-3')
  })
})
