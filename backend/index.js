require("dotenv").config();

const config = require("./config.json");
const mongoose = require("mongoose");

mongoose.connect(config.connectionString);

const User = require("./models/user.model");
const Note = require("./models/note.model");
const Folder = require("./models/folder.model");

const express = require("express");
const cors = require("cors");
const app = express();

const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilities");

app.use(express.json());

app.use(
    cors({
        origin: "*",
    })
);

app.get("/", (req, res) => {
    res.json({ data: "hello" });
})

// Backend API

// CREATE ACCOUNT
app.post("/create-account", async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName) {
        return res.status(400).json({ error: true, message: "Full Name is required" });
    }

    if (!email) {
        return res.status(400).json({ error: true, message: "Email is required" });
    }

    if (!password) {
        return res.status(400).json({ error: true, message: "Password is required" });
    }

    const isUser = await User.findOne({ email: email });

    if (isUser) {
        return res.json({ error: true, message: "User already exists!", });
    }

    const user = new User ({
        fullName, 
        email, 
        password, 
    });

    await user.save();

    const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "36000m",
    });

    return res.json({
        error: false,
        user, 
        accessToken, 
        message: "Registration Successful",
    });
});

// LOGIN
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    if (!password) {
        return res.status(400).json({ message: "Password is required" });
    }

    const userInfo = await User.findOne({ email: email });

    if (!userInfo) {
        return res.status(400).json({ message: "User not found" });
    }

    if (userInfo.email == email && userInfo.password == password) {
        const user = { user: userInfo };
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "36000m",
        });

        return res.json({
            error: false,
            message: "Login Successful",
            email,
            accessToken,
        });
    } else {
        return res.status(400).json ({
            error: true,
            message: "Invalid Credentials",
        });
    }
});

// GET USER
app.get("/get-user", authenticateToken, async (req, res) => {
    const { user } = req.user;

    const isUser = await User.findOne({ _id: user._id });

    if (!isUser) {
        return res.sendStatus(401);
    }

    return res.json({
        user: { 
            fullName: isUser.fullName, 
            email: isUser.email, 
            "_id": isUser._id, 
            createdOn: isUser.createdOn
        },
        message: ""
    });
});

// ADD NOTE
app.post("/add-note", authenticateToken, async (req, res) => {
    const { title, content, tags, folderId } = req.body;
    const { user } = req.user;

    if (!title) {
        return res.status(400).json({ error: true, message: "Title is required" });
    }
    
    if (!content) {
        return res.status(400).json({ error: true, message: "Content is required" });
    }

    try {
        const note = new Note({
            title,
            content,
            tags: tags || [],
            folderId: folderId || null,
            userId: user._id,
        });

        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note added successfully",
        });
    } catch (error) {
        return res.status(500).json({ error: true, message: "Internal Server Error" })
    }
});

// EDIT NOTE, PUT may be better for editing notes than POST
app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { title, content, tags, folderId, isPinned } = req.body;
    const { user } = req.user;

    if (!title && !content && !tags) {
        return res.status(400).json({ error: true, message: "No changes provided" });
    }

    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });

        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        if (title) note.title = title;
        if (content) note.content = content;
        if (tags) note.tags = tags;
        if (folderId) note.folderId = folderId;
        if (isPinned) note.isPinned = isPinned;

        await note.save();

        return res.json({
            error: false, 
            note, 
            message: "Note updated successfully",
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
});

// GET ALL NOTES
app.get("/get-all-notes/", authenticateToken, async (req, res) => {
    const { user } = req.user;

    try {
        const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 });
        return res.json({ error: false, notes, message: "All notes retrieved successfully" });
    } catch (error) {
        return res.status(500).json({ error: true, message: "Internal Server Error" })
    }
});

// DELETE NOTE
app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { user } = req.user;

    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });

        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        await Note.deleteOne({ _id: noteId, userId: user._id });

        return res.json({ error: false, message: "Note deleted successfully" });
    } catch (error) {
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    } 
});

