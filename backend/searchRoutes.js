const database = require("./connect")
const express = require("express")
require("dotenv").config({ path: "./config.env" })

let searchRoutes = express.Router()

// #1 - Search One
searchRoutes.route("/search").get(async (req, res) => {
    let db = database.getDb();
    console.log("Received search query:", req.query.searchQuery.replace(/[·]/g, ''));

    try {
        const searchQuery = req.query.searchQuery.replace(/[·]/g, '')

        if (!searchQuery) {
            return res.status(400).json({ error: "Search query cannot be empty." });
        }

        let data = await db.collection("posts").find({ title: { $regex: new RegExp(searchQuery, "i") } }).toArray();

        if (data.length > 0) {
            res.json(data);
        } else {
            res.status(200).json({ error: "No posts found with the given search term." });
        }

    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'An error occurred while fetching posts' });
    }
});

module.exports = searchRoutes