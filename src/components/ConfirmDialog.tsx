import { Check, Undo2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from './Button'

/** Konfirmasi singkat (design.md 8), dipakai untuk "Kami Sepakat" dan keluar sesi. */
export function ConfirmDialog({
  title,
  children,
  confirmLabel,
  onConfirm,
  onCancel,
}: {
  title: string
  children?: ReactNode
  confirmLabel: string
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-marun-900/50 p-8" role="presentation">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-label={title}
        className="flex max-w-xl flex-col items-center gap-6 rounded-lg bg-gading-50 p-10 text-center shadow-lift animate-[tumbuh_250ms_cubic-bezier(0.16,1,0.3,1)]"
      >
        <h2 className="font-display text-fase text-marun-700">{title}</h2>
        {children && <div className="font-body text-isi text-tanah-900">{children}</div>}
        <div className="flex gap-4">
          <Button variant="secondary" icon={Undo2} onClick={onCancel} autoFocus>
            Belum
          </Button>
          <Button icon={Check} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
