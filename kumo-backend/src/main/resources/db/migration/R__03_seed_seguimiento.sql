-- Datos semilla para el módulo de seguimiento.

-- Registros diarios de ejemplo.
INSERT INTO registros_diarios (habito_id, fecha_registro, valor_registrado, esta_cumplido, fecha_creacion, fecha_ultima_modificacion)
SELECT h.id, DATE '2025-01-05', 1.0, TRUE, TIMESTAMPTZ '2025-01-05 07:05:00+00', TIMESTAMPTZ '2025-01-05 07:10:00+00'
FROM habitos h
JOIN usuarios u ON u.id = h.usuario_id
WHERE u.email = 'ana.lopez@kumo.com'
	AND UPPER(h.nombre) = 'MEDITACION MATUTINA'
	AND NOT EXISTS (
		SELECT 1 FROM registros_diarios rd WHERE rd.habito_id = h.id AND rd.fecha_registro = DATE '2025-01-05'
	);

INSERT INTO registros_diarios (habito_id, fecha_registro, valor_registrado, esta_cumplido, fecha_creacion, fecha_ultima_modificacion)
SELECT h.id, DATE '2025-01-04', 3.0, TRUE, TIMESTAMPTZ '2025-01-04 21:30:00+00', TIMESTAMPTZ '2025-01-04 21:45:00+00'
FROM habitos h
JOIN usuarios u ON u.id = h.usuario_id
WHERE u.email = 'ana.lopez@kumo.com'
	AND UPPER(h.nombre) = 'CAMINATA NOCTURNA'
	AND NOT EXISTS (
		SELECT 1 FROM registros_diarios rd WHERE rd.habito_id = h.id AND rd.fecha_registro = DATE '2025-01-04'
	);

INSERT INTO registros_diarios (habito_id, fecha_registro, valor_registrado, esta_cumplido, fecha_creacion, fecha_ultima_modificacion)
SELECT h.id, DATE '2025-01-03', 1.0, TRUE, TIMESTAMPTZ '2025-01-03 06:45:00+00', TIMESTAMPTZ '2025-01-03 06:50:00+00'
FROM habitos h
JOIN usuarios u ON u.id = h.usuario_id
WHERE u.email = 'bruno.pari@kumo.com'
	AND UPPER(h.nombre) = 'PLANIFICACION DIARIA'
	AND NOT EXISTS (
		SELECT 1 FROM registros_diarios rd WHERE rd.habito_id = h.id AND rd.fecha_registro = DATE '2025-01-03'
	);

INSERT INTO registros_diarios (habito_id, fecha_registro, valor_registrado, esta_cumplido, fecha_creacion, fecha_ultima_modificacion)
SELECT h.id, DATE '2025-01-06', 45.0, TRUE, TIMESTAMPTZ '2025-01-06 19:00:00+00', TIMESTAMPTZ '2025-01-06 19:05:00+00'
FROM habitos h
JOIN usuarios u ON u.id = h.usuario_id
WHERE u.email = 'diego.torres@kumo.com'
	AND UPPER(h.nombre) = 'CURSO INGLES'
	AND NOT EXISTS (
		SELECT 1 FROM registros_diarios rd WHERE rd.habito_id = h.id AND rd.fecha_registro = DATE '2025-01-06'
	);

INSERT INTO registros_diarios (habito_id, fecha_registro, valor_registrado, esta_cumplido, fecha_creacion, fecha_ultima_modificacion)
SELECT h.id, DATE '2025-01-02', 1.0, TRUE, TIMESTAMPTZ '2025-01-02 22:10:00+00', TIMESTAMPTZ '2025-01-02 22:12:00+00'
FROM habitos h
JOIN usuarios u ON u.id = h.usuario_id
WHERE u.email = 'elena.ramos@kumo.com'
	AND UPPER(h.nombre) = 'DIARIO GRATITUD'
	AND NOT EXISTS (
		SELECT 1 FROM registros_diarios rd WHERE rd.habito_id = h.id AND rd.fecha_registro = DATE '2025-01-02'
	);

