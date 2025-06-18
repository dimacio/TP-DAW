CREATE DATABASE IF NOT EXISTS smart_home;

USE smart_home;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Estructura para la tabla `Devices`
--
DROP TABLE IF EXISTS `Devices`;
CREATE TABLE `Devices` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_id` varchar(128) NOT NULL UNIQUE,
  `ubicacion` varchar(128) NOT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT 0,
  `nivel` int(3) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Datos de ejemplo para `Devices`
--

INSERT INTO `Devices` (`nombre_id`, `ubicacion`, `estado`, `nivel`) VALUES
('lampara-living-1', 'Living Room', 1, 80),
('ventilador-techo-dormitorio', 'Dormitorio Principal', 1, 50),
('calefactor-bano', 'Baño', 0, 100);

COMMIT;