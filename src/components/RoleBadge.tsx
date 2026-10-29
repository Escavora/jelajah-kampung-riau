import { Hammer, NotebookPen, ShieldCheck, Tag, type LucideIcon } from 'lucide-react'
import { ROLES, type RoleId } from '../lib/roles'

/** Ikon dan warna aksen tetap per peran. Warna kategori alam, buatan, dan diskusi sengaja tidak dipakai. */
const STYLE: Record<RoleId, { icon: LucideIcon; className: string }> = {
  arsitek: { icon: Hammer, className: 'bg-langit-700 text-white' },
  'juru-label': { icon: Tag, className: 'bg-emas-400 text-marun-900' },
  pencatat: { icon: NotebookPen, className: 'bg-sungai-300 text-tanah-900' },
  penjaga: { icon: ShieldCheck, className: 'bg-tanah-900 text-gading-50' },
}

export function RoleBadge({ role, className = '' }: { role: RoleId; className?: string }) {
  const { icon: Icon, className: color } = STYLE[role]
  return (
    // Tepi gading supaya lencana tetap terpisah dari bilah marun.
    <span className={`inline-flex items-center gap-2 rounded-sm border-2 border-gading-50 px-3 py-1.5 font-body text-kecil ${color} ${className}`}>
      <Icon aria-hidden size={22} strokeWidth={2.5} />
      {ROLES[role].nama}
    </span>
  )
}
