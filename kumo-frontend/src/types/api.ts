// ==================== AUTH TYPES ====================
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegistroUsuarioRequest {
  nombre: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  tipoToken: string;
  expiraEn: string;
}

// ==================== PERFIL TYPES ====================
export interface PerfilResponse {
  id: number;
  nombre: string;
  email: string;
  zonaHoraria: string;
  formatoFecha: string;
  fechaRegistro?: string; // Optional to handle missing field gracefully
}

export interface ActualizarPerfilRequest {
  nombre?: string;
  email?: string;
  password?: string;
  zonaHoraria?: string;
  formatoFecha?: string;
}

// ==================== HABITO TYPES ====================
export interface CategoriaResponse {
  id: number;
  nombre: string;
  colorHex: string;
  icono?: string;
}

export interface HabitoResponse {
  id: number;
  nombre: string;
  metaDiaria: number;
  estaArchivado: boolean;
  fechaCreacion: string;
  fechaModificacion: string;
  categorias: CategoriaResponse[];
}

export interface CrearHabitoRequest {
  nombre: string;
  metaDiaria?: number;
  categoriaIds?: number[];
  estaArchivado?: boolean;
}

export interface ActualizarHabitoRequest {
  nombre?: string;
  metaDiaria?: number;
  estaArchivado?: boolean;
  categoriaIds?: number[];
}

// ==================== REGISTRO TYPES ====================
export interface RegistroRequest {
  habitoId: number;
  fechaRegistro: string; // LocalDate format: YYYY-MM-DD
  valorRegistrado: number;
  estaCumplido: boolean;
}

export interface RegistroResponse {
  id: number;
  habitoId: number;
  habitoNombre: string;
  fechaRegistro: string;
  valorRegistrado: number;
  estaCumplido: boolean;
  fechaCreacion: string;
  fechaUltimaModificacion: string;
}

// ==================== METRICAS TYPES ====================
export interface MetricasResponse {
  habitoId: number;
  rachaMasLarga: number;
  totalDiasCumplidos: number;
  totalValorAcumulado: number;
  fechaUltimaActualizacion: string;
}

export interface MetaMensualRequest {
  habitoId: number;
  mes: number; // 1-12
  año: number;
  metaMensual: number;
}

export interface MetaMensualResponse {
  id: number;
  habitoId: number;
  mes: number;
  año: number;
  metaMensual: number;
  valorActual: number;
  porcentajeProgreso: number;
  fechaCreacion: string;
}

// ==================== RECORDATORIO TYPES ====================
export interface RecordatorioRequest {
  habitoId: number;
  horaRecordatorio: string; // LocalTime format: HH:mm:ss
  mensaje?: string;
  dias: string[]; // ["LUNES", "MARTES", ...]
  estaActivo?: boolean;
}

export interface RecordatorioUpdateRequest {
  horaRecordatorio?: string;
  mensaje?: string;
  dias?: string[];
  estaActivo?: boolean;
}

export interface RecordatorioResponse {
  id: number;
  habitoId: number;
  horaRecordatorio: string;
  mensaje?: string;
  dias: string[]; // ["LUNES", "MARTES", ...]
  estaActivo: boolean;
  fechaCreacion: string;
  fechaModificacion?: string;
}

// ==================== UTILITY TYPES ====================
export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
