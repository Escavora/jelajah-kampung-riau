import type { ReactNode } from 'react'
import { elemenById } from '../content'
import { ALAM_CELLS, COLS } from '../features/phase1-build/layout'
import { ElementToken, ukuranPetak, ukuranPetakLencana } from './ElementToken'
import { MapFrame } from './KampungMap'

/**
 * Kampung hasil Fase 1 dalam grid 6 x 4 yang sama, tanpa aksi seret.
 * Tiap elemen diberi atribut `data-element` supaya bisa jadi ujung garis di Fase 4.
 */
export function VillageView({
  ids,
  cells,
  size,
  selectedId,
  onTap,
  decorate,
  showNames = true,
  masuk = false,
  className = '',
}: {
  ids: string[]
  cells: ReadonlyMap<string, number>
  /** Default mengikuti ruang petak. */
  size?: number | string
  selectedId?: string | null
  onTap?: (id: string) => void
  /** Penanda kecil di pojok kanan atas token, misalnya tanda sudah dipakai warga. */
  decorate?: (id: string) => ReactNode
  showNames?: boolean
  /** Tiap elemen terbit bergiliran, dipakai untuk momen pembuka rapor. */
  masuk?: boolean
  className?: string
}) {
  return (
    <MapFrame variant="kanvas" className={className}>
      <div className="absolute inset-0 grid grid-cols-6 grid-rows-4">
      {ids.map((id, urutan) => {
        const e = elemenById.get(id)
        const cell = ALAM_CELLS[id] ?? cells.get(id)
        if (!e || cell === undefined) return null
        const token = (
          <ElementToken
            elemen={e}
            state={e.kategori === 'alam' ? 'alam-found' : 'buatan-placed'}
            selected={selectedId === id}
            size={size ?? (!showNames ? 'max(40px, min(86cqw, 100cqh))' : decorate ? ukuranPetakLencana : ukuranPetak)}
            showName={showNames}
            badge={decorate?.(id)}
          />
        )
        return (
          <div
            key={id}
            style={{
              gridColumn: (cell % COLS) + 1,
              gridRow: Math.floor(cell / COLS) + 1,
              containerType: 'size',
              ['--tunda' as string]: `${Math.min(700 + urutan * 120, 2000)}ms`,
            }}
            className={`flex items-center justify-center ${masuk ? 'masuk-bergilir' : ''}`}
          >
            {onTap ? (
              <button type="button" data-element={id} aria-label={e.nama} onClick={() => onTap(id)}>
                {token}
              </button>
            ) : (
              <span data-element={id}>{token}</span>
            )}
          </div>
        )
      })}
      </div>
    </MapFrame>
  )
}
