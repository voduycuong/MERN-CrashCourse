const connect = require("./connect")
const express = require("express")
const cors = require("cors")
const posts = require("./postRoutes")
const users = require("./userRoutes")
const searchRoutes = require('./searchRoutes')
const awsRoutes = require("./awsRoutes")
const multer = require("multer")
const upload = multer()

const app = express()

app.use(cors())
app.use(express.json())
app.use(upload.any())
app.use(posts)
app.use(users)
app.use("/", searchRoutes)
app.use(awsRoutes)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    connect.connectToServer()
    console.log(`Server is running on port ${PORT}`)
})