import { describe, expect, it } from 'vitest'
import { CUSTOM_BENEFIT_ID } from './derive'
import { scoreKlasifikasi, scoreManfaat, scoreRagam, scoreSession, scoreTindakan, scoreWarga } from './scoring'
import { logBuilder } from './testLog'

describe('I1 ragam lingkungan', () => {
  it('kurang dari 3 jenis: mulai', () => {
    expect(scoreRagam(logBuilder().found('sungai-siak').placed('rumah').log).level).toBe('mulai')
  })

  it('3 sampai 5 jenis: berkembang', () => {
    const log = logBuilder().found('sungai-siak', 'hutan').placed('rumah', 'sekolah', 'jalan').log
    expect(scoreRagam(log).level).toBe('berkembang')
  })

  it('6 jenis tapi satu kategori dominan: berkembang', () => {
    const log = logBuilder().found('sungai-siak').placed('rumah', 'sekolah', 'jalan', 'puskesmas', 'taman').log
    expect(scoreRagam(log)).toMatchObject({ level: 'berkembang', detail: '6 jenis (1 alam, 5 buatan)' })
  })

  it('6 jenis seimbang: mahir', () => {
    const log = logBuilder().found('sungai-siak', 'hutan', 'rawa').placed('rumah', 'sekolah', 'taman').log
    expect(scoreRagam(log).level).toBe('mahir')
  })

  it('elemen yang dibuang tidak dihitung, elemen dari Fase 4 tidak ikut', () => {
    const b = logBuilder().found('sungai-siak', 'hutan', 'rawa').placed('rumah', 'sekolah', 'taman')
    b.add(1, 'element_removed', { elementId: 'taman' })
    b.add(4, 'element_placed', { elementId: 'puskesmas', cell: 9 })
    expect(scoreRagam(b.log)).toMatchObject({ level: 'berkembang', detail: '5 jenis (3 alam, 2 buatan)' })
  })
})

describe('I2 klasifikasi', () => {
  it('kurang dari 50% benar: mulai', () => {
    const log = logBuilder()
      .label('sungai-siak', null, 'buatan')
      .label('hutan', null, 'buatan')
      .label('rumah', null, 'buatan').log
    // 1 dari 3 benar
    expect(scoreKlasifikasi(log).level).toBe('mulai')
  })

  it('tepat 80% benar: berkembang karena Mahir harus lebih dari 80%', () => {
    const b = logBuilder()
    ;['sungai-siak', 'hutan', 'rawa'].forEach((id) => b.label(id, null, 'alam'))
    b.label('taman', null, 'buatan').label('rumah', null, 'alam')
    expect(scoreKlasifikasi(b.log).level).toBe('berkembang')
  })

  it('semua benar termasuk elemen diskusi: mahir', () => {
    const log = logBuilder()
      .label('sungai-siak', null, 'alam')
      .label('rumah', null, 'buatan')
      .label('taman', null, 'alam')
      .label('taman', 'alam', 'buatan').log
    expect(scoreKlasifikasi(log).level).toBe('mahir')
  })

  it('semua benar tapi tidak ada elemen diskusi: berkembang', () => {
    const log = logBuilder().label('sungai-siak', null, 'alam').label('rumah', null, 'buatan').log
    expect(scoreKlasifikasi(log).level).toBe('berkembang')
  })

  it('benar setelah lebih dari 2 kali ubah: berkembang', () => {
    const log = logBuilder()
      .label('sungai-siak', null, 'alam')
      .label('taman', null, 'alam')
      .label('taman', 'alam', 'buatan')
      .label('taman', 'buatan', 'alam')
      .label('taman', 'alam', 'buatan').log
    expect(scoreKlasifikasi(log).level).toBe('berkembang')
  })

  it('memakai isi kunci "Kami Sepakat" kalau ada', () => {
    const b = logBuilder().label('sungai-siak', null, 'buatan')
    b.add(2, 'label_locked', { labels: { 'sungai-siak': 'alam', taman: 'buatan' } })
    expect(scoreKlasifikasi(b.log).level).toBe('mahir')
  })
})

