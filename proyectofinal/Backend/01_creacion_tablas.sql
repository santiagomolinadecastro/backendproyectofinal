--Creacion tabla caloriasReferencias
CREATE TABLE `caloriasReferencias` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `kmhora` int(11) DEFAULT NULL,
  `peso` int(11) DEFAULT NULL,
  `sexo` varchar(45) COLLATE latin1_spanish_ci DEFAULT NULL,
  `tiempo` int(11) DEFAULT NULL,
  `caloriasQuemadas` int(11) DEFAULT NULL,
  `altura` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci;

--Creacion tabla estadosMaquina
CREATE TABLE `estadosMaquina` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(45) COLLATE latin1_spanish_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci;

--Creacion tabla gimnasios
CREATE TABLE `gimnasios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(45) COLLATE latin1_spanish_ci DEFAULT NULL,
  `direccion` varchar(45) COLLATE latin1_spanish_ci DEFAULT NULL,
  `telefono` varchar(45) COLLATE latin1_spanish_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci;

--Creacion tabla IMCReferencias
CREATE TABLE `IMCReferencias` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `imc` varchar(45) COLLATE latin1_spanish_ci DEFAULT NULL,
  `condicion` varchar(45) COLLATE latin1_spanish_ci DEFAULT NULL,
  `descripcion` varchar(45) COLLATE latin1_spanish_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci;

--Creacion tabla tipoActividad
CREATE TABLE `tipoActividad` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(45) COLLATE latin1_spanish_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci;

--Creacion tabla tensorTrain
CREATE TABLE `tensorTrain` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `altura` int(11) DEFAULT NULL,
  `peso` int(11) DEFAULT NULL,
  `edad` int(11) DEFAULT NULL,
  `sexo` varchar(1) COLLATE latin1_spanish_ci DEFAULT NULL,
  `tiempo` int(11) DEFAULT NULL,
  `tipoActividadId` int(11) DEFAULT NULL,
  `gramosQuemados` int(11) DEFAULT NULL,
  `caloriasQuemadas` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci;

--Creacion tabla usuarios
CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `altura` int(11) DEFAULT NULL,
  `peso` int(11) DEFAULT NULL,
  `sexo` varchar(45) COLLATE latin1_spanish_ci DEFAULT NULL,
  `edad` int(11) DEFAULT NULL,
  `foto` mediumblob,
  `email` varchar(45) COLLATE latin1_spanish_ci DEFAULT NULL,
  `password` varchar(45) COLLATE latin1_spanish_ci DEFAULT NULL,
  `deviceId` int(11) DEFAULT NULL,
  `gimnasioId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_gim_id_idx` (`gimnasioId`),
  CONSTRAINT `fk_gim_id` FOREIGN KEY (`gimnasioId`) REFERENCES `gimnasios` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci;



--Creacion tabla historial
CREATE TABLE `historial` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userID` int(11) DEFAULT NULL,
  `altura` int(11) DEFAULT NULL,
  `peso` int(11) DEFAULT NULL,
  `sexo` varchar(45) COLLATE latin1_spanish_ci DEFAULT NULL,
  `edad` int(11) DEFAULT NULL,
  `foto` blob,
  `fecha` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_userid_idx` (`userID`),
  CONSTRAINT `fk_user_id` FOREIGN KEY (`userID`) REFERENCES `usuarios` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci;

--Creacion tabla maquinas
CREATE TABLE `maquinas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `gimnasioId` int(11) NOT NULL,
  `modelo` varchar(45) COLLATE latin1_spanish_ci DEFAULT NULL,
  `estadoId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_gimnasioid_idx` (`gimnasioId`),
  KEY `fk_estadoid_idx` (`estadoId`),
  CONSTRAINT `fk_estadoid` FOREIGN KEY (`estadoId`) REFERENCES `estadosMaquina` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_gimnasioid` FOREIGN KEY (`gimnasioId`) REFERENCES `gimnasios` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci;


--Creacion tabla actividades
CREATE TABLE `actividades` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `tipo` varchar(45) COLLATE latin1_spanish_ci DEFAULT NULL,
  `velocidad` int(11) DEFAULT NULL,
  `fechaInicio` datetime DEFAULT NULL,
  `fechaFin` datetime NOT NULL,
  `tipoActividadId` int(11) NOT NULL,
  `maquinaId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_userid_idx` (`userId`),
  KEY `fk_tipoactividad_idx` (`tipoAcitivdadId`),
  KEY `fk_maquinaid_idx` (`maquinaId`),
  CONSTRAINT `fk_maquinaid` FOREIGN KEY (`maquinaId`) REFERENCES `maquinas` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_tipoactividad` FOREIGN KEY (`tipoAcitivdadId`) REFERENCES `tipoActividad` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_userid` FOREIGN KEY (`userId`) REFERENCES `usuarios` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci;