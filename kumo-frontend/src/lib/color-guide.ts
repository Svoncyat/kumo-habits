/**
 * GUÍA DE COLORES - KUMO HABITS
 * ==============================
 * 
 * Esta guía documenta el sistema de colores alineado con el SRS
 * 
 * 1. COLORES DE CATEGORÍAS (Dinámicos desde Backend)
 * --------------------------------------------------
 * Los colores de categorías provienen de la base de datos:
 * 
 * - Mindfulness:    #8BC34A (verde)
 * - Salud:          #FF7043 (naranja)
 * - Productividad:  #42A5F5 (azul)
 * - Aprendizaje:    #AB47BC (morado)
 * - Bienestar:      #FDD835 (amarillo)
 * 
 * Uso:
 * ```tsx
 * <Badge customColor={categoria.colorHex}>
 *   {categoria.nombre}
 * </Badge>
 * ```
 * 
 * 
 * 2. ESTADOS DE CALENDARIO (RF-RAC-RES-004, RF-RAC-CAL-005)
 * ---------------------------------------------------------
 * Cada día en el calendario mensual debe colorearse según su estado:
 * 
 * - CUMPLIDO:      Verde (#22c55e - cumplido-500)
 * - NO CUMPLIDO:   Rojo (#ef4444 - noCumplido-500)
 * - SIN REGISTRO:  Gris (#9ca3af - sinRegistro-400)
 * 
 * Uso:
 * ```tsx
 * <CalendarioDia 
 *   dia={15} 
 *   estado="cumplido" // o "noCumplido" o "sinRegistro"
 * />
 * ```
 * 
 * 
 * 3. VALIDACIÓN DE FORMULARIOS (RF-AUT-REG-005)
 * ---------------------------------------------
 * Los campos con datos inválidos deben marcarse con borde rojo:
 * 
 * Uso:
 * ```tsx
 * <Input 
 *   label="Email" 
 *   error={errors.email} // Automáticamente aplica borde rojo
 * />
 * ```
 * 
 * 
 * 4. INDICADOR DE RACHA (RF-RAC-CAL-005)
 * --------------------------------------
 * Diseño visual distintivo con icono de fuego en color naranja:
 * 
 * - Color racha: Naranja (#f97316 - racha-500)
 * 
 * Uso:
 * ```tsx
 * <RachaIndicator rachaActual={7} size="lg" />
 * ```
 * 
 * 
 * 5. GRÁFICOS DE REPORTES
 * -----------------------
 * 
 * RF-REP-VIS-001: Gráfico de barras (cumplidos vs no cumplidos)
 * - Cumplidos:     Verde #22c55e
 * - No cumplidos:  Rojo #ef4444
 * 
 * Uso:
 * ```tsx
 * import { CHART_ESTADO_COLORS } from '@/lib/colors';
 * 
 * const datasets = [
 *   {
 *     label: 'Cumplidos',
 *     backgroundColor: CHART_ESTADO_COLORS.cumplido,
 *     data: [...]
 *   },
 *   {
 *     label: 'No Cumplidos',
 *     backgroundColor: CHART_ESTADO_COLORS.noCumplido,
 *     data: [...]
 *   }
 * ];
 * ```
 * 
 * RF-REP-VIS-003: Gráfico comparativo (múltiples hábitos)
 * - Cada hábito usa el color de su categoría principal
 * 
 * Uso:
 * ```tsx
 * import { generateChartColors } from '@/lib/colors';
 * 
 * const colores = generateChartColors(habito.categorias);
 * ```
 * 
 * 
 * 6. CLASES DE TAILWIND DISPONIBLES
 * ---------------------------------
 * 
 * Estados de calendario:
 * - bg-cumplido-{50-900}
 * - text-cumplido-{50-900}
 * - border-cumplido-{50-900}
 * 
 * - bg-noCumplido-{50-900}
 * - text-noCumplido-{50-900}
 * - border-noCumplido-{50-900}
 * 
 * - bg-sinRegistro-{50-900}
 * - text-sinRegistro-{50-900}
 * - border-sinRegistro-{50-900}
 * 
 * Racha:
 * - bg-racha-{50-900}
 * - text-racha-{50-900}
 * - border-racha-{50-900}
 * 
 * 
 * 7. COMPONENTES CON SOPORTE DE COLORES
 * -------------------------------------
 * 
 * Badge:
 * - variant="cumplido" | "noCumplido" | "sinRegistro"
 * - customColor={categoria.colorHex} // Para colores dinámicos
 * 
 * CalendarioDia:
 * - estado="cumplido" | "noCumplido" | "sinRegistro" | "futuro"
 * 
 * RachaIndicator:
 * - size="sm" | "md" | "lg"
 * 
 * Input:
 * - error={mensaje} // Automáticamente aplica borde rojo
 */

export {};
