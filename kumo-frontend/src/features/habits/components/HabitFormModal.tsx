import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
    Button,
    DialogRoot,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogBody,
    DialogFooter,
    DialogCloseTrigger,
    Input,
    Textarea,
    VStack,
    Field,
    NativeSelectRoot,
    NativeSelectField,
} from '@chakra-ui/react'
import { habitsApi } from '../services/habitsApi'
import { toaster } from '../../../core/providers/toaster'
import type { Habito } from '../../../core/types/domain'
import { FrecuenciaTipo } from '../../../core/types/domain'
import type { AxiosError } from 'axios'

const habitSchema = z.object({
    nombre: z.string().min(1, 'El nombre es requerido').max(100),
    descripcion: z.string().max(500).optional(),
    color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Color inválido'),
    icono: z.string().max(50).optional(),
    frecuenciaTipo: z.enum([
        FrecuenciaTipo.DIARIA,
        FrecuenciaTipo.SEMANAL,
        FrecuenciaTipo.MENSUAL,
        FrecuenciaTipo.PERSONALIZADA,
    ]),
    diasObjetivo: z.number().min(1).max(365).optional(),
    fechaInicio: z.string().min(1, 'La fecha de inicio es requerida'),
    fechaFin: z.string().optional(),
})

type HabitFormData = z.infer<typeof habitSchema>

interface HabitFormModalProps {
    isOpen: boolean
    onClose: () => void
    habit?: Habito
}

export const HabitFormModal = ({ isOpen, onClose, habit }: HabitFormModalProps) => {
    const queryClient = useQueryClient()
    const isEditing = !!habit

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<HabitFormData>({
        resolver: zodResolver(habitSchema),
        defaultValues: habit
            ? {
                nombre: habit.nombre,
                descripcion: habit.descripcion || '',
                color: habit.color,
                icono: habit.icono || '',
                frecuenciaTipo: habit.frecuenciaTipo,
                diasObjetivo: habit.diasObjetivo || undefined,
                fechaInicio: habit.fechaInicio,
                fechaFin: habit.fechaFin || '',
            }
            : {
                color: '#3182ce',
                frecuenciaTipo: FrecuenciaTipo.DIARIA,
                fechaInicio: new Date().toISOString().split('T')[0],
            },
    })

    const mutation = useMutation({
        mutationFn: (data: HabitFormData) => {
            return isEditing ? habitsApi.update(habit.id, data) : habitsApi.create(data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['habits'] })
            toaster.create({
                title: isEditing ? 'Hábito actualizado' : 'Hábito creado',
                type: 'success',
                duration: 3000,
            })
            reset()
            onClose()
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

    const onSubmit = (data: HabitFormData) => {
        const payload = {
            ...data,
            diasObjetivo: data.diasObjetivo || undefined,
            fechaFin: data.fechaFin || undefined,
            descripcion: data.descripcion || undefined,
            icono: data.icono || undefined,
        }
        mutation.mutate(payload)
    }

    const handleClose = () => {
        reset()
        onClose()
    }

    return (
        <DialogRoot open={isOpen} onOpenChange={(e) => !e.open && handleClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Editar Hábito' : 'Crear Hábito'}</DialogTitle>
                    <DialogCloseTrigger />
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogBody>
                        <VStack gap={4} align="stretch">
                            <Field.Root invalid={!!errors.nombre}>
                                <Field.Label>Nombre</Field.Label>
                                <Input
                                    {...register('nombre')}
                                    placeholder="Ej: Meditar 10 minutos"
                                />
                                {errors.nombre && (
                                    <Field.ErrorText>{errors.nombre.message}</Field.ErrorText>
                                )}
                            </Field.Root>

                            <Field.Root invalid={!!errors.descripcion}>
                                <Field.Label>Descripción (opcional)</Field.Label>
                                <Textarea
                                    {...register('descripcion')}
                                    placeholder="Describe tu hábito..."
                                    rows={3}
                                />
                                {errors.descripcion && (
                                    <Field.ErrorText>{errors.descripcion.message}</Field.ErrorText>
                                )}
                            </Field.Root>

                            <Field.Root invalid={!!errors.color}>
                                <Field.Label>Color</Field.Label>
                                <Input {...register('color')} type="color" />
                                {errors.color && (
                                    <Field.ErrorText>{errors.color.message}</Field.ErrorText>
                                )}
                            </Field.Root>

                            <Field.Root invalid={!!errors.frecuenciaTipo}>
                                <Field.Label>Frecuencia</Field.Label>
                                <NativeSelectRoot>
                                    <NativeSelectField {...register('frecuenciaTipo')}>
                                        <option value="DIARIA">Diaria</option>
                                        <option value="SEMANAL">Semanal</option>
                                        <option value="MENSUAL">Mensual</option>
                                        <option value="PERSONALIZADA">Personalizada</option>
                                    </NativeSelectField>
                                </NativeSelectRoot>
                                {errors.frecuenciaTipo && (
                                    <Field.ErrorText>
                                        {errors.frecuenciaTipo.message}
                                    </Field.ErrorText>
                                )}
                            </Field.Root>

                            <Field.Root invalid={!!errors.fechaInicio}>
                                <Field.Label>Fecha de inicio</Field.Label>
                                <Input {...register('fechaInicio')} type="date" />
                                {errors.fechaInicio && (
                                    <Field.ErrorText>{errors.fechaInicio.message}</Field.ErrorText>
                                )}
                            </Field.Root>

                            <Field.Root invalid={!!errors.fechaFin}>
                                <Field.Label>Fecha de fin (opcional)</Field.Label>
                                <Input {...register('fechaFin')} type="date" />
                                {errors.fechaFin && (
                                    <Field.ErrorText>{errors.fechaFin.message}</Field.ErrorText>
                                )}
                            </Field.Root>
                        </VStack>
                    </DialogBody>

                    <DialogFooter>
                        <Button variant="outline" onClick={handleClose} mr={3}>
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            colorPalette="teal"
                            loading={isSubmitting || mutation.isPending}
                        >
                            {isEditing ? 'Guardar' : 'Crear'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </DialogRoot>
    )
}
