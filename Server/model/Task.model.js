import mongoose from "../config/db.js";

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    due: {
        type: Date,
        required: true,
    },
    priority: {
        type: String,
        required: true,
        enum: ["low", "medium", "high"],
    },
    completed: {
        type: Boolean,
        default: false,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
}, {
    timestamps: true,
});

const Task = mongoose.model("Task", taskSchema);

export default Task;
