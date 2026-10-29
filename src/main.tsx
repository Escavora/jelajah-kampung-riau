import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import { mulaiMusikSetelahSentuhan } from './lib/musik'
import { router } from './routes'

// Aplikasi diperbarui otomatis di belakang layar; sesi yang sedang berjalan tidak terputus.
registerSW({ immediate: true })
// Musik latar baru boleh bunyi setelah anak menyentuh layar (aturan autoplay browser).
mulaiMusikSetelahSentuhan()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
