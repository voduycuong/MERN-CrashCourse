
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config({ path: './config.env' });

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.dan3x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

let database;

module.exports = {
    connectToServer: async () => {
        try {
            await client.connect();
            database = client.db(process.env.PROJECT_NAME);
            console.log("Successfully connected to MongoDB!");
        } catch (error) {
            console.error("Error connecting to MongoDB:", error.message);
            process.exit(1);
        }
    },
    getDb: () => {
        if (!database) {
            throw new Error("Database not initialized. Call connectToServer first.");
        }
        return database;
    },
    getClient: () => client
};

/* async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
run().catch(console.dir); */
