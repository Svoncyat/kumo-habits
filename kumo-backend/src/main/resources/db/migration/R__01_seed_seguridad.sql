-- Datos semilla para el módulo de seguridad.

-- Roles base requeridos por Spring Security.
INSERT INTO roles (nombre) VALUES
		('USUARIO'),
		('ADMIN'),
		('ANALISTA'),
		('MENTOR'),
		('SOPORTE')
ON CONFLICT (nombre) DO NOTHING;

-- Usuarios iniciales del sistema.
INSERT INTO usuarios (nombre, avatar_url, email, clave_hash, estado, fecha_creacion, fecha_modificacion)
VALUES
		('Ana Lopez', 'https://cdn.kumo.dev/avatars/ana.png', 'ana.lopez@kumo.com', 'hashed_password_ana', 'ACTIVO', CURRENT_TIMESTAMP - INTERVAL '90 days', CURRENT_TIMESTAMP - INTERVAL '2 days'),
		('Bruno Pari', 'https://cdn.kumo.dev/avatars/bruno.png', 'bruno.pari@kumo.com', 'hashed_password_bruno', 'ACTIVO', CURRENT_TIMESTAMP - INTERVAL '75 days', CURRENT_TIMESTAMP - INTERVAL '3 days'),
		('Carla Mendoza', 'https://cdn.kumo.dev/avatars/carla.png', 'carla.mendoza@kumo.com', 'hashed_password_carla', 'PENDIENTE_VERIFICACION', CURRENT_TIMESTAMP - INTERVAL '20 days', NULL),
		('Diego Torres', 'https://cdn.kumo.dev/avatars/diego.png', 'diego.torres@kumo.com', 'hashed_password_diego', 'ACTIVO', CURRENT_TIMESTAMP - INTERVAL '60 days', CURRENT_TIMESTAMP - INTERVAL '1 day'),
		('Elena Ramos', 'https://cdn.kumo.dev/avatars/elena.png', 'elena.ramos@kumo.com', 'hashed_password_elena', 'BLOQUEADO', CURRENT_TIMESTAMP - INTERVAL '110 days', CURRENT_TIMESTAMP - INTERVAL '5 days')
ON CONFLICT (email) DO NOTHING;

-- Preferencias de usuario (1:1 con usuarios).
INSERT INTO preferencias_usuario (usuario_id, zona_horaria, formato_fecha)
SELECT u.id, 'America/Lima', 'DD/MM/AAAA'
FROM usuarios u
WHERE u.email = 'ana.lopez@kumo.com'
	AND NOT EXISTS (SELECT 1 FROM preferencias_usuario p WHERE p.usuario_id = u.id);

INSERT INTO preferencias_usuario (usuario_id, zona_horaria, formato_fecha)
SELECT u.id, 'America/Bogota', 'DD/MM/AAAA'
FROM usuarios u
WHERE u.email = 'bruno.pari@kumo.com'
	AND NOT EXISTS (SELECT 1 FROM preferencias_usuario p WHERE p.usuario_id = u.id);

INSERT INTO preferencias_usuario (usuario_id, zona_horaria, formato_fecha)
SELECT u.id, 'America/Santiago', 'AAAA-MM-DD'
FROM usuarios u
WHERE u.email = 'carla.mendoza@kumo.com'
	AND NOT EXISTS (SELECT 1 FROM preferencias_usuario p WHERE p.usuario_id = u.id);

INSERT INTO preferencias_usuario (usuario_id, zona_horaria, formato_fecha)
SELECT u.id, 'America/Mexico_City', 'MM/DD/AAAA'
FROM usuarios u
WHERE u.email = 'diego.torres@kumo.com'
	AND NOT EXISTS (SELECT 1 FROM preferencias_usuario p WHERE p.usuario_id = u.id);

INSERT INTO preferencias_usuario (usuario_id, zona_horaria, formato_fecha)
SELECT u.id, 'America/Lima', 'DD/MM/AAAA'
FROM usuarios u
WHERE u.email = 'elena.ramos@kumo.com'
	AND NOT EXISTS (SELECT 1 FROM preferencias_usuario p WHERE p.usuario_id = u.id);

-- Relación usuario-rol.
INSERT INTO usuario_roles (usuario_id, rol_id)
SELECT u.id, r.id
FROM usuarios u
JOIN roles r ON r.nombre = 'ADMIN'
WHERE u.email = 'ana.lopez@kumo.com'
	AND NOT EXISTS (SELECT 1 FROM usuario_roles ur WHERE ur.usuario_id = u.id AND ur.rol_id = r.id);

