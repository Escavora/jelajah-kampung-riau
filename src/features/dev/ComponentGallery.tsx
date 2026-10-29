import { ArrowRight, Check, Plus } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { AvatarPicker } from '../../components/Avatar'
import { Button } from '../../components/Button'
import { Badrul } from '../../components/Badrul'
import { LebahBergantung, PucukRebungBand, Selembayung } from '../../components/Ornamen'
import { PhaseProgress } from '../../components/PhaseProgress'
import { RoleBadge } from '../../components/RoleBadge'
import { SpeakerButton } from '../../components/SpeakerButton'
import { WorkScreen } from '../../components/WorkScreen'
import { konten } from '../../content'
import { ROLES, type RoleId } from '../../lib/roles'

function Section({ title, children, dark = false }: { title: string; children: ReactNode; dark?: boolean }) {
  return (
    <section className={`rounded-lg p-6 shadow-rest ${dark ? 'bg-marun-700 [&>h2]:text-gading-50' : 'bg-gading-50'}`}>
      <h2 className="mb-4 font-display text-sub text-tanah-900">{title}</h2>
      <div className="flex flex-wrap items-center gap-4">{children}</div>
    </section>
  )
}

/** Galeri komponen untuk cek visual. Hanya tersedia saat `npm run dev`. */
export function ComponentGallery() {
  const [selected, setSelected] = useState<string[]>(['avatar-kucing'])
  const [phase, setPhase] = useState(2)

  return (
    <div className="h-full overflow-y-auto bg-gading-100 p-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-fase text-marun-700">Galeri Komponen</h1>
          <Link className="font-body text-isi text-marun-700 underline underline-offset-4" to="/dev/kerja">
            Contoh layar kerja
          </Link>
        </div>

        <Section title="Button">
          <Button icon={ArrowRight}>Lanjut</Button>
          <Button variant="secondary" icon={Plus}>
            Tambah
          </Button>
          <Button variant="ghost">Kembali</Button>
          <Button icon={Check} disabled>
            Kami Yakin
          </Button>
        </Section>

        <Section title="SpeakerButton">
          <SpeakerButton src="/audio/contoh/tidak-ada.mp3" />
          <span className="font-body text-isi text-tanah-600">Ketuk untuk memutar nada pengganti</span>
        </Section>

        <Section title="PhaseProgress (pucuk rebung)" dark>
          <PhaseProgress key={phase} current={phase} done={Array.from({ length: phase }, (_, i) => i)} />
          <Button onClick={() => setPhase((p) => (p + 1) % 6)}>Fase berikut</Button>
        </Section>

        <Section title="Ornamen Melayu" dark>
          <div className="flex w-full flex-col gap-4">
            <PucukRebungBand height={24} />
            <LebahBergantung />
            <Selembayung />
          </div>
        </Section>

        <Section title="RoleBadge" dark>
          {(Object.keys(ROLES) as RoleId[]).map((role) => (
            <RoleBadge key={role} role={role} />
          ))}
        </Section>

        <Section title="AvatarPicker">
          <AvatarPicker
            label="Pilih avatar"
            options={konten.avatar.map((a, i) => ({ id: a.id, dimmed: i === 3, caption: i === 3 ? 'sudah' : undefined }))}
            selected={selected}
            onSelect={(id) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))}
          />
        </Section>

        <Section title="Badrul">
          <Badrul />
          <Badrul talking />
        </Section>
      </div>
    </div>
  )
}

export function WorkScreenDemo() {
  return (
    <WorkScreen
      phase={1}
      donePhases={[0]}
      actor={{ avatarId: 'avatar-kucing', nama: 'Rara', role: 'arsitek' }}
      instruction="Seret rumah ke tanah kosong."
      voiceSrc="/audio/instruksi/fase-1.mp3"
      primary={<Button icon={ArrowRight}>Lanjut</Button>}
      drawer={
        <ul className="flex flex-col gap-3">
          {konten.elemen
            .filter((e) => e.kategori === 'buatan')
            .map((e) => (
              <li key={e.id} className="rounded-md border-2 border-buatan-500 bg-gading-50 p-3 font-body text-kecil">
                {e.nama}
              </li>
            ))}
        </ul>
      }
      onPause={() => {}}
    >
      <div className="flex h-full items-center justify-center">
        <p className="font-body text-isi text-tanah-600">Kanvas kampung</p>
      </div>
    </WorkScreen>
  )
}
