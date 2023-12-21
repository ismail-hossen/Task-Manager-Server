const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const app = express();
const cors = require("cors");
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.mongo_url, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const db = await client.db("task-manager");
    const tasksCollection = await db.collection("tasks");

    app.get("/tasks", async (req, res) => {
      const param = req.params.email;
      const result = await tasksCollection.find({ email: param }).toArray();
      res.send(result);
    });

    app.post("/create-task", async (req, res) => {
      const result = await tasksCollection.insertOne(req.body);
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
