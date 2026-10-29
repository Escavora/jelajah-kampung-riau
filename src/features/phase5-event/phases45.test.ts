import { describe, expect, it } from 'vitest'
import { reportSentence, reportSummary } from '../../lib/report'
import { logBuilder } from '../../lib/testLog'
import { citizenStatus, firstFreeCell } from '../phase4-citizen/citizens'
import { DAMPAK, eventProgress, healthMeter, METER_AWAL } from './meter'

describe('status warga Fase 4', () => {
  it('mencatat warga yang terhubung benar, mengabaikan garis keliru', () => {
    const b = logBuilder().placed('puskesmas', 'rumah')
    b.add(4, 'citizen_linked', { citizenId: 'demam', elementId: 'rumah', correct: false })
    b.add(4, 'citizen_linked', { citizenId: 'demam', elementId: 'puskesmas', correct: true })
    const s = citizenStatus(b.log, ['demam', 'salat-jumat'])
    expect([...s.linked]).toEqual([['demam', 'puskesmas']])
  })

  it('menandai warga yang kebutuhannya belum ada di kampung', () => {
    const b = logBuilder().placed('puskesmas')
    expect(citizenStatus(b.log, ['demam', 'salat-jumat', 'mencuci']).needsMissing).toEqual(['salat-jumat', 'mencuci'])
  })

  it('mencuci terpenuhi oleh sungai', () => {
    const b = logBuilder().found('sungai-siak')
    expect(citizenStatus(b.log, ['mencuci']).needsMissing).toEqual([])
  })

  it('petak bebas pertama untuk elemen tambahan menghindari petak terisi', () => {
    const b = logBuilder().placed('rumah')
    expect(firstFreeCell('masjid-an-nur', b.log)).toBe(1)
    expect(firstFreeCell('jembatan', b.log)).toBe(6)
  })
})

describe('meter Kampung Sehat dan kejadian', () => {
  const choose = (b: ReturnType<typeof logBuilder>, eventId: string, actionId: string) =>
    b.add(5, 'event_action_chosen', { eventId, actionId, correct: false, attempt: 1 })

  it('naik untuk tindakan tepat, turun untuk yang merusak', () => {
    const b = logBuilder()
    choose(b, 'sungai-sampah', 'ikut-buang')
    choose(b, 'sungai-sampah', 'pungut-sampah')
    expect(healthMeter(b.log)).toBe(METER_AWAL + DAMPAK.merusak + DAMPAK.tepat)
  })

  it('tidak pernah di luar 0 sampai 100', () => {
    const b = logBuilder()
    for (let i = 0; i < 10; i++) choose(b, 'pohon-ditebang', 'tebang-lagi')
    expect(healthMeter(b.log)).toBe(0)
  })

  it('kejadian selesai setelah tindakan tepat, percobaan sesudahnya diabaikan', () => {
    const b = logBuilder()
    choose(b, 'jalan-tergenang', 'main-genangan')
    choose(b, 'jalan-tergenang', 'bersihkan-selokan')
    choose(b, 'jalan-tergenang', 'main-genangan')
    expect(eventProgress(b.log).get('jalan-tergenang')).toEqual({
      tried: ['main-genangan', 'bersihkan-selokan'],
      resolvedBy: 'bersihkan-selokan',
    })
  })
})

describe('rapor kelompok', () => {
  it('menghitung alam dan buatan dari kunci konten, bukan dari label anak', () => {
    const b = logBuilder().found('sungai-siak', 'hutan').placed('rumah', 'taman', 'sekolah')
    b.add(2, 'label_locked', { labels: { taman: 'alam' } })
    b.add(5, 'event_action_chosen', { eventId: 'sungai-sampah', actionId: 'pungut-sampah', correct: true, attempt: 1 })
    const s = reportSummary(b.log)
    expect(s).toEqual({ alam: 2, buatan: 3, tindakan: 1 })
    expect(reportSentence(s)).toBe(
      'Kampung kalian punya 2 lingkungan alam dan 3 lingkungan buatan, dan kalian sudah menjaganya dengan 1 cara.',
    )
  })
})
