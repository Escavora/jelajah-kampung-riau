import { describe, expect, it } from 'vitest'
import { elemenById } from '../../content'
import { benefitOptions, PENGECOH } from './options'

describe('pilihan kartu manfaat', () => {
  it('memuat semua manfaat yang tepat ditambah pengecoh', () => {
    const opts = benefitOptions('hutan', 's1')
    const tepat = elemenById.get('hutan')!.manfaat
    expect(opts).toEqual(expect.arrayContaining(tepat))
    expect(opts).toHaveLength(tepat.length + PENGECOH)
    expect(new Set(opts).size).toBe(opts.length)
  })

  it('urutannya tetap untuk sesi yang sama', () => {
    expect(benefitOptions('rumah', 's1')).toEqual(benefitOptions('rumah', 's1'))
  })
})
