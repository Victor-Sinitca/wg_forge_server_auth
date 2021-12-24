import dotenv from "dotenv";
import express from "express";
import {router} from "./router";
import cors from "cors";
import  * as  bodyParser from "body-parser";
import errorHandler from "errorhandler";
import mongoose from "mongoose";
import errorMiddleware from "./middlewares/error-middleware"
import cookieParser from "cookie-parser"


mongoose.Promise = global.Promise;
dotenv.config();

const PORT = process.env.PORT || 8000
const app = express()
app.use(express.static('helper'));
app.use(express.json({limit: '50mb'}))

app.use(cookieParser()) // подключает res.cookie(`refreshToken`, userDate.refreshToken, )

app.use(cors({
    origin: process.env.LOCAL_URL,
    //origin: process.env.LOCAL_URL,
   // origin: [""+process.env.UI_URL,],
   /* methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,*/
    credentials:true, // разрешаем куки
}))
app.use(bodyParser.urlencoded({
    parameterLimit: 100000,
    limit: '50mb',
    extended: false
}))
app.use(bodyParser.json({
    type: 'application/json',
    limit: '50mb'
}))
app.use(`/api`, router)

const isProduction = process.env.NODE_ENV === 'production';
if (!isProduction) {
    app.use(errorHandler());
}
app.use(errorMiddleware) // !!должен быть последним middleware

const start = async () => {
    try {
        //Configure Mongoose
        await mongoose.connect(process.env.BD_URL || "some url address DB", {
            user:"root",
            pass:"1986"
        },function(error:any) {
            if(error) console.log(`error  mongoose.connect : ${error}`)
        });
        await  mongoose.set('debug', true);
        app.listen(PORT, () => console.log(`server was start on   http://localhost:${PORT}/  documentation http://localhost:${PORT}/doc.html `))
    } catch (e) {
        console.log(e)
    }
}

start()
