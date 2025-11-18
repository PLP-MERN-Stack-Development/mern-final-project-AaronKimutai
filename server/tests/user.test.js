const request = require('supertest');
const app = require('../server'); 
const mongoose = require('mongoose');


const MOCK_TOKEN = 'mock-clerk-jwt-token-for-testing-12345'; 


beforeAll(async () => {
    if (process.env.MONGO_URI) {
        await mongoose.connect(process.env.MONGO_URI); 
    }
});

// After all tests in this file complete, close the database connection
afterAll(async () => {
    await mongoose.connection.close();
});



describe('User API Endpoints', () => {

    // Check the base route to ensure the Express server is responsive.
    test('GET / should return 200 and "Server is running"', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('Server is running');
    });

    //  CRITICAL TEST 
    test('GET /api/users/me should return 401 if no token is provided', async () => {
        const response = await request(app)
            .get('/api/users/me')
            .expect('Content-Type', /json/)
            .expect(401); 
        
        
        expect(response.body).toHaveProperty('message');
    });

    // Validates that an invalid token is rejected.
    test('GET /api/users/me should return 401 with an invalid mock token', async () => {
        const response = await request(app)
            .get('/api/users/me')
            .set('Authorization', `Bearer ${MOCK_TOKEN}`) 
            .expect('Content-Type', /json/)
            .expect(401); 
        
        
        expect(response.body).toHaveProperty('message'); 
    });

    // Ensure the Course Enrollment route is also protected.
    test('POST /api/users/enroll/:courseId should return 401 without authentication', async () => {
        const testCourseId = '654321098765432109876543'; 
        const response = await request(app)
            .post(`/api/users/enroll/${testCourseId}`)
            .send({}) 
            .expect('Content-Type', /json/)
            .expect(401);

        expect(response.body).toHaveProperty('message');
    });
});
