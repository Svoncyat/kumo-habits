import { Box, Button, Heading, SimpleGrid, Text, Spinner, Center } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { habitsApi } from '../services/habitsApi'
import { useState } from 'react'
import { HabitFormModal } from '../components/HabitFormModal'
import type { Habito } from '../../../core/types/domain'

export const HabitsListPage = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

    const { data: habits = [], isLoading, error } = useQuery<Habito[]>({
        queryKey: ['habits'],
        queryFn: habitsApi.list,
    })

    if (isLoading) {
        return (
            <Center h="200px">
                <Spinner size="lg" color="teal.500" />
            </Center>
        )
    }

    if (error) {
        return (
            <Box>
                <Heading size="lg" mb={4}>Mis Hábitos</Heading>
                <Text color="red.500">Error al cargar los hábitos</Text>
            </Box>
        )
    }

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={6}>
                <Heading size="lg">Mis Hábitos</Heading>
                <Button
                    colorPalette="teal"
                    onClick={() => setIsCreateModalOpen(true)}
                >
                    Crear Hábito
                </Button>
            </Box>

            {habits.length === 0 ? (
                <Box textAlign="center" py={10}>
                    <Text color="gray.500" mb={4}>
                        No tienes hábitos aún
                    </Text>
                    <Button
                        colorPalette="teal"
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        Crear tu primer hábito
                    </Button>
                </Box>
            ) : (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
                    {habits.map((habit) => (
                        <Link key={habit.id} to={`/habitos/${habit.id}`} style={{ textDecoration: 'none' }}>
                            <Box
                                p={5}
                                borderWidth="1px"
                                borderRadius="lg"
                                bg="white"
                                shadow="sm"
                                transition="all 0.2s"
                                _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
                                cursor="pointer"
                            >
                                <Box display="flex" alignItems="center" mb={2}>
                                    <Box
                                        w={3}
                                        h={3}
                                        borderRadius="full"
                                        bg={habit.color}
                                        mr={2}
                                    />
                                    <Heading size="md">{habit.nombre}</Heading>
                                </Box>
                                {habit.descripcion && (
                                    <Text color="gray.600" fontSize="sm" lineClamp={2}>
                                        {habit.descripcion}
                                    </Text>
                                )}
                                <Text fontSize="xs" color="gray.500" mt={2}>
                                    {habit.frecuenciaTipo}
                                </Text>
                            </Box>
                        </Link>
                    ))}
                </SimpleGrid>
            )}

            <HabitFormModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </Box>
    )
}
