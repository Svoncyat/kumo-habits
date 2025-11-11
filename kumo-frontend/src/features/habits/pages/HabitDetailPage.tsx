import { Container, Heading, Text } from '@chakra-ui/react'
import { useParams } from 'react-router-dom'

export function HabitDetailPage() {
    const { id } = useParams()
    return (
        <Container py={8}>
            <Heading size="lg">Detalle de hábito</Heading>
            <Text mt={2}>ID: {id}</Text>
        </Container>
    )
}
