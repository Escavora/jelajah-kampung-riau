/**
 * Pemutar voice over. Hanya satu klip berjalan dalam satu waktu (design.md 11).
 * Selama rekaman asli belum ada, file yang gagal dimuat diganti nada pendek.
 */

import { konteks } from './konteks'

type Playback = { src: string; stop: () => void }

let current: Playback | null = null
const listeners = new Set<() => void>()

const notify = () => listeners.forEach((fn) => fn())

export function subscribeAudio(fn: () => void): () => void {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export const currentVoiceSrc = () => current?.src ?? null

export function stopVoice() {
  const playing = current
  current = null
  playing?.stop()
  notify()
}

/** Putar klip. `onEnd` dipanggil saat selesai, dihentikan, atau gagal. */
export function playVoice(src: string, onEnd?: () => void): () => void {
  stopVoice()
  let done = false
  let stopFallback: (() => void) | null = null
  const audio = new Audio(src)

  const finish = () => {
    if (done) return
    done = true
    audio.pause()
    stopFallback?.()
    if (current === playback) current = null
    notify()
    onEnd?.()
  }

  const playback: Playback = { src, stop: finish }
  current = playback
  notify()

  audio.addEventListener('ended', finish)
  audio.addEventListener('error', () => {
    if (done || stopFallback) return
    stopFallback = playPlaceholderTone(finish)
  })
  audio.play().catch(() => {
    // Autoplay diblokir atau file tidak ada: tetap beri tanda bunyi supaya alur bisa dicoba.
    if (!done && !stopFallback) stopFallback = playPlaceholderTone(finish)
  })

  return finish
}

/** Dua nada lembut sekitar 0,6 detik sebagai pengganti voice over yang belum direkam. */
function playPlaceholderTone(onEnd: () => void): () => void {
  try {
    const ctx = konteks()
    if (ctx.state === 'suspended') void ctx.resume()
    const gain = ctx.createGain()
    gain.connect(ctx.destination)
    const t = ctx.currentTime
    gain.gain.setValueAtTime(0.0001, t)
    gain.gain.exponentialRampToValueAtTime(0.12, t + 0.03)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.6)
    const oscillators = [523.25, 659.25].map((freq, i) => {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = freq
      osc.connect(gain)
      osc.start(t + i * 0.18)
      osc.stop(t + 0.6)
      return osc
    })
    const timer = window.setTimeout(onEnd, 650)
    return () => {
      window.clearTimeout(timer)
      oscillators.forEach((osc) => {
        try {
          osc.stop()
        } catch {
          // sudah berhenti
        }
      })
    }
  } catch {
    const timer = window.setTimeout(onEnd, 650)
    return () => window.clearTimeout(timer)
  }
}
