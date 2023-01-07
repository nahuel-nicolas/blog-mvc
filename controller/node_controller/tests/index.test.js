const test = require("node:test");
const assert = require("node:assert");

const request = require("supertest");
const logWhyIsNodeRunning = require('why-is-node-running')

const redis = require("../redis")
const { server, serverLife } = require("../index");
const { port } = require("../settings");


const { describe, it } = test;
const postObjectKeys = new Set(['id', 'title', 'body', 'slug', 'updated', 'created', 'author']);
function isStringInNestedObject(obj, string) {
    for (const key in obj) {
        const currentValue = obj[key]
        if (typeof currentValue === 'object') {
            if (isStringInNestedObject(currentValue, string)) {
                return true;
            }
        } else {
            if (currentValue === string) {
                return true;
            }
        }
    }
    return false;
}
const userData = {
    username: 'testUser',
    password: 'testPassword'
}

test('Check TEST ENV', () => {
    assert.equal(process.env.NODE_ENV, 'test');
    assert.equal(port, 3031);
});

describe('Compare non waited response with awaited response by making GET /post/', () => {
    let res = request(server).get('/post/');
    it('response data is empty', () => {
        console.log([res.ok, res.statusCode, res.statusType, res.body]);
        assert.ok(!res.statusCode);
        assert.ok(!res.statusType);
        assert.ok(!res.body);
    });

    
    it('response data is completed', async () => {
        res = await res;
        console.log([res.ok, res.statusCode, res.statusType, typeof res.body === 'object']);
        assert.ok(res.ok);
        assert.ok(res.statusCode);
        assert.ok(res.statusType);
        assert.equal(typeof res.body, 'object');
        assert.ok(Array.isArray(res.body));
    });
});

describe('GET /post/', () => {
    const endpointName = 'GET /post/';
    let res;
    it('Make request', async () => {
        res = await request(server).get('/post/').expect("Content-Type", /json/).expect(200);
    })

    it('Response has expected body', () => {
        assert.ok(Array.isArray(res.body))
        if (res.body.length > 0) {
            const currentPost = res.body[1]
            for (const currentKey of postObjectKeys) {
                assert.ok(currentKey in currentPost)
            }
        }
    })

    describe('Is Redis working properly?', () => {
        it('Redis data is same than response.body', async () => {
            const redisData = JSON.parse(await redis.client.get(endpointName));
            assert.deepEqual(res.body, redisData)
        })
    })
})

describe('User Register and login', () => {
    it('GET /authentication/user && if not user POST /authentication/user', async () => {
        const getUsersResponse = await request(server)
            .get('/authentication/user')
            .expect("Content-Type", /json/)
            .expect(200)
        assert.ok(getUsersResponse.body)

        if (!isStringInNestedObject(getUsersResponse.body, userData.username)) {
            const resgisterResponse = await request(server)
                .post('/authentication/user')
                .send(userData)
                .expect(201)
        }
    })

    let loginTokenResponse;
    it('POST /authentication/token. Get Token & Login User.', async () => {
        loginTokenResponse = await request(server)
            .post('/authentication/token')
            .send(userData)
            .expect("Content-Type", /json/)
            .expect(200)
        assert.ok(loginTokenResponse.body.access)
        assert.ok(loginTokenResponse.body.refresh)
    })

    it('POST /authentication/token/refresh', async () => {
        const refreshResponse = await request(server)
            .post('/authentication/token/refresh')
            .send({ refresh: loginTokenResponse.body.refresh })
            .expect("Content-Type", /json/)
            .expect(200)
        assert.ok(refreshResponse.body.access)
        assert.ok(refreshResponse.body.refresh)
    })  
})

describe('POST /post/', () => {
    let tokenResponse;
    it('Authenticate', async () => {
        tokenResponse = await request(server)
            .post('/authentication/token')
            .send(userData)
            .expect("Content-Type", /json/)
            .expect(200)
        assert.ok(tokenResponse.body.access)
        assert.ok(tokenResponse.body.refresh)
    })

    const postData = {
        title: 'Test Post',
        body: 'This is a test',
        slug: 'testing',
        author: 1
    }
    it('post with same slug exists ? GET post : POST post', async () => {
        const getResponse = await request(server)
            .get('/post/')
            .expect("Content-Type", /json/)
            .expect(200)
        let thisPostExists = false;
        for (const currentPost of getResponse.body) {
            if (currentPost.slug === postData.slug) {
                thisPostExists = true
                postData.id = currentPost.id
            }
        }
        if (!thisPostExists) {
            const postResponse = await request(server)
                .post('/post/')
                .send(postData)
                .set("Authorization", "Bearer " + String(tokenResponse.body.access))
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(200)
            postData.id = postResponse.body.id
        }
        
    })

    describe('GET /post/:id', () => {
        it('Make GET request', async () => {
            assert.ok(postData.id)
            const getRes = await request(server)
                .get(`/post/${postData.id}/`)
                .expect("Content-Type", /json/)
                .expect(200)
        })
    })

    describe('PUT /post/:id', () => {
        const updatedPostData = postData;
        updatedPostData.body = 'This is an updated test post.';
        it('Make PUT request', async () => {
            assert.ok(postData.id)
            const putRes = await request(server)
                .put(`/post/${postData.id}/`)
                .send(updatedPostData)
                .set("Authorization", "Bearer " + String(tokenResponse.body.access))
                .expect("Content-Type", /json/)
                .expect(200)
        })
    })

    describe('DELETE /post/:id', () => {
        it('Make DELETE request', async () => {
            assert.ok(postData.id)
            const deleteRes = await request(server)
                .delete(`/post/${postData.id}/`)
                .set("Authorization", "Bearer " + String(tokenResponse.body.access))
                .expect("Content-Type", /json/)
                .expect(200)
        })
    })
})

setTimeout(() => {
    serverLife.close()
    redis.client.quit()
    // logWhyIsNodeRunning()
}, 2000)