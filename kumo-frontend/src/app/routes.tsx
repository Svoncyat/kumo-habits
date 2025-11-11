import { createBrowserRouter, Navigate } from 'react-router-dom'
import { LoginPage } from '../features/auth/pages/LoginPage'
import { RegisterPage } from '../features/auth/pages/RegisterPage'
import { HabitsListPage } from '../features/habits/pages/HabitsListPage'
import { HabitDetailPage } from '../features/habits/pages/HabitDetailPage'
import { ProfilePage } from '../features/profile/pages/ProfilePage'
import { ProtectedRoute } from '../core/routing/ProtectedRoute'

export const router = createBrowserRouter([
    { path: '/', element: <Navigate to="/habitos" replace /> },
    { path: '/login', element: <LoginPage /> },
    { path: '/register', element: <RegisterPage /> },
    {
        path: '/',
        element: <ProtectedRoute />,
        children: [
            { path: '/habitos', element: <HabitsListPage /> },
            { path: '/habitos/:id', element: <HabitDetailPage /> },
            { path: '/perfil', element: <ProfilePage /> },
        ],
    },
])
