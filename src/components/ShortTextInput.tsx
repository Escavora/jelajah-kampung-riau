import { Check } from 'lucide-react'
import { useState } from 'react'
import { Button } from './Button'

/** Isian satu kalimat pendek, dipakai untuk "Manfaat versi kami" dan janji di Refleksi. */
export function ShortTextInput({
  onSave,
  placeholder,
  maxLength = 60,
}: {
  onSave: (text: string) => void
  placeholder: string
  maxLength?: number
}) {
  const [text, setText] = useState('')
  const submit = () => text.trim() && onSave(text.trim())

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <input
        value={text}
        maxLength={maxLength}
        placeholder={placeholder}
        aria-label={placeholder}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
        className="tap w-full rounded-md border-2 border-marun-700 bg-gading-50 px-4 font-body text-isi"
      />
      <Button icon={Check} disabled={!text.trim()} onClick={submit}>
        Simpan
      </Button>
    </div>
  )
}
