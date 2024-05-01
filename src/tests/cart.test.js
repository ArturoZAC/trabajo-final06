require('../models')
const request = require("supertest")
const app = require("../app")
const Product = require("../models/Product")
const BASE_URL = '/api/v1/cart'

let TOKEN
let userId
let productBody
let product
let cartId
let cart

beforeAll(async()=>{

    const user = {
        email: 'arturo@gmail.com',
        password: 'arturo1234'
    }

    const res = await request(app)
        .post('/api/v1/users/login')
        .send(user)

    TOKEN = res.body.token
    userId = res.body.user.id
    // console.log(res.body)
    productBody = {
        title: 'iphone test',
        description: 'iphone description',
        price: 3.34
    }

    product = await Product.create(productBody)
})

test("POST -> BASE_URL, should return status code 201, and res.body.quantity === cart.quantity", async()=>{
    cart = {
        quantity: 5,
        productId: product.id
    }

    const res = await request(app)
        .post(BASE_URL)
        .send(cart)
        .set('Authorization', `Bearer ${TOKEN}`)

    cartId = res.body.id

    expect(res.status).toBe(201)
    expect(res.body).toBeDefined()
    expect(res.body.quantity).toBe(cart.quantity)


})

test("GET -> BASE_URL, should return status code 200, and res.body.length === 1", async()=>{
    const res = await request(app)
        .get(BASE_URL)
        .set('Authorization', `Bearer ${TOKEN}`)

    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body).toHaveLength(1)


})

test("GET -> BASE_URL/:id should return status code 200, and res.body.quantity === cart.quantity", async()=>{
    const res = await request(app)
        .get(`${BASE_URL}/${cartId}`)
        .set('Authorization', `Bearer ${TOKEN}`)

    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.quantity).toBe(cart.quantity)

})

test("PUT -> BASE_URL/:id, should return status code 200, and res.body.quantity === bodyUpdate.quantity", async()=>{
    const bodyUpdate = {quantity: 6}
    const res = await request(app)
        .put(`${BASE_URL}/${cartId}`)
        .send(bodyUpdate)
        .set('Authorization', `Bearer ${TOKEN}`)

    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.quantity).toBe(bodyUpdate.quantity  )
    
})

test("DEL -> BASE_URL/:id, should return status code 204", async()=>{
    const res = await request(app)
        .delete(`${BASE_URL}/${cartId}`)
        .set('Authorization', `Bearer ${TOKEN}`)

    expect(res.statusCode).toBe(204)

    await product.destroy()
})