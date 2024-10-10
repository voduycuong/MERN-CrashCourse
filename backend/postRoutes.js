const database = require("./connect");
const express = require("express");
const ObjectId = require("mongodb").ObjectId;
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "./config.env" });

let postRoutes = express.Router();

// #1 - Retrieve All
postRoutes.route("/posts").get(verifyToken, async (req, res) => {
    try {
        let db = database.getDb();
        let data = await db.collection("posts").find({}).toArray();

        if (data.length > 0) {
            res.json(data);
        } else {
            res.status(404).json({ message: "No posts found" });
        }
    } catch (error) {
        console.error("Error retrieving posts:", error);
        res.status(500).json({ message: "An error occurred while retrieving posts", error: error.message });
    }
});

// #2 - Retrieve One
postRoutes.route("/posts/:id").get(verifyToken, async (req, res) => {
    try {
        let db = database.getDb();
        const postId = req.params.id;
        if (!ObjectId.isValid(postId)) {
            return res.status(400).json({ message: "Invalid post ID format" });
        }

        let data = await db.collection("posts").findOne({ _id: ObjectId.createFromHexString(postId) });

        if (data) {
            res.json(data);
        } else {
            res.status(404).json({ message: "Post not found" });
        }
    } catch (error) {
        console.error("Error retrieving post:", error);
        res.status(500).json({ message: "An error occurred while retrieving the post", error: error.message });
    }
});

// #3 - Create One
postRoutes.route("/posts").post(verifyToken, async (req, res) => {
    try {
        let db = database.getDb();

        const { title, description, content, dateCreated, imageId } = req.body;
        if (!title || !description || !content) {
            return res.status(400).json({ message: "Title, description, and content are required" });
        }

        let mongoObject = {
            title,
            description,
            content,
            author: req.body.user._id,
            dateCreated: new Date(dateCreated),
            imageId,
        };

        let data = await db.collection("posts").insertOne(mongoObject);
        res.status(201).json(data);
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ message: "An error occurred while creating the post", error: error.message });
    }
});

// #4 - Update One
postRoutes.route("/posts/:id").put(verifyToken, async (req, res) => {
    try {
        let db = database.getDb();
        const postId = req.params.id;
        if (!ObjectId.isValid(postId)) {
            return res.status(400).json({ message: "Invalid post ID format" });
        }

        let mongoObject = {
            $set: {
                title: req.body.title,
                description: req.body.description,
                content: req.body.content,
                author: req.body.author,
                dateCreated: new Date(req.body.dateCreated),
                imageId: req.body.imageId,
            },
        };

        let data = await db.collection("posts").updateOne({ _id: ObjectId.createFromHexString(postId) }, mongoObject);
        if (data.modifiedCount > 0) {
            res.json({ message: "Post updated successfully", data });
        } else {
            res.status(404).json({ message: "Post not found or no changes made" });
        }
    } catch (error) {
        console.error("Error updating post:", error);
        res.status(500).json({ message: "An error occurred while updating the post", error: error.message });
    }
});

// #5 - Delete One
postRoutes.route("/posts/:id").delete(verifyToken, async (req, res) => {
    try {
        let db = database.getDb();
        const postId = req.params.id;
        if (!ObjectId.isValid(postId)) {
            return res.status(400).json({ message: "Invalid post ID format" });
        }

        let data = await db.collection("posts").deleteOne({ _id: ObjectId.createFromHexString(postId) });
        if (data.deletedCount > 0) {
            res.json({ message: "Post deleted successfully" });
        } else {
            res.status(404).json({ message: "Post not found" });
        }
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ message: "An error occurred while deleting the post", error: error.message });
    }
});

// Token Verification Middleware
function verifyToken(req, res, next) {
    const authHeaders = req.headers["authorization"];
    const token = authHeaders && authHeaders.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: "Authorization token is missing" });
    }
    jwt.verify(token, process.env.SECRET_KEY, (error, user) => {
        if (error) {
            return res.status(403).json({ message: "Invalid token" });
        }

        req.body.user = user;
        next();
    });
}

module.exports = postRoutes;
