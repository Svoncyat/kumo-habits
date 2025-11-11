-- Seed data required by the application startup.
-- Roles esenciales para Spring Security.
INSERT INTO roles (nombre) VALUES ('USUARIO')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO roles (nombre) VALUES ('ADMIN')
ON CONFLICT (nombre) DO NOTHING;
