const request = require("supertest")
const app = require("../app")
const BASE_URL = '/api/v1/categories'

let TOKEN
let categoryId

beforeAll(async()=>{

    const user = {
        email: 'arturo@gmail.com',
        password: 'arturo1234'
    }

    const res = await request(app)
        .post('/api/v1/users/login')
        .send(user)

    TOKEN = res.body.token
    // console.log(res.body)
})


test("POST -> BASE_URL, should return StatusCode201, and res.body.name === category.name", async()=>{
    const category ={
        name: 'Tecno'
    }

    const res = await request(app)
        .post(BASE_URL)
        .send(category)
        .set('Authorization', `Bearer ${TOKEN}`)

        categoryId = res.body.id

    expect(res.status).toBe(201)
    expect(res.body).toBeDefined()
    expect(res.body.name).toBe(category.name)
})

test("GET ALL -> BASE_URL, should return StatusCode 200, and res.body.length === 1", async()=>{

    const res = await request(app)
        .get(BASE_URL)

    expect(res.status).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body).toHaveLength(1)
})

test("DEL -> BASE_URL/:id, should return StatusCode 204", async()=>{
    const res = await request(app)
        .del(`${BASE_URL}/${categoryId}`)
        .set('Authorization', `Bearer ${TOKEN}`)


    expect(res.statusCode).toBe(204)

})