const sql2 = require('mysql2');
const connection = sql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: '26#may#2004',
    database: 'social_app',
    multipleStatements: true
})
connection.connect((err)=>{
    if(err)
        console.log(err);
    else
        console.log('connected to datbase');
})

module.exports =  connection;