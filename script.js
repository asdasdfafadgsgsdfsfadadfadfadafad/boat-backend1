const express = require("express")
const app = express()
const bodyparser = require("body-parser")
const cors = require("cors")
const PORT = process.env.PORT 
app.use(express.json())
app.use(cors())


const { Pool  } = require('pg');
const client = new Pool ({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});



// const knex = require('knex')({
//     production: { client: 'pg', connection: process.env.DATABASE_URL }
// });
app.get("/",(req,resp)=>{
    // resp.json("asdasdasdasdasdasdasda")
    const arr= []
    client.connect()
    .then(()=>{return client.query("select * from users")})
    .then(data=>arr.concat(data.rows))
    .catch((err)=>{
        resp.json("error",err)
    })
    // .finally(()=>client.end())
    resp.json(arr)
    // the problem is that it dosent client end it it keeps running and once resp.json runs it exits without ending
    
})
// app.get("/",(req,resp)=>{
//     // resp.json("asdasdasdasdasdasdasda")
//     client.connect()
//     .then(()=>{return client.query("select * from users")})
//     .then(data=>resp.json(data.rows))
//     .catch((err)=>{
//         resp.json("error",err)
//     })
//     .finally(()=>client.end())
//     // the problem is that it dosent client end it it keeps running and once resp.json runs it exits without ending

// })





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
    }).catch(err => {
        resp.json("error")
    })
})
app.listen(PORT || 3000)
