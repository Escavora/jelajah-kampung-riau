import avatarsJson from './avatars.json'
import benefitsJson from './benefits.json'
import citizensJson from './citizens.json'
import elementsJson from './elements.json'
import eventsJson from './events.json'
import rubricJson from './rubric.json'
import type { Avatar, Elemen, Indikator, Kejadian, Manfaat, Warga } from './types'

export interface Konten {
  elemen: Elemen[]
  manfaat: Manfaat[]
  warga: Warga[]
  kejadian: Kejadian[]
  rubrik: Indikator[]
  avatar: Avatar[]
}

export const konten: Konten = {
  elemen: elementsJson as Elemen[],
  manfaat: benefitsJson as Manfaat[],
  warga: citizensJson as Warga[],
  kejadian: eventsJson as Kejadian[],
  rubrik: rubricJson as Indikator[],
  avatar: avatarsJson as Avatar[],
}

export function byId<T extends { id: string }>(items: T[]): Map<string, T> {
  return new Map(items.map((item) => [item.id, item]))
}

export const elemenById = byId(konten.elemen)
export const manfaatById = byId(konten.manfaat)
export const avatarById = byId(konten.avatar)
