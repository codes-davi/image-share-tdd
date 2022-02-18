const app =  require('../src/main');
const supertest = require('supertest');
const request = supertest(app);

describe('Register a new user', () => {
    test('Should create a new user & return status 200', () => {
        let email = `tests.${Date.now().toString().substring(0,5)}@hosting.com`;
        let user = {name: "tester", email: email, password: "3131581"};

        return request.post('/user')
        .send(user)
        .then(res=>{
            expect(res.statusCode).toEqual(201);
        }).catch(err => {
            fail(err);
        });
    });
});