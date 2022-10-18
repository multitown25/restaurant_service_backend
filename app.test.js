const request = require('supertest')
const assert = require('assert')

const app = require('./app')

let token = ''

describe('authorization test', function() {
    it('should return status 200 with valid token', function (done) {
        request(app)
            .post('/api/auth/login')
            .send({
                email: 'andrew@mail.ru',
                password: '1234567'
            })
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err)
                token = res.body.token
                done()
            })
    });

    it('should return status 401 because of invalid password', function (done) {
        request(app)
            .post('/api/auth/login')
            .send({
                email: 'andrew@mail.ru',
                password: '1234567890'
            })
            .expect(401)
            .end(done)
    });

    it('should return status 404 because of invalid email (user not found)', function (done) {
        request(app)
            .post('/api/auth/login')
            .send({
                email: 'andr@mail.ru',
                password: '1234567'
            })
            .expect(404)
            .end(done)
    });
})

describe('test the app with valid authorization', function() {
    it('should be able to consume the route "overview" /test since valid token was sent', function(done) {
        request(app)
            .get('/api/analytics/overview')
            .set('Authorization', token)
            .expect(200)
            .end(done)
    })

    it('should not be able to consume the route "overview" /test since no token was sent', function(done) {
        request(app)
            .get('/api/analytics/overview')
            .expect(401)
            .end(done)
    })

    it('should be able to consume the route "analytics" /test since valid token was sent', function(done) {
        request(app)
            .get('/api/analytics/analytics')
            .set('Authorization', token)
            .expect(200)
            .end(done)
    })

    it('should be able to consume the route "order" /test since valid token was sent', function(done) {
        request(app)
            .get('/api/order')
            .set('Authorization', token)
            .expect(200)
            .end(done)
    })


    it('should be able to consume the route "category" and get all categories /test since valid token was sent', function(done) {
        request(app)
            .get('/api/category')
            .set('Authorization', token)
            .expect(200)
            .end(done)
    })

    it('should be able to consume the route "position" and get them by categoryId /test since valid token was sent', function(done) {
        request(app)
            .get('/api/position/6331a6737849b96f74fdb96a')
            .set('Authorization', token)
            .expect(200)
            .end(done)
    })
})