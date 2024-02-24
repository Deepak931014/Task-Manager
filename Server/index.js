import express from "express";
import expressConfig from "./config/express.config.js";
import userRoutes from "./routes/api/user.api.js";


// instantiate express
const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/user", userRoutes);
app.get("/", (_req, res) => {
    res.status(200).json({ message: "Server is live!" });
});


// start server
app.listen(expressConfig.PORT, () => {
    console.log(`Server is running on port ${expressConfig.PORT}!`);
});