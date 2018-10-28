var express = require('express');
var router = express.Router();
var config = require('../config');

var con_mysql = config.con.virtualgym;

router.get('/', function (req, res, next) {
    try {
        var queryString = `SELECT * FROM caloriasReferencias`;


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

        var queryString = `SELECT * FROM caloriasReferencias where Id = '${id}'`;


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

