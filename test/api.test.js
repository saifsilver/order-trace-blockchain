const assert = require('assert');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = require('../app');

describe('Authentication', () => {
    let authToken;

    // Prepare a valid JWT token for authenticated requests
    before((done) => {
        const user = {
            id: 1,
            username: 'admin',
            passwordHash: bcrypt.hashSync('password', 10) // Hash the password
        };

        authToken = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET);
        done();
    });

    it('should return a JWT token when logging in with correct credentials', (done) => {
        request(app)
            .post('/api/auth/login')
            .send({ username: 'admin', password: 'password' })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);

                assert.ok(res.body.token);
                done();
            });
    });

    it('should return an error when logging in with incorrect credentials', (done) => {
        request(app)
            .post('/api/auth/login')
            .send({ username: 'admin', password: 'wrongpassword' })
            .expect(401, done);
    });

    it('should return an error when logging in with missing credentials', (done) => {
        request(app)
            .post('/api/auth/login')
            .send({})
            .expect(400, done);
    });

    it('should return an error for unauthorized access to blockchain API without token', (done) => {
        request(app)
            .get('/api/blockchain')
            .expect(401, done);
    });

    it('should return an error for unauthorized access to blockchain API with invalid token', (done) => {
        request(app)
            .get('/api/blockchain')
            .set('Authorization', 'Bearer invalid_token')
            .expect(403, done);
    });

    it('should return the blockchain for authenticated access', (done) => {
        request(app)
            .get('/api/blockchain')
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                assert.ok(Array.isArray(res.body));
                done();
            });
    });

    // Add more authentication test cases as needed
});

describe('Blockchain API', () => {
    let authToken;

    // Prepare a valid JWT token for authenticated requests
    before((done) => {
        const user = {
            id: 1,
            username: 'admin',
            passwordHash: bcrypt.hashSync('password', 10) // Hash the password
        };
        authToken = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET);
        done();
    });

    it('should add a new order to pending transactions', (done) => {
        request(app)
            .post('/api/order')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                id: '1',
                products: [{ name: 'Product A', qty: 2 }],
                customer: { name: 'John Doe', address: '123 Main St' }
            })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                assert.strictEqual(res.body.message, 'Order added to the pending transactions.');
                done();
            });
    });

    it('should add a new delivery to pending transactions', (done) => {
        request(app)
            .post('/api/delivery')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                orderId: '1',
                deliveryId: 'D1',
                status: 'In Transit',
                deliveryPerson: 'Jane Doe'
            })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                assert.strictEqual(res.body.message, 'Delivery added to the pending transactions.');
                done();
            });
    });

    it('should mine pending transactions and add them to the blockchain', (done) => {
        request(app)
            .get('/api/blockchain/mine')
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                assert.strictEqual(res.body.message, 'Pending transactions mined and added to the blockchain.');
                done();
            });
    });

    // Add more test cases for blockchain API as needed
});
