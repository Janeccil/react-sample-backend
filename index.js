const express = require('express');
const bodyParser = require('body-parser');
const { getStoredPosts, storePosts } = require('./data/posts');

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.get('/posts', async (req, res) => {
    const storedPosts = await getStoredPosts();
    res.json({ posts: storedPosts });
});

app.post('/posts', async (req, res) => {
    const existingPosts = await getStoredPosts();
    const newPost = { ...req.body, id: Math.random().toString() };
    const updatedPosts = [newPost, ...existingPosts];
    await storePosts(updatedPosts);
    res.status(201).json({ message: 'Stored new post.', post: newPost });
});

app.listen(8080, () => console.log('Backend running on port 8080!'));
