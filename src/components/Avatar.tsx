import { Bird, Cat, Fish, Rabbit, Shell, Snail, Squirrel, Turtle, type LucideIcon } from 'lucide-react'
import { avatarById } from '../content'

/** Placeholder sampai SVG avatar hewan 96 px tersedia (design.md 15). */
const ICONS: Record<string, LucideIcon> = {
  'avatar-kucing': Cat,
  'avatar-burung': Bird,
  'avatar-ikan': Fish,
  'avatar-kura': Turtle,
  'avatar-kelinci': Rabbit,
  'avatar-tupai': Squirrel,
  'avatar-siput': Snail,
  'avatar-kerang': Shell,
}

export function AvatarIcon({ id, size = 56 }: { id: string; size?: number }) {
  const Icon = ICONS[id] ?? Cat
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full border-2 border-emas-400 bg-gading-50 text-marun-900"
      style={{ width: size, height: size }}
    >
      <Icon aria-hidden size={size * 0.58} strokeWidth={2.5} />
    </span>
  )
}

export interface AvatarOption {
  id: string
  /** Teks di bawah ikon. Default nama hewan. */
  caption?: string
  /** Tampil redup, misalnya avatar yang sudah dipilih anak lain atau sudah dapat giliran. */
  dimmed?: boolean
  disabled?: boolean
}

interface AvatarPickerProps {
  options: AvatarOption[]
  selected: string[]
  onSelect: (id: string) => void
  label: string
}

/** Ubin avatar 96 px (design.md 8). Pilihan tunggal atau ganda diatur pemanggil lewat `selected`. */
export function AvatarPicker({ options, selected, onSelect, label }: AvatarPickerProps) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap justify-center gap-4">
      {options.map((option) => {
        const isSelected = selected.includes(option.id)
        const nama = avatarById.get(option.id)?.nama ?? option.id
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={isSelected}
            disabled={option.disabled}
            onClick={() => onSelect(option.id)}
            className={
              'flex w-[120px] flex-col items-center gap-2 rounded-lg p-3 transition-[transform,opacity,box-shadow] duration-150 ease-out active:scale-95 ' +
              (isSelected ? 'bg-emas-100 ring-4 ring-marun-700' : 'hover:bg-gading-50') +
              (option.dimmed ? ' opacity-45' : '') +
              (option.disabled ? ' cursor-not-allowed' : '')
            }
          >
            <AvatarIcon id={option.id} size={96} />
            <span className="font-body text-kecil text-tanah-900">{option.caption ?? nama}</span>
          </button>
        )
      })}
    </div>
  )
}
