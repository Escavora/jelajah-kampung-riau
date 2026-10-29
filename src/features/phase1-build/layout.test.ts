import { describe, expect, it } from 'vitest'
import { ALAM_CELLS, canPlace, countTarget } from './layout'

describe('aturan petak Fase 1', () => {
  const kosong = new Set<number>()

  it('bangunan di darat boleh, di sungai tidak', () => {
    expect(canPlace('rumah', 0, kosong)).toBe(true)
    expect(canPlace('rumah', 8, kosong)).toBe(false)
  })

  it('jembatan hanya di sungai', () => {
    expect(canPlace('jembatan', 8, kosong)).toBe(true)
    expect(canPlace('jembatan', 0, kosong)).toBe(false)
  })

  it('petak alam dan petak terisi ditolak', () => {
    expect(canPlace('rumah', ALAM_CELLS.hutan, kosong)).toBe(false)
    expect(canPlace('rumah', 0, new Set([0]))).toBe(false)
  })

  it('posisi alam tidak bertabrakan dan sungai ada di baris sungai', () => {
    const cells = Object.values(ALAM_CELLS)
    expect(new Set(cells).size).toBe(cells.length)
    expect(Math.floor(ALAM_CELLS['sungai-siak'] / 6)).toBe(1)
  })

  it('menghitung target alam, buatan, diskusi', () => {
    expect(countTarget(['hutan', 'rumah', 'taman'])).toEqual({ alam: 1, buatan: 2, diskusi: 1 })
  })
})
