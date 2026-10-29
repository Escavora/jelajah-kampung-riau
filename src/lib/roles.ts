/** Id tetap (dipakai di log). Nama yang tampil ke anak ada di ROLES (Pembangun, Pemilah, Pencari Guna, Penjaga Kampung). */
export type RoleId = 'arsitek' | 'juru-label' | 'pencatat' | 'penjaga'

export interface RoleInfo {
  id: RoleId
  nama: string
  tugas: string
}

export const ROLES: Record<RoleId, RoleInfo> = {
  arsitek: { id: 'arsitek', nama: 'Pembangun', tugas: 'Membangun kampung' },
  'juru-label': { id: 'juru-label', nama: 'Pemilah', tugas: 'Memilih: Alam atau Buatan?' },
  pencatat: { id: 'pencatat', nama: 'Pencari Guna', tugas: 'Mencari guna tiap tempat' },
  penjaga: { id: 'penjaga', nama: 'Penjaga Kampung', tugas: 'Memilih cara menjaga kampung' },
}

/**
 * Peran utama tiap fase. Fase 0 dijelajahi bersama tanpa peran utama.
 * Fase 4 dipegang Arsitek karena kelompok mungkin perlu menambah elemen yang kurang.
 */
export const PHASE_ROLE: Record<number, RoleId | null> = {
  0: null,
  1: 'arsitek',
  2: 'juru-label',
  3: 'pencatat',
  4: 'arsitek',
  5: 'penjaga',
}

export interface Turn {
  phase: number
  role: RoleId
  actorId: string
}

export function turnCounts(memberIds: string[], turns: Turn[]): Map<string, number> {
  const counts = new Map(memberIds.map((id) => [id, 0]))
  for (const turn of turns) {
    if (counts.has(turn.actorId)) counts.set(turn.actorId, counts.get(turn.actorId)! + 1)
  }
  return counts
}

/**
 * Anggota yang boleh memegang peran utama berikutnya: yang paling sedikit kebagian.
 * Dengan begitu tidak ada anak yang dapat giliran kedua sebelum semua dapat giliran pertama.
 */
export function eligibleActors(memberIds: string[], turns: Turn[]): string[] {
  if (memberIds.length === 0) return []
  const counts = turnCounts(memberIds, turns)
  const min = Math.min(...counts.values())
  return memberIds.filter((id) => counts.get(id) === min)
}

export function canTakeTurn(actorId: string, memberIds: string[], turns: Turn[]): boolean {
  return eligibleActors(memberIds, turns).includes(actorId)
}

/** Peran unik yang pernah dipegang tiap anggota, untuk lencana di rapor. */
export function rolesHeld(actorId: string, turns: Turn[]): RoleId[] {
  return [...new Set(turns.filter((t) => t.actorId === actorId).map((t) => t.role))]
}
