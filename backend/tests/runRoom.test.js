const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { User } = require('../models/user.model');
const { RunRoom } = require('../models/runRoom.model');
const runRoomRoutes = require('../routes/runRoom.route');

const app = express();
app.use(express.json());
app.use('/api/runrooms', runRoomRoutes);

describe('RunRoom API Tests', () => {
    let testUser;
    let testRoom;
    const testRunID = 'test123';
    const testPassword = 'roompass';

    beforeEach(async () => {
        // Clear collections
        await User.deleteMany({});
        await RunRoom.deleteMany({});

        // Create test user
        testUser = await User.create({
            username: 'testrunner',
            password: 'testpass',
            nickname: 'Test Runner'
        });

        // Create test room
        testRoom = await RunRoom.create({
            runID: testRunID,
            password: testPassword,
            runners: [{
                username: testUser.username,
                nickname: testUser.nickname,
                longitude: 0,
                latitude: 0,
                meters: 0,
                seconds: 0,
                running: false,
                markers: [],
                in_room: true
            }]
        });
    });

    describe('Room Management', () => {
        it('should create a new room successfully', async () => {
            const res = await request(app)
                .post('/api/runrooms/create')
                .send({
                    runID: 'newroom123',
                    password: 'newpass'
                });

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('message', 'Room created successfully');
            expect(res.body.room).toHaveProperty('runID', 'newroom123');
        });

        it('should get all rooms', async () => {
            const res = await request(app)
                .get('/api/runrooms/all');

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('rooms');
            expect(Array.isArray(res.body.rooms)).toBe(true);
        });

        it('should get a single room by runID', async () => {
            const res = await request(app)
                .get(`/api/runrooms/${testRunID}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.data).toHaveProperty('runID', testRunID);
            expect(Array.isArray(res.body.data.runners)).toBe(true);
        });

        it('should prevent duplicate room creation', async () => {
            const res = await request(app)
                .post('/api/runrooms/create')
                .send({
                    runID: testRunID,
                    password: testPassword
                });

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('error', 'Room already exists');
        });
    });

    describe('Runner Management', () => {
        it('should allow a new runner to join room', async () => {
            const newRunner = await User.create({
                username: 'newrunner',
                password: 'pass',
                nickname: 'New Runner'
            });

            const res = await request(app)
                .post('/api/runrooms/join')
                .send({
                    runID: testRunID,
                    password: testPassword,
                    username: newRunner.username,
                    longitude: 10,
                    latitude: 20
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.room.runners).toHaveLength(2);
            expect(res.body.room.runners[1].username).toBe(newRunner.username);
        });

        it('should update runner location', async () => {
            const res = await request(app)
                .post('/api/runrooms/update')
                .send({
                    runID: testRunID,
                    password: testPassword,
                    username: testUser.username,
                    longitude: 15,
                    latitude: 25
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.room.runners[0].longitude).toBe(15);
            expect(res.body.room.runners[0].latitude).toBe(25);
        });

        it('should allow runner to leave room', async () => {
            const res = await request(app)
                .post('/api/runrooms/leave')
                .send({
                    runID: testRunID,
                    username: testUser.username,
                    password: testPassword
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.updatedRoom.runners[0].in_room).toBe(false);
        });
    });

    describe('Error Handling', () => {
        it('should handle invalid room ID', async () => {
            const res = await request(app)
                .get('/api/runrooms/invalidroom');

            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('code', 'ROOM_NOT_FOUND');
        });

        it('should handle invalid password when joining', async () => {
            const res = await request(app)
                .post('/api/runrooms/join')
                .send({
                    runID: testRunID,
                    password: 'wrongpass',
                    username: testUser.username,
                    longitude: 0,
                    latitude: 0
                });

            expect(res.statusCode).toBe(401);
            expect(res.body).toHaveProperty('error', 'Invalid password');
        });

        it('should handle missing required fields', async () => {
            const res = await request(app)
                .post('/api/runrooms/update')
                .send({
                    runID: testRunID,
                    password: testPassword
                    // Missing username and coordinates
                });

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('error', 'Missing required fields');
        });

        it('should handle non-existent user', async () => {
            const res = await request(app)
                .post('/api/runrooms/join')
                .send({
                    runID: testRunID,
                    password: testPassword,
                    username: 'nonexistentuser',
                    longitude: 0,
                    latitude: 0
                });

            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('error', 'User not found');
        });
    });

    describe('Room Deletion', () => {
        it('should delete a room with correct password', async () => {
            const res = await request(app)
                .delete('/api/runrooms/delete')
                .send({
                    runID: testRunID,
                    password: testPassword
                });

            expect(res.statusCode).toBe(200);
            const deletedRoom = await RunRoom.findOne({ runID: testRunID });
            expect(deletedRoom).toBeNull();
        });

        it('should not delete room with incorrect password', async () => {
            const res = await request(app)
                .delete('/api/runrooms/delete')
                .send({
                    runID: testRunID,
                    password: 'wrongpass'
                });

            expect(res.statusCode).toBe(403);
            expect(res.body).toHaveProperty('error', 'Invalid password for the room.');
        });

        it('should delete all rooms', async () => {
            const res = await request(app)
                .delete('/api/runrooms/deleteAll');

            expect(res.statusCode).toBe(200);
            const remainingRooms = await RunRoom.countDocuments();
            expect(remainingRooms).toBe(0);
        });
    });
});