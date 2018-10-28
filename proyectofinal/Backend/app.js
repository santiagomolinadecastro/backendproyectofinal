var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var config = require('./config');
var gimnasios = require('./routes/gimnasios');
var actividades = require('./routes/actividades');
var caloriasReferencias = require('./routes/caloriasReferencias');
var estadosMaquinas = require('./routes/estadosMaquinas');
var historial = require('./routes/historial');
var imcReferencias = require('./routes/imcReferencias');
var maquinas = require('./routes/maquinas');
var tipoActividad = require('./routes/tipoActividad');
var usuarios = require('./routes/usuarios');
var calculadora = require('./helpers/calculadora');

var app = express();
const jwt = require('jsonwebtoken');

console.log("Servicio iniciado");

app.use(logger('dev'));
app.use(cookieParser());
app.use('/public/attachments', express.static(__dirname + '/public/attachments'));

//establezco limite de payload para los servicios
app.use(bodyParser.urlencoded({
    limit: '5mb',
    extended: false
}));
app.use(bodyParser.json({
    limit: '5mb'
}));


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,OPTIONS,DELETE");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Cache-Control,Authorization, Origin, X-Requested-With, Content-Type, Accept,Key,X-Mashape-Authorization");

    if ('OPTIONS' === req.method) {
        res.send(200);
      }
      else {
        next();
      }

});


app.use('/', routes);
app.use('/gimnasios',gimnasios);
app.use('/actividades',actividades);
app.use('/caloriasReferencias',caloriasReferencias);
app.use('/estadosMaquinas',estadosMaquinas);
app.use('/historial',historial);
app.use('/imcReferencias',imcReferencias);
app.use('/maquinas',maquinas);
app.use('/tipoActividad',tipoActividad);
app.use('/usuarios',usuarios);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var options = {
    db: { native_parser: true },
    server: { poolSize: 5 },
    replset: { rs_name: 'myReplicaSetName' },
    user: 'root',
    pass: 'root'
}



//Prototypes:
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};


// if(true){
//     var rta = calculadora.getGramosQuemados(150000,'M','correr',40);
//     var rta2= calculadora.getCaloriasQuemadas(150000,'M','correr',40);
//     console.log("gramos",rta);
//     console.log("calorias",rta2);
// }

module.exports = app;