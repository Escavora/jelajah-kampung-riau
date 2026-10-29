import { createBrowserRouter, Outlet, type RouteObject } from 'react-router-dom'
import { ComingSoon } from './features/ComingSoon'
import { GamePage } from './features/game/GamePage'
import { HomePage } from './features/home/HomePage'
import { SetupPage } from './features/setup/SetupPage'

/** Tata letak mengikuti layar. Hanya langkah berpeta di HP tegak yang meminta HP diputar (lihat WorkScreen). */
function RootLayout() {
  return (
    <>
      <Outlet />
    </>
  )
}

const devRoutes: RouteObject[] = import.meta.env.DEV
  ? [
      {
        path: '/dev',
        lazy: () => import('./features/dev/ComponentGallery').then((m) => ({ Component: m.ComponentGallery })),
      },
      {
        path: '/dev/kerja',
        lazy: () => import('./features/dev/ComponentGallery').then((m) => ({ Component: m.WorkScreenDemo })),
      },
    ]
  : []

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    // Rute lazy butuh fallback saat pertama dimuat. Layar kosong krem sudah cukup.
    HydrateFallback: () => <div className="h-full bg-gading-100" />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/setup', element: <SetupPage /> },
      { path: '/main', element: <GamePage /> },
      ...devRoutes,
      { path: '*', element: <ComingSoon title="Ups, halaman ini tidak ada" /> },
    ],
  },
])
