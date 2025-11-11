// User & Auth Types
export interface User {
    id: number;
    nombre: string;
    email: string;
    fechaCreacion: string;
    activo: boolean;
}

export interface AuthResponse {
    token: string;
    usuario?: User;
}

// Habit Types
export interface Habito {
    id: number;
    nombre: string;
    descripcion: string | null;
    color: string;
    icono: string | null;
    frecuenciaTipo: FrecuenciaTipo;
    diasObjetivo: number | null;
    fechaInicio: string;
    fechaFin: string | null;
    activo: boolean;
    usuarioId: number;
    fechaCreacion: string;
    fechaActualizacion: string;
}

export const FrecuenciaTipo = {
    DIARIA: "DIARIA",
    SEMANAL: "SEMANAL",
    MENSUAL: "MENSUAL",
    PERSONALIZADA: "PERSONALIZADA"
} as const

export type FrecuenciaTipo = typeof FrecuenciaTipo[keyof typeof FrecuenciaTipo]

export interface CreateHabitoDto {
    nombre: string;
    descripcion?: string;
    color: string;
    icono?: string;
    frecuenciaTipo: FrecuenciaTipo;
    diasObjetivo?: number;
    fechaInicio: string;
    fechaFin?: string;
}

export interface UpdateHabitoDto extends Partial<CreateHabitoDto> {
    activo?: boolean;
}

// Tracking/Registro Types
export interface RegistroHabito {
    id: number;
    habitoId: number;
    fecha: string;
    completado: boolean;
    notas: string | null;
    fechaCreacion: string;
    fechaActualizacion: string;
}

export interface CreateRegistroDto {
    habitoId: number;
    fecha: string;
    completado: boolean;
    notas?: string;
}

// Meta Types
export interface Meta {
    id: number;
    habitoId: number;
    tipoMeta: TipoMeta;
    valorObjetivo: number;
    valorActual: number;
    unidad: string | null;
    fechaInicio: string;
    fechaFin: string;
    completada: boolean;
    fechaCreacion: string;
    fechaActualizacion: string;
}

export const TipoMeta = {
    RACHA: "RACHA",
    TOTAL: "TOTAL",
    PORCENTAJE: "PORCENTAJE"
} as const

export type TipoMeta = typeof TipoMeta[keyof typeof TipoMeta]

export interface CreateMetaDto {
    habitoId: number;
    tipoMeta: TipoMeta;
    valorObjetivo: number;
    unidad?: string;
    fechaInicio: string;
    fechaFin: string;
}

// Reminder Types
export interface Recordatorio {
    id: number;
    habitoId: number;
    diasSemana: DiaSemana[];
    hora: string;
    mensaje: string | null;
    activo: boolean;
    fechaCreacion: string;
    fechaActualizacion: string;
}

export const DiaSemana = {
    LUNES: "LUNES",
    MARTES: "MARTES",
    MIERCOLES: "MIERCOLES",
    JUEVES: "JUEVES",
    VIERNES: "VIERNES",
    SABADO: "SABADO",
    DOMINGO: "DOMINGO"
} as const

export type DiaSemana = typeof DiaSemana[keyof typeof DiaSemana]

export interface CreateRecordatorioDto {
    habitoId: number;
    diasSemana: DiaSemana[];
    hora: string;
    mensaje?: string;
}

// Metrics Types
export interface Metrica {
    habitoId: number;
    rachaActual: number;
    rachaMasLarga: number;
    totalCompletados: number;
    porcentajeCompletado: number;
    ultimaActualizacion: string;
}

export interface MetricaPorPeriodo {
    fecha: string;
    totalCompletados: number;
    porcentajeCompletado: number;
}
