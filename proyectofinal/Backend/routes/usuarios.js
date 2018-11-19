var express = require('express');
var router = express.Router();
var config = require('../config');
var tensor = require('../tensor/module');

var con_mysql = config.con.virtualgym;

//Get de todos los usuarios... no debería usarse
router.get('/', function (req, res, next) {
    try {
        var queryString = `SELECT id,userName,altura,peso,sexo,edad,foto, email,deviceId, (peso / (altura * altura))*10000 as imc FROM usuarios`;


        con_mysql.query(queryString, function (err, rows, fields) {
            if (err)
                res.status(500).send(err);
            else
                res.status(200).json(rows);

        });
    }
    catch (err) {
        res.status(500).send("Error al conectar: " + err);
    }
});

//Get de los usuarios de un gym
router.get('/gimnasio/:idGimnasio', function (req, res, next) {
    try {
        var idGimnasio = req.params.idGimnasio;
        var queryString = `SELECT id,userName,altura,peso,sexo,edad,foto,email,deviceId, (peso / (altura * altura))*10000 as imc FROM usuarios WHERE idGimnasio = ${idGimnasio}`;


        con_mysql.query(queryString, function (err, rows, fields) {
            if (err)
                res.status(500).send(err);
            else
                res.status(200).json(rows);

        });
    }
    catch (err) {
        res.status(500).send("Error al conectar: " + err);
    }
});

//Login
router.get('/email/:email/password/:password', function (req, res, next) {
    try {
        var email = req.params.email;
        var password = req.params.password;

        var queryString = `SELECT id,userName,altura,peso,sexo,edad,foto,email,deviceId, (peso / (altura * altura))*10000 as imc FROM usuarios where email = '${email}' AND password = '${password}'`;


        con_mysql.query(queryString, function (err, rows, fields) {
            if (err)
                res.status(500).send(err);
            else
                res.status(200).json(rows);

        });
    }
    catch (err) {
        res.status(500).send("Error al conectar: " + err);
    }
});

//Get de usuario por ID
router.get('/:id', function (req, res, next) {
    try {
        var id = req.params.id;

        var queryString = `SELECT id,userName,altura,peso,sexo,edad, foto ,email,deviceId, (peso / (altura * altura))*10000 as imc FROM usuarios where Id = '${id}'`;


        con_mysql.query(queryString, function (err, rows, fields) {
            if (err)
                res.status(500).send(err);
            else
                res.status(200).json(rows);

        });
    }
    catch (err) {
        res.status(500).send("Error al conectar: " + err);
    }
});

//Nuevo usuario
router.post('/', function (req, res, next) {

    try {
        var usuario = req.body;

        var queryString = `INSERT INTO usuarios (altura, userName, peso, sexo, edad, foto, email, password, deviceId) VALUES (${usuario.altura},'${usuario.userName}',${usuario.peso*1000},'${usuario.sexo}',${usuario.edad},${usuario.foto},'${usuario.email}','${usuario.password}',${usuario.deviceId})`
        con_mysql.query(queryString, function (err, rows, fields) {
            if (err)
                res.status(500).send("Error al insertar usuario:" + err + ". La query es: " + queryString);
            else
                res.status(200).json(rows);
        });

    }
    catch (err) {
        res.status(500).send("Error al conectar:" + err);
    }
});

//Actualizacion usuario
router.put('/:id', function (req, res, next) {
    try {
        var id = req.params.id;
        var usuario = req.body;

        var queryString = `UPDATE usuarios SET altura = '${usuario.altura}', userName = '${usuario.userName}', peso = '${usuario.peso*1000}', sexo = '${usuario.sexo}', edad = '${usuario.edad}', foto = '${usuario.foto}', email = '${usuario.email}', password = '${usuario.password}', deviceId = '${usuario.deviceId}' WHERE id = '${id}'`

        con_mysql.query(queryString, function (err, rows, fields) {
            if (err)
                res.status(500).send("Error al actualizario usuario:" + err + ". La query es: " + queryString);
            else
                res.status(200).json(rows);
        });

    }
    catch (err) {
        res.status(500).send("Error al conectar:" + err);
    }
});

