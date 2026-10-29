import { describe, expect, it } from 'vitest'
import { avatarById, elemenById, konten, manfaatById } from '.'

/** Aturan teks prd.md 4.3. */
const MAX_KALIMAT = 3
const MAX_KATA_PER_KALIMAT = 12
const MAX_KATA_KARTU_MANFAAT = 3
const MAX_KATA_TOMBOL_TINDAKAN = 3
const AUDIO_PATH = /^\/audio\/[a-z0-9-]+\/[a-z0-9-]+\.mp3$/

const sentences = (text: string) =>
  text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
const words = (text: string) => text.split(/\s+/).filter(Boolean)

function expectChildText(label: string, text: string) {
  const list = sentences(text)
  expect(list.length, `${label}: lebih dari ${MAX_KALIMAT} kalimat`).toBeLessThanOrEqual(MAX_KALIMAT)
  for (const sentence of list) {
    expect(words(sentence).length, `${label}: "${sentence}" terlalu panjang`).toBeLessThanOrEqual(MAX_KATA_PER_KALIMAT)
  }
}

describe('katalog elemen', () => {
  it('berisi 14 elemen sesuai prd.md 4.1', () => {
    expect(konten.elemen).toHaveLength(14)
    expect(konten.elemen.filter((e) => e.kategori === 'alam')).toHaveLength(5)
    expect(konten.elemen.filter((e) => e.diskusi).map((e) => e.id)).toEqual(['taman', 'danau-lembah-sari'])
  })

  it('elemen diskusi berkunci buatan', () => {
    for (const e of konten.elemen.filter((e) => e.diskusi)) expect(e.kategori).toBe('buatan')
  })

  it.each(konten.elemen.map((e) => [e.id, e] as const))('%s: teks info mengikuti aturan anak', (id, e) => {
    expectChildText(id, e.info)
    expect(e.info, `${id}: kalimat terakhir harus menyebut kategori`).toMatch(
      new RegExp(`termasuk lingkungan ${e.kategori}\\.$`),
    )
    expect(e.audio).toMatch(AUDIO_PATH)
  })

  it('tiap elemen punya minimal 2 manfaat yang ada di benefits.json', () => {
    for (const e of konten.elemen) {
      expect(e.manfaat.length, e.id).toBeGreaterThanOrEqual(2)
      for (const m of e.manfaat) expect(manfaatById.has(m), `${e.id} -> ${m}`).toBe(true)
    }
  })

  it('minimal 5 pin di peta Fase 0, posisi dalam batas peta', () => {
    const pins = konten.elemen.filter((e) => e.pin)
    expect(pins.length).toBeGreaterThanOrEqual(5)
    for (const e of pins) {
      expect(e.pin!.x).toBeGreaterThanOrEqual(0)
      expect(e.pin!.x).toBeLessThanOrEqual(100)
      expect(e.pin!.y).toBeGreaterThanOrEqual(0)
      expect(e.pin!.y).toBeLessThanOrEqual(100)
    }
  })

  it('tidak memakai klaim yang dihapus di prd.md 4.2', () => {
    const all = konten.elemen.map((e) => e.info).join(' ')
    expect(all).not.toMatch(/sahabat Nabi|Nabawi|elektrik|tempat tinggal pribadi/i)
  })
})

describe('kartu manfaat', () => {
  it.each(konten.manfaat.map((m) => [m.id, m] as const))('%s: maksimal 3 kata dan punya audio', (_, m) => {
    expect(words(m.teks).length).toBeLessThanOrEqual(MAX_KATA_KARTU_MANFAAT)
    expect(m.audio).toMatch(AUDIO_PATH)
  })

  it('setiap manfaat dipakai minimal oleh satu elemen', () => {
    const used = new Set(konten.elemen.flatMap((e) => e.manfaat))
    for (const m of konten.manfaat) expect(used.has(m.id), m.id).toBe(true)
  })
})

describe('kartu warga', () => {
  it('cukup untuk diambil acak 3', () => {
    expect(konten.warga.length).toBeGreaterThanOrEqual(3)
  })

  it.each(konten.warga.map((w) => [w.id, w] as const))('%s: elemen tepat ada dan teks pendek', (id, w) => {
    for (const el of w.elemenTepat) expect(elemenById.has(el), `${id} -> ${el}`).toBe(true)
    expectChildText(id, w.kata)
    expectChildText(`${id} petunjuk`, w.petunjuk)
    expect(w.audio).toMatch(AUDIO_PATH)
    expect(w.audioPetunjuk).toMatch(AUDIO_PATH)
  })
})

describe('kejadian', () => {
  it('ada 3 kejadian sesuai prd.md 4.5', () => {
    expect(konten.kejadian).toHaveLength(3)
  })

  it.each(konten.kejadian.map((k) => [k.id, k] as const))('%s: 3 tindakan, tepat satu yang tepat', (id, k) => {
    expect(k.tindakan).toHaveLength(3)
    expect(k.tindakan.filter((t) => t.jenis === 'tepat')).toHaveLength(1)
    expectChildText(id, k.cerita)
    expect(k.audio).toMatch(AUDIO_PATH)
    for (const t of k.tindakan) {
      expect(words(t.label).length, `${id}/${t.id}`).toBeLessThanOrEqual(MAX_KATA_TOMBOL_TINDAKAN)
      expectChildText(`${id}/${t.id}`, t.umpanBalik)
      expect(t.audio).toMatch(AUDIO_PATH)
    }
  })

  it('umpan balik tidak memakai kata menghakimi (design.md 12)', () => {
    const all = konten.kejadian.flatMap((k) => k.tindakan.map((t) => t.umpanBalik)).join(' ')
    expect(all).not.toMatch(/salah|keliru|nilai/i)
  })
})

describe('rubrik dan avatar', () => {
  it('rubrik punya I1 sampai I5 dengan tiga level', () => {
    expect(konten.rubrik.map((r) => r.id)).toEqual(['I1', 'I2', 'I3', 'I4', 'I5'])
    for (const r of konten.rubrik) expect(Object.keys(r.level)).toEqual(['mulai', 'berkembang', 'mahir'])
  })

  it('ada 8 avatar hewan dengan id unik', () => {
    expect(avatarById.size).toBe(8)
  })

  it('semua id konten unik', () => {
    for (const list of [konten.elemen, konten.manfaat, konten.warga, konten.kejadian]) {
      expect(new Set(list.map((x) => x.id)).size).toBe(list.length)
    }
  })
})
