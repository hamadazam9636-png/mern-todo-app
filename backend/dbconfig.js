import { MongoClient } from "mongodb"

const url = "mongodb+srv://12345:12345@cluster0.fjfdqkr.mongodb.net/?appName=Cluster0"
const dbName= "node-project";
export const collectionName= "todo"
const client = new MongoClient(url)

export const connection= async()=>{
const connect = await client.connect()
return await connect.db(dbName)
}