import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../../features/auth/context/AuthContext'

export function ProtectedRoute() {
    const { isAuthenticated } = useAuth()
    if (!isAuthenticated) return <Navigate to="/login" replace />
    return <Outlet />
}
