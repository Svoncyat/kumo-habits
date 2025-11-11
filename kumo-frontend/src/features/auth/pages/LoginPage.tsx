import { Button, Container, Heading, Input, Stack, Field } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginRequest } from '../services/authApi'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

export function LoginPage() {
    const { loginWithCredentials } = useAuth()
    const navigate = useNavigate()
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginRequest>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '' },
    })

    const onSubmit = async (data: LoginRequest) => {
        await loginWithCredentials(data.email, data.password)
        navigate('/habitos', { replace: true })
    }

    return (
        <Container maxW="sm" py={16}>
            <Stack gap={6}>
                <Heading size="lg" textAlign="center">Iniciar sesión</Heading>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack gap={4}>
                        <Field.Root invalid={!!errors.email}>
                            <Field.Label>Email</Field.Label>
                            <Input type="email" autoComplete="email" {...register('email')} />
                            <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
                        </Field.Root>
                        <Field.Root invalid={!!errors.password}>
                            <Field.Label>Contraseña</Field.Label>
                            <Input type="password" autoComplete="current-password" {...register('password')} />
                            <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
                        </Field.Root>
                        <Button type="submit" colorScheme="blue" loading={isSubmitting}>Entrar</Button>
                    </Stack>
                </form>
                <Stack direction="row" justify="center" fontSize="sm">
                    <span>¿No tienes cuenta?</span>
                    <Link to="/register">Regístrate</Link>
                </Stack>
            </Stack>
        </Container>
    )
}
