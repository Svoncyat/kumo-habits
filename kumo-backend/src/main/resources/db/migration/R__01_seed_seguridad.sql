-- Datos semilla para el módulo de seguridad.
-- Todas las contraseñas corresponden al hash bcrypt de "demo123".

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
  ('Ana Lopez', 'https://cdn.kumo.dev/avatars/ana.png', 'ana.lopez@kumo.com', '$2a$10$.VTbUPug.CwBqEurWC/1GuCBAaZAK4ZBsbqwXFcWKpev31J/JvGQK', 'ACTIVO', CURRENT_TIMESTAMP - INTERVAL '90 days', CURRENT_TIMESTAMP - INTERVAL '2 days'),
    ('Bruno Pari', 'https://cdn.kumo.dev/avatars/bruno.png', 'bruno.pari@kumo.com', '$2a$10$.VTbUPug.CwBqEurWC/1GuCBAaZAK4ZBsbqwXFcWKpev31J/JvGQK', 'ACTIVO', CURRENT_TIMESTAMP - INTERVAL '75 days', CURRENT_TIMESTAMP - INTERVAL '3 days'),
    ('Carla Mendoza', 'https://cdn.kumo.dev/avatars/carla.png', 'carla.mendoza@kumo.com', '$2a$10$.VTbUPug.CwBqEurWC/1GuCBAaZAK4ZBsbqwXFcWKpev31J/JvGQK', 'PENDIENTE_VERIFICACION', CURRENT_TIMESTAMP - INTERVAL '20 days', NULL),
  ('Diego Torres', 'https://cdn.kumo.dev/avatars/diego.png', 'diego.torres@kumo.com', '$2a$10$.VTbUPug.CwBqEurWC/1GuCBAaZAK4ZBsbqwXFcWKpev31J/JvGQK', 'ACTIVO', CURRENT_TIMESTAMP - INTERVAL '60 days', CURRENT_TIMESTAMP - INTERVAL '1 day'),
  ('Elena Ramos', 'https://cdn.kumo.dev/avatars/elena.png', 'elena.ramos@kumo.com', '$2a$10$.VTbUPug.CwBqEurWC/1GuCBAaZAK4ZBsbqwXFcWKpev31J/JvGQK', 'BLOQUEADO', CURRENT_TIMESTAMP - INTERVAL '110 days', CURRENT_TIMESTAMP - INTERVAL '5 days'),
  ('Usuario Demo', NULL, 'test@kumo.com', '$2a$10$.VTbUPug.CwBqEurWC/1GuCBAaZAK4ZBsbqwXFcWKpev31J/JvGQK', 'ACTIVO', CURRENT_TIMESTAMP - INTERVAL '7 days', CURRENT_TIMESTAMP - INTERVAL '1 day')
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

INSERT INTO preferencias_usuario (usuario_id, zona_horaria, formato_fecha)
SELECT u.id, 'UTC', 'AAAA-MM-DD'
FROM usuarios u
WHERE u.email = 'test@kumo.com'
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

INSERT INTO usuario_roles (usuario_id, rol_id)
SELECT u.id, r.id
FROM usuarios u
JOIN roles r ON r.nombre = 'USUARIO'
WHERE u.email = 'test@kumo.com'
  AND NOT EXISTS (SELECT 1 FROM usuario_roles ur WHERE ur.usuario_id = u.id AND ur.rol_id = r.id);

-- Intentos de inicio de sesión recientes.
INSERT INTO intentos_login (email, ip_direccion, fecha_intento)
SELECT 'ana.lopez@kumo.com', '192.168.0.10', CURRENT_TIMESTAMP - INTERVAL '12 hours'
WHERE NOT EXISTS (
    SELECT 1 FROM intentos_login
    WHERE email = 'ana.lopez@kumo.com'
      AND fecha_intento = CURRENT_TIMESTAMP - INTERVAL '12 hours'
);

INSERT INTO intentos_login (email, ip_direccion, fecha_intento)
SELECT 'bruno.pari@kumo.com', '172.16.5.21', CURRENT_TIMESTAMP - INTERVAL '20 hours'
WHERE NOT EXISTS (
    SELECT 1 FROM intentos_login
    WHERE email = 'bruno.pari@kumo.com'
      AND fecha_intento = CURRENT_TIMESTAMP - INTERVAL '20 hours'
);

