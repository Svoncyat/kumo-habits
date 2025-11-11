import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../query/queryClient";
import { AuthProvider } from "../../features/auth/context/AuthContext";
import { ToasterProvider } from "./ToasterProvider";

interface AppProvidersProps {
    children: React.ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
    return (
        <ChakraProvider value={defaultSystem}>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <ToasterProvider />
                    {children}
                </AuthProvider>
            </QueryClientProvider>
        </ChakraProvider>
    );
};