// UPDATE NOTE PIN (isPinned)
app.put("/update-note-pinned/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { isPinned } = req.body;
    const { user } = req.user;

    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });

        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        note.isPinned = isPinned;

        await note.save();

        return res.json({
            error: false, 
            note, 
            message: "Note updated successfully",
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
});

// SEARCH NOTES
app.get("/search-notes/", authenticateToken, async (req, res) => {
    const { user } = req.user;
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ error: true, message: "Search query is required"})
    }

    try {
        const matchingNotes = await Note.find({ 
            userId: user._id, 
            $or: [
                { title: { $regex: new RegExp(query, "i") } },
                { content: { $regex: new RegExp(query, "i") } },
            ],
        });

        return res.json({
            error: false, 
            notes: matchingNotes, 
            message: "Notes matching the search query retrieved successfully",
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
});

// ADD FOLDER
app.post('/add-folder/', authenticateToken, async (req, res) => {
    const { name } = req.body;
    const { user } = req.user;

    if (!name) {
        return res.status(400).json({ error: true, message: "Folder name is required" });
    }

    try {
        const folder = new Folder({
            name,
            userId: user._id,
        });

        await folder.save();

        return res.json({
            error: false,
            folder,
            message: "Folder added successfully",
        });
    } catch (error) {
        return res.status(500).json({ error: true, message: "Internal Server Error" })
    }
});

// EDIT FOLDER
app.put("/edit-folder/:folderId", authenticateToken, async (req, res) => {
    const folderId = req.params.folderId;
    const { name } = req.body;
    const { user } = req.user;

    if (!name) {
        return res.status(400).json({ error: true, message: "No changes provided" });
    }

    try {
        const folder = await Folder.findOne({ _id: folderId, userId: user._id });

        if (!folder) {
            return res.status(404).json({ error: true, message: "Folder not found" });
        }

        if (name) folder.name = name;

        await folder.save();

        return res.json({
            error: false, 
            folder, 
            message: "Folder updated successfully",
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
});

// GET ALL FOLDERS
app.get("/get-all-folders/", authenticateToken, async (req, res) => {
    const { user } = req.user;

    try {
        const folders = await Folder.find({ userId: user._id });
        return res.json({ error: false, folders, message: "All folders retrieved successfully" });
    } catch (error) {
        return res.status(500).json({ error: true, message: "Internal Server Error" })
    }
});

// DELETE FOLDER
app.delete("/delete-folder/:folderId", authenticateToken, async (req, res) => {
    const folderId = req.params.folderId;
    const { user } = req.user;

    try {
        const folder = await Folder.findOne({ _id: folderId, userId: user._id });

        if (!folder) {
            return res.status(404).json({ error: true, message: "Folder not found" });
        }

        await Folder.deleteOne({ _id: folderId, userId: user._id });
        await Note.deleteMany({ folderId: folderId, userId: user._id });

        return res.json({ error: false, message: "Folder deleted successfully" });
    } catch (error) {
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    } 
});

// GET ALL NOTES IN FOLDER
app.get("/get-notes/:folderId", authenticateToken, async (req, res) => {
    const { folderId } = req.params;
    const { user } = req.user;

    try {
        const notes = await Note.find({ folderId: folderId, userId: user._id }).sort({ isPinned: -1 });
        return res.json({ error: false, notes, message: "All notes associated with the folder retrieved successfully" });
    } catch (error) {
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    } 
});

// GET FOLDER
app.get("/get-folder/:folderId", authenticateToken, async (req, res) => {
    const { folderId } = req.params;
    const { user } = req.user;

    try {
        const folder = await Folder.findOne({ _id: folderId, userId: user._id });

        if (!folder) {
            return res.status(404).json({ error: true, message: "Folder not found" });
        }

        return res.json({ error: false, folder, message: "Folder retrieved successfully" });
    } catch (error) {
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    } 
});

app.listen(8000);

module.exports = app;