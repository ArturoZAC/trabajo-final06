require("../models")
const request = require("supertest")
const app = require("../app")
const Product = require("../models/Product")

const BASE_URL = "/api/v1/purchase"

let TOKEN
let userId
let productBody
let product
let bodyCart


beforeAll(async() =>{
    const user = {
        email: 'arturo@gmail.com',
        password: 'arturo1234'
    }

    const res = await request(app)
        .post('/api/v1/users/login')
        .send(user)

    TOKEN = res.body.token
    userId = res.body.user.id

    //Product
    productBody = {
        title: 'producttest',
        description: 'random1010',
        price: 21
    }

    product = await Product.create(productBody)

    //Cart
    bodyCart = {
        quantity: 1,
        productId: product.id
    }

    await request(app)
        .post('/api/v1/cart')
        .send(bodyCart)
        .set('Authorization', `Bearer ${TOKEN}`)

})

test("POST -> BASE_URL, should return status code 201 and res.body.quantity === bodyCart.quantity", async()=>{
    const res = await request(app)
        .post(BASE_URL)
        .set('Authorization', `Bearer ${TOKEN}`)

    expect(res.status).toBe(201)
    expect(res.body[0].quantity).toBe(bodyCart.quantity)
})

test("GET -> BASE_URL, should return status code 200 res.body.length === 1", async()=>{
    const res = await request(app)
        .get(BASE_URL)
        .set('Authorization', `Bearer ${TOKEN}`)

    expect(res.status).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body).toHaveLength(1)
    
    expect(res.body[0].userId).toBeDefined()
    expect(res.body[0].userId).toBe(userId)
    expect(res.body[0].product).toBeDefined()
    expect(res.body[0].product.id).toBe(product.id)

    await product.destroy()
})