-- Auditoría de cambios en registros diarios.
INSERT INTO registros_diarios_auditoria (tipo_operacion, registro_id, habito_id, usuario_modificador_id, fecha_registro_auditada, valor_anterior, esta_cumplido_anterior, valor_nuevo, esta_cumplido_nuevo, fecha_operacion)
SELECT 'MODIFICACION', rd.id, rd.habito_id, u.id, rd.fecha_registro, 0.5, FALSE, 1.0, TRUE, TIMESTAMPTZ '2025-01-05 07:12:00+00'
FROM registros_diarios rd
JOIN habitos h ON h.id = rd.habito_id
JOIN usuarios u ON u.email = 'ana.lopez@kumo.com'
WHERE UPPER(h.nombre) = 'MEDITACION MATUTINA'
	AND rd.fecha_registro = DATE '2025-01-05'
	AND NOT EXISTS (
		SELECT 1 FROM registros_diarios_auditoria rda
		WHERE rda.registro_id = rd.id AND rda.tipo_operacion = 'MODIFICACION'
	);

INSERT INTO registros_diarios_auditoria (tipo_operacion, registro_id, habito_id, usuario_modificador_id, fecha_registro_auditada, valor_anterior, esta_cumplido_anterior, valor_nuevo, esta_cumplido_nuevo, fecha_operacion)
SELECT 'INSERCION', rd.id, rd.habito_id, u.id, rd.fecha_registro, NULL, NULL, rd.valor_registrado, rd.esta_cumplido, TIMESTAMPTZ '2025-01-03 06:51:00+00'
FROM registros_diarios rd
JOIN habitos h ON h.id = rd.habito_id
JOIN usuarios u ON u.email = 'bruno.pari@kumo.com'
WHERE UPPER(h.nombre) = 'PLANIFICACION DIARIA'
	AND rd.fecha_registro = DATE '2025-01-03'
	AND NOT EXISTS (
		SELECT 1 FROM registros_diarios_auditoria rda
		WHERE rda.registro_id = rd.id AND rda.tipo_operacion = 'INSERCION'
	);

INSERT INTO registros_diarios_auditoria (tipo_operacion, registro_id, habito_id, usuario_modificador_id, fecha_registro_auditada, valor_anterior, esta_cumplido_anterior, valor_nuevo, esta_cumplido_nuevo, fecha_operacion)
SELECT 'MODIFICACION', rd.id, rd.habito_id, u.id, rd.fecha_registro, 30.0, TRUE, 45.0, TRUE, TIMESTAMPTZ '2025-01-06 19:10:00+00'
FROM registros_diarios rd
JOIN habitos h ON h.id = rd.habito_id
JOIN usuarios u ON u.email = 'diego.torres@kumo.com'
WHERE UPPER(h.nombre) = 'CURSO INGLES'
	AND rd.fecha_registro = DATE '2025-01-06'
	AND NOT EXISTS (
		SELECT 1 FROM registros_diarios_auditoria rda
		WHERE rda.registro_id = rd.id AND rda.tipo_operacion = 'MODIFICACION'
	);

INSERT INTO registros_diarios_auditoria (tipo_operacion, registro_id, habito_id, usuario_modificador_id, fecha_registro_auditada, valor_anterior, esta_cumplido_anterior, valor_nuevo, esta_cumplido_nuevo, fecha_operacion)
SELECT 'INSERCION', rd.id, rd.habito_id, u.id, rd.fecha_registro, NULL, NULL, rd.valor_registrado, rd.esta_cumplido, TIMESTAMPTZ '2025-01-04 21:46:00+00'
FROM registros_diarios rd
JOIN habitos h ON h.id = rd.habito_id
JOIN usuarios u ON u.email = 'ana.lopez@kumo.com'
WHERE UPPER(h.nombre) = 'CAMINATA NOCTURNA'
	AND rd.fecha_registro = DATE '2025-01-04'
	AND NOT EXISTS (
		SELECT 1 FROM registros_diarios_auditoria rda
		WHERE rda.registro_id = rd.id AND rda.tipo_operacion = 'INSERCION'
	);

INSERT INTO registros_diarios_auditoria (tipo_operacion, registro_id, habito_id, usuario_modificador_id, fecha_registro_auditada, valor_anterior, esta_cumplido_anterior, valor_nuevo, esta_cumplido_nuevo, fecha_operacion)
SELECT 'ELIMINACION', NULL, h.id, u.id, DATE '2024-12-29', 2.0, TRUE, NULL, NULL, TIMESTAMPTZ '2024-12-29 22:00:00+00'
FROM habitos h
JOIN usuarios u ON u.email = 'elena.ramos@kumo.com'
WHERE UPPER(h.nombre) = 'DIARIO GRATITUD'
	AND NOT EXISTS (
		SELECT 1 FROM registros_diarios_auditoria rda
		WHERE rda.habito_id = h.id AND rda.tipo_operacion = 'ELIMINACION' AND rda.fecha_registro_auditada = DATE '2024-12-29'
	);

