import express from "express"
import dotenv from "dotenv"
dotenv.config();
import bootstrab from "./src/index.router.js"
import connectDB from "./database/connection.js"

const port = 3000;
const app = express();

bootstrab(app,express);
connectDB()

app.listen(port , () => {
    console.log(`App is running on port ${port} ......`);
})
