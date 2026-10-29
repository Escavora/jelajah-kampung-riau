import { House } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { PucukRebungBand } from '../components/Ornamen'

/** Halaman untuk alamat yang tidak dikenal. */
export function ComingSoon({ title }: { title: string }) {
  const navigate = useNavigate()
  return (
    <div className="relative flex h-full flex-col items-center justify-center gap-6 bg-gading-100">
      <PucukRebungBand flip height={20} className="absolute inset-x-0 top-0" inner="var(--color-gading-100)" />
      <h1 className="font-display text-fase text-marun-700">{title}</h1>
      <p className="font-body text-isi text-tanah-600">Ayo kembali ke Beranda.</p>
      <Button variant="secondary" icon={House} onClick={() => navigate('/')}>
        Beranda
      </Button>
    </div>
  )
}
