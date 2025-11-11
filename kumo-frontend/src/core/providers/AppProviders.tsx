import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { queryClient } from '../query/queryClient'
import { AuthProvider } from '../../features/auth/context/AuthContext'

export function AppProviders({ children }: { children: ReactNode }) {
    return (
        <ChakraProvider value={defaultSystem}>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>{children}</AuthProvider>
            </QueryClientProvider>
        </ChakraProvider>
    )
}