INSERT INTO intentos_login (email, ip_direccion, fecha_intento)
SELECT 'carla.mendoza@kumo.com', '10.0.0.52', CURRENT_TIMESTAMP - INTERVAL '1 day'
WHERE NOT EXISTS (
    SELECT 1 FROM intentos_login
    WHERE email = 'carla.mendoza@kumo.com'
      AND fecha_intento = CURRENT_TIMESTAMP - INTERVAL '1 day'
);

INSERT INTO intentos_login (email, ip_direccion, fecha_intento)
SELECT 'diego.torres@kumo.com', '192.168.3.11', CURRENT_TIMESTAMP - INTERVAL '2 days'
WHERE NOT EXISTS (
    SELECT 1 FROM intentos_login
    WHERE email = 'diego.torres@kumo.com'
      AND fecha_intento = CURRENT_TIMESTAMP - INTERVAL '2 days'
);

INSERT INTO intentos_login (email, ip_direccion, fecha_intento)
SELECT 'elena.ramos@kumo.com', '192.168.1.200', CURRENT_TIMESTAMP - INTERVAL '3 days'
WHERE NOT EXISTS (
    SELECT 1 FROM intentos_login
    WHERE email = 'elena.ramos@kumo.com'
      AND fecha_intento = CURRENT_TIMESTAMP - INTERVAL '3 days'
);

-- Tokens de recuperación de contraseña.
INSERT INTO tokens_recuperacion_clave (usuario_id, token_hash, fecha_expiracion, utilizado)
SELECT u.id, 'reset-ana-demo', CURRENT_TIMESTAMP + INTERVAL '2 days', FALSE
FROM usuarios u
WHERE u.email = 'ana.lopez@kumo.com'
  AND NOT EXISTS (SELECT 1 FROM tokens_recuperacion_clave t WHERE t.token_hash = 'reset-ana-demo');

INSERT INTO tokens_recuperacion_clave (usuario_id, token_hash, fecha_expiracion, utilizado)
SELECT u.id, 'reset-bruno-demo', CURRENT_TIMESTAMP + INTERVAL '1 day', TRUE
FROM usuarios u
WHERE u.email = 'bruno.pari@kumo.com'
  AND NOT EXISTS (SELECT 1 FROM tokens_recuperacion_clave t WHERE t.token_hash = 'reset-bruno-demo');

INSERT INTO tokens_recuperacion_clave (usuario_id, token_hash, fecha_expiracion, utilizado)
SELECT u.id, 'reset-carla-demo', CURRENT_TIMESTAMP + INTERVAL '3 days', FALSE
FROM usuarios u
WHERE u.email = 'carla.mendoza@kumo.com'
  AND NOT EXISTS (SELECT 1 FROM tokens_recuperacion_clave t WHERE t.token_hash = 'reset-carla-demo');

INSERT INTO tokens_recuperacion_clave (usuario_id, token_hash, fecha_expiracion, utilizado)
SELECT u.id, 'reset-diego-demo', CURRENT_TIMESTAMP + INTERVAL '4 days', FALSE
FROM usuarios u
WHERE u.email = 'diego.torres@kumo.com'
  AND NOT EXISTS (SELECT 1 FROM tokens_recuperacion_clave t WHERE t.token_hash = 'reset-diego-demo');

INSERT INTO tokens_recuperacion_clave (usuario_id, token_hash, fecha_expiracion, utilizado)
SELECT u.id, 'reset-elena-demo', CURRENT_TIMESTAMP - INTERVAL '1 day', TRUE
FROM usuarios u
WHERE u.email = 'elena.ramos@kumo.com'
  AND NOT EXISTS (SELECT 1 FROM tokens_recuperacion_clave t WHERE t.token_hash = 'reset-elena-demo');

-- Solicitudes de exportación.
INSERT INTO solicitudes_exportacion (usuario_id, estado, url_descarga, fecha_solicitud, fecha_finalizacion, fecha_expiracion_enlace)
SELECT u.id, 'COMPLETADA', 'https://cdn.kumo.dev/exports/ana-demo.zip', CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_TIMESTAMP - INTERVAL '5 days' + INTERVAL '5 minutes', CURRENT_TIMESTAMP + INTERVAL '2 days'
FROM usuarios u
WHERE u.email = 'ana.lopez@kumo.com'
  AND NOT EXISTS (
    SELECT 1 FROM solicitudes_exportacion se
    WHERE se.usuario_id = u.id AND se.fecha_solicitud = CURRENT_TIMESTAMP - INTERVAL '5 days'
  );

