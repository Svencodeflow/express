import express from "express";
import fetch from "node-fetch";
import fs from "node:fs/promises";

const app = express();
const port = 3000;
const api = "https://jsonplaceholder.typicode.com/posts";
const api_json = './api.json';

let json_mason = [];

const backup = async () => {
    const response = await fetch(api);
    const data = await response.json();
    await fs.writeFile(api_json, JSON.stringify(data));
    json_mason = data;
};

const loadJsonMason = async () => {
    try {
        const todosData = await fs.readFile(api_json, 'utf-8');
        json_mason = JSON.parse(todosData);
    } catch (error) {
        console.error('Error:', error);
    }
};

backup();
loadJsonMason();

app.get('/status', (req, res) => {
    res.status(200).send('OK');
});

app.get('/posts', async (req, res) => {
    res.status(200).json(json_mason);
});

app.get('/posts/:id', async (req, res) => {
    const postId = req.params.id;
    const post = json_mason.find((todo) => todo.id === parseInt(postId));
    if (post) {
        res.status(200).json(post);
    } else {
        res.status(404).json({ error: 'Post nicht gefunden' });
    }
});

app.get('/todos', async (req, res) => {
    res.status(200).json(json_mason);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});