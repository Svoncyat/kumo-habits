-- Datos semilla para el módulo de notificaciones.

-- Recordatorios configurados por hábito.
INSERT INTO recordatorios (habito_id, hora_recordatorio, mensaje, esta_activo, fecha_creacion, fecha_modificacion)
SELECT h.id, TIME '07:00:00', 'Respira profundo y prepara tu meditacion.', TRUE, CURRENT_TIMESTAMP - INTERVAL '15 days', CURRENT_TIMESTAMP - INTERVAL '1 day'
FROM habitos h
JOIN usuarios u ON u.id = h.usuario_id
WHERE u.email = 'ana.lopez@kumo.com'
	AND UPPER(h.nombre) = 'MEDITACION MATUTINA'
	AND NOT EXISTS (
		SELECT 1 FROM recordatorios r WHERE r.habito_id = h.id AND r.hora_recordatorio = TIME '07:00:00'
	);

INSERT INTO recordatorios (habito_id, hora_recordatorio, mensaje, esta_activo, fecha_creacion, fecha_modificacion)
SELECT h.id, TIME '20:30:00', 'Hora de tu caminata relajante.', TRUE, CURRENT_TIMESTAMP - INTERVAL '12 days', CURRENT_TIMESTAMP - INTERVAL '2 days'
FROM habitos h
JOIN usuarios u ON u.id = h.usuario_id
WHERE u.email = 'ana.lopez@kumo.com'
	AND UPPER(h.nombre) = 'CAMINATA NOCTURNA'
	AND NOT EXISTS (
		SELECT 1 FROM recordatorios r WHERE r.habito_id = h.id AND r.hora_recordatorio = TIME '20:30:00'
	);

INSERT INTO recordatorios (habito_id, hora_recordatorio, mensaje, esta_activo, fecha_creacion, fecha_modificacion)
SELECT h.id, TIME '06:00:00', 'Revisa tu agenda y planifica el dia.', TRUE, CURRENT_TIMESTAMP - INTERVAL '20 days', CURRENT_TIMESTAMP - INTERVAL '5 days'
FROM habitos h
JOIN usuarios u ON u.id = h.usuario_id
WHERE u.email = 'bruno.pari@kumo.com'
	AND UPPER(h.nombre) = 'PLANIFICACION DIARIA'
	AND NOT EXISTS (
		SELECT 1 FROM recordatorios r WHERE r.habito_id = h.id AND r.hora_recordatorio = TIME '06:00:00'
	);

INSERT INTO recordatorios (habito_id, hora_recordatorio, mensaje, esta_activo, fecha_creacion, fecha_modificacion)
SELECT h.id, TIME '19:30:00', 'Avanza una leccion de ingles.', TRUE, CURRENT_TIMESTAMP - INTERVAL '18 days', CURRENT_TIMESTAMP - INTERVAL '3 days'
FROM habitos h
JOIN usuarios u ON u.id = h.usuario_id
WHERE u.email = 'diego.torres@kumo.com'
	AND UPPER(h.nombre) = 'CURSO INGLES'
	AND NOT EXISTS (
		SELECT 1 FROM recordatorios r WHERE r.habito_id = h.id AND r.hora_recordatorio = TIME '19:30:00'
	);

INSERT INTO recordatorios (habito_id, hora_recordatorio, mensaje, esta_activo, fecha_creacion, fecha_modificacion)
SELECT h.id, TIME '21:30:00', 'Registra tres motivos de gratitud.', TRUE, CURRENT_TIMESTAMP - INTERVAL '10 days', CURRENT_TIMESTAMP - INTERVAL '2 days'
FROM habitos h
JOIN usuarios u ON u.id = h.usuario_id
WHERE u.email = 'elena.ramos@kumo.com'
	AND UPPER(h.nombre) = 'DIARIO GRATITUD'
	AND NOT EXISTS (
		SELECT 1 FROM recordatorios r WHERE r.habito_id = h.id AND r.hora_recordatorio = TIME '21:30:00'
	);

-- Dias configurados para los recordatorios.
INSERT INTO recordatorio_dias (recordatorio_id, dia)
SELECT r.id, 'LUNES'
FROM recordatorios r
JOIN habitos h ON h.id = r.habito_id
JOIN usuarios u ON u.id = h.usuario_id
WHERE u.email = 'ana.lopez@kumo.com'
	AND UPPER(h.nombre) = 'MEDITACION MATUTINA'
	AND r.hora_recordatorio = TIME '07:00:00'
	AND NOT EXISTS (
		SELECT 1 FROM recordatorio_dias rd WHERE rd.recordatorio_id = r.id AND rd.dia = 'LUNES'
	);

INSERT INTO recordatorio_dias (recordatorio_id, dia)
SELECT r.id, 'MARTES'
FROM recordatorios r
JOIN habitos h ON h.id = r.habito_id
JOIN usuarios u ON u.id = h.usuario_id
WHERE u.email = 'ana.lopez@kumo.com'
	AND UPPER(h.nombre) = 'CAMINATA NOCTURNA'
	AND r.hora_recordatorio = TIME '20:30:00'
	AND NOT EXISTS (
		SELECT 1 FROM recordatorio_dias rd WHERE rd.recordatorio_id = r.id AND rd.dia = 'MARTES'
	);

INSERT INTO recordatorio_dias (recordatorio_id, dia)
SELECT r.id, 'MIERCOLES'
FROM recordatorios r
JOIN habitos h ON h.id = r.habito_id
JOIN usuarios u ON u.id = h.usuario_id
WHERE u.email = 'bruno.pari@kumo.com'
	AND UPPER(h.nombre) = 'PLANIFICACION DIARIA'
	AND r.hora_recordatorio = TIME '06:00:00'
	AND NOT EXISTS (
		SELECT 1 FROM recordatorio_dias rd WHERE rd.recordatorio_id = r.id AND rd.dia = 'MIERCOLES'
	);

