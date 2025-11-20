const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const Course = mongoose.model('Course'); 
const { expect } = require('@jest/globals'); 

// Mock tokens
const ADMIN_TOKEN = 'mock-admin-jwt-token-for-testing'; 
const MOCK_USER_ID = new mongoose.Types.ObjectId(); 



beforeAll(async () => {
    if (!mongoose.connection.readyState) {
        await mongoose.connect(process.env.MONGO_URI);
    }
});

beforeEach(async () => {
    await Course.deleteMany({});
});

afterAll(async () => {
    if (process.env.NODE_ENV === 'test') {
        await mongoose.connection.db.dropDatabase();
    }
});

// Test Data 
const testCourse = {
    title: 'Advanced React Hooks',
    description: 'Master custom hooks and state management.',
    instructor: 'Admin Tester',
    lessons: [{ title: 'Lesson 1: Intro', vidUrl: 'http://youtube.com/1' }]
};

describe('Course API Endpoints (CRUD)', () => {

    // Public route - GET all courses 
    test('GET /api/courses should return an empty array initially', async () => {
        const response = await request(app)
            .get('/api/courses')
            .expect(200);

        
        expect(response.body).toEqual([]);
    });
    
    //  Protected route - POST a new course 
    test('POST /api/courses should return 401 without an Admin token', async () => {
        const response = await request(app)
            .post('/api/courses')
            .send(testCourse)
            .expect(401); 

        expect(response.body).toHaveProperty('message');
    });

    //  Public route - GET course by ID 
    test('GET /api/courses/:id should return 404 for non-existent course', async () => {
        const fakeId = '654321098765432109876543';
        const response = await request(app)
            .get(`/api/courses/${fakeId}`)
            .expect(404);
            
        expect(response.body).toHaveProperty('message', 'Course not found');
    });
});