INSERT INTO usuario_roles (usuario_id, rol_id)
SELECT u.id, r.id
FROM usuarios u
JOIN roles r ON r.nombre = 'USUARIO'
WHERE u.email = 'ana.lopez@kumo.com'
	AND NOT EXISTS (SELECT 1 FROM usuario_roles ur WHERE ur.usuario_id = u.id AND ur.rol_id = r.id);

INSERT INTO usuario_roles (usuario_id, rol_id)
SELECT u.id, r.id
FROM usuarios u
JOIN roles r ON r.nombre = 'USUARIO'
WHERE u.email = 'bruno.pari@kumo.com'
	AND NOT EXISTS (SELECT 1 FROM usuario_roles ur WHERE ur.usuario_id = u.id AND ur.rol_id = r.id);

INSERT INTO usuario_roles (usuario_id, rol_id)
SELECT u.id, r.id
FROM usuarios u
JOIN roles r ON r.nombre = 'USUARIO'
WHERE u.email = 'carla.mendoza@kumo.com'
	AND NOT EXISTS (SELECT 1 FROM usuario_roles ur WHERE ur.usuario_id = u.id AND ur.rol_id = r.id);

INSERT INTO usuario_roles (usuario_id, rol_id)
SELECT u.id, r.id
FROM usuarios u
JOIN roles r ON r.nombre = 'ANALISTA'
WHERE u.email = 'diego.torres@kumo.com'
	AND NOT EXISTS (SELECT 1 FROM usuario_roles ur WHERE ur.usuario_id = u.id AND ur.rol_id = r.id);

INSERT INTO usuario_roles (usuario_id, rol_id)
SELECT u.id, r.id
FROM usuarios u
JOIN roles r ON r.nombre = 'USUARIO'
WHERE u.email = 'diego.torres@kumo.com'
	AND NOT EXISTS (SELECT 1 FROM usuario_roles ur WHERE ur.usuario_id = u.id AND ur.rol_id = r.id);

INSERT INTO usuario_roles (usuario_id, rol_id)
SELECT u.id, r.id
FROM usuarios u
JOIN roles r ON r.nombre = 'USUARIO'
WHERE u.email = 'elena.ramos@kumo.com'
	AND NOT EXISTS (SELECT 1 FROM usuario_roles ur WHERE ur.usuario_id = u.id AND ur.rol_id = r.id);

INSERT INTO usuario_roles (usuario_id, rol_id)
SELECT u.id, r.id
FROM usuarios u
JOIN roles r ON r.nombre = 'SOPORTE'
WHERE u.email = 'elena.ramos@kumo.com'
	AND NOT EXISTS (SELECT 1 FROM usuario_roles ur WHERE ur.usuario_id = u.id AND ur.rol_id = r.id);

-- Intentos de inicio de sesión recientes.
INSERT INTO intentos_login (email, ip_direccion, fecha_intento)
SELECT 'ana.lopez@kumo.com', '192.168.0.10', TIMESTAMPTZ '2025-01-10 08:15:00+00'
WHERE NOT EXISTS (
		SELECT 1 FROM intentos_login
		WHERE email = 'ana.lopez@kumo.com'
			AND fecha_intento = TIMESTAMPTZ '2025-01-10 08:15:00+00'
);

INSERT INTO intentos_login (email, ip_direccion, fecha_intento)
SELECT 'bruno.pari@kumo.com', '172.16.5.21', TIMESTAMPTZ '2025-01-09 07:45:00+00'
WHERE NOT EXISTS (
		SELECT 1 FROM intentos_login
		WHERE email = 'bruno.pari@kumo.com'
			AND fecha_intento = TIMESTAMPTZ '2025-01-09 07:45:00+00'
);

INSERT INTO intentos_login (email, ip_direccion, fecha_intento)
SELECT 'carla.mendoza@kumo.com', '10.0.0.52', TIMESTAMPTZ '2025-01-08 22:10:00+00'
WHERE NOT EXISTS (
		SELECT 1 FROM intentos_login
		WHERE email = 'carla.mendoza@kumo.com'
			AND fecha_intento = TIMESTAMPTZ '2025-01-08 22:10:00+00'
);

