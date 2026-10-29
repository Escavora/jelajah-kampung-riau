import { describe, expect, it } from 'vitest'
import {
  AKOR,
  DURASI_LANGKAH,
  JUMLAH_BIRAMA,
  LANGKAH_PER_BIRAMA,
  MELODI,
  mtof,
  POLA_BASS,
  URUTAN_AKOR,
} from './komposisi'

/** Himpunan pentatonik C (kelas nada 0, 2, 4, 7, 9) ditambah F dan B yang dipakai sebagai nada lewat di akor F dan G. */
const KELAS_BOLEH = new Set([0, 2, 4, 5, 7, 9, 11])

describe('komposisi lagu latar', () => {
  it('mtof: A4 adalah 440 Hz dan satu oktaf menggandakan frekuensi', () => {
    expect(mtof(69)).toBeCloseTo(440, 5)
    expect(mtof(81)).toBeCloseTo(880, 5)
  })

  it('panjang lagu: 8 birama, sekitar 17 sampai 19 detik per putaran', () => {
    const detik = JUMLAH_BIRAMA * LANGKAH_PER_BIRAMA * DURASI_LANGKAH
    expect(detik).toBeGreaterThan(17)
    expect(detik).toBeLessThan(19)
  })

  it('tiap birama punya akor dan melodi', () => {
    expect(URUTAN_AKOR).toHaveLength(JUMLAH_BIRAMA)
    expect(MELODI).toHaveLength(JUMLAH_BIRAMA)
    for (const nama of URUTAN_AKOR) expect(AKOR[nama]).toBeDefined()
  })

  it('tiap not melodi mulai dan berakhir di dalam birama, tidak saling bertabrakan', () => {
    MELODI.forEach((birama, i) => {
      let akhirSebelumnya = 0
      for (const [langkah, midi, panjang] of birama) {
        expect(langkah, `birama ${i + 1}`).toBeGreaterThanOrEqual(akhirSebelumnya)
        expect(langkah + panjang, `birama ${i + 1}`).toBeLessThanOrEqual(LANGKAH_PER_BIRAMA)
        expect(midi).toBeGreaterThanOrEqual(60)
        expect(midi).toBeLessThanOrEqual(88)
        akhirSebelumnya = langkah + panjang
      }
    })
  })

  it('semua nada melodi tetap dalam tangga nada C mayor (tanpa nada sumbang)', () => {
    for (const birama of MELODI) for (const [, midi] of birama) expect(KELAS_BOLEH.has(midi % 12), `midi ${midi}`).toBe(true)
  })

  it('lagu berakhir di nada C supaya terdengar selesai sebelum berulang', () => {
    const terakhir = MELODI[JUMLAH_BIRAMA - 1].at(-1)!
    expect(terakhir[1] % 12).toBe(0)
  })

  it('pola bass muat dalam satu birama', () => {
    for (const [langkah, , panjang] of POLA_BASS) expect(langkah + panjang).toBeLessThanOrEqual(LANGKAH_PER_BIRAMA)
  })
})
