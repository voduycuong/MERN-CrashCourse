const database = require("./connect");
const express = require("express");
require("dotenv").config({ path: "./config.env" });

let searchRoutes = express.Router();

// #1 - Search One
searchRoutes.route("/search").get(async (req, res) => {
    try {
        let db = database.getDb();

        const searchQuery = req.query.searchQuery ? req.query.searchQuery.trim().replace(/[·]/g, '') : '';

        if (!searchQuery) {
            return res.status(400).json({ error: "Search query cannot be empty." });
        }

        console.log("Received search query:", searchQuery);

        let data = await db.collection("posts").find({ title: { $regex: new RegExp(searchQuery, "i") } }).toArray();

        if (data.length > 0) {
            res.json(data);
        } else {
            res.status(200).json({ message: "No posts found with the given search term." });
        }
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'An error occurred while fetching posts' });
    }
});

module.exports = searchRoutes;
