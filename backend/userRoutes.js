const database = require("./connect")
const express = require("express")
const ObjectId = require("mongodb").ObjectId
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require('dotenv').config({ path: './config.env' });

let userRoutes = express.Router()
const SALT_ROUND = 6

// #1 - Retrive All
userRoutes.route("/users").get(async (req, res) => {
    let db = database.getDb()
    let data = await db.collection("users").find({}).toArray()

    if (data.length > 0) {
        res.json(data)
    } else {
        throw new Error("Data was not found :(")
    }
})

// #2 - Retrive One
userRoutes.route("/users/:id").get(async (req, res) => {
    let db = database.getDb()
    let data = await db.collection("users").findOne({
        _id: ObjectId.createFromHexString(req.params.id)
    })

    if (Object.keys(data).length > 0) {
        res.json(data)
    } else {
        throw new Error("Data was not found :(")
    }
})

// #3 - Create One
userRoutes.route("/users").post(async (req, res) => {
    let db = database.getDb()

    const takenEmail = await db.collection("users").findOne({ email: req.body.email })

    if (takenEmail) {
        res.json({ message: "The email is taken" })
    } else {
        const hash = await bcrypt.hash(req.body.password, SALT_ROUND)

        let mongoObject = {
            name: req.body.name,
            email: req.body.email,
            password: hash,
            joinDate: new Date(),
            posts: []
        }

        let data = await db.collection("users").insertOne(mongoObject)
        res.json(data)
    }
})

// #4 - Update One
userRoutes.route("/users/:id").put(async (req, res) => {
    let db = database.getDb()

    let mongoObject = {
        $set: {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            joinDate: req.body.joinDate,
            posts: req.body.posts
        }
    }

    let data = await db.collection("users").updateOne({ _id: ObjectId.createFromHexString(req.params.id) }, mongoObject)
    res.json(data)
})

// #5 - Delete One
userRoutes.route("/users/:id").delete(async (req, res) => {
    let db = database.getDb()
    let data = await db.collection("users").deleteOne({
        _id: ObjectId.createFromHexString(req.params.id)
    })

    res.json(data)
})

// #6 - Login
userRoutes.route("/users/login").post(async (req, res) => {
    let db = database.getDb()

    const user = await db.collection("users").findOne({ email: req.body.email })

    if (user) {
        let confirmation = await bcrypt.compare(req.body.password, user.password)
        if (confirmation) {
            const token = jwt.sign(user, process.env.SECRET_KEY, { expiresIn: "1h" })
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Incorrect Password" })
        }
    } else {
        res.json({ success: false, message: "User not found" })
    }

})

module.exports = userRoutes