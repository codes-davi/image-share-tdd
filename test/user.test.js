/* eslint-disable no-undef */
const app =  require('../src/main');
const supertest = require('supertest');
const request = supertest(app);

describe('Register a new user', () => {
    test('Should create a new user & return status 201', () => {
        let email = `tests.${Date.now().toString()}@hosting.com`;
        let user = { name: 'tester', email: email, password: `${Date.now()}` };

        return request.post('/user')
            .send(user)
            .then(res => {
                expect(res.statusCode).toEqual(201);
            }).catch(err => {
                fail(err);
            });
    });

    test('Shouldnt create new user when empty data sent to server', () => {
        let user = { name: '', email: '', password: '' };

        return request.post('/user')
            .send(user)
            .then(res => {
                expect(res.statusCode).toEqual(400);
            }).catch(err => {
                fail(err);
            });
    });

    test('Shouldnt create new user when email already exists', ()=>{

        //IMPORTANT: Make sure to pick up an existing email, so this validation test is going to work
        let user = { name: 'davi', email: 'davi@gmail.com', password: `${Date.now()}` };

        return request.post('/user')
        .send(user)
        .then(res=>{
            expect(res.statusCode).toEqual(400);
        }).catch(err=>{
            fail(err);
        });
    });
});