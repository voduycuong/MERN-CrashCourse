const database = require("./connect");
const express = require("express");
const ObjectId = require("mongodb").ObjectId;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config({ path: './config.env' });

let userRoutes = express.Router();
const SALT_ROUND = 6;

// #1 - Retrieve All Users
userRoutes.route("/users").get(async (req, res) => {
    try {
        let db = database.getDb();
        let data = await db.collection("users").find({}).toArray();

        if (data.length > 0) {
            res.json(data);
        } else {
            res.status(404).json({ message: "No users found" });
        }
    } catch (error) {
        console.error("Error retrieving users:", error);
        res.status(500).json({ message: "An error occurred while fetching users" });
    }
});

// #2 - Retrieve One User by ID
userRoutes.route("/users/:id").get(async (req, res) => {
    try {
        let db = database.getDb();
        let data = await db.collection("users").findOne({ _id: ObjectId.createFromHexString(req.params.id) });

        if (data) {
            res.json(data);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error("Error retrieving user:", error);
        res.status(500).json({ message: "An error occurred while fetching the user" });
    }
});

// #3 - Create a New User
userRoutes.route("/users").post(async (req, res) => {
    try {
        let db = database.getDb();

        const takenEmail = await db.collection("users").findOne({ email: req.body.email });

        if (takenEmail) {
            return res.status(400).json({ message: "The email is already taken" });
        }

        const hash = await bcrypt.hash(req.body.password, SALT_ROUND);

        let mongoObject = {
            name: req.body.name,
            email: req.body.email,
            password: hash,
            joinDate: new Date(),
            posts: []
        };

        let data = await db.collection("users").insertOne(mongoObject);
        res.status(201).json({ message: "User created successfully", data });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "An error occurred while creating the user" });
    }
});

// #4 - Update User Information
userRoutes.route("/users/:id").put(async (req, res) => {
    try {
        let db = database.getDb();

        let mongoObject = {
            $set: {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                joinDate: req.body.joinDate,
                posts: req.body.posts
            }
        };

        let data = await db.collection("users").updateOne({ _id: ObjectId.createFromHexString(req.params.id) }, mongoObject);
        res.json({ message: "User updated successfully", data });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "An error occurred while updating the user" });
    }
});

// #5 - Delete a User
userRoutes.route("/users/:id").delete(async (req, res) => {
    try {
        let db = database.getDb();
        let data = await db.collection("users").deleteOne({ _id: ObjectId.createFromHexString(req.params.id) });

        if (data.deletedCount === 1) {
            res.json({ message: "User deleted successfully" });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "An error occurred while deleting the user" });
    }
});

// #6 - User Login
userRoutes.route("/users/login").post(async (req, res) => {
    try {
        let db = database.getDb();

        const user = await db.collection("users").findOne({ email: req.body.email });

        if (user) {
            let confirmation = await bcrypt.compare(req.body.password, user.password);
            if (confirmation) {
                const token = jwt.sign({ id: user._id, email: user.email }, process.env.SECRET_KEY, { expiresIn: "1h" });
                res.json({ success: true, token });
            } else {
                res.status(401).json({ success: false, message: "Invalid email or password" });
            }
        } else {
            res.status(401).json({ success: false, message: "Invalid email or password" });
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "An error occurred during login" });
    }
});

module.exports = userRoutes;
