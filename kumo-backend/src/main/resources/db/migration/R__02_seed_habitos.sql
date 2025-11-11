-- Datos semilla para el módulo de definición de hábitos.

-- Categorías personalizadas por usuario.
INSERT INTO categorias (usuario_id, nombre, color_hex)
SELECT u.id, 'Mindfulness', '#8BC34A'
FROM usuarios u
WHERE u.email = 'ana.lopez@kumo.com'
	AND NOT EXISTS (
		SELECT 1 FROM categorias c WHERE c.usuario_id = u.id AND UPPER(c.nombre) = 'MINDFULNESS'
	);

INSERT INTO categorias (usuario_id, nombre, color_hex)
SELECT u.id, 'Salud', '#FF7043'
FROM usuarios u
WHERE u.email = 'ana.lopez@kumo.com'
	AND NOT EXISTS (
		SELECT 1 FROM categorias c WHERE c.usuario_id = u.id AND UPPER(c.nombre) = 'SALUD'
	);

INSERT INTO categorias (usuario_id, nombre, color_hex)
SELECT u.id, 'Productividad', '#42A5F5'
FROM usuarios u
WHERE u.email = 'bruno.pari@kumo.com'
	AND NOT EXISTS (
		SELECT 1 FROM categorias c WHERE c.usuario_id = u.id AND UPPER(c.nombre) = 'PRODUCTIVIDAD'
	);

INSERT INTO categorias (usuario_id, nombre, color_hex)
SELECT u.id, 'Aprendizaje', '#AB47BC'
FROM usuarios u
WHERE u.email = 'diego.torres@kumo.com'
	AND NOT EXISTS (
		SELECT 1 FROM categorias c WHERE c.usuario_id = u.id AND UPPER(c.nombre) = 'APRENDIZAJE'
	);

INSERT INTO categorias (usuario_id, nombre, color_hex)
SELECT u.id, 'Bienestar', '#FDD835'
FROM usuarios u
WHERE u.email = 'elena.ramos@kumo.com'
	AND NOT EXISTS (
		SELECT 1 FROM categorias c WHERE c.usuario_id = u.id AND UPPER(c.nombre) = 'BIENESTAR'
	);

-- Hábitos iniciales creados por los usuarios.
INSERT INTO habitos (usuario_id, nombre, meta_diaria, esta_archivado, fecha_creacion, fecha_modificacion)
SELECT u.id, 'Meditacion Matutina', 1.0, FALSE, CURRENT_TIMESTAMP - INTERVAL '45 days', CURRENT_TIMESTAMP - INTERVAL '1 day'
FROM usuarios u
WHERE u.email = 'ana.lopez@kumo.com'
	AND NOT EXISTS (
		SELECT 1 FROM habitos h WHERE h.usuario_id = u.id AND UPPER(h.nombre) = 'MEDITACION MATUTINA'
	);

INSERT INTO habitos (usuario_id, nombre, meta_diaria, esta_archivado, fecha_creacion, fecha_modificacion)
SELECT u.id, 'Caminata Nocturna', 3.0, FALSE, CURRENT_TIMESTAMP - INTERVAL '30 days', CURRENT_TIMESTAMP - INTERVAL '3 days'
FROM usuarios u
WHERE u.email = 'ana.lopez@kumo.com'
	AND NOT EXISTS (
		SELECT 1 FROM habitos h WHERE h.usuario_id = u.id AND UPPER(h.nombre) = 'CAMINATA NOCTURNA'
	);

INSERT INTO habitos (usuario_id, nombre, meta_diaria, esta_archivado, fecha_creacion, fecha_modificacion)
SELECT u.id, 'Planificacion Diaria', 1.0, FALSE, CURRENT_TIMESTAMP - INTERVAL '60 days', CURRENT_TIMESTAMP - INTERVAL '2 days'
FROM usuarios u
WHERE u.email = 'bruno.pari@kumo.com'
	AND NOT EXISTS (
		SELECT 1 FROM habitos h WHERE h.usuario_id = u.id AND UPPER(h.nombre) = 'PLANIFICACION DIARIA'
	);

INSERT INTO habitos (usuario_id, nombre, meta_diaria, esta_archivado, fecha_creacion, fecha_modificacion)
SELECT u.id, 'Curso Ingles', 45.0, FALSE, CURRENT_TIMESTAMP - INTERVAL '50 days', CURRENT_TIMESTAMP - INTERVAL '5 days'
FROM usuarios u
WHERE u.email = 'diego.torres@kumo.com'
	AND NOT EXISTS (
		SELECT 1 FROM habitos h WHERE h.usuario_id = u.id AND UPPER(h.nombre) = 'CURSO INGLES'
	);

