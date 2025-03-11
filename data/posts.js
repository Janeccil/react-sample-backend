const fs = require('node:fs/promises');
const filePath = 'posts.json';

// Ensure the file exists
async function ensureFileExists() {
	try {
		await fs.access(filePath);
	} catch {
		await fs.writeFile(filePath, JSON.stringify({ posts: [] }));
	}
}

// Get all stored posts
async function getStoredPosts() {
	await ensureFileExists();
	const rawFileContent = await fs.readFile(filePath, { encoding: 'utf-8' });
	const data = JSON.parse(rawFileContent);
	return data.posts || [];
}

// Store updated posts
async function storePosts(posts) {
	await ensureFileExists();
	await fs.writeFile(filePath, JSON.stringify({ posts }));
}

exports.getStoredPosts = getStoredPosts;
exports.storePosts = storePosts;
