/** Satu AudioContext untuk seluruh aplikasi (voice over, musik, efek). Browser membatasi jumlahnya. */
let konteksBersama: AudioContext | null = null

export function konteks(): AudioContext {
  konteksBersama ??= new AudioContext()
  return konteksBersama
}

export const adaKonteks = () => konteksBersama !== null
