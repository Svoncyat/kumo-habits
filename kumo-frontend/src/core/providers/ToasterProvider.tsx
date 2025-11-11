import { Toaster } from '@chakra-ui/react'
import { toaster } from './toaster'

export const ToasterProvider = () => (
    <Toaster toaster={toaster}>{(t) => t.title}</Toaster>
)
