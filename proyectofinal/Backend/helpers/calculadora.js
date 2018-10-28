exports.getGramosQuemados = function (peso,sexo,actividad,tiempo) {
    return this.getCaloriasQuemadas(peso,sexo,actividad,tiempo) * 0.1296;
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