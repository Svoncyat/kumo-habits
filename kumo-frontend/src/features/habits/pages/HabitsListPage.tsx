import { useQuery } from '@tanstack/react-query'
import { listHabits } from '../services/habitsApi'
import { Container, Heading, Spinner, Stack, Box, Text } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

export function HabitsListPage() {
    const { data, isLoading } = useQuery({ queryKey: ['habits'], queryFn: listHabits })
    return (
        <Container py={8} maxW="container.md">
            <Heading size="lg" mb={6}>Hábitos</Heading>
            {isLoading && <Spinner />}
            <Stack gap={4}>
                {data?.map(h => (
                    <Box key={h.id} borderWidth="1px" borderRadius="md" p={4} _hover={{ bg: 'gray.50' }}>
                        <Stack gap={1}>
                            <Heading size="sm"><Link to={`/habitos/${h.id}`}>{h.nombre}</Link></Heading>
                            {h.descripcion && <Text fontSize="sm" opacity={0.8}>{h.descripcion}</Text>}
                        </Stack>
                    </Box>
                ))}
            </Stack>
        </Container>
    )
}
