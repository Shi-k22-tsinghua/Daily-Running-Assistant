// tests/posts.test.js
const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { User, Post, Comment, Like } = require('../models/user.model');
const userRoutes = require('../routes/user.route');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

describe('Posts API Tests', () => {
  let authToken;
  let testUser;
  let testPost;

  beforeEach(async() => {
    // Clear collections before each test
    await User.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});
    await Like.deleteMany({});

    // Create test user
    testUser = await User.create({
      username: 'testuser',
      password: 'testpass',
      nickname: 'Test User'
    });

    // Login to get token
    const loginRes = await request(app)
      .post('/api/users/login')
      .send({
        username: 'testuser',
        password: 'testpass'
      });
    authToken = loginRes.body.token;

    // Create a test post
    testPost = await Post.create({
      title: 'Test Post',
      content: 'Test Content',
      author: testUser._id,
      images: [],
      likes: 0,
      comments: [],
      postId: 123
    });
  });

  describe('Post Creation and Image Handling', () => {
    it('should upload a single image successfully', async() => {
      const testImagePath = path.join(__dirname, '../images/my-icon.png');
      const res = await request(app)
        .post('/api/users/share/posts/image')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('image', testImagePath)
        .field('username', 'testuser');

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('imageId');
    });

    it('should create a new post successfully', async() => {
      const res = await request(app)
        .post('/api/users/share/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'New Post',
          content: 'Post Content',
          username: 'testuser'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Post created successfully');
    });

    it('should create a post with multiple images', async() => {
      const testImagePath = path.join(__dirname, '../images/my-icon.png');
      const res = await request(app)
        .post('/api/users/share/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('images', testImagePath)
        .attach('images', testImagePath)
        .field('title', 'Image Post')
        .field('content', 'Post with Images')
        .field('username', 'testuser');

      expect(res.statusCode).toBe(200);
      expect(res.body.post.images.length).toBe(2);
    });

    it('should get post image successfully', async() => {
      const testImagePath = path.join(__dirname, '../images/my-icon.png');
      const uploadRes = await request(app)
        .post('/api/users/share/posts/image')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('image', testImagePath)
        .field('username', 'testuser');

      const res = await request(app)
        .get(`/api/users/posts/images/${uploadRes.body.imageId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.headers['content-type']).toMatch(/^image/);
    });

    it('should handle invalid image ID', async() => {
      const res = await request(app)
        .get('/api/users/posts/images/invalidid')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(500);
    });
  });

  describe('Post Retrieval and Management', () => {
    it('should get all posts', async() => {
      const res = await request(app)
        .get('/api/users/share/posts')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('posts');
      expect(Array.isArray(res.body.posts)).toBe(true);
    });

    it('should get a single post by ID', async() => {
      const res = await request(app)
        .get(`/api/users/share/posts/${testPost.postId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('post');
    });

    it('should get posts by username', async() => {
      const res = await request(app)
        .get(`/api/users/share/${testUser.username}/posts`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should update post successfully', async() => {
      const res = await request(app)
        .put(`/api/users/share/posts/${testPost.postId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Updated Title',
          content: 'Updated Content'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.post).toHaveProperty('title', 'Updated Title');
    });

    it('should delete post and associated data', async() => {
      const res = await request(app)
        .delete(`/api/users/share/posts/${testPost.postId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);

      // Verify cascade deletion
      const deletedPost = await Post.findOne({ postId: testPost.postId });
      expect(deletedPost).toBeNull();
    });
  });

  describe('Comments Functionality', () => {
    let testComment;

    beforeEach(async() => {
      // Create a test comment
      const commentRes = await request(app)
        .post(`/api/users/share/posts/${testPost.postId}/comments`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Test Comment',
          username: 'testuser'
        });
      testComment = commentRes.body.comment;
    });

    it('should create a comment successfully', async() => {
      const res = await request(app)
        .post(`/api/users/share/posts/${testPost.postId}/comments`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Another Comment',
          username: 'testuser'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.comment).toHaveProperty('content', 'Another Comment');
    });

    it('should get comments for a post', async() => {
      const res = await request(app)
        .get(`/api/users/share/posts/${testPost.postId}/comments`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('should delete a comment successfully', async() => {
      const res = await request(app)
        .delete(`/api/users/share/comments/${testComment.commentId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Comment deleted successfully');
    });

    it('should handle comment likes', async() => {
      const likeRes = await request(app)
        .post(`/api/users/share/posts/${testComment.commentId}/likeComment`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(likeRes.statusCode).toBe(200);
      expect(likeRes.body.comment.likes).toBe(1);

      const unlikeRes = await request(app)
        .post(`/api/users/share/posts/${testComment.commentId}/unlikeComment`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(unlikeRes.statusCode).toBe(200);
      expect(unlikeRes.body.comment.likes).toBe(0);
    });
  });

  describe('Post Likes Functionality', () => {
    it('should handle post likes', async() => {
      const likeRes = await request(app)
        .post(`/api/users/share/posts/${testPost.postId}/likePost`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ username: 'testuser' });

      expect(likeRes.statusCode).toBe(200);
      expect(likeRes.body.post.likes).toBe(1);

      const unlikeRes = await request(app)
        .post(`/api/users/share/posts/${testPost.postId}/unlikePost`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ username: 'testuser' });

      expect(unlikeRes.statusCode).toBe(200);
      expect(unlikeRes.body.post.likes).toBe(0);
    });

    it('should check if post is liked', async() => {
      // First like the post
      await request(app)
        .post(`/api/users/share/posts/${testPost.postId}/likePost`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ username: 'testuser' });

      const res = await request(app)
        .get(`/api/users/share/posts/${testPost.postId}/ifLikedPost`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ username: 'testuser' });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('liked', true);
    });
  });

  describe('Error Handling', () => {
    it('should handle non-existent user', async() => {
      const res = await request(app)
        .post('/api/users/share/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Post',
          content: 'Content',
          username: 'nonexistent'
        });

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('message', 'User not found');
    });

    it('should handle non-existent post', async() => {
      const res = await request(app)
        .get('/api/users/share/posts/999999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('message', 'Post not found');
    });

    it('should handle invalid file types', async() => {
      const invalidFilePath = path.join(__dirname, 'temp.txt');
      fs.writeFileSync(invalidFilePath, 'This is not an image');

      const res = await request(app)
        .post('/api/users/share/posts/image')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('image', invalidFilePath)
        .field('username', 'testuser');

      fs.unlinkSync(invalidFilePath);

      // Check response based on your error handling
      expect(res.statusCode).toBe(200); // or whatever your implementation returns
    });
  });
});

// Add to posts.test.js
describe('Error Handling for Posts and Comments', () => {
  let authToken;
  let testUser;
  let testPost;

  beforeEach(async() => {
    await User.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});

    testUser = await User.create({
      username: 'testuser',
      password: 'testpass'
    });

    const loginRes = await request(app)
      .post('/api/users/login')
      .send({
        username: 'testuser',
        password: 'testpass'
      });
    authToken = loginRes.body.token;

    testPost = await Post.create({
      title: 'Test Post',
      content: 'Test Content',
      author: testUser._id,
      postId: 123
    });
  });

  describe('Post Creation Edge Cases', () => {
    it('should handle multiple parallel uploads for same post', async() => {
      const testImagePath = path.join(__dirname, '../images/my-icon.png');

      // Create two parallel upload requests
      const [res1, res2] = await Promise.all([
        request(app)
          .post('/api/users/share/posts')
          .set('Authorization', `Bearer ${authToken}`)
          .attach('images', testImagePath)
          .field('title', 'Parallel Post')
          .field('content', 'Test Content')
          .field('username', 'testuser'),

        request(app)
          .post('/api/users/share/posts')
          .set('Authorization', `Bearer ${authToken}`)
          .attach('images', testImagePath)
          .field('title', 'Parallel Post')
          .field('content', 'Test Content')
          .field('username', 'testuser')
      ]);

      expect(res1.statusCode).toBe(200);
      expect(res2.statusCode).toBe(200);
    });
  });

  describe('Comment System Edge Cases', () => {
    it('should handle comment creation with missing content', async() => {
      const res = await request(app)
        .post(`/api/users/share/posts/${testPost.postId}/comments`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          username: 'testuser'
          // Missing content field
        });

      expect(res.statusCode).toBe(500);
    });

    it('should handle deletion of already deleted comment', async() => {
      // Create and delete a comment
      const comment = await Comment.create({
        content: 'Test Comment',
        author: testUser._id,
        post: testPost._id,
        commentId: 456
      });

      await Comment.deleteOne({ _id: comment._id });

      const res = await request(app)
        .delete(`/api/users/share/comments/${comment.commentId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(404);
    });
  });

  describe('Post Management Edge Cases', () => {
    it('should handle update of non-existent post', async() => {
      const res = await request(app)
        .put('/api/users/share/posts/999')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Updated Title',
          content: 'Updated Content'
        });

      expect(res.statusCode).toBe(404);
    });

  });
});

// Add to users.test.js
describe('User Preferences Edge Cases', () => {
  let testUser;
  let authToken;

  beforeEach(async() => {
    await User.deleteMany({});

    testUser = await User.create({
      username: 'testuser',
      password: 'testpass'
    });

    const loginRes = await request(app)
      .post('/api/users/login')
      .send({
        username: 'testuser',
        password: 'testpass'
      });
    authToken = loginRes.body.token;
  });

  it('should handle partial preference updates', async() => {
    const res = await request(app)
      .put(`/api/users/${testUser.username}/preferences`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ theme: 'dark' });

    expect(res.statusCode).toBe(200);
    expect(res.body.preferences.theme).toBe('dark');
    expect(res.body.preferences.notifications).toBe(true); // Default value
    expect(res.body.preferences.language).toBe('en'); // Default value
  });

  it('should handle multiple rapid preference updates', async() => {
    const updates = ['light', 'dark', 'system'].map(theme =>
      request(app)
        .put(`/api/users/${testUser.username}/preferences`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ theme })
    );

    const results = await Promise.all(updates);
    const finalRes = results[results.length - 1];

    expect(finalRes.statusCode).toBe(200);
    expect(finalRes.body.preferences.theme).toBe('system');
  });

});
