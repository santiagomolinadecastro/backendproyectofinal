USE virtualgym;

--Configuracion
--Tipos de actividad
INSERT INTO tipoActividad (id,descripcion)VALUES(1,'Caminar');
INSERT INTO tipoActividad (id,descripcion)VALUES(2,'Correr');

--Estados de maquina
INSERT INTO estadosMaquina (id, descripcion) VALUES ('1', 'OK');
INSERT INTO estadosMaquina (id, descripcion) VALUES ('2', 'Fuera de servicio');


--Datos prueba
--Gimnasios
INSERT INTO gimnasios (id, descripcion, direccion, telefono) VALUES ('3', 'IronWoman', 'Cordoba 1234', '1540916688');

--Maquinas
INSERT INTO maquinas (id, gimnasioId, modelo, estadoId) VALUES ('1', '1', 'Cinta de correr', '1');

--Usuarios
INSERT INTO usuarios (altura, peso, sexo, edad, foto, email, password, deviceId) VALUES ('170','60','M',20,'foto','juani@gmail.com','juani','1');
INSERT INTO usuarios (altura, peso, sexo, edad, foto, email, password, deviceId) VALUES ('175','65','F',25,'foto','guille@gmail.com','guille','1');
INSERT INTO usuarios (altura, peso, sexo, edad, foto, email, password, deviceId) VALUES ('180','70','M',30,'foto','santi@gmail.com','santi','1');
INSERT INTO usuarios (altura, peso, sexo, edad, foto, email, password, deviceId) VALUES ('185','75','F',35,'foto','nico@gmail.com','nico','1');

--Actividades
INSERT INTO actividades (id, userId, tipo, velocidad, fechaInicio, fechaFin, tipoAcitivdadId, maquinaId) VALUES ('1', '1', '1', '20', '2018-09-01 10:00:00', '2018-09-01 10:20:00', '1', '1');
INSERT INTO actividades (id, userId, tipo, velocidad, fechaInicio, fechaFin, tipoAcitivdadId, maquinaId) VALUES ('2', '2', '2', '20', '2018-09-01 11:00:00', '2018-09-01 11:30:00', '2', '1');
