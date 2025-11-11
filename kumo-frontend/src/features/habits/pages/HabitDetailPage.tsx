import {
    Box,
    Button,
    Heading,
    Text,
    Spinner,
    Center,
    HStack,
    VStack,
    Badge,
} from '@chakra-ui/react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { habitsApi } from '../services/habitsApi'
import { HabitFormModal } from '../components/HabitFormModal'
import { toaster } from '../../../core/providers/toaster'
import type { AxiosError } from 'axios'

export function HabitDetailPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    const { data: habit, isLoading, error } = useQuery({
        queryKey: ['habit', id],
        queryFn: () => habitsApi.getById(Number(id)),
        enabled: !!id,
    })

    const deleteMutation = useMutation({
        mutationFn: () => habitsApi.delete(Number(id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['habits'] })
            toaster.create({
                title: 'Hábito eliminado',
                type: 'success',
                duration: 3000,
            })
            navigate('/habitos')
        },
        onError: (error: AxiosError<{ message?: string }>) => {
            toaster.create({
                title: 'Error al eliminar',
                description: error.response?.data?.message || 'Ocurrió un error',
                type: 'error',
                duration: 5000,
            })
        },
    })

    const handleDelete = () => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este hábito?')) {
            deleteMutation.mutate()
        }
    }

    if (isLoading) {
        return (
            <Center h="200px">
                <Spinner size="lg" color="teal.500" />
            </Center>
        )
    }

    if (error || !habit) {
        return (
            <Box>
                <Heading size="lg" mb={4}>
                    Error
                </Heading>
                <Text color="red.500">No se pudo cargar el hábito</Text>
                <Button mt={4} onClick={() => navigate('/habitos')}>
                    Volver a Hábitos
                </Button>
            </Box>
        )
    }

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={6}>
                <Box>
                    <HStack mb={2}>
                        <Box w={4} h={4} borderRadius="full" bg={habit.color} />
                        <Heading size="lg">{habit.nombre}</Heading>
                    </HStack>
                    {habit.descripcion && (
                        <Text color="gray.600" fontSize="md">
                            {habit.descripcion}
                        </Text>
                    )}
                </Box>

                <HStack>
                    <Button
                        colorPalette="blue"
                        variant="outline"
                        onClick={() => setIsEditModalOpen(true)}
                    >
                        Editar
                    </Button>
                    <Button
                        colorPalette="red"
                        variant="outline"
                        onClick={handleDelete}
                        loading={deleteMutation.isPending}
                    >
                        Eliminar
                    </Button>
                </HStack>
            </Box>

            <VStack align="stretch" gap={4}>
                <Box p={5} bg="white" borderRadius="lg" borderWidth="1px">
                    <Heading size="sm" mb={3}>
                        Detalles
                    </Heading>
                    <VStack align="stretch" gap={2}>
                        <HStack justify="space-between">
                            <Text color="gray.600">Frecuencia:</Text>
                            <Badge colorPalette="teal">{habit.frecuenciaTipo}</Badge>
                        </HStack>
                        <HStack justify="space-between">
                            <Text color="gray.600">Fecha de inicio:</Text>
                            <Text>{new Date(habit.fechaInicio).toLocaleDateString()}</Text>
                        </HStack>
                        {habit.fechaFin && (
                            <HStack justify="space-between">
                                <Text color="gray.600">Fecha de fin:</Text>
                                <Text>{new Date(habit.fechaFin).toLocaleDateString()}</Text>
                            </HStack>
                        )}
                        {habit.diasObjetivo && (
                            <HStack justify="space-between">
                                <Text color="gray.600">Días objetivo:</Text>
                                <Text>{habit.diasObjetivo}</Text>
                            </HStack>
                        )}
                        <HStack justify="space-between">
                            <Text color="gray.600">Estado:</Text>
                            <Badge colorPalette={habit.activo ? 'green' : 'gray'}>
                                {habit.activo ? 'Activo' : 'Inactivo'}
                            </Badge>
                        </HStack>
                    </VStack>
                </Box>

                <Box p={5} bg="white" borderRadius="lg" borderWidth="1px">
                    <Heading size="sm" mb={3}>
                        Registros
                    </Heading>
                    <Text color="gray.500">Próximamente: calendario de seguimiento</Text>
                </Box>

                <Box p={5} bg="white" borderRadius="lg" borderWidth="1px">
                    <Heading size="sm" mb={3}>
                        Métricas
                    </Heading>
                    <Text color="gray.500">Próximamente: estadísticas y rachas</Text>
                </Box>

                <Box p={5} bg="white" borderRadius="lg" borderWidth="1px">
                    <Heading size="sm" mb={3}>
                        Recordatorios
                    </Heading>
                    <Text color="gray.500">Próximamente: configurar recordatorios</Text>
                </Box>
            </VStack>

            {habit && (
                <HabitFormModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    habit={habit}
                />
            )}
        </Box>
    )
}
