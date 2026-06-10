import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./src/app.js";

dotenv.config();


mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB connected");

    app.listen(5000, () => {
        console.log("Server is running on port 5000");
    });
})
.catch(err => console.log(err));