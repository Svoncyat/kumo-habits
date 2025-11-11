import { Suspense } from 'react'
import { RouterProvider } from 'react-router-dom'
import { AppProviders } from './core/providers/AppProviders'
import { router } from './app/routes'

function App() {
  return (
    <AppProviders>
      <Suspense fallback={null}>
        <RouterProvider router={router} />
      </Suspense>
    </AppProviders>
  )
}

export default App