INSERT INTO solicitudes_exportacion (usuario_id, estado, url_descarga, fecha_solicitud, fecha_finalizacion, fecha_expiracion_enlace)
SELECT u.id, 'PROCESANDO', NULL, CURRENT_TIMESTAMP - INTERVAL '2 days', NULL, NULL
FROM usuarios u
WHERE u.email = 'bruno.pari@kumo.com'
  AND NOT EXISTS (
    SELECT 1 FROM solicitudes_exportacion se
    WHERE se.usuario_id = u.id AND se.fecha_solicitud = CURRENT_TIMESTAMP - INTERVAL '2 days'
  );

INSERT INTO solicitudes_exportacion (usuario_id, estado, url_descarga, fecha_solicitud, fecha_finalizacion, fecha_expiracion_enlace)
SELECT u.id, 'FALLIDA', NULL, CURRENT_TIMESTAMP - INTERVAL '7 days', CURRENT_TIMESTAMP - INTERVAL '7 days' + INTERVAL '5 minutes', NULL
FROM usuarios u
WHERE u.email = 'carla.mendoza@kumo.com'
  AND NOT EXISTS (
    SELECT 1 FROM solicitudes_exportacion se
    WHERE se.usuario_id = u.id AND se.fecha_solicitud = CURRENT_TIMESTAMP - INTERVAL '7 days'
  );

INSERT INTO solicitudes_exportacion (usuario_id, estado, url_descarga, fecha_solicitud, fecha_finalizacion, fecha_expiracion_enlace)
SELECT u.id, 'COMPLETADA', 'https://cdn.kumo.dev/exports/diego-demo.zip', CURRENT_TIMESTAMP - INTERVAL '9 days', CURRENT_TIMESTAMP - INTERVAL '9 days' + INTERVAL '6 minutes', CURRENT_TIMESTAMP - INTERVAL '2 days'
FROM usuarios u
WHERE u.email = 'diego.torres@kumo.com'
  AND NOT EXISTS (
    SELECT 1 FROM solicitudes_exportacion se
    WHERE se.usuario_id = u.id AND se.fecha_solicitud = CURRENT_TIMESTAMP - INTERVAL '9 days'
  );

INSERT INTO solicitudes_exportacion (usuario_id, estado, url_descarga, fecha_solicitud, fecha_finalizacion, fecha_expiracion_enlace)
SELECT u.id, 'PENDIENTE', NULL, CURRENT_TIMESTAMP - INTERVAL '12 hours', NULL, NULL
FROM usuarios u
WHERE u.email = 'elena.ramos@kumo.com'
  AND NOT EXISTS (
    SELECT 1 FROM solicitudes_exportacion se
    WHERE se.usuario_id = u.id AND se.fecha_solicitud = CURRENT_TIMESTAMP - INTERVAL '12 hours'
  );

-- Solicitudes de eliminación de cuenta.
INSERT INTO solicitudes_eliminacion (usuario_id, fecha_solicitud, fecha_ejecucion_programada)
SELECT u.id, CURRENT_TIMESTAMP - INTERVAL '4 days', CURRENT_TIMESTAMP + INTERVAL '10 days'
FROM usuarios u
WHERE u.email = 'carla.mendoza@kumo.com'
  AND NOT EXISTS (
    SELECT 1 FROM solicitudes_eliminacion se
    WHERE se.usuario_id = u.id AND se.fecha_solicitud = CURRENT_TIMESTAMP - INTERVAL '4 days'
  );

INSERT INTO solicitudes_eliminacion (usuario_id, fecha_solicitud, fecha_ejecucion_programada)
SELECT u.id, CURRENT_TIMESTAMP - INTERVAL '6 days', CURRENT_TIMESTAMP + INTERVAL '8 days'
FROM usuarios u
WHERE u.email = 'elena.ramos@kumo.com'
  AND NOT EXISTS (
    SELECT 1 FROM solicitudes_eliminacion se
    WHERE se.usuario_id = u.id AND se.fecha_solicitud = CURRENT_TIMESTAMP - INTERVAL '6 days'
  );

INSERT INTO solicitudes_eliminacion (usuario_id, fecha_solicitud, fecha_ejecucion_programada)
SELECT u.id, CURRENT_TIMESTAMP - INTERVAL '15 days', CURRENT_TIMESTAMP - INTERVAL '1 day'
FROM usuarios u
WHERE u.email = 'diego.torres@kumo.com'
  AND NOT EXISTS (
    SELECT 1 FROM solicitudes_eliminacion se
    WHERE se.usuario_id = u.id AND se.fecha_solicitud = CURRENT_TIMESTAMP - INTERVAL '15 days'
  );