INSERT INTO intentos_login (email, ip_direccion, fecha_intento)
SELECT 'diego.torres@kumo.com', '192.168.3.11', TIMESTAMPTZ '2025-01-07 06:35:00+00'
WHERE NOT EXISTS (
		SELECT 1 FROM intentos_login
		WHERE email = 'diego.torres@kumo.com'
			AND fecha_intento = TIMESTAMPTZ '2025-01-07 06:35:00+00'
);

INSERT INTO intentos_login (email, ip_direccion, fecha_intento)
SELECT 'elena.ramos@kumo.com', '192.168.1.200', TIMESTAMPTZ '2025-01-06 14:20:00+00'
WHERE NOT EXISTS (
		SELECT 1 FROM intentos_login
		WHERE email = 'elena.ramos@kumo.com'
			AND fecha_intento = TIMESTAMPTZ '2025-01-06 14:20:00+00'
);

-- Tokens de recuperación de contraseña.
INSERT INTO tokens_recuperacion_clave (usuario_id, token_hash, fecha_expiracion, utilizado)
SELECT u.id, 'reset-ana-202501', TIMESTAMPTZ '2025-01-15 12:00:00+00', FALSE
FROM usuarios u
WHERE u.email = 'ana.lopez@kumo.com'
	AND NOT EXISTS (SELECT 1 FROM tokens_recuperacion_clave t WHERE t.token_hash = 'reset-ana-202501');

INSERT INTO tokens_recuperacion_clave (usuario_id, token_hash, fecha_expiracion, utilizado)
SELECT u.id, 'reset-bruno-202501', TIMESTAMPTZ '2025-01-12 09:00:00+00', TRUE
FROM usuarios u
WHERE u.email = 'bruno.pari@kumo.com'
	AND NOT EXISTS (SELECT 1 FROM tokens_recuperacion_clave t WHERE t.token_hash = 'reset-bruno-202501');

INSERT INTO tokens_recuperacion_clave (usuario_id, token_hash, fecha_expiracion, utilizado)
SELECT u.id, 'reset-carla-202501', TIMESTAMPTZ '2025-01-18 15:00:00+00', FALSE
FROM usuarios u
WHERE u.email = 'carla.mendoza@kumo.com'
	AND NOT EXISTS (SELECT 1 FROM tokens_recuperacion_clave t WHERE t.token_hash = 'reset-carla-202501');

INSERT INTO tokens_recuperacion_clave (usuario_id, token_hash, fecha_expiracion, utilizado)
SELECT u.id, 'reset-diego-202501', TIMESTAMPTZ '2025-01-20 10:30:00+00', FALSE
FROM usuarios u
WHERE u.email = 'diego.torres@kumo.com'
	AND NOT EXISTS (SELECT 1 FROM tokens_recuperacion_clave t WHERE t.token_hash = 'reset-diego-202501');

INSERT INTO tokens_recuperacion_clave (usuario_id, token_hash, fecha_expiracion, utilizado)
SELECT u.id, 'reset-elena-202501', TIMESTAMPTZ '2025-01-05 05:30:00+00', TRUE
FROM usuarios u
WHERE u.email = 'elena.ramos@kumo.com'
	AND NOT EXISTS (SELECT 1 FROM tokens_recuperacion_clave t WHERE t.token_hash = 'reset-elena-202501');

-- Solicitudes de exportación.
INSERT INTO solicitudes_exportacion (usuario_id, estado, url_descarga, fecha_solicitud, fecha_finalizacion, fecha_expiracion_enlace)
SELECT u.id, 'COMPLETADA', 'https://cdn.kumo.dev/exports/ana-202501.zip', TIMESTAMPTZ '2025-01-04 09:00:00+00', TIMESTAMPTZ '2025-01-04 09:05:00+00', TIMESTAMPTZ '2025-01-11 09:05:00+00'
FROM usuarios u
WHERE u.email = 'ana.lopez@kumo.com'
	AND NOT EXISTS (
		SELECT 1 FROM solicitudes_exportacion se
		WHERE se.usuario_id = u.id AND se.fecha_solicitud = TIMESTAMPTZ '2025-01-04 09:00:00+00'
	);

