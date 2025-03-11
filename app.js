const express = require('express');
const bodyParser = require('body-parser');
const { getStoredPosts, storePosts } = require('./data/posts');

const app = express();
app.use(bodyParser.json());

// CORS Middleware - Allows requests from different origins (Frontend)
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
	next();
});

// GET: Fetch All Posts
app.get('/posts', async (req, res) => {
	const storedPosts = await getStoredPosts();
	res.json({ posts: storedPosts });
});

// GET: Fetch a Single Post
app.get('/posts/:id', async (req, res) => {
	const storedPosts = await getStoredPosts();
	const post = storedPosts.find((post) => post.id === req.params.id);
	if (!post) return res.status(404).json({ message: 'Post not found' });
	res.json({ post });
});

// POST: Create a New Post
app.post('/posts', async (req, res) => {
	const existingPosts = await getStoredPosts();
	const postData = req.body;

	if (!postData.body || !postData.author) {
		return res.status(400).json({ message: 'Invalid post data' });
	}

	const newPost = { ...postData, id: Date.now().toString() };
	const updatedPosts = [newPost, ...existingPosts];

	await storePosts(updatedPosts);
	res.status(201).json({ message: 'Stored new post.', post: newPost });
});

// PUT: Update a Post
app.put('/posts/:id', async (req, res) => {
	const storedPosts = await getStoredPosts();
	const postIndex = storedPosts.findIndex((post) => post.id === req.params.id);

	if (postIndex === -1) return res.status(404).json({ message: 'Post not found' });

	storedPosts[postIndex] = { ...storedPosts[postIndex], ...req.body };
	await storePosts(storedPosts);

	res.json({ message: 'Post updated.', post: storedPosts[postIndex] });
});

// DELETE: Remove a Post
app.delete('/posts/:id', async (req, res) => {
	const storedPosts = await getStoredPosts();
	const updatedPosts = storedPosts.filter((post) => post.id !== req.params.id);

	if (storedPosts.length === updatedPosts.length) {
		return res.status(404).json({ message: 'Post not found' });
	}

	await storePosts(updatedPosts);
	res.json({ message: 'Post deleted.' });
});

// Start Server
app.listen(8080, () => console.log('Server running on http://localhost:8080'));