INSERT INTO habitos (usuario_id, nombre, meta_diaria, esta_archivado, fecha_creacion, fecha_modificacion)
SELECT u.id, 'Diario Gratitud', NULL, FALSE, CURRENT_TIMESTAMP - INTERVAL '25 days', CURRENT_TIMESTAMP - INTERVAL '4 days'
FROM usuarios u
WHERE u.email = 'elena.ramos@kumo.com'
	AND NOT EXISTS (
		SELECT 1 FROM habitos h WHERE h.usuario_id = u.id AND UPPER(h.nombre) = 'DIARIO GRATITUD'
	);

-- Asociación entre hábitos y categorías.
INSERT INTO habito_categorias (habito_id, categoria_id)
SELECT h.id, c.id
FROM habitos h
JOIN usuarios u ON u.id = h.usuario_id
JOIN categorias c ON c.usuario_id = u.id AND UPPER(c.nombre) = 'MINDFULNESS'
WHERE u.email = 'ana.lopez@kumo.com'
	AND UPPER(h.nombre) = 'MEDITACION MATUTINA'
	AND NOT EXISTS (
		SELECT 1 FROM habito_categorias hc WHERE hc.habito_id = h.id AND hc.categoria_id = c.id
	);

INSERT INTO habito_categorias (habito_id, categoria_id)
SELECT h.id, c.id
FROM habitos h
JOIN usuarios u ON u.id = h.usuario_id
JOIN categorias c ON c.usuario_id = u.id AND UPPER(c.nombre) = 'SALUD'
WHERE u.email = 'ana.lopez@kumo.com'
	AND UPPER(h.nombre) = 'MEDITACION MATUTINA'
	AND NOT EXISTS (
		SELECT 1 FROM habito_categorias hc WHERE hc.habito_id = h.id AND hc.categoria_id = c.id
	);

INSERT INTO habito_categorias (habito_id, categoria_id)
SELECT h.id, c.id
FROM habitos h
JOIN usuarios u ON u.id = h.usuario_id
JOIN categorias c ON c.usuario_id = u.id AND UPPER(c.nombre) = 'SALUD'
WHERE u.email = 'ana.lopez@kumo.com'
	AND UPPER(h.nombre) = 'CAMINATA NOCTURNA'
	AND NOT EXISTS (
		SELECT 1 FROM habito_categorias hc WHERE hc.habito_id = h.id AND hc.categoria_id = c.id
	);

INSERT INTO habito_categorias (habito_id, categoria_id)
SELECT h.id, c.id
FROM habitos h
JOIN usuarios u ON u.id = h.usuario_id
JOIN categorias c ON c.usuario_id = u.id AND UPPER(c.nombre) = 'PRODUCTIVIDAD'
WHERE u.email = 'bruno.pari@kumo.com'
	AND UPPER(h.nombre) = 'PLANIFICACION DIARIA'
	AND NOT EXISTS (
		SELECT 1 FROM habito_categorias hc WHERE hc.habito_id = h.id AND hc.categoria_id = c.id
	);

INSERT INTO habito_categorias (habito_id, categoria_id)
SELECT h.id, c.id
FROM habitos h
JOIN usuarios u ON u.id = h.usuario_id
JOIN categorias c ON c.usuario_id = u.id AND UPPER(c.nombre) = 'APRENDIZAJE'
WHERE u.email = 'diego.torres@kumo.com'
	AND UPPER(h.nombre) = 'CURSO INGLES'
	AND NOT EXISTS (
		SELECT 1 FROM habito_categorias hc WHERE hc.habito_id = h.id AND hc.categoria_id = c.id
	);

INSERT INTO habito_categorias (habito_id, categoria_id)
SELECT h.id, c.id
FROM habitos h
JOIN usuarios u ON u.id = h.usuario_id
JOIN categorias c ON c.usuario_id = u.id AND UPPER(c.nombre) = 'BIENESTAR'
WHERE u.email = 'elena.ramos@kumo.com'
	AND UPPER(h.nombre) = 'DIARIO GRATITUD'
	AND NOT EXISTS (
		SELECT 1 FROM habito_categorias hc WHERE hc.habito_id = h.id AND hc.categoria_id = c.id
	);

