import { ArrowRight, X } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AvatarIcon, AvatarPicker } from '../../components/Avatar'
import { Button } from '../../components/Button'
import { PucukRebungBand } from '../../components/Ornamen'
import { TombolMusik } from '../../components/TombolMusik'
import { useSuasana } from '../../lib/musik'
import { avatarById, konten } from '../../content'
import { MAX_MEMBERS, MAX_NAMA, MIN_MEMBERS, useSessionStore, type Member } from '../../store/sessionStore'

/** Setup kelompok (design.md 7.2): nama kelompok, lalu 3 sampai 4 anggota dengan avatar dan nama panggilan. */
export function SetupPage() {
  const navigate = useNavigate()
  useSuasana('meriah', false)
  const createSession = useSessionStore((s) => s.createSession)
  const setMembers = useSessionStore((s) => s.setMembers)
  const setStep = useSessionStore((s) => s.setStep)

  const [groupName, setGroupName] = useState('Kelompok 1')
  const [members, setLocalMembers] = useState<Member[]>([])
  const [picking, setPicking] = useState<string | null>(null)
  const [nama, setNama] = useState('')

  const taken = new Set(members.map((m) => m.id))
  const full = members.length >= MAX_MEMBERS

  const addMember = () => {
    if (!picking || !nama.trim()) return
    setLocalMembers((list) => [...list, { id: picking, nama: nama.trim() }])
    setPicking(null)
    setNama('')
  }

  const start = () => {
    createSession(groupName.trim() || 'Kelompok')
    setMembers(members)
    // Fase 0 dikerjakan bersama, jadi langsung masuk tanpa layar giliran.
    setStep({ screen: 'fase', phase: 0 })
    navigate('/main')
  }

  return (
    <div className="relative flex h-full flex-col bg-gading-100">
      <header className="relative z-10 bg-marun-700 px-4 py-3 sm:px-8 sm:py-5">
        <div className="flex items-center justify-between gap-3">
          <h1 className="font-display text-sub text-gading-50 sm:text-fase">Siapa saja di kelompok ini?</h1>
          <TombolMusik />
        </div>
        <PucukRebungBand flip height={16} className="pointer-events-none absolute inset-x-0 top-full" />
      </header>

      <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-4 pt-8 pb-4 sm:gap-6 sm:px-8 sm:pt-10 sm:pb-6">
        <label className="flex items-center gap-4 font-body text-isi text-tanah-900">
          Nama kelompok
          <input
            value={groupName}
            maxLength={20}
            onChange={(e) => setGroupName(e.target.value)}
            className="tap rounded-md border-2 border-marun-700 bg-gading-50 px-4 font-body text-isi"
          />
        </label>

        {!full && !picking && (
          <p className="font-body text-instruksi text-tanah-900">
            {members.length === 0 ? 'Ketuk satu hewan, lalu tulis nama panggilanmu.' : 'Teman berikutnya, ketuk satu hewan lagi.'}
          </p>
        )}

        {!full && (
          <AvatarPicker
            label="Pilih avatar"
            options={konten.avatar.map((a) => ({ id: a.id, disabled: taken.has(a.id), dimmed: taken.has(a.id) }))}
            selected={picking ? [picking] : []}
            onSelect={(id) => setPicking(id)}
          />
        )}

        {picking && (
          <div className="flex items-center justify-center gap-4">
            <AvatarIcon id={picking} size={64} />
            <input
              autoFocus
              value={nama}
              maxLength={MAX_NAMA}
              placeholder="Nama panggilan"
              onChange={(e) => setNama(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addMember()}
              className="tap w-64 rounded-md border-2 border-marun-700 bg-gading-50 px-4 font-body text-isi"
            />
            <Button variant="secondary" onClick={addMember} disabled={!nama.trim()}>
              Tambah
            </Button>
          </div>
        )}
      </div>

      <footer className="flex flex-wrap items-center gap-3 bg-marun-700 px-4 py-3 sm:gap-4 sm:px-8 sm:py-5">
        <span className="font-body text-isi text-gading-50 pendek:hidden">Anggota:</span>
        <ul className="flex min-w-0 flex-1 flex-wrap gap-2 sm:gap-3">
          {members.map((m) => (
            <li key={m.id} className="flex items-center gap-1.5 rounded-full bg-gading-50 py-1 pr-0 pl-1 sm:gap-2 sm:pr-1">
              <AvatarIcon id={m.id} size={40} />
              <span className="font-body text-kecil text-marun-900">
                <span className="pendek:hidden">{avatarById.get(m.id)?.nama}: </span>{m.nama}
              </span>
              <button
                type="button"
                aria-label={`Hapus ${m.nama}`}
                onClick={() => setLocalMembers((list) => list.filter((x) => x.id !== m.id))}
                className="tap inline-flex items-center justify-center rounded-full text-marun-700 pendek:-ml-3"
              >
                <X aria-hidden size={24} strokeWidth={2.5} />
              </button>
            </li>
          ))}
        </ul>
        {members.length < MIN_MEMBERS && (
          <span className="max-w-[180px] font-body text-kecil leading-tight text-gading-50">Perlu {MIN_MEMBERS} sampai {MAX_MEMBERS} anggota</span>
        )}
        <Button icon={ArrowRight} disabled={members.length < MIN_MEMBERS} onClick={start}>
          Mulai Jelajah
        </Button>
      </footer>
    </div>
  )
}
