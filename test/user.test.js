/* eslint-disable no-undef */
const app =  require('../src/main');
const supertest = require('supertest');
const request = supertest(app);

//file globals
const email = `tests.${Date.now().toString()}@not-real.com`;
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