INSERT INTO solicitudes_exportacion (usuario_id, estado, url_descarga, fecha_solicitud, fecha_finalizacion, fecha_expiracion_enlace)
SELECT u.id, 'PROCESANDO', NULL, TIMESTAMPTZ '2025-01-09 08:30:00+00', NULL, NULL
FROM usuarios u
WHERE u.email = 'bruno.pari@kumo.com'
	AND NOT EXISTS (
		SELECT 1 FROM solicitudes_exportacion se
		WHERE se.usuario_id = u.id AND se.fecha_solicitud = TIMESTAMPTZ '2025-01-09 08:30:00+00'
	);

INSERT INTO solicitudes_exportacion (usuario_id, estado, url_descarga, fecha_solicitud, fecha_finalizacion, fecha_expiracion_enlace)
SELECT u.id, 'FALLIDA', NULL, TIMESTAMPTZ '2025-01-05 13:15:00+00', TIMESTAMPTZ '2025-01-05 13:20:00+00', NULL
FROM usuarios u
WHERE u.email = 'carla.mendoza@kumo.com'
	AND NOT EXISTS (
		SELECT 1 FROM solicitudes_exportacion se
		WHERE se.usuario_id = u.id AND se.fecha_solicitud = TIMESTAMPTZ '2025-01-05 13:15:00+00'
	);

INSERT INTO solicitudes_exportacion (usuario_id, estado, url_descarga, fecha_solicitud, fecha_finalizacion, fecha_expiracion_enlace)
SELECT u.id, 'COMPLETADA', 'https://cdn.kumo.dev/exports/diego-202412.zip', TIMESTAMPTZ '2024-12-28 10:00:00+00', TIMESTAMPTZ '2024-12-28 10:06:00+00', TIMESTAMPTZ '2025-01-04 10:06:00+00'
FROM usuarios u
WHERE u.email = 'diego.torres@kumo.com'
	AND NOT EXISTS (
		SELECT 1 FROM solicitudes_exportacion se
		WHERE se.usuario_id = u.id AND se.fecha_solicitud = TIMESTAMPTZ '2024-12-28 10:00:00+00'
	);

INSERT INTO solicitudes_exportacion (usuario_id, estado, url_descarga, fecha_solicitud, fecha_finalizacion, fecha_expiracion_enlace)
SELECT u.id, 'PENDIENTE', NULL, TIMESTAMPTZ '2025-01-11 16:40:00+00', NULL, NULL
FROM usuarios u
WHERE u.email = 'elena.ramos@kumo.com'
	AND NOT EXISTS (
		SELECT 1 FROM solicitudes_exportacion se
		WHERE se.usuario_id = u.id AND se.fecha_solicitud = TIMESTAMPTZ '2025-01-11 16:40:00+00'
	);

-- Solicitudes de eliminación de cuenta.
INSERT INTO solicitudes_eliminacion (usuario_id, fecha_solicitud, fecha_ejecucion_programada)
SELECT u.id, TIMESTAMPTZ '2025-01-03 18:00:00+00', TIMESTAMPTZ '2025-01-17 18:00:00+00'
FROM usuarios u
WHERE u.email = 'carla.mendoza@kumo.com'
	AND NOT EXISTS (
		SELECT 1 FROM solicitudes_eliminacion se
		WHERE se.usuario_id = u.id AND se.fecha_solicitud = TIMESTAMPTZ '2025-01-03 18:00:00+00'
	);

INSERT INTO solicitudes_eliminacion (usuario_id, fecha_solicitud, fecha_ejecucion_programada)
SELECT u.id, TIMESTAMPTZ '2025-01-08 20:20:00+00', TIMESTAMPTZ '2025-01-22 20:20:00+00'
FROM usuarios u
WHERE u.email = 'elena.ramos@kumo.com'
	AND NOT EXISTS (
		SELECT 1 FROM solicitudes_eliminacion se
		WHERE se.usuario_id = u.id AND se.fecha_solicitud = TIMESTAMPTZ '2025-01-08 20:20:00+00'
	);

INSERT INTO solicitudes_eliminacion (usuario_id, fecha_solicitud, fecha_ejecucion_programada)
SELECT u.id, TIMESTAMPTZ '2024-12-30 11:00:00+00', TIMESTAMPTZ '2025-01-13 11:00:00+00'
FROM usuarios u
WHERE u.email = 'diego.torres@kumo.com'
	AND NOT EXISTS (
		SELECT 1 FROM solicitudes_eliminacion se
		WHERE se.usuario_id = u.id AND se.fecha_solicitud = TIMESTAMPTZ '2024-12-30 11:00:00+00'
	);

