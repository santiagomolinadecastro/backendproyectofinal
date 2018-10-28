var mysql = require('mysql');

//APP
exports.APP = {//'mongodb://localhost:27017/dbTurnos'

    port: 3000    
}


//mysql connect with localhost
exports.con = {
    virtualgym : mysql.createPool({
        host: "localhost",
        connectionLimit : 1000,
        // host: "190.210.116.13",
        port:"3306",
        user: "root",
        password: "root",
        database : 'virtualgym'
      })
}






    