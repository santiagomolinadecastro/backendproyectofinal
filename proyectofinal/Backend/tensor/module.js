// import * as tf from '@tensorflow/tfjs';
// import * as trainer from './trainer';
const tf = require("@tensorflow/tfjs");
var trainer = require('./trainer');
global.fetch = require('node-fetch');
exports.model = {};


exports.setModel = function () {
    // var model = {};

    // try {
    //     console.log("try");
    //     model = tf.loadModel('file:///tmp/my-model-1/model.json');
    // }
    // catch (e) {
        createModel();
    // }

};

    function createModel() {
        exports.model = tf.sequential();
        // layer intermedio neuronal
        const hidden = tf.layers.dense({
            units: 25,
            inputShape: [6],     // indico cantidad de datos de entrada
            // activation: 'sigmoid'
        });

        exports.model.add(hidden);

        // layer de output
        const output = tf.layers.dense({
            units: 2,
            // activation: 'sigmoid'
        });

        exports.model.add(output);


        // Preparo el modelo para entrenarse indicando la funcion optimizer y la de minimizar error
        const sgdOpt = tf.train.sgd(0.0001);
        exports.model.compile({
            loss: 'meanSquaredError',
            optimizer: sgdOpt
        });

        console.log("antes de entrenar", exports.model);
        trainer.trainModel(exports.model);
        // exports.model = model;
    }

exports.predecirActividad = function (altura,peso,edad,sexo,actividad,tiempo) {
    // return this.getCaloriasQuemadas(peso,sexo,actividad,tiempo) * 0.1296;

    // var persona = {
    //     altura: 17,
    //     peso: 59021,
    //     sexo: 0,
    //     edad: 20,
    //     tiempo: 25,
    //     tipoActividad: 1,
    //   }

    //   [18,69.78,30,0,30,2],
    if(sexo == 'F'){
        sexo = 1;
    }
    else{
        sexo = 0;
    }


    const tensorAPredecir = tf.tensor2d([[altura/10,peso/1000,edad,sexo,tiempo,parseInt(actividad)]]);
    console.log(altura/10,peso/1000,edad,sexo,tiempo,actividad);
    // const tensorAPredecir = tf.tensor2d([[17,58.904,20,0,30,1]]);
    let output = exports.model.predict(tensorAPredecir);
    var formateado = {
        gramosQuemados: output.dataSync()[0],
        caloriasQuemadas: output.dataSync()[1]
    }
    return formateado;

};


exports.getCaloriasQuemadas = function (peso,sexo,actividad,tiempo) {
    //Fuente:  https://es.calcuworld.com/deporte-y-ejercicio/calculadora-de-calorias-quemadas/

    var modificadorSexo = sexo == 'M' ? 1 : 0.875;

    if (actividad = 1){
        return  0.035 * (peso / 1000) * 2.2 * tiempo * modificadorSexo;
    }
    else if (acitividad = 2){
        return    0.2244 * (peso / 1000) * tiempo * modificadorSexo;
    }
};