describe('I3 manfaat', () => {
  const attach = (b: ReturnType<typeof logBuilder>, elementId: string, ...benefitIds: string[]) =>
    benefitIds.forEach((benefitId) => b.add(3, 'benefit_attached', { elementId, benefitId }))

  it('ada elemen dengan kurang dari 2 kartu benar: mulai', () => {
    const b = logBuilder().found('hutan').placed('rumah')
    attach(b, 'hutan', 'udara-segar', 'rumah-hewan')
    attach(b, 'rumah', 'tempat-tinggal', 'tempat-ibadah')
    expect(scoreManfaat(b.log).level).toBe('mulai')
  })

  it('semua elemen punya 2 kartu benar: berkembang', () => {
    const b = logBuilder().found('hutan').placed('rumah')
    attach(b, 'hutan', 'udara-segar', 'rumah-hewan')
    attach(b, 'rumah', 'tempat-tinggal', 'berteduh')
    expect(scoreManfaat(b.log).level).toBe('berkembang')
  })

  it('kartu yang dilepas tidak dihitung', () => {
    const b = logBuilder().found('hutan')
    attach(b, 'hutan', 'udara-segar', 'rumah-hewan')
    b.add(3, 'benefit_detached', { elementId: 'hutan', benefitId: 'rumah-hewan' })
    expect(scoreManfaat(b.log).level).toBe('mulai')
  })

  it('ditambah manfaat versi kami: mahir dan perlu dicek guru', () => {
    const b = logBuilder().found('hutan')
    attach(b, 'hutan', 'udara-segar', 'rumah-hewan')
    b.add(3, 'benefit_attached', {
      elementId: 'hutan',
      benefitId: CUSTOM_BENEFIT_ID,
      custom: { text: 'tempat cari kayu bakar' },
    })
    expect(scoreManfaat(b.log)).toMatchObject({ level: 'mahir', perluCekGuru: true })
  })
})

describe('I4 kebutuhan warga', () => {
  const link = (b: ReturnType<typeof logBuilder>, citizenId: string, elementId: string) =>
    b.add(4, 'citizen_linked', { citizenId, elementId, correct: false })

  it('1 dari 3 benar: mulai', () => {
    const b = logBuilder()
    link(b, 'demam', 'puskesmas')
    link(b, 'salat-jumat', 'sekolah')
    expect(scoreWarga(b.log).level).toBe('mulai')
  })

  it('2 dari 3 benar: berkembang', () => {
    const b = logBuilder()
    link(b, 'demam', 'puskesmas')
    link(b, 'salat-jumat', 'masjid-an-nur')
    expect(scoreWarga(b.log).level).toBe('berkembang')
  })

  it('3 benar dengan petunjuk: berkembang', () => {
    const b = logBuilder()
    link(b, 'demam', 'sekolah')
    b.add(4, 'hint_used', { citizenId: 'demam' })
    link(b, 'demam', 'puskesmas')
    link(b, 'salat-jumat', 'masjid-an-nur')
    link(b, 'mencuci', 'sungai-siak')
    expect(scoreWarga(b.log).level).toBe('berkembang')
  })

  it('3 benar tanpa petunjuk, termasuk jawaban kedua untuk mencuci: mahir', () => {
    const b = logBuilder()
    b.add(4, 'element_placed', { elementId: 'puskesmas', cell: 4 })
    link(b, 'demam', 'puskesmas')
    link(b, 'salat-jumat', 'masjid-an-nur')
    link(b, 'mencuci', 'rumah')
    expect(scoreWarga(b.log)).toMatchObject({ level: 'mahir' })
    expect(scoreWarga(b.log).detail).toContain('1 elemen ditambah')
  })

  it('menghitung ulang benar dari konten, bukan dari payload', () => {
    const b = logBuilder()
    b.add(4, 'citizen_linked', { citizenId: 'demam', elementId: 'sekolah', correct: true })
    expect(scoreWarga(b.log).detail).toContain('0 dari 3')
  })
})

describe('I5 tindakan', () => {
  const choose = (b: ReturnType<typeof logBuilder>, eventId: string, actionId: string, attempt = 1) =>
    b.add(5, 'event_action_chosen', { eventId, actionId, correct: false, attempt })

  it('3 benar pada percobaan pertama: mahir', () => {
    const b = logBuilder()
    choose(b, 'sungai-sampah', 'pungut-sampah')
    choose(b, 'pohon-ditebang', 'tanam-pohon')
    choose(b, 'jalan-tergenang', 'bersihkan-selokan')
    expect(scoreTindakan(b.log).level).toBe('mahir')
  })

  it('3 benar dengan percobaan ulang: berkembang', () => {
    const b = logBuilder()
    choose(b, 'sungai-sampah', 'biarkan')
    choose(b, 'sungai-sampah', 'pungut-sampah', 2)
    choose(b, 'pohon-ditebang', 'tanam-pohon')
    choose(b, 'jalan-tergenang', 'bersihkan-selokan')
    expect(scoreTindakan(b.log)).toMatchObject({
      level: 'berkembang',
      detail: '3 dari 3 kejadian ditangani benar, 2 pada percobaan pertama',
    })
  })

  it('1 dari 3 benar: mulai', () => {
    const b = logBuilder()
    choose(b, 'sungai-sampah', 'ikut-buang')
    choose(b, 'pohon-ditebang', 'tanam-pohon')
    choose(b, 'jalan-tergenang', 'main-genangan')
    expect(scoreTindakan(b.log).level).toBe('mulai')
  })
})

describe('scoreSession', () => {
  it('log kosong menghasilkan mulai di semua indikator', () => {
    const report = scoreSession([])
    expect(Object.values(report).map((r) => r.level)).toEqual(['mulai', 'mulai', 'mulai', 'mulai', 'mulai'])
  })
})
