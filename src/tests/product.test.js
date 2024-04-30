require("../models")
const request = require("supertest")
const Category = require("../models/Category")
const app = require("../app")

const BASE_URL = '/api/v1/products'

let category
let TOKEN
let productId
let product

beforeAll(async()=>{

    const user = {
        email: 'arturo@gmail.com',
        password: 'arturo1234'
    }

    const res = await request(app)
    .post('/api/v1/users/login')
    .send(user)

    TOKEN = res.body.token

    category = await Category.create({name: 'Tecno'})
})


test("POST -> BASE_URL, should return StatusCode 201, and res.body.title === products.title", async()=>{

    product = {
        title: "Celular",
        description: "Iphone 15 256gb",
        price: "890",
        categoryId: category.id
    }

    const res = await request(app)
        .post(BASE_URL)
        .send(product)
        .set('Authorization', `Bearer ${TOKEN}`)

        productId = res.body.id

        expect(res.status).toBe(201)
        expect(res.body).toBeDefined()
        expect(res.body.title).toBe(product.title)

})

test("GET ALL -> BASE_URL, should return 200, and res.body.length === 1", async()=>{
    const res = await request(app)
        .get(BASE_URL)

    expect(res.status).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body).toHaveLength(1)

})

test("GET ONE -> BASE_URL/:id, should return 200, and res.body.length === 1", async()=>{
    const res = await request(app)
        .get(`${BASE_URL}/${productId}`)

    expect(res.status).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.title).toBe(product.title)

})

test("PUT -> BASE_URL/:id, should return StatusCode 200, and res.body.title === bodyUpdate.title", async()=>{
    const bodyUpdate = {
        title: "Iphone 15 pro max"
    }

    const res = await request(app)
        .put(`${BASE_URL}/${productId}`)
        .send(bodyUpdate)
        .set('Authorization', `Bearer ${TOKEN}`)

    expect(res.status).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.title).toBe(bodyUpdate.title)

})

test("DEL -> BASE_URL/:id, should return 204", async()=>{
    const res = await request(app)
        .delete(`${BASE_URL}/${productId}`)
        .set('Authorization', `Bearer ${TOKEN}`)

    expect(res.status).toBe(204)

    await category.destroy() //Siempre va a la ultima parte

})