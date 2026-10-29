import { create } from 'zustand'
import { efek } from '../lib/musik'

export type Reaksi = 'senang' | 'berpikir'

interface BadrulState {
  reaksi: Reaksi
  /** Dinaikkan tiap reaksi supaya animasi yang sama bisa diputar ulang. */
  n: number
  bereaksi: (reaksi: Reaksi) => void
}

/**
 * Badrul menanggapi apa yang dilakukan anak: senang saat berhasil, berpikir saat butuh petunjuk.
 * Tidak disimpan ke localStorage; hanya gerak sesaat.
 */
export const useBadrul = create<BadrulState>()((set) => ({
  reaksi: 'senang',
  n: 0,
  bereaksi: (reaksi) => {
    efek(reaksi === 'senang' ? 'chime' : 'hmm')
    set((s) => ({ reaksi, n: s.n + 1 }))
  },
}))

export const bereaksi = (r: Reaksi) => useBadrul.getState().bereaksi(r)
