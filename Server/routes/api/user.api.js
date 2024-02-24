import express from "express";
import User from "../../model/User.model.js";
import Task from "../../model/Task.model.js";
import bcrypt from "bcrypt";
import passport from "passport";
import session from "express-session";
import passportFn from "../../config/passport.js";
import clientConfig from "../../config/client.config.js";
import cookieParser from "cookie-parser";
import cors from "cors";

// instantiate express router
const router = express.Router();

// middlewares
router.use(cors({
    origin: clientConfig.URL,
    credentials: true,
}));
router.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 2,
    },
}));
router.use(cookieParser("secret"));
router.use(passport.initialize());
router.use(passport.session());
passportFn(passport);

// custom middlewares
const checkLoggedIn = (req, res, next) => {
    if (!req.user) {
        return next();
    } else {
        res.status(403).json({
            error: "You are already logged in!",
        });
    }
};

const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.status(401).json({
            error: "You are not logged in!",
        });
    }
};

const isAuthorized = (req, res, next) => {
    if (req.user._id === req.params.id) {
        return next();
    } else {
        res.status(403).json({
            error: "You are not authorized to perform this action!",
        });
    }
};

// routes for users

// @route   POST api/user/register
// @desc    Register a new user
// @access  Public
router.post("/register", async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body?.password, 10);
        await User.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashedPassword,
        });
        res.status(201).json({
            message: "User created successfully!"
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
});

// @route   POST api/user/login
// @desc    Login a user
// @access  Public
router.post("/login", checkLoggedIn, (req, res) => {
    try {
        passport.authenticate("local", (err, user, info) => {
            if (err) {
                return res.status(500).json({
                    error: err.message,
                });
            }
            if (!user) {
                return res.status(401).json({
                    error: info.message,
                });
            }
            req.logIn(user, (err) => {
                if (err) {
                    return res.status(500).json({
                        error: err.message,
                    });
                }
                return res.status(200).json({
                    message: "User logged in successfully!",
                    user: user,
                });
            });
        })(req, res);
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
});

// @route   GET api/user/logout
// @desc    Logout a user
// @access  Public
router.get("/logout", isAuthenticated, (req, res) => {
    req.logout((error) => {
        if (error) return next(error);
    });
    res.status(200).json({ message: "User successfully logged out!" });
});

// @route   PUT api/user/update/:id
// @desc    Update a user
// @access  Public
router.put("/update/:id", isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        if (req.body.firstName) user.firstName = req.body.firstName;
        if (req.body.lastName) user.lastName = req.body.lastName;
        if (req.body.email) user.email = req.body.email;
        if (req.body.password) {
            const hashedPassword = await bcrypt.hash(req.body?.password, 10);
            user.password = hashedPassword;
        }

        await user.save();
        res.status(200).json({
            message: "User updated successfully",
        });


    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
});

// @route   DELETE api/user/delete/:id
// @desc    Delete a user
// @access  Public
router.delete("/delete/:id", isAuthenticated, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });
        res.status(200).json({
            message: `User with ID ${req.params.id} was deleted successfully!`,
        });

    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
});

// routes for tasks

// @route   GET api/user/task
// @desc    Get all tasks for a user
// @access  Public
router.get("/task", isAuthenticated, async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user._id });
        if (!tasks) return res.status(404).json({ error: "Tasks not found" });
        res.status(200).json({
            tasks,
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            error: error.message,
        });
    }
});

// @route   GET api/user/task/:taskId
// @desc    Get a task for a user
// @access  Public
router.get("/task/:taskId", isAuthenticated, async (req, res) => {
    try {
        const task = await Task.findById(req.params.taskId);
        if (!task) return res.status(404).json({ error: "Task not found" });
        res.status(200).json({
            task,
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
});

// @route   POST api/user/task
// @desc    Create a task for a user
// @access  Public
router.post("/task", isAuthenticated, async (req, res) => {
    try {
        if (!req.body) return res.status(400).json({ error: "Task data is required" });

        const task = await Task.create({
            title: req.body.title,
            description: req.body.description,
            due: new Date(req.body.due),
            priority: req.body.priority,
            user: req.user._id,
        });
        req.user.tasks.push(task._id);
        await req.user.save();

        res.status(200).json({
            message: "Task created successfully!",
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
});

// @route   PUT api/user/task/update/:taskId
// @desc    Update a task for a user
// @access  Public
router.put("/task/update/:taskId", isAuthenticated, async (req, res) => {
    try {
        const task = await Task.findById(req.params.taskId);
        if (!task) return res.status(404).json({ error: "Task not found" });

        const updates = Object.keys(req.body);
        updates.forEach((update) => {
            if (update === "due") task[update] = new Date(req.body[update]);
            if (update === "completed" && req.body[update] === true) {
                req.user.tasks = req.user.tasks.filter((task) => task._id.toString() !== req.params.taskId);
                return task[update] = req.body[update];
            }
            task[update] = req.body[update]
        });
        await task.save();
        await req.user.save();

        res.status(200).json({
            message: "Task updated successfully",
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
});

// @route   DELETE api/user/task/delete/:taskId
// @desc    Delete a task for a user
// @access  Public
router.delete("/task/delete/:taskId", isAuthenticated, async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete({
            _id: req.params.taskId,
            user: req.user._id,
        });

        if (!task) return res.status(404).json({ error: "Task not found" });

        req.user.tasks = req.user.tasks.filter((task) => task._id.toString() !== req.params.taskId);
        await req.user.save();

        res.status(200).json({
            message: `Task with ID ${req.params.taskId} was deleted successfully!`,
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
});

// @route   GET api/user/:id
// @desc    Get a user
// @access  Public
router.get("/:id", isAuthenticated, async (req, res) => {
    try {
        if (req.user._id.toString() !== req.params.id) return res.status(401).json({ error: "Unauthorized" });
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });
        res.status(200).json({
            user,
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
});

export default router;