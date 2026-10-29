import { describe, expect, it } from 'vitest'
import { canTakeTurn, eligibleActors, PHASE_ROLE, rolesHeld, type Turn } from './roles'

const PHASES_WITH_ROLE = Object.entries(PHASE_ROLE).filter(([, role]) => role !== null)

/** Simulasi satu sesi: tiap fase memilih anak pertama yang boleh. */
function simulate(members: string[], pick: (eligible: string[]) => string = (e) => e[0]): Turn[] {
  const turns: Turn[] = []
  for (const [phase, role] of PHASES_WITH_ROLE) {
    const actorId = pick(eligibleActors(members, turns))
    turns.push({ phase: Number(phase), role: role!, actorId })
  }
  return turns
}

describe('rotasi peran', () => {
  it('semua anggota boleh di awal', () => {
    expect(eligibleActors(['a', 'b', 'c'], [])).toEqual(['a', 'b', 'c'])
  })

  it('anak yang sudah kebagian tidak boleh lagi sebelum semua kebagian', () => {
    const turns: Turn[] = [{ phase: 1, role: 'arsitek', actorId: 'a' }]
    expect(canTakeTurn('a', ['a', 'b', 'c'], turns)).toBe(false)
    expect(eligibleActors(['a', 'b', 'c'], turns)).toEqual(['b', 'c'])
  })

  it('setelah semua kebagian, semua boleh lagi', () => {
    const turns: Turn[] = [
      { phase: 1, role: 'arsitek', actorId: 'a' },
      { phase: 2, role: 'juru-label', actorId: 'b' },
      { phase: 3, role: 'pencatat', actorId: 'c' },
    ]
    expect(eligibleActors(['a', 'b', 'c'], turns)).toEqual(['a', 'b', 'c'])
  })

  it.each([3, 4])('kelompok %i anak: selisih giliran antar anak paling banyak 1', (size) => {
    const members = Array.from({ length: size }, (_, i) => `anak-${i}`)
    // Pilih anak terakhir yang boleh supaya urutannya tidak sekadar berurutan.
    const turns = simulate(members, (e) => e[e.length - 1])
    const counts = members.map((m) => turns.filter((t) => t.actorId === m).length)
    expect(Math.max(...counts) - Math.min(...counts)).toBeLessThanOrEqual(1)
    expect(Math.min(...counts)).toBeGreaterThanOrEqual(1)
  })

  it('mencatat peran unik yang dipegang untuk lencana', () => {
    const turns: Turn[] = [
      { phase: 1, role: 'arsitek', actorId: 'a' },
      { phase: 4, role: 'arsitek', actorId: 'a' },
      { phase: 5, role: 'penjaga', actorId: 'a' },
    ]
    expect(rolesHeld('a', turns)).toEqual(['arsitek', 'penjaga'])
  })
})
