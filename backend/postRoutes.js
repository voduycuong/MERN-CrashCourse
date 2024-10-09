const database = require("./connect")
const express = require("express")
const ObjectId = require("mongodb").ObjectId
const jwt = require("jsonwebtoken")
require("dotenv").config({ path: "./config.env" })

let postRoutes = express.Router()

// #1 - Retrive All
postRoutes.route("/posts").get(verifyToken, async (req, res) => {
    let db = database.getDb()
    let data = await db.collection("posts").find({}).toArray()

    if (data.length > 0) {
        res.json(data)
    } else {
        throw new Error("Data was not found :(")
    }
})

// #2 - Retrive One
postRoutes.route("/posts/:id").get(verifyToken, async (req, res) => {
    let db = database.getDb()
    let data = await db.collection("posts").findOne({
        _id: ObjectId.createFromHexString(req.params.id)
    })

    if (Object.keys(data).length > 0) {
        res.json(data)
    } else {
        throw new Error("Data was not found :(")
    }
})

// #3 - Create One
postRoutes.route("/posts").post(verifyToken, async (req, res) => {
    let db = database.getDb()

    let mongoObject = {
        title: req.body.title,
        description: req.body.description,
        content: req.body.content,
        author: req.body.user._id,
        dateCreated: req.body.dateCreated,
        imageId: req.body.imageId
    }

    let data = await db.collection("posts").insertOne(mongoObject)
    res.json(data)
})

// #4 - Update One
postRoutes.route("/posts/:id").put(verifyToken, async (req, res) => {
    let db = database.getDb()

    let mongoObject = {
        $set: {
            title: req.body.title,
            description: req.body.description,
            content: req.body.content,
            author: req.body.author,
            dateCreated: req.body.dateCreated,
            imageId: req.body.imageId
        }
    }

    let data = await db.collection("posts").updateOne({ _id: ObjectId.createFromHexString(req.params.id) }, mongoObject)
    res.json(data)
})

// #5 - Delete One
postRoutes.route("/posts/:id").delete(verifyToken, async (req, res) => {
    let db = database.getDb()
    let data = await db.collection("posts").deleteOne({
        _id: ObjectId.createFromHexString(req.params.id)
    })

    res.json(data)
})

function verifyToken(req, res, next) {
    const authHeaders = req.headers["authorization"]
    const token = authHeaders && authHeaders.split(' ')[1]
    if (!token) {
        return res.status(401).json({ message: "Authorization token is missing" })
    }
    jwt.verify(token, process.env.SECRET_KEY, (error, user) => {
        if (error) {
            return res.status(403).json({ message: "Invalid token" })
        }

        req.body.user = user
        next()
    })
}

module.exports = postRoutes