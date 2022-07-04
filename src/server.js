import express from "express";
import cors from "cors"
import joi from "joi"
import { MongoClient } from "mongodb";
import dotenv from "dotenv"
import {db} from "../src/dbStrategy/mongo.js"


import authRouter from "./routes/authRouter.js"
import infosUserRouter from "./routes/infosUserRouter.js"

const app = express();
app.use(express.json());
app.use(cors())


app.use(authRouter)
app.use(infosUserRouter)





app.listen(5000, ()=>{
    console.log("Servidor rodando")
});