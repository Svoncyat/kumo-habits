-- Datos semilla para el módulo de seguimiento.

-- Registros diarios de ejemplo.
INSERT INTO registros_diarios (habito_id, fecha_registro, valor_registrado, esta_cumplido, fecha_creacion, fecha_ultima_modificacion)
SELECT h.id, CURRENT_DATE - INTERVAL '2 days', 1.0, TRUE, CURRENT_TIMESTAMP - INTERVAL '2 days' + INTERVAL '7 hours', CURRENT_TIMESTAMP - INTERVAL '2 days' + INTERVAL '7 hours 5 minutes'
FROM habitos h
JOIN usuarios u ON u.id = h.usuario_id
WHERE u.email = 'ana.lopez@kumo.com'
	AND UPPER(h.nombre) = 'MEDITACION MATUTINA'
		AND NOT EXISTS (
			SELECT 1 FROM registros_diarios rd WHERE rd.habito_id = h.id AND rd.fecha_registro = CURRENT_DATE - INTERVAL '2 days'
		);

INSERT INTO registros_diarios (habito_id, fecha_registro, valor_registrado, esta_cumplido, fecha_creacion, fecha_ultima_modificacion)
SELECT h.id, CURRENT_DATE - INTERVAL '3 days', 3.0, TRUE, CURRENT_TIMESTAMP - INTERVAL '3 days' + INTERVAL '21 hours 30 minutes', CURRENT_TIMESTAMP - INTERVAL '3 days' + INTERVAL '21 hours 45 minutes'
FROM habitos h
JOIN usuarios u ON u.id = h.usuario_id
WHERE u.email = 'ana.lopez@kumo.com'
	AND UPPER(h.nombre) = 'CAMINATA NOCTURNA'
		AND NOT EXISTS (
			SELECT 1 FROM registros_diarios rd WHERE rd.habito_id = h.id AND rd.fecha_registro = CURRENT_DATE - INTERVAL '3 days'
		);

INSERT INTO registros_diarios (habito_id, fecha_registro, valor_registrado, esta_cumplido, fecha_creacion, fecha_ultima_modificacion)
SELECT h.id, CURRENT_DATE - INTERVAL '4 days', 1.0, TRUE, CURRENT_TIMESTAMP - INTERVAL '4 days' + INTERVAL '6 hours 45 minutes', CURRENT_TIMESTAMP - INTERVAL '4 days' + INTERVAL '6 hours 50 minutes'
FROM habitos h
JOIN usuarios u ON u.id = h.usuario_id
WHERE u.email = 'bruno.pari@kumo.com'
	AND UPPER(h.nombre) = 'PLANIFICACION DIARIA'
		AND NOT EXISTS (
			SELECT 1 FROM registros_diarios rd WHERE rd.habito_id = h.id AND rd.fecha_registro = CURRENT_DATE - INTERVAL '4 days'
		);

INSERT INTO registros_diarios (habito_id, fecha_registro, valor_registrado, esta_cumplido, fecha_creacion, fecha_ultima_modificacion)
SELECT h.id, CURRENT_DATE - INTERVAL '1 day', 45.0, TRUE, CURRENT_TIMESTAMP - INTERVAL '1 day' + INTERVAL '19 hours', CURRENT_TIMESTAMP - INTERVAL '1 day' + INTERVAL '19 hours 5 minutes'
FROM habitos h
JOIN usuarios u ON u.id = h.usuario_id
WHERE u.email = 'diego.torres@kumo.com'
	AND UPPER(h.nombre) = 'CURSO INGLES'
		AND NOT EXISTS (
			SELECT 1 FROM registros_diarios rd WHERE rd.habito_id = h.id AND rd.fecha_registro = CURRENT_DATE - INTERVAL '1 day'
		);

INSERT INTO registros_diarios (habito_id, fecha_registro, valor_registrado, esta_cumplido, fecha_creacion, fecha_ultima_modificacion)
SELECT h.id, CURRENT_DATE - INTERVAL '5 days', 1.0, TRUE, CURRENT_TIMESTAMP - INTERVAL '5 days' + INTERVAL '22 hours 10 minutes', CURRENT_TIMESTAMP - INTERVAL '5 days' + INTERVAL '22 hours 12 minutes'
FROM habitos h
JOIN usuarios u ON u.id = h.usuario_id
WHERE u.email = 'elena.ramos@kumo.com'
	AND UPPER(h.nombre) = 'DIARIO GRATITUD'
		AND NOT EXISTS (
			SELECT 1 FROM registros_diarios rd WHERE rd.habito_id = h.id AND rd.fecha_registro = CURRENT_DATE - INTERVAL '5 days'
		);

-- Auditoría de cambios en registros diarios.
INSERT INTO registros_diarios_auditoria (tipo_operacion, registro_id, habito_id, usuario_modificador_id, fecha_registro_auditada, valor_anterior, esta_cumplido_anterior, valor_nuevo, esta_cumplido_nuevo, fecha_operacion)
SELECT 'MODIFICACION', rd.id, rd.habito_id, u.id, rd.fecha_registro, 0.5, FALSE, 1.0, TRUE, CURRENT_TIMESTAMP - INTERVAL '2 days' + INTERVAL '7 hours 12 minutes'
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
SELECT 'INSERCION', rd.id, rd.habito_id, u.id, rd.fecha_registro, NULL, NULL, rd.valor_registrado, rd.esta_cumplido, CURRENT_TIMESTAMP - INTERVAL '4 days' + INTERVAL '6 hours 51 minutes'
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
SELECT 'MODIFICACION', rd.id, rd.habito_id, u.id, rd.fecha_registro, 30.0, TRUE, 45.0, TRUE, CURRENT_TIMESTAMP - INTERVAL '1 day' + INTERVAL '19 hours 10 minutes'
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
SELECT 'INSERCION', rd.id, rd.habito_id, u.id, rd.fecha_registro, NULL, NULL, rd.valor_registrado, rd.esta_cumplido, CURRENT_TIMESTAMP - INTERVAL '3 days' + INTERVAL '21 hours 46 minutes'
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
SELECT 'ELIMINACION', NULL, h.id, u.id, CURRENT_DATE - INTERVAL '10 days', 2.0, TRUE, NULL, NULL, CURRENT_TIMESTAMP - INTERVAL '10 days' + INTERVAL '22 hours'
FROM habitos h
JOIN usuarios u ON u.email = 'elena.ramos@kumo.com'
WHERE UPPER(h.nombre) = 'DIARIO GRATITUD'
		AND NOT EXISTS (
			SELECT 1 FROM registros_diarios_auditoria rda
			WHERE rda.habito_id = h.id AND rda.tipo_operacion = 'ELIMINACION' AND rda.fecha_registro_auditada = CURRENT_DATE - INTERVAL '10 days'
		);

