import { Volume2 } from 'lucide-react'
import { useEffect, useSyncExternalStore } from 'react'
import { currentVoiceSrc, playVoice, stopVoice, subscribeAudio } from '../lib/audio'

/** Status putar sebuah klip, dipakai juga oleh Badrul untuk animasi bicara. */
export function useVoice(src: string, { autoPlay = false } = {}) {
  const playingSrc = useSyncExternalStore(subscribeAudio, currentVoiceSrc)
  const playing = playingSrc === src

  useEffect(() => {
    if (!autoPlay) return
    playVoice(src)
    return () => {
      if (currentVoiceSrc() === src) stopVoice()
    }
  }, [src, autoPlay])

  return { playing, play: () => playVoice(src), stop: stopVoice }
}

interface SpeakerButtonProps {
  src: string
  label?: string
  /** Putar sekali saat layar muncul (design.md 11). */
  autoPlay?: boolean
  className?: string
}

export function SpeakerButton({ src, label = 'Dengar lagi', autoPlay, className = '' }: SpeakerButtonProps) {
  const { playing, play, stop } = useVoice(src, { autoPlay })

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={playing}
      onClick={playing ? stop : play}
      className={
        'tap inline-flex size-16 shrink-0 items-center justify-center rounded-full border-2 shadow-rest ' +
        'transition-colors duration-150 ease-out active:scale-95 ' +
        (playing ? 'border-emas-400 bg-emas-400 text-marun-900' : 'border-emas-400 bg-gading-50 text-marun-700') +
        ` ${className}`
      }
    >
      {playing ? (
        <span aria-hidden className="flex h-7 items-center gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 rounded-full bg-current animate-[gelombang_900ms_ease-in-out_infinite]"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </span>
      ) : (
        <Volume2 aria-hidden size={30} strokeWidth={2.5} />
      )}
    </button>
  )
}
