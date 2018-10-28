var express = require('express');
var router = express.Router();
var config = require('../config');

var con_mysql = config.con.virtualgym;

//Get de todos los usuarios... no debería usarse
router.get('/', function (req, res, next) {
    try {
        var queryString = `SELECT id,altura,peso,sexo,edad,foto, email,deviceId, (peso / (altura * altura))*10000 as imc FROM usuarios`;


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
        var queryString = `SELECT id,altura,peso,sexo,edad,foto,email,deviceId, (peso / (altura * altura))*10000 as imc FROM usuarios WHERE idGimnasio = ${idGimnasio}`;


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

        var queryString = `SELECT id,altura,peso,sexo,edad,foto,email,deviceId, (peso / (altura * altura))*10000 as imc FROM usuarios where email = '${email}' AND password = '${password}'`;


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

        var queryString = `SELECT id,altura,peso,sexo,edad, foto ,email,deviceId, (peso / (altura * altura))*10000 as imc FROM usuarios where Id = '${id}'`;


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

        var queryString = `INSERT INTO usuarios (altura, peso, sexo, edad, foto, email, password, deviceId) VALUES (${usuario.altura},${usuario.peso},'${usuario.sexo}',${usuario.edad},${usuario.foto},'${usuario.email}','${usuario.password}',${usuario.deviceId})`
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

        var queryString = `UPDATE usuarios SET altura = '${usuario.altura}', peso = '${usuario.peso}', sexo = '${usuario.sexo}', edad = '${usuario.edad}', foto = '${usuario.foto}', email = '${usuario.email}', password = '${usuario.password}', deviceId = '${usuario.deviceId}' WHERE id = '${id}'`

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

        var queryString = `INSERT INTO historial (userID,altura,peso,fecha) VALUES (${usuario.userID},${usuario.altura},${usuario.peso},'${usuario.fecha}');`
        
        con_mysql.query(queryString, function (err, rows, fields) {
            if (err)
                res.status(500).send("Error al reingresar usuario:" + err + ". La query es: " + queryString);
            else
                res.status(200).json(rows);
        });

    }
    catch (err) {
        res.status(500).send("Error al conectar:" + err);
    }
});

module.exports = router;

