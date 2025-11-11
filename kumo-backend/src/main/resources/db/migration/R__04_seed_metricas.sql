-- Datos semilla para el módulo de métricas.
-- Nota: No se insertan registros en habito_metricas_calculadas para permitir que la lógica de la aplicación genere las métricas.

-- Metas mensuales planificadas.
INSERT INTO metas_mensuales (habito_id, mes, anio, objetivo_dias_cumplidos, objetivo_valor_acumulado, fecha_creacion, fecha_modificacion)
SELECT h.id,
			 EXTRACT(MONTH FROM CURRENT_DATE)::SMALLINT,
			 EXTRACT(YEAR FROM CURRENT_DATE)::SMALLINT,
			 25,
			 NULL,
			 CURRENT_TIMESTAMP - INTERVAL '9 days',
			 CURRENT_TIMESTAMP - INTERVAL '5 days'
FROM habitos h
JOIN usuarios u ON u.id = h.usuario_id
WHERE u.email = 'ana.lopez@kumo.com'
	AND UPPER(h.nombre) = 'MEDITACION MATUTINA'
	AND NOT EXISTS (
		SELECT 1 FROM metas_mensuales mm WHERE mm.habito_id = h.id AND mm.mes = 1 AND mm.anio = 2025
	);

INSERT INTO metas_mensuales (habito_id, mes, anio, objetivo_dias_cumplidos, objetivo_valor_acumulado, fecha_creacion, fecha_modificacion)
SELECT h.id,
	   EXTRACT(MONTH FROM CURRENT_DATE)::SMALLINT,
	   EXTRACT(YEAR FROM CURRENT_DATE)::SMALLINT,
	   18,
	   90.0,
	   CURRENT_TIMESTAMP - INTERVAL '8 days',
	   CURRENT_TIMESTAMP - INTERVAL '4 days'
FROM habitos h
JOIN usuarios u ON u.id = h.usuario_id
WHERE u.email = 'ana.lopez@kumo.com'
	AND UPPER(h.nombre) = 'CAMINATA NOCTURNA'
	AND NOT EXISTS (
		SELECT 1 FROM metas_mensuales mm WHERE mm.habito_id = h.id AND mm.mes = 1 AND mm.anio = 2025
	);

INSERT INTO metas_mensuales (habito_id, mes, anio, objetivo_dias_cumplidos, objetivo_valor_acumulado, fecha_creacion, fecha_modificacion)
SELECT h.id,
	   EXTRACT(MONTH FROM CURRENT_DATE)::SMALLINT,
	   EXTRACT(YEAR FROM CURRENT_DATE)::SMALLINT,
	   26,
	   NULL,
	   CURRENT_TIMESTAMP - INTERVAL '10 days',
	   CURRENT_TIMESTAMP - INTERVAL '6 days'
FROM habitos h
JOIN usuarios u ON u.id = h.usuario_id
WHERE u.email = 'bruno.pari@kumo.com'
	AND UPPER(h.nombre) = 'PLANIFICACION DIARIA'
	AND NOT EXISTS (
		SELECT 1 FROM metas_mensuales mm WHERE mm.habito_id = h.id AND mm.mes = 1 AND mm.anio = 2025
	);

INSERT INTO metas_mensuales (habito_id, mes, anio, objetivo_dias_cumplidos, objetivo_valor_acumulado, fecha_creacion, fecha_modificacion)
SELECT h.id,
	   EXTRACT(MONTH FROM CURRENT_DATE)::SMALLINT,
	   EXTRACT(YEAR FROM CURRENT_DATE)::SMALLINT,
	   NULL,
	   1800.0,
	   CURRENT_TIMESTAMP - INTERVAL '7 days',
	   CURRENT_TIMESTAMP - INTERVAL '3 days'
FROM habitos h
JOIN usuarios u ON u.id = h.usuario_id
WHERE u.email = 'diego.torres@kumo.com'
	AND UPPER(h.nombre) = 'CURSO INGLES'
	AND NOT EXISTS (
		SELECT 1 FROM metas_mensuales mm WHERE mm.habito_id = h.id AND mm.mes = 1 AND mm.anio = 2025
	);

INSERT INTO metas_mensuales (habito_id, mes, anio, objetivo_dias_cumplidos, objetivo_valor_acumulado, fecha_creacion, fecha_modificacion)
SELECT h.id,
	   EXTRACT(MONTH FROM CURRENT_DATE)::SMALLINT,
	   EXTRACT(YEAR FROM CURRENT_DATE)::SMALLINT,
	   20,
	   NULL,
	   CURRENT_TIMESTAMP - INTERVAL '6 days',
	   CURRENT_TIMESTAMP - INTERVAL '2 days'
FROM habitos h
JOIN usuarios u ON u.id = h.usuario_id
WHERE u.email = 'elena.ramos@kumo.com'
	AND UPPER(h.nombre) = 'DIARIO GRATITUD'
	AND NOT EXISTS (
		SELECT 1 FROM metas_mensuales mm WHERE mm.habito_id = h.id AND mm.mes = 1 AND mm.anio = 2025
	);

