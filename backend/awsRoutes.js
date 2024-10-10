const database = require("./connect")
const express = require("express")
const ObjectId = require("mongodb").ObjectId
const jwt = require("jsonwebtoken")
require('dotenv').config({ path: './config.env' });
const multer = require('multer');
const upload = multer();

const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3")
let awsRoutes = express.Router()

const bucketName = process.env.BUCKET_NAME
const bucketRegion = process.env.BUCKET_REGION
const awsAccessKey = process.env.AWS_ACCESS_KEY
const awsSecretKey = process.env.AWS_SECRET_KEY

const s3Client = new S3Client({
    region: bucketRegion,
    credentials: {
        accessKeyId: awsAccessKey,
        secretAccessKey: awsSecretKey
    }
})

// #1 - Retrive One
awsRoutes.route("/images/:id").get(verifyToken, async (req, res) => {
    const id = req.params.id
    const bucketParams = {
        Bucket: bucketName,
        Key: id,
    }

    const data = await s3Client.send(new GetObjectCommand(bucketParams))

    const contentType = data.ContentType
    const srcString = await data.Body.transformToString('base64')
    const imageSource = `data:${contentType};base64, ${srcString}`

    res.json(imageSource)
})

// #2 - Create One
awsRoutes.route("/images").post(verifyToken, async (req, res) => {
    const file = req.files[0];
    if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
    }
    const bucketParams = {
        Bucket: bucketName,
        Key: file.originalname,
        Body: file.buffer,
    }

    try {
        const data = await s3Client.send(new PutObjectCommand(bucketParams));
        res.json(data);
    } catch (error) {
        console.error("Error uploading to S3:", error);
        res.status(500).json({ message: "File upload failed", error: error.message });
    }
})

function verifyToken(req, res, next) {
    const authHeaders = req.headers["authorization"]
    // console.log("Authorization Header:", authHeaders);
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

module.exports = awsRoutes