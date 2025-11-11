import { Box, Container, Flex, Heading, Button, HStack } from "@chakra-ui/react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/context/AuthContext";

export const MainLayout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <Box minH="100vh" bg="gray.50">
            {/* Navbar */}
            <Box bg="white" shadow="sm" borderBottom="1px" borderColor="gray.200">
                <Container maxW="container.xl">
                    <Flex h="16" alignItems="center" justifyContent="space-between">
                        <Heading size="md" color="teal.600">
                            Kumo Habits
                        </Heading>

                        <HStack gap={4}>
                            <Button asChild
                                variant="ghost"
                                colorPalette="teal"
                            >
                                <Link to="/habitos">Hábitos</Link>
                            </Button>
                            <Button asChild
                                variant="ghost"
                                colorPalette="teal"
                            >
                                <Link to="/perfil">Perfil</Link>
                            </Button>
                            <Button
                                onClick={handleLogout}
                                variant="outline"
                                colorPalette="red"
                            >
                                Cerrar Sesión
                            </Button>
                        </HStack>
                    </Flex>
                </Container>
            </Box>

            {/* Main Content */}
            <Container maxW="container.xl" py={8}>
                <Outlet />
            </Container>
        </Box>
    );
};
