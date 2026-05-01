import express from "express";
import { requestInterceptor } from "./requestInterceptor.js";
import dotenv from "dotenv/config";
import { program } from "commander";

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json({ limit : "16kb" }));
app.use(express.urlencoded({ extended : true }));
app.use(requestInterceptor());  // Usage in the code



app.get("/",(req,res) =>{
    return res.json({
        success : true,
        message : "Backend is running properly"
    })
});


app.listen(PORT,() =>{
    console.log(`Backend is running at PORT ${PORT}`);
})