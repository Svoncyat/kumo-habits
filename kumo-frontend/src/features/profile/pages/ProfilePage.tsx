import {
    Box,
    Button,
    Heading,
    Text,
    Spinner,
    Center,
    VStack,
    Input,
    Field,
} from '@chakra-ui/react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { profileApi } from '../services/profileApi'
import { toaster } from '../../../core/providers/toaster'
import { useState } from 'react'
import type { AxiosError } from 'axios'

const profileSchema = z.object({
    nombre: z.string().min(1, 'El nombre es requerido').max(100),
    email: z.string().email('Email inválido'),
})

type ProfileFormData = z.infer<typeof profileSchema>

export function ProfilePage() {
    const queryClient = useQueryClient()
    const [isEditing, setIsEditing] = useState(false)

    const { data: profile, isLoading, error } = useQuery({
        queryKey: ['profile'],
        queryFn: profileApi.getProfile,
    })

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        values: profile
            ? {
                nombre: profile.nombre,
                email: profile.email,
            }
            : undefined,
    })

    const mutation = useMutation({
        mutationFn: profileApi.updateProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile'] })
            toaster.create({
                title: 'Perfil actualizado',
                type: 'success',
                duration: 3000,
            })
            setIsEditing(false)
        },
        onError: (error: AxiosError<{ message?: string }>) => {
            toaster.create({
                title: 'Error',
                description: error.response?.data?.message || 'Ocurrió un error',
                type: 'error',
                duration: 5000,
            })
        },
    })

    const onSubmit = (data: ProfileFormData) => {
        mutation.mutate(data)
    }

    const handleCancel = () => {
        reset()
        setIsEditing(false)
    }

    if (isLoading) {
        return (
            <Center h="200px">
                <Spinner size="lg" color="teal.500" />
            </Center>
        )
    }

    if (error || !profile) {
        return (
            <Box>
                <Heading size="lg" mb={4}>
                    Error
                </Heading>
                <Text color="red.500">No se pudo cargar el perfil</Text>
            </Box>
        )
    }

    return (
        <Box maxW="600px">
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={6}>
                <Heading size="lg">Mi Perfil</Heading>
                {!isEditing && (
                    <Button colorPalette="teal" onClick={() => setIsEditing(true)}>
                        Editar
                    </Button>
                )}
            </Box>

            <Box p={6} bg="white" borderRadius="lg" borderWidth="1px">
                {isEditing ? (
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <VStack gap={4} align="stretch">
                            <Field.Root invalid={!!errors.nombre}>
                                <Field.Label>Nombre</Field.Label>
                                <Input
                                    {...register('nombre')}
                                    placeholder="Tu nombre"
                                    autoComplete="name"
                                />
                                {errors.nombre && (
                                    <Field.ErrorText>{errors.nombre.message}</Field.ErrorText>
                                )}
                            </Field.Root>

                            <Field.Root invalid={!!errors.email}>
                                <Field.Label>Email</Field.Label>
                                <Input
                                    {...register('email')}
                                    type="email"
                                    placeholder="tu@email.com"
                                    autoComplete="email"
                                />
                                {errors.email && (
                                    <Field.ErrorText>{errors.email.message}</Field.ErrorText>
                                )}
                            </Field.Root>

                            <Box display="flex" gap={3} mt={4}>
                                <Button
                                    type="submit"
                                    colorPalette="teal"
                                    loading={isSubmitting || mutation.isPending}
                                    flex={1}
                                >
                                    Guardar
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={handleCancel}
                                    disabled={isSubmitting || mutation.isPending}
                                    flex={1}
                                >
                                    Cancelar
                                </Button>
                            </Box>
                        </VStack>
                    </form>
                ) : (
                    <VStack align="stretch" gap={4}>
                        <Box>
                            <Text color="gray.600" fontSize="sm" mb={1}>
                                Nombre
                            </Text>
                            <Text fontSize="lg">{profile.nombre}</Text>
                        </Box>
                        <Box>
                            <Text color="gray.600" fontSize="sm" mb={1}>
                                Email
                            </Text>
                            <Text fontSize="lg">{profile.email}</Text>
                        </Box>
                        <Box>
                            <Text color="gray.600" fontSize="sm" mb={1}>
                                Fecha de creación
                            </Text>
                            <Text fontSize="lg">
                                {new Date(profile.fechaCreacion).toLocaleDateString()}
                            </Text>
                        </Box>
                        <Box>
                            <Text color="gray.600" fontSize="sm" mb={1}>
                                Estado
                            </Text>
                            <Text fontSize="lg" color={profile.activo ? 'green.600' : 'gray.600'}>
                                {profile.activo ? 'Activo' : 'Inactivo'}
                            </Text>
                        </Box>
                    </VStack>
                )}
            </Box>
        </Box>
    )
}
