var mysql = require('mysql')

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Kangtaemin12345@",
    database: "mydb"
})

con.connect(function(err){
    if(err) throw err
    console.log("connect")
    var sql = "CREATE TABLE userinfo (name VARCHAR(255), id VARCHAR(255), password VARCHAR(255))";
    con.query(sql, function(err, result){
        if(err) throw err;
        console.log("table created")
    })
})