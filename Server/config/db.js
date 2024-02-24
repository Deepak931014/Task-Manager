import mongoose from "mongoose";
import mongooseConfig from "./mongoose.config.js";

(async () => {
    try {
        await mongoose.connect("mongodb+srv://Deepak25:gta5mods@cluster0.bk2xyo5.mongodb.net/TaskManager?retryWrites=true&w=majority", mongooseConfig.OPTIONS);
        console.log("Connected to database!");
    } catch (error) {
        console.log("Database connection error:", error.message);
    }
})();

export default mongoose;