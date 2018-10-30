var express = require('express');
var router = express.Router();
var config = require('../config');
var calculadora = require('../helpers/calculadora');
var request = require('request');
var tensor = require('../tensor/module');

var con_mysql = config.con.virtualgym;

//Get de todas las actividades
router.get('/', function (req, res, next) {
    try {
        var queryString = `SELECT * FROM actividades`;


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

//Get de actividades por ID
router.get('/:id', function (req, res, next) {
    try {
        var id = req.params.id;

        var queryString = `SELECT * FROM actividades where Id = '${id}'`;


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

//Nueva actividad
router.post('/', function (req, res, next) {
    
    try {
        var actividad = req.body;
        console.log("llega act",actividad);
        var queryString = `INSERT INTO actividades (userId, tipo, velocidad, fechaInicio, fechaFin, tipoActividadId, maquinaId) VALUES (${actividad.userId},${actividad.tipo},'${actividad.velocidad}',${actividad.fechaInicio},${actividad.fechaFin},'${actividad.tipoActividadId}','${actividad.maquinaId}')`
    
        
        var timeFin = (new Date(actividad.fechaFin.replaceAll("'"," "))).getTime();
        var timeInicio = (new Date(actividad.fechaInicio.replaceAll("'"," "))).getTime();
        var minutosEntrenados = (timeFin - timeInicio) / 1000 / 60;

        con_mysql.query(queryString, function (err, rows, fields) { 
            if (err){ 
                res.status(500).send("Error al insertar actividad:" + err + ". La query es: " + queryString);
            }
            else{
                var queryString = `SELECT id,peso,sexo,edad,altura FROM usuarios WHERE id = ${actividad.userId}`;
                con_mysql.query(queryString, function (err, rows, fields) { 
                    if (err){ 
                        res.status(500).send("Error al obtener usuario: " + err + ". La query es: " + queryString);
                    }
                    else{
                        var usuario = rows[0];
                        var queryString = `INSERT INTO historial (userID,peso,fecha) VALUES (${usuario.id},${usuario.peso},now());`;
                        con_mysql.query(queryString, function (err, rows, fields) { 
                            if (err){ 
                                res.status(500).send("Error al insertar historial:" + err + ". La query es: " + queryString);
                            }
                            else{
                                // var gramosQuemados = calculadora.getGramosQuemados(usuario.peso,usuario.sexo,actividad.tipoActividadId,minutosEntrenados);
                                var prediccion = tensor.predecirActividad(usuario.altura,usuario.peso,usuario.edad,usuario.segundos,actividad.tipoActividadId,minutosEntrenados);
                                console.log("la prediccion es:",prediccion);
                                var nuevoPeso = usuario.peso - prediccion.gramosQuemados;

                                var queryString = `UPDATE usuarios SET peso = ${nuevoPeso} WHERE id = ${usuario.id}`;
                                con_mysql.query(queryString, function (err, rows, fields) { 
                                    if (err){ 
                                        res.status(500).send("Error al actualizar usuario:" + err + ". La query es: " + queryString);
                                    }
                                    else{
                                        res.status(200).json(rows);
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });

    }
    catch (err) {
        res.status(500).send("Error al conectar:" + err);
    }
});


//Llenado de base de historicos
router.get('/test/generarHistorico', function (req, res, next) {
    try {
        var queryString = `SELECT * FROM usuarios`;


        con_mysql.query(queryString, function (err, rows, fields) {
            if (err){
                console.log("error");
                res.status(500).send(err);
            }
            else{
                var registrosTotales = 0;
                    //Por cada usuario genero historicos
                    for(var i = 0; i < rows.length ; i++){
                        var usuario = rows[i];
                        //Genero entre 15 y 50 actividades por usuario
                        var cantidadActividades = Math.floor((Math.random() * 1000) + 150);
                        // var cantidadActividades = Math.floor((Math.random() * 1) + 1);
                        registrosTotales += cantidadActividades;
                        
                        for(var j = 0; j < cantidadActividades; j++){
                            //Genero la actividad
                            var dia = Math.floor((Math.random() * 28) + 1);
                            var mes = Math.floor((Math.random() * 12) + 1);
                            var ano = 2018;

                            var hora = Math.floor((Math.random() * 9) + 9);
                            var caso = Math.floor((Math.random() * 3) + 1);
                            var minutosInicio = 0;
                            var minutosFin = 10;

                            if (caso == 1){
                                minutosInicio = '00';
                            }
                            else if (caso == 1){
                                minutosInicio = 15;
                            }
                            else if (caso == 2){
                                minutosInicio = 20;
                            }
                            else{
                                minutosInicio = 30;
                            }

                            caso = Math.floor((Math.random() * 3) + 1);
                            if (caso == 1){
                                minutosFin = minutosInicio + 10;
                            }
                            else if (caso == 1){
                                minutosFin = minutosInicio + 20;
                            }
                            else if (caso == 2){
                                minutosFin = minutosInicio + 25;
                            }
                            else{
                                minutosFin = minutosInicio + 30;
                            }

                            var segundos = '00';
                            var fechaInicio = `'${ano}-${mes}-${dia} ${hora}:${minutosInicio}:${segundos}'`;
                            var fechaFin    = `'${ano}-${mes}-${dia} ${hora}:${minutosFin}:${segundos}'`;

                            var actividad = { 
                                userId: usuario.id,
                                tipo: 3,
                                velocidad: Math.floor((Math.random() * 50) + 1),
                                fechaInicio: fechaInicio,
                                fechaFin: fechaFin,
                                tipoActividadId: Math.floor((Math.random() * 2) + 1),
                                maquinaId: 1
                            }

                            //Hago el post local
                            // request.post(
                            //     'http://localhost:3000/actividades',
                            //     {json: actividad},
                            //     function (error, response, body) {
                            //         if (!error && response.statusCode == 200) {
                            //             // console.log(body);
                            //         }
                            //     }
                            // );

                            var tiempoEntrenamiento = minutosFin - minutosInicio;
                            var gramosQuemados = calculadora.getGramosQuemados(usuario.peso,usuario.sexo,actividad.tipoActividadId,tiempoEntrenamiento);
                            var caloriasQuemadas = gramosQuemados / 0.1296;
                            var trainData = { 
                                altura: usuario.altura,
                                peso: usuario.peso,
                                edad: usuario.edad,
                                sexo: usuario.sexo,
                                tiempo: tiempoEntrenamiento,
                                tipoActividadId: actividad.tipoActividadId,
                                gramosQuemados: gramosQuemados,
                                caloriasQuemadas: caloriasQuemadas
                            }

                            usuario.peso = usuario.peso - gramosQuemados;
                            
                            var queryString = `INSERT INTO tensorTrain (altura, peso, edad, sexo, tiempo, tipoActividadId, gramosQuemados, caloriasQuemadas) VALUES (${trainData.altura},${trainData.peso},'${trainData.edad}','${trainData.sexo}',${trainData.tiempo},'${trainData.tipoActividadId}',${trainData.gramosQuemados}, ${trainData.caloriasQuemadas})`;
                            console.log("query",queryString);
                            con_mysql.query(queryString, function (err, rows, fields) {
                                if (err){
                                    console.log("error",i);
                                    // res.status(500).send(err);
                                }
                            })

                        }
                    }
                    res.status(200).send("Se insertaron actividades");
                }
        });
    }
    catch (err) {
        res.status(500).send("Error al conectar: " + err);
    }
});

module.exports = router;

