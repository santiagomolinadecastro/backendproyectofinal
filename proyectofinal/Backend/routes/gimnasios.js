var express = require('express');
var router = express.Router();
var http = require('http');
var config = require('../config');
var q = require('q');

var con_mysql = config.con.virtualgym;

router.get('/', function (req, res, next) {
    try {
        var queryString = `SELECT * FROM gimnasios`;


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


router.get('/:id', function (req, res, next) {
    try {
        var id = req.params.id;

        var queryString = `SELECT * FROM gimnasios where Id = '${id}'`;


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

module.exports = router;

