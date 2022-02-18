const app =  require('../src/main');
const supertest = require('supertest');
const request = supertest(app);

test('App should run on port 3000', ()=>{
    return request.get('/').then(res=>{
        let status = res.statusCode;
        expect(status).toEqual(200);
    }).catch(err=>{
        fail(err);
    });
});