INSERT INTO recordatorio_dias (recordatorio_id, dia)
SELECT r.id, 'JUEVES'
FROM recordatorios r
JOIN habitos h ON h.id = r.habito_id
JOIN usuarios u ON u.id = h.usuario_id
WHERE u.email = 'diego.torres@kumo.com'
	AND UPPER(h.nombre) = 'CURSO INGLES'
	AND r.hora_recordatorio = TIME '19:30:00'
	AND NOT EXISTS (
		SELECT 1 FROM recordatorio_dias rd WHERE rd.recordatorio_id = r.id AND rd.dia = 'JUEVES'
	);

INSERT INTO recordatorio_dias (recordatorio_id, dia)
SELECT r.id, 'VIERNES'
FROM recordatorios r
JOIN habitos h ON h.id = r.habito_id
JOIN usuarios u ON u.id = h.usuario_id
WHERE u.email = 'elena.ramos@kumo.com'
	AND UPPER(h.nombre) = 'DIARIO GRATITUD'
	AND r.hora_recordatorio = TIME '21:30:00'
	AND NOT EXISTS (
		SELECT 1 FROM recordatorio_dias rd WHERE rd.recordatorio_id = r.id AND rd.dia = 'VIERNES'
	);

-- Historial de disparo de recordatorios.
INSERT INTO registros_notificaciones (recordatorio_id, usuario_id, fecha_disparo, estado)
SELECT r.id, h.usuario_id, TIMESTAMPTZ '2025-01-05 07:00:00+00', 'ENVIADO'
FROM recordatorios r
JOIN habitos h ON h.id = r.habito_id
JOIN usuarios u ON u.id = h.usuario_id
WHERE u.email = 'ana.lopez@kumo.com'
	AND UPPER(h.nombre) = 'MEDITACION MATUTINA'
	AND r.hora_recordatorio = TIME '07:00:00'
	AND NOT EXISTS (
		SELECT 1 FROM registros_notificaciones rn
		WHERE rn.recordatorio_id = r.id AND rn.fecha_disparo = TIMESTAMPTZ '2025-01-05 07:00:00+00'
	);

INSERT INTO registros_notificaciones (recordatorio_id, usuario_id, fecha_disparo, estado)
SELECT r.id, h.usuario_id, TIMESTAMPTZ '2025-01-04 20:30:00+00', 'ENVIADO'
FROM recordatorios r
JOIN habitos h ON h.id = r.habito_id
JOIN usuarios u ON u.id = h.usuario_id
WHERE u.email = 'ana.lopez@kumo.com'
	AND UPPER(h.nombre) = 'CAMINATA NOCTURNA'
	AND r.hora_recordatorio = TIME '20:30:00'
	AND NOT EXISTS (
		SELECT 1 FROM registros_notificaciones rn
		WHERE rn.recordatorio_id = r.id AND rn.fecha_disparo = TIMESTAMPTZ '2025-01-04 20:30:00+00'
	);

INSERT INTO registros_notificaciones (recordatorio_id, usuario_id, fecha_disparo, estado)
SELECT r.id, h.usuario_id, TIMESTAMPTZ '2025-01-03 06:00:00+00', 'ENVIADO'
FROM recordatorios r
JOIN habitos h ON h.id = r.habito_id
JOIN usuarios u ON u.id = h.usuario_id
WHERE u.email = 'bruno.pari@kumo.com'
	AND UPPER(h.nombre) = 'PLANIFICACION DIARIA'
	AND r.hora_recordatorio = TIME '06:00:00'
	AND NOT EXISTS (
		SELECT 1 FROM registros_notificaciones rn
		WHERE rn.recordatorio_id = r.id AND rn.fecha_disparo = TIMESTAMPTZ '2025-01-03 06:00:00+00'
	);

INSERT INTO registros_notificaciones (recordatorio_id, usuario_id, fecha_disparo, estado)
SELECT r.id, h.usuario_id, TIMESTAMPTZ '2025-01-06 19:30:00+00', 'FALLIDO'
FROM recordatorios r
JOIN habitos h ON h.id = r.habito_id
JOIN usuarios u ON u.id = h.usuario_id
WHERE u.email = 'diego.torres@kumo.com'
	AND UPPER(h.nombre) = 'CURSO INGLES'
	AND r.hora_recordatorio = TIME '19:30:00'
	AND NOT EXISTS (
		SELECT 1 FROM registros_notificaciones rn
		WHERE rn.recordatorio_id = r.id AND rn.fecha_disparo = TIMESTAMPTZ '2025-01-06 19:30:00+00'
	);

INSERT INTO registros_notificaciones (recordatorio_id, usuario_id, fecha_disparo, estado)
SELECT r.id, h.usuario_id, TIMESTAMPTZ '2025-01-02 21:30:00+00', 'ENVIADO'
FROM recordatorios r
JOIN habitos h ON h.id = r.habito_id
JOIN usuarios u ON u.id = h.usuario_id
WHERE u.email = 'elena.ramos@kumo.com'
	AND UPPER(h.nombre) = 'DIARIO GRATITUD'
	AND r.hora_recordatorio = TIME '21:30:00'
	AND NOT EXISTS (
		SELECT 1 FROM registros_notificaciones rn
		WHERE rn.recordatorio_id = r.id AND rn.fecha_disparo = TIMESTAMPTZ '2025-01-02 21:30:00+00'
	);

