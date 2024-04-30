const User = require("../models/User");

const userCreate = async () =>{
    const user={
        firstName:'Arturo',
        lastName: 'Araujo',
        email: 'arturo@gmail.com',
        password: 'arturo1234',
        phone: '123321'
    }

    await User.create(user)
}

module.exports = userCreate



