const express = require("express")
const app = express()
const bodyparser = require("body-parser")
const cors = require("cors")
const PORT = process.env.PORT 
const knex = require('knex')({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : '01203328888m',
      database : 'boat'
    }
});
app.use(express.json())
app.use(cors())
app.get("/",(req,resp)=>{
    resp.json("all good")
})
app.post("/register",(req,resp)=>{
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    knex("users").select("*").where("email","=",email).orWhere("username","=",username).then(data=>{
        return data.length
    }).then(d=>{
        if (d >= 1){
           resp.json("fail")
        }else{
           knex("users").insert({email:email,username:username,password:password}).then(console.log)
           resp.json("success")
        }
    })
})
app.post("/login",(req,resp)=>{
    password = req.body.password;
    username = req.body.username;
    knex("users").select("*").where("password","=",password).andWhere("username","=",username).then(d=>{
        return d.length
    }).then(data=>{
        if (data === 1){
            resp.json("success")
        }else{
            resp.json("fail")
        }
    })
})
app.listen(PORT || 3000)

































