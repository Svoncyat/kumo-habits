import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { tokenStorage } from '../../../core/security/tokenStorage'
import { login } from '../services/authApi'

type AuthContextValue = {
    isAuthenticated: boolean
    token: string | null
    loginWithCredentials: (email: string, password: string) => Promise<void>
    logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(tokenStorage.get())

    useEffect(() => {
        if (token) tokenStorage.set(token)
        else tokenStorage.clear()
    }, [token])

    const value = useMemo<AuthContextValue>(() => ({
        isAuthenticated: !!token,
        token,
        async loginWithCredentials(email: string, password: string) {
            const res = await login({ email, password })
            setToken(res.token)
        },
        logout() {
            setToken(null)
        },
    }), [token])

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}
