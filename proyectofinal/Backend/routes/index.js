var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send('Bienvenido a la APP Rest de VirtualGym!');
});

router.get('/testConexion', function (req, res, next) {
  res.status(200).json("ok");
});

router.get('/testTensorflow', function (req, res, next) {
  var tf = require('../helpers/tensorflow');

  /*
  a: peso en gramos
  b: tiempo en minutos
  c: sexo M o F
  */

  peso = tf.constraints([[80],[79],[78],[76],[81],[73],[101],[94],[64]],dtype = tf.float32);

  const model = tf.sequential();
  model.add(tf.layers.dense({units: 1, inputShape: [1]}));

  // Prepare the model for training: Specify the loss and the optimizer.
  model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});

  // Generate some synthetic data for training.
  const xs = tf.tensor([1, 2, 3, 4], [4, 1]);
  const ys = tf.tensor([1, 3, 5, 7], [4, 1]);
  
  //tensor entrada:  peso sexo tiempo ejeccicio
  //tensor salida: calorias quemadas
  //const x = tf.tensor2d([[80,1,45,1],[95,0,30,1],[78,1,40,0],[67,0,30,1],[88,0,60,1],[69,0,18,1],[71,0,22,1]]);
  //const y = tf.tensor2d([[290],[200],[198],[300],[299],[107],[304]]);

  // Train the model using the data.
  model.fit(xs, ys, {epochs: 90}).then(() => {
    // Use the model to do inference on a data point the model hasn't seen before:
    // Open the browser devtools to see the output
    res.status(200).json(model.predict(tf.tensor2d([5], [1, 1])));
  });


  

 
});

module.exports = router;
