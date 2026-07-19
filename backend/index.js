import express from 'express'
import cors from "cors"
import { collectionName, connection } from './dbconfig.js'
import { ObjectId } from 'mongodb';
import jwt, { decode } from "jsonwebtoken"
import cookieParser from 'cookie-parser';
const app = express()
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));
app.use(express.json());
app.use(cookieParser())

app.post("/login",async(req,res)=>{
const userData = req.body;
if (userData.email && userData.password) {
    const db = await connection()
    const collection = db.collection("users")
    const result = await collection.findOne({email:userData.email,password:userData.password})
    if (result) {
    jwt.sign(userData,"Google",{expiresIn:"5d"}, (error,token)=>{
    res.send({success:true,message:"Login Done",token})
    })
    }else{
    res.send({success:false,message:"User Not found"})
    }
  
}else{
    res.send({success:false,message:"Login Not Done"})
}

})

app.post("/signup",async(req,res)=>{
const userData = req.body;
if (userData.email && userData.password) {
    const db = await connection()
    const collection = db.collection("users")
    const result =await collection.insertOne(userData)
    if (result) {
    jwt.sign(userData,"Google",{expiresIn:"5d"}, (error,token)=>{
    res.send({success:true,message:"SignUp Done",token})
    })
    }
}else{
    res.send({success:false,message:"SignUp Not Done"})
    }
})

app.post("/add-task",verifyjwtToken,async(req,res)=>{
const db = await connection()
const collection = await db.collection(collectionName)
const result = await collection.insertOne(req.body);
if (result) {
    res.send({message:"New Task Added",success:true,result})
}else{
    res.send({message:"Task Not Added",success:false})
}

})
app.get("/tasks",verifyjwtToken,async(req,res)=>{
const db = await connection()
const collection = await db.collection(collectionName)
const result = await collection.find().toArray();
if (result) {
    res.send({message:"Task List Fetched",success:true,result})
}else{
    res.send({message:"error Try After Sometime",success:false})
}

})

app.get("/task/:id",verifyjwtToken,async(req,res)=>{
const db = await connection()
const collection = await db.collection(collectionName)
const id = req.params.id;
const result = await collection.findOne({_id: new ObjectId(id)});
if (result) {
    res.send({message:"Task List Fetched",success:true,result})
}else{
    res.send({message:"error Try After Sometime",success:false})
}

})
app.put("/update-task",verifyjwtToken,async(req,res)=>{
const db = await connection()
const collection = await db.collection(collectionName)
const {_id,...fields} = req.body;
const update = {$set:fields};
const result = await collection.updateOne({_id:new ObjectId(_id)},update);
if (result) {
    res.send({message:"Task Data Updated",success:true,result})
}else{
    res.send({message:"error Try After Sometime",success:false})
}

})

app.delete("/delete/:id",verifyjwtToken,async(req,res)=>{
const db = await connection()
const id = req.params.id;
const collection = await db.collection(collectionName)
const result = await collection.deleteOne({_id: new ObjectId(id)});
if (result) {
    res.send({message:"Task Deleted",success:true,result})
}else{
    res.send({message:"error Try After Sometime",success:false})
}

})

app.delete("/delete-multiple",verifyjwtToken,async(req,res)=>{
const db = await connection()
const Ids = req.body;
const deleteTaskIds = Ids.map((item) => new ObjectId(item))
const collection = await db.collection(collectionName)
const result = await collection.deleteMany({_id:{$in:deleteTaskIds}});
if (result) {
    res.send({message:"Task Deleted",success:result})
}else{
    res.send({message:"error Try After Sometime",success:false})
}

})

function verifyjwtToken(req,res,next){
const token = req.cookies['token'];
jwt.verify(token,"Google",(error,decoded)=>{
    if (error) {
        res.send({
            success:false,
            message:"Invalid token"
        })
    }
    next()
})
}

app.listen(3200)