//Reingreso de datos de usuario usuario
router.put('/:id/reingreso', function (req, res, next) {
    try {
        var id = req.params.id;
        var usuario = req.body;
        var fe = new Date();
        var fecha = fe.toISOString().substring(0,10);

        var queryString = `INSERT INTO historial (userID,altura,peso,fecha) VALUES (${id},${usuario.altura},${usuario.peso*1000},'${fecha}');`

        con_mysql.query(queryString, function (err, rows, fields) {
            if (err)
                res.status(500).send("Error al reingresar usuario:" + err + ". La query es: " + queryString);
            else
                {
                    var qs = `UPDATE usuarios SET altura = '${usuario.altura}', peso = '${usuario.peso*1000}', edad = '${usuario.edad}' WHERE id = '${id}'`

                    con_mysql.query(queryString, function (err, rows, fields) { 
                    if(err){
                        res.status(501).send("Error al reingresar usuario:" + err + ". La query es: " + qs);
                    }
                    else{
                        res.status(200).json(qs);
                    }
                })
                }
        });

    }
    catch (err) {
        res.status(500).send("Error al conectar:" + err);
    }
});

//Get de predicciones de actividades de usuario por ID
router.get('/:id/predicciones/frecuencia/:frecuencia/tiempoEntrenamiento/:minutosEntrenados', function (req, res, next) {
    try {
        var id = req.params.id;
        var frecuencia = req.params.frecuencia;
        var minutosEntrenados = req.params.minutosEntrenados;

        var queryString = `SELECT id,altura,peso,sexo,edad FROM usuarios where Id = '${id}'`;


        con_mysql.query(queryString, function (err, rows, fields) {
            if (err)
                res.status(500).send(err);
            else {
                var respuesta = {
                    trimestral: {caminar: [], correr: []},
                    semestral: {caminar: [], correr: []},
                    anual: {caminar: [], correr: []}
                }
                var usuario = rows[0];
                var pesoActual = usuario.peso;
                var caloriasQuemadas = 0;
                var gramosBajados = 0;
                var saltosDias = Math.floor(7 / frecuencia);
                var tipoActividad = 1;

                console.log("saltos", saltosDias, saltosDias + 2);
                // Proyecto para 3, 6 y 12 meses tanto caminar como correr.
                // Caminar
                for (var i = 0; i <= 365; i = i + saltosDias) {
                    //Caminando
                    var prediccion = tensor.predecirActividad(usuario.altura,
                        pesoActual,
                        usuario.edad,
                        usuario.sexo,
                        tipoActividad,
                        minutosEntrenados);

                    caloriasQuemadas += prediccion.caloriasQuemadas;
                    gramosBajados += prediccion.gramosQuemados;

                    pesoActual = pesoActual - prediccion.gramosQuemados;

                    var pred = {
                        dia: i,
                        pesoActual: pesoActual,
                        caloriasQuemadas: caloriasQuemadas,
                        gramosBajados: gramosBajados
                    }

                    if (i <= 122) {
                        respuesta.trimestral.caminar.push(pred);
                    }
                    if (i <= 244) {
                        respuesta.semestral.caminar.push(pred);
                    }
                    respuesta.anual.caminar.push(pred);
                }

                //Correr
                tipoActividad = 2;
                pesoActual = usuario.peso;
                for (var i = 0; i <= 365; i = i + saltosDias) {
                    //Caminando
                    var prediccion = tensor.predecirActividad(usuario.altura,
                        pesoActual,
                        usuario.edad,
                        usuario.sexo,
                        tipoActividad,
                        minutosEntrenados);

                    caloriasQuemadas += prediccion.caloriasQuemadas;
                    gramosBajados += prediccion.gramosQuemados;

                    pesoActual = pesoActual - prediccion.gramosQuemados;

                    var pred = {
                        dia: i,
                        pesoActual: pesoActual,
                        caloriasQuemadas: caloriasQuemadas,
                        gramosBajados: gramosBajados
                    }

                    if (i <= 122) {
                        respuesta.trimestral.correr.push(pred);
                    }
                    if (i <= 244) {
                        respuesta.semestral.correr.push(pred);
                    }
                    respuesta.anual.correr.push(pred);
                }
                res.status(200).json(respuesta);
            }

        });
    }
    catch (err) {
        res.status(500).send("Error al conectar: " + err);
    }
});



module.exports = router;

