import type { LucideIcon } from 'lucide-react'
import type { ButtonHTMLAttributes } from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  icon?: LucideIcon
}

/** Aksi utama berwarna emas seperti benang songket; terbaca di bilah marun maupun lantai gading. */
const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'border-2 border-emas-600 bg-emas-400 text-marun-900 shadow-rest hover:bg-[#f6c34a]',
  secondary: 'border-2 border-marun-700 bg-gading-50 text-marun-700 shadow-rest hover:bg-emas-100',
  ghost: 'bg-transparent text-marun-700 hover:bg-gading-50',
}

/** Tombol design.md 8: tinggi 72 px, ikon di kiri, label maksimal 2 kata. */
export function Button({ variant = 'primary', icon: Icon, className = '', children, type = 'button', ...rest }: ButtonProps) {
  return (
    <button
      type={type}
      className={
        'tap inline-flex h-[72px] items-center justify-center gap-3 rounded-md px-8 font-body text-tombol pendek:h-16 pendek:px-6 max-sm:h-16 max-sm:gap-2 max-sm:px-5 ' +
        'transition-[transform,background-color,border-color] duration-150 ease-out active:scale-[0.97] ' +
        'disabled:pointer-events-none disabled:border-gading-200 disabled:bg-gading-200 disabled:text-tanah-600 disabled:shadow-none ' +
        `${VARIANTS[variant]} ${className}`
      }
      {...rest}
    >
      {Icon && <Icon aria-hidden size={28} strokeWidth={2.5} />}
      {children}
    </button>
  )
}
