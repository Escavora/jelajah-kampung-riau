import { describe, expect, it } from 'vitest'
import css from '../index.css?raw'

/** Pasangan warna yang dipakai di UI. Target dari design.md 3.4. */
const NORMAL = 4.5
const LARGE = 3

const tokens = Object.fromEntries(
  [...css.matchAll(/--color-([a-z]+-\d+):\s*(#[0-9a-f]{6})/gi)].map(([, name, hex]) => [name, hex]),
)
const color = (name: string) => (name === 'putih' ? '#ffffff' : tokens[name])

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

const pairs: [fg: string, bg: string, min: number, pakai: string][] = [
  ['tanah-900', 'gading-100', NORMAL, 'teks utama di kanvas'],
  ['tanah-900', 'gading-50', NORMAL, 'teks kartu'],
  ['tanah-600', 'gading-100', NORMAL, 'teks sekunder'],
  ['marun-700', 'gading-50', NORMAL, 'judul dan tombol sekunder'],
  ['marun-700', 'emas-100', NORMAL, 'tombol sekunder saat ditekan'],
  ['gading-50', 'marun-700', NORMAL, 'instruksi di bilah bawah'],
  ['emas-400', 'marun-700', NORMAL, 'judul emas di atas marun'],
  ['marun-900', 'emas-400', NORMAL, 'label tombol utama'],
  ['alam-700', 'gading-50', NORMAL, 'teks alam'],
  ['alam-700', 'alam-100', NORMAL, 'teks di area alam'],
  ['buatan-700', 'gading-50', NORMAL, 'teks buatan'],
  ['buatan-700', 'buatan-100', NORMAL, 'teks di area buatan'],
  ['putih', 'alam-700', NORMAL, 'label Alam'],
  ['putih', 'langit-700', NORMAL, 'lencana Arsitek'],
  ['tanah-900', 'buatan-500', NORMAL, 'label Buatan memakai teks gelap'],
  ['tanah-900', 'sungai-300', NORMAL, 'lencana Pencatat'],
  ['tanah-900', 'diskusi-100', NORMAL, 'teks di area diskusi'],
  ['emas-400', 'marun-700', LARGE, 'ornamen dan cincin fokus di atas marun'],
  ['marun-900', 'gading-100', LARGE, 'cincin fokus di atas gading'],
]

describe('kontras warna', () => {
  it('token terbaca dari index.css', () => {
    expect(Object.keys(tokens).length).toBeGreaterThanOrEqual(23)
  })

  it.each(pairs)('%s di atas %s minimal %d:1 (%s)', (fg, bg, min) => {
    expect(contrast(color(fg), color(bg))).toBeGreaterThanOrEqual(min)
  })

  it('teks putih di atas buatan-500 tidak lolos, jadi tidak boleh dipakai', () => {
    expect(contrast('#ffffff', color('buatan-500'))).toBeLessThan(LARGE)
  })
})
