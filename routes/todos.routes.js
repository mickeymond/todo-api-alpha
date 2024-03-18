import { Router } from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config({ path: ['.env.local'] });

const router = Router();

const url = process.env.MONGO_URI;

const client = new MongoClient(url);
const todoDb = 'todo-db';
const todoCollection = 'todos';

// Define routes
router.post('/todos', async (req, res) => {
    // Connect mongodb client
    await client.connect();
    // Get access to todo database
    const db = client.db(todoDb);
    // Get access to todos collection
    const collection = db.collection(todoCollection);
    // Add todo document to todos collection
    const insertOneResult = await collection.insertOne({
        ...req.body,
        isCompleted: false,
        createdAt: new Date()
    });
    // Disconnect mongodb client
    await client.close();
    // Return reponse
    res.json(insertOneResult);
});

router.get('/todos', async (req, res) => {
    // Connect mongodb client
    await client.connect();
    // Get access to todo database
    const db = client.db(todoDb);
    // Get access to todos collection
    const collection = db.collection(todoCollection);
    // Find all todos from todos collection
    const limit = parseInt(req.query.limit) || 10;
    const findResult = await collection.find({}).limit(limit).toArray();
    // Disconnect mongodb client
    await client.close();
    // Return reponse
    res.json(findResult);
});

router.delete('/todos', async (req, res) => {
    // Connect mongodb client
    await client.connect();
    // Get access to todo database
    const db = client.db(todoDb);
    // Get access to todos collection
    const collection = db.collection(todoCollection);
    // Delete all todos from todos collection
    const deleteManyResult = await collection.deleteMany({});
    // Disconnect mongodb client
    await client.close();
    // Return reponse
    res.json(deleteManyResult);
});

router.get('/todos/:id', (req, res) => {
    res.send(`Get todo with id: ${req.params.id}`);
});

router.patch('/todos/:id', (req, res) => {
    res.send(`Update todo with id: ${req.params.id}`);
});

router.delete('/todos/:id', (req, res) => {
    res.send(`Delete todo with id: ${req.params.id}`);
});

// Export router
export default router;