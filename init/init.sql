-- Eliminar la base de datos si existe, para un inicio limpio en Docker
DROP DATABASE IF EXISTS dbporteria;

-- Crear la base de datos
CREATE DATABASE dbporteria;

-- Usar la base de datos
USE dbporteria;

-- =======================================================
-- 1. Catálogos
-- =======================================================

CREATE TABLE `tipos_identificacion` (
    `id_tipo_identificacion` INT AUTO_INCREMENT PRIMARY KEY,
    `descripcion` VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE `areas` (
    `id_area` INT AUTO_INCREMENT PRIMARY KEY,
    `nombre_area` VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE `tipos_paquetes` (
    `id_tipo_paquete` INT AUTO_INCREMENT PRIMARY KEY,
    `descripcion` VARCHAR(120) NOT NULL
);

-- =======================================================
-- 2. Usuarios y Autenticación
-- =======================================================

CREATE TABLE `usuarios` (
    `id_usuario` INT PRIMARY KEY AUTO_INCREMENT,
    `nombre` VARCHAR(80) NOT NULL,
    `apellido` VARCHAR(80) NOT NULL,
    `correo` VARCHAR(255) NOT NULL UNIQUE,
    `contrasena_hash` VARCHAR(255) NULL,
    `id_oauth` VARCHAR(255) UNIQUE NULL,
    `proveedor_oauth` ENUM('google', 'microsoft') NULL,
    `rol` ENUM('admin', 'portero') NOT NULL,
    `ultimo_login` TIMESTAMP NULL,
    `fecha_creacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `fecha_actualizacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `activo` boolean default false
);

CREATE TABLE refresh_tokens (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL, 
    token VARCHAR(255) UNIQUE NOT NULL,
    expira_en TIMESTAMP NOT NULL,
    revocado TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

-- =======================================================
-- 3. Logs y Visitas
-- =======================================================

CREATE TABLE `visitas` (
    `id_visita` INT AUTO_INCREMENT PRIMARY KEY,
    `nombre_visitante` VARCHAR(100) NOT NULL,
    `telefono` varchar(20) not null,
    `identificacion` VARCHAR(20) NOT NULL,
    `id_tipo_identificacion` INT NOT NULL,
    `empresa` VARCHAR(100) NULL,
    `nombre_destinatario` VARCHAR(100) NOT NULL,
    `id_area` INT NOT NULL,
    `fecha_entrada` TIMESTAMP NOT NULL,
    `fecha_salida` TIMESTAMP NULL,
    `estado` BOOLEAN NOT NULL DEFAULT TRUE,
    `motivo` text not null,
    `observaciones` TEXT NULL,
    `id_usuario_entrada` INT,
    `id_usuario_salida` INT NULL,
    `path_firma` varchar(255) not null,
    FOREIGN KEY (`id_usuario_entrada`) REFERENCES `usuarios`(`id_usuario`),
    FOREIGN KEY (`id_usuario_salida`) REFERENCES `usuarios`(`id_usuario`),
    FOREIGN KEY (`id_area`) REFERENCES `areas`(`id_area`),
    FOREIGN KEY (`id_tipo_identificacion`) REFERENCES `tipos_identificacion`(`id_tipo_identificacion`)
);

CREATE TABLE `paquetes` (
    `id_paquete` INT AUTO_INCREMENT PRIMARY KEY,
    `id_tipo_paquete` INT NOT NULL,
    `tipo_operacion` ENUM('enviar', 'recibir') NOT NULL,
    `guia` varchar(50) null,
    `nombre_destinatario` VARCHAR(100) null,
    `id_area` INT NULL,
    `nombre_remitente` varchar(100) null,
    `destino_salida` VARCHAR(100) NULL,
    `empresa_transporte` VARCHAR(100) NULL,
    `mensajero_nombre` varchar(255) null,
    `fecha_recibido` TIMESTAMP NULL,
    `fecha_envio` TIMESTAMP NULL,
    `observaciones` TEXT NULL,
    `id_usuario_recibir` INT NULL,
    `id_usuario_enviar` INT NULL,
    FOREIGN KEY (`id_tipo_paquete`) REFERENCES `tipos_paquetes`(`id_tipo_paquete`),
    FOREIGN KEY (`id_usuario_recibir`) REFERENCES `usuarios`(`id_usuario`),
    FOREIGN KEY (`id_usuario_enviar`) REFERENCES `usuarios`(`id_usuario`),
    FOREIGN KEY (`id_area`) REFERENCES `areas`(`id_area`)
);

CREATE TABLE `logs` (
    `id_log` INT AUTO_INCREMENT PRIMARY KEY,
    `id_usuario` INT NULL,
    `accion` VARCHAR(255) NOT NULL,
    `fecha_log` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `descripcion` TEXT NULL,
    `ip_usuario` VARCHAR(39) NOT NULL
);

-- =======================================================
-- 4. Datos Iniciales (SEED)
-- =======================================================
INSERT INTO `tipos_identificacion` (`descripcion`) VALUES 
('Cédula de Ciudadanía'), 
('Tarjeta de Identidad'), 
('Cédula de Extranjería'),
('Pasaporte');

INSERT INTO `areas` (`nombre_area`) VALUES 
('Administración'), 
('Recursos Humanos'), 
('IT'),
('Ventas');

INSERT INTO `tipos_paquetes` (`descripcion`) VALUES 
('Documentos'), 
('Caja Pequeña'), 
('Caja Mediana'),
('Caja Grande');

-- Contraseña: 'password123' (hash generado con bcrypt para un ejemplo, tú debes usar el hash real)
INSERT INTO `usuarios` (`nombre`, `apellido`, `correo`, `contrasena_hash`, `rol`, `activo`) VALUES 
('Admin', 'Porteria', 'admin@porteria.com', '$2b$10$wE9s/7G0x4E7s5qF.iE9G.mE5F.L7V2L5E.K.S4G.L6S.G.S5S.V4I.Q5U.W8A.', 'admin', true),
('Juan', 'Portero', 'juan@porteria.com', '$2b$10$wE9s/7G0x4E7s5qF.iE9G.mE5F.L7V2L5E.K.S4G.L6S.G.S5S.V4I.Q5U.W8A.', 'portero', true);
