-- Datos semilla para el módulo de métricas.

-- Métricas calculadas para hábitos clave.
INSERT INTO habito_metricas_calculadas (habito_id, racha_mas_larga, total_dias_cumplidos, total_valor_acumulado, fecha_ultima_actualizacion)
SELECT h.id, 12, 42, 42.0, CURRENT_TIMESTAMP - INTERVAL '1 day'
FROM habitos h
JOIN usuarios u ON u.id = h.usuario_id
WHERE u.email = 'ana.lopez@kumo.com'
	AND UPPER(h.nombre) = 'MEDITACION MATUTINA'
	AND NOT EXISTS (
		SELECT 1 FROM habito_metricas_calculadas mc WHERE mc.habito_id = h.id
	);

INSERT INTO habito_metricas_calculadas (habito_id, racha_mas_larga, total_dias_cumplidos, total_valor_acumulado, fecha_ultima_actualizacion)
SELECT h.id, 7, 20, 60.0, CURRENT_TIMESTAMP - INTERVAL '3 days'
FROM habitos h
JOIN usuarios u ON u.id = h.usuario_id
WHERE u.email = 'ana.lopez@kumo.com'
	AND UPPER(h.nombre) = 'CAMINATA NOCTURNA'
	AND NOT EXISTS (
		SELECT 1 FROM habito_metricas_calculadas mc WHERE mc.habito_id = h.id
	);

INSERT INTO habito_metricas_calculadas (habito_id, racha_mas_larga, total_dias_cumplidos, total_valor_acumulado, fecha_ultima_actualizacion)
SELECT h.id, 18, 55, 55.0, CURRENT_TIMESTAMP - INTERVAL '2 days'
FROM habitos h
JOIN usuarios u ON u.id = h.usuario_id
WHERE u.email = 'bruno.pari@kumo.com'
	AND UPPER(h.nombre) = 'PLANIFICACION DIARIA'
	AND NOT EXISTS (
		SELECT 1 FROM habito_metricas_calculadas mc WHERE mc.habito_id = h.id
	);

INSERT INTO habito_metricas_calculadas (habito_id, racha_mas_larga, total_dias_cumplidos, total_valor_acumulado, fecha_ultima_actualizacion)
SELECT h.id, 10, 32, 1440.0, CURRENT_TIMESTAMP - INTERVAL '4 days'
FROM habitos h
JOIN usuarios u ON u.id = h.usuario_id
WHERE u.email = 'diego.torres@kumo.com'
	AND UPPER(h.nombre) = 'CURSO INGLES'
	AND NOT EXISTS (
		SELECT 1 FROM habito_metricas_calculadas mc WHERE mc.habito_id = h.id
	);

INSERT INTO habito_metricas_calculadas (habito_id, racha_mas_larga, total_dias_cumplidos, total_valor_acumulado, fecha_ultima_actualizacion)
SELECT h.id, 5, 15, 15.0, CURRENT_TIMESTAMP - INTERVAL '6 days'
FROM habitos h
JOIN usuarios u ON u.id = h.usuario_id
WHERE u.email = 'elena.ramos@kumo.com'
	AND UPPER(h.nombre) = 'DIARIO GRATITUD'
	AND NOT EXISTS (
		SELECT 1 FROM habito_metricas_calculadas mc WHERE mc.habito_id = h.id
	);

-- Metas mensuales planificadas.
INSERT INTO metas_mensuales (habito_id, mes, anio, objetivo_dias_cumplidos, objetivo_valor_acumulado, fecha_creacion, fecha_modificacion)
SELECT h.id, 1, 2025, 25, NULL, TIMESTAMPTZ '2025-01-01 08:00:00+00', TIMESTAMPTZ '2025-01-05 08:00:00+00'
FROM habitos h
JOIN usuarios u ON u.id = h.usuario_id
WHERE u.email = 'ana.lopez@kumo.com'
	AND UPPER(h.nombre) = 'MEDITACION MATUTINA'
	AND NOT EXISTS (
		SELECT 1 FROM metas_mensuales mm WHERE mm.habito_id = h.id AND mm.mes = 1 AND mm.anio = 2025
	);

INSERT INTO metas_mensuales (habito_id, mes, anio, objetivo_dias_cumplidos, objetivo_valor_acumulado, fecha_creacion, fecha_modificacion)
SELECT h.id, 1, 2025, 18, 90.0, TIMESTAMPTZ '2025-01-02 20:00:00+00', TIMESTAMPTZ '2025-01-04 20:00:00+00'
FROM habitos h
JOIN usuarios u ON u.id = h.usuario_id
WHERE u.email = 'ana.lopez@kumo.com'
	AND UPPER(h.nombre) = 'CAMINATA NOCTURNA'
	AND NOT EXISTS (
		SELECT 1 FROM metas_mensuales mm WHERE mm.habito_id = h.id AND mm.mes = 1 AND mm.anio = 2025
	);

INSERT INTO metas_mensuales (habito_id, mes, anio, objetivo_dias_cumplidos, objetivo_valor_acumulado, fecha_creacion, fecha_modificacion)
SELECT h.id, 1, 2025, 26, NULL, TIMESTAMPTZ '2025-01-01 06:30:00+00', TIMESTAMPTZ '2025-01-03 06:30:00+00'
FROM habitos h
JOIN usuarios u ON u.id = h.usuario_id
WHERE u.email = 'bruno.pari@kumo.com'
	AND UPPER(h.nombre) = 'PLANIFICACION DIARIA'
	AND NOT EXISTS (
		SELECT 1 FROM metas_mensuales mm WHERE mm.habito_id = h.id AND mm.mes = 1 AND mm.anio = 2025
	);

INSERT INTO metas_mensuales (habito_id, mes, anio, objetivo_dias_cumplidos, objetivo_valor_acumulado, fecha_creacion, fecha_modificacion)
SELECT h.id, 1, 2025, NULL, 1800.0, TIMESTAMPTZ '2025-01-03 18:30:00+00', TIMESTAMPTZ '2025-01-06 18:30:00+00'
FROM habitos h
JOIN usuarios u ON u.id = h.usuario_id
WHERE u.email = 'diego.torres@kumo.com'
	AND UPPER(h.nombre) = 'CURSO INGLES'
	AND NOT EXISTS (
		SELECT 1 FROM metas_mensuales mm WHERE mm.habito_id = h.id AND mm.mes = 1 AND mm.anio = 2025
	);

INSERT INTO metas_mensuales (habito_id, mes, anio, objetivo_dias_cumplidos, objetivo_valor_acumulado, fecha_creacion, fecha_modificacion)
SELECT h.id, 1, 2025, 20, NULL, TIMESTAMPTZ '2025-01-02 21:00:00+00', TIMESTAMPTZ '2025-01-07 21:00:00+00'
FROM habitos h
JOIN usuarios u ON u.id = h.usuario_id
WHERE u.email = 'elena.ramos@kumo.com'
	AND UPPER(h.nombre) = 'DIARIO GRATITUD'
	AND NOT EXISTS (
		SELECT 1 FROM metas_mensuales mm WHERE mm.habito_id = h.id AND mm.mes = 1 AND mm.anio = 2025
	);

