const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const morgan = require('morgan');
const app = express();
app.use(express.json());
app.use(bodyparser.urlencoded({extended:false}));
app.use(morgan('tiny'));
const port = process.env.PORT || 4000;

mongoose.connect("mongodb+srv://vivek:admin@cluster0.swrbp.mongodb.net/person").then(()=>{
    console.log("mongodb connected");
}).catch((err)=>{
    console.log(err);
});
const personschem = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    number:{
        type:Number,
        require:true
    },
    address:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    cpassword:{
        type:String,
        required:true
    }
});

const Person = new mongoose.model('persondetails',personschem);

app.get("/", async(req,res)=>{
    res.sendFile(path.join(__dirname + "/reg.html"));
});

app.post("/api/v1/person/new", async(req,res)=>{
    console.log(req.body.name);
    const password = req.body.password;
    const cpassword = req.body.cpassword;
    if(password === cpassword){
        const person = new Person({
            name:req.body.name,
            email:req.body.email,
            number:req.body.number,
            address:req.body.address,
            password:req.body.password,
            cpassword:req.body.cpassword
        });
        person.save();
       
    }else{
        console.log("password not matching");
    }
    res.sendFile(path.join(__dirname + "/log.html"));
})

app.get("/log", async(req,res)=>{
    res.sendFile(path.join(__dirname + "/log.html"));
});

app.post("/api/v1/person/log", async(req,res)=>{
    try {
        const email = req.body.email;
        const password = req.body.password;
        const person = await Person.findOne({email});
        
        if(person.password === password){
            res.sendFile(path.join(__dirname + "/home.html"));
        }else{
            res.sendFile(path.join(__dirname + "/log.html"));
        }

    } catch (error) {
        console.log(error);
    }
})
app.get("/Home", async(req,res)=>{
    res.sendFile(path.join(__dirname + "/home.html"));
});
app.listen(port, ()=>{
    console.log(`server running on http:://localhost:${port}`);
}); 
