/* eslint-disable no-undef */
const app =  require('../src/main');
const supertest = require('supertest');
const request = supertest(app);

//file globals
const email = 'tests.any@not-real.com';
let user = { name: 'tester', email: email, password: `${Date.now()}` };

beforeAll(()=>{
    return request.post('/user')
    .send(user)
    .then(()=>{
        console.log(`Test User Added ${JSON.stringify(user)}`);
    })
    .catch(err=>{console.log(err);});
});

afterAll(()=>{
    return request.delete(`/user/${user.email}`)
    .then((info)=>{
        console.log(`Test User Deleted ${user.email}, ${info.text}`);
    })
    .catch(err=>{console.log(err);});
});

describe('Register a new user', () => {
    test('Should create a new user & return status 201', () => {

        //user available only in this test
        let email = `tests.${Date.now().toString()}@not-real.com`;
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
        let newUser = { name: 'davi', email: 'davi@gmail.com', password: `${Date.now()}` };

        return request.post('/user')
        .send(newUser)
        .then(res=>{
            expect(res.statusCode).toEqual(400);
        }).catch(err=>{
            fail(err);
        });
    });
});

describe('Authentication', () => {
    test('Should return a token when logged in', () => {
        request
            .post('/auth')
            .send({ email: user.email, password: user.password })
            .then(res => {
                expect(res.statusCode).toEqual(200);
                expect(res.body.token).toBeDefined();
            }).catch(err => {
                console.log(err);
                fail(err);
            });
    });

    test('Shouldnt log in if user is not registered', () => {
        request
            .post('/auth')
            .send({ email: 'any_2@not-real.com', password: '0000' })
            .then(res => {
                expect(res.statusCode).toEqual(404);
            }).catch(err => {
                console.log(err);
                fail(err);
            });
    });

    test('Shouldnt log in if password is wrong', () => {
        request
            .post('/auth')
            .send({ email: user.email, password: '0000' })
            .then(res => {
                expect(res.statusCode).toEqual(403);
                expect(res.body.error).toEqual('Wrong password and/or email');
            }).catch(err => {
                console.log(err);
                fail(err);
            });
    });
});