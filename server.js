const express = require('express');
const app = express();
const port = 3000;
const url = require('url')
const mysql = require('mysql');
const { METHODS } = require('http');
const bodyParser = require("body-parser")
var qs = require('querystring');
app.use(express.json());
const crypto = require('crypto');
const salt = crypto.randomBytes(128).toString('base64');
const jwt  = require('jsonwebtoken');
const secretObj = require("./config/jwt");
const cookieParser = require('cookie-parser');

// server.use(express.static("/css")) css
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}))

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Kangtaemin12345@",
    database: "mydb",
})

app.get("/", (request,response, next) => {
    response.sendFile(__dirname + "/first.html");
})

app.post('/newlogin-success.html', (request, response) => {
    con.connect(function(err) { // 회원가입 중복 확인
        if (err) throw err;
        let sql = `SELECT id FROM userinfo WHERE id='${request.body.id}'`

        function getData() {
            return new Promise(function(resolve, reject) {
                con.query(sql, function (err, result1) {
                    if (err) throw err;
                    resolve(result1)
                })
            })
        }
        getData().then(function(result) {
            const hashPassword = crypto.createHash('sha512').update(request.body.pw + salt).digest('hex');
            if(+result===0){ // 회원가입 계정 정보 입력
                db = `INSERT INTO userinfo (id, password, gd, sg, salt) VALUES ('${request.body.id}', '${hashPassword}', '${request.body.gd}', '${request.body.sg}', '${salt}')`
                con.query(db, function (err, result) {
                    if (err) throw err;
                    console.log(result);
                });
            }
        })
    });
    response.sendStatus(200);
});

app.post('/login-success.html', (request, response, next) => { // 로그인 부분
    con.connect(function(err) {
        if (err) throw err;
        let sql = `SELECT password, salt FROM userinfo WHERE id='${request.body.id}'`
        function getData() {
            return new Promise(function(resolve, reject) {
                con.query(sql, function (err, result) {
                    if (err) throw err;
                    let dataList = [];
                    for (var data of result){
                        dataList.push(data.password);
                        dataList.push(data.salt);
                    };
                    let a = dataList[0]+dataList[1]
                    resolve(a)
                })
            })
        }
        getData().then(function(result) {
            let pass = result.slice(0, 128)
            let slt = result.slice(128)
            const hashPassword = crypto.createHash('sha512').update(request.body.pw + slt).digest('hex');
            if(hashPassword === pass){
                console.log("login is success")
                let token = jwt.sign({
                    email: "kangtaemin" // 토큰 내용
                },
                secretObj.secret, // 비밀키
                {
                    expiresIn: '1h' // 유효 시간
                })
                response.cookie("user", token);
                // response.json({
                //     token: token
                // })
                // response.header('Authorization', token)
                response.status(301).redirect('http://localhost:3000/main')
            }
            else{
                console.log("login non success")
            }
        })
    })
    //response.sendStatus(200);
})

app.get("/main", (request, response) => {
    let token = request.cookies.user;
    let decoded = jwt.verify(token, secretObj.secret);
    if(decoded){
        response.sendFile(__dirname + "/main.html");
    } 
    else{
        response.send("권한이 없습니다.")
    }
});

app.listen(port, (err) => {
    if(err) throw err
    console.log("The server is opened on port 3000");
})