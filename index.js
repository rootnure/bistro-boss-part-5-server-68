const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3al0nc5.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const menuCollection = client.db("bistroBoss").collection("menu");
        const reviewCollection = client.db("bistroBoss").collection("reviews");
        const cartCollection = client.db("bistroBoss").collection("cart");

        // menu related api
        app.get("/menu", async (req, res) => {
            const result = await menuCollection.find().toArray();
            res.send(result);
        })

        // review related api
        app.get("/reviews", async (req, res) => {
            const result = await reviewCollection.find().toArray();
            res.send(result);
        })

        // cart related api
        /* carts collection */
        app.get("/cart", async(req,res) => {
            const email= req.query.email;
            const query = {email: email}
            const result = await cartCollection.find(query).toArray();
            res.send(result);
        })

        app.post("/cart", async(req,res) => {
            const cart = req.body;
            const result = await cartCollection.insertOne(cart);
            res.send(result);
        })

        app.delete("/cart/:id", async(req,res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result =await cartCollection.deleteOne(query);
            res.send(result);
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send({ msg: "Boss is online..." });
})

app.listen(port, () => {
    console.log(`Boss is online in port ${port}`);
})

/**
 * --------------------------------------
 *         NAMING CONVENTION
 * --------------------------------------
 * app.get('/users')
 * app.get('/users/:id')
 * app.post('/users')
 * app.put('/users/:id')
 * app.patch('/users/:id')
 * app.delete('users/:id')
 */