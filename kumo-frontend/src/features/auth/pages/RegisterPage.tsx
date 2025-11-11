import { Button, Container, Heading, Input, Stack, Field } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { register as registerApi, registerSchema, type RegisterRequest } from '../services/authApi'
import { useNavigate, Link } from 'react-router-dom'

export function RegisterPage() {
    const navigate = useNavigate()
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterRequest>({
        resolver: zodResolver(registerSchema),
        defaultValues: { nombre: '', email: '', password: '' },
    })

    const onSubmit = async (data: RegisterRequest) => {
        await registerApi(data)
        navigate('/login', { replace: true })
    }

    return (
        <Container maxW="sm" py={16}>
            <Stack gap={6}>
                <Heading size="lg" textAlign="center">Crear cuenta</Heading>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack gap={4}>
                        <Field.Root invalid={!!errors.nombre}>
                            <Field.Label>Nombre</Field.Label>
                            <Input autoComplete="name" {...register('nombre')} />
                            <Field.ErrorText>{errors.nombre?.message}</Field.ErrorText>
                        </Field.Root>
                        <Field.Root invalid={!!errors.email}>
                            <Field.Label>Email</Field.Label>
                            <Input type="email" autoComplete="email" {...register('email')} />
                            <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
                        </Field.Root>
                        <Field.Root invalid={!!errors.password}>
                            <Field.Label>Contraseña</Field.Label>
                            <Input type="password" autoComplete="new-password" {...register('password')} />
                            <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
                        </Field.Root>
                        <Button type="submit" colorScheme="blue" loading={isSubmitting}>Registrarme</Button>
                    </Stack>
                </form>
                <Stack direction="row" justify="center" fontSize="sm">
                    <span>¿Ya tienes cuenta?</span>
                    <Link to="/login">Inicia sesión</Link>
                </Stack>
            </Stack>
        </Container>
    )
}
