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
      postId: '123'
    });
  });

  afterEach(async () => {
    // Restore original GridFS if it was mocked
    if (mongoose.mongo.GridFSBucket.mockRestore) {
      mongoose.mongo.GridFSBucket.mockRestore();
    }
  });

  describe('Post Management', () => {
    it('should update post successfully', async() => {
      const res = await request(app)
        .put(`/api/users/share/posts/${testPost._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Updated Title',
          content: 'Updated Content',
          username: testUser.username
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.post.title).toBe('Updated Title');
    });

    it('should delete post and associated data', async() => {
      const res = await request(app)
        .delete(`/api/users/share/posts/${testPost._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ username: testUser.username });

      expect(res.statusCode).toBe(200);
      const deletedPost = await Post.findById(testPost._id);
      expect(deletedPost).toBeNull();
    });

    it('should handle update of non-existent post', async() => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/api/users/share/posts/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Updated Title',
          content: 'Updated Content',
          username: testUser.username
        });

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('message', 'Post not found');
    });
  });

  describe('Post Creation with Images', () => {
    it('should create post with multiple images', async () => {
      const mockImages = [
        { buffer: Buffer.from('fake image 1'), mimetype: 'image/jpeg' },
        { buffer: Buffer.from('fake image 2'), mimetype: 'image/jpeg' }
      ];

      const res = await request(app)
        .post('/api/users/share/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .field('username', 'testuser')
        .field('title', 'Test Post')
        .field('content', 'Test Content')
        .attach('images', mockImages[0].buffer, 'image1.jpg')
        .attach('images', mockImages[1].buffer, 'image2.jpg');

      expect(res.status).toBe(200);
      expect(res.body.post).toBeDefined();
      expect(res.body.post.images).toBeDefined();
    });

    it('should handle GridFS errors when uploading images', async () => {
      const originalGridFS = mongoose.mongo.GridFSBucket;
      mongoose.mongo.GridFSBucket = jest.fn().mockImplementation(() => ({
        openUploadStream: () => {
          throw new Error('GridFS error');
        }
      }));

      const res = await request(app)
        .post('/api/users/share/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .field('username', 'testuser')
        .field('title', 'Test Post')
        .field('content', 'Test Content')
        .attach('images', Buffer.from('test image'), 'test.jpg');

      expect(res.status).toBe(500);
      
      mongoose.mongo.GridFSBucket = originalGridFS;
    });
  });

  describe('Comments System', () => {
    let testComment;

    beforeEach(async() => {
      testComment = await Comment.create({
        content: 'Test Comment',
        author: testUser._id,
        post: testPost._id,
        commentId: Date.now().toString()
      });

      await Post.findByIdAndUpdate(testPost._id, {
        $push: { comments: testComment._id }
      });
    });

    it('should get comments for a post', async() => {
      const res = await request(app)
        .get(`/api/users/share/posts/${testPost._id}/comments`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('should delete a comment successfully', async() => {
      const res = await request(app)
        .delete(`/api/users/share/comments/${testComment._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ username: testUser.username });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Comment deleted successfully');
    });

    it('should handle deletion of already deleted comment', async() => {
      await Comment.findByIdAndDelete(testComment._id);

      const res = await request(app)
        .delete(`/api/users/share/comments/${testComment._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ username: testUser.username });

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('message', 'Comment not found');
    });
  });
});