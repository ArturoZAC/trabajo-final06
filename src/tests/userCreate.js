const User = require("../models/User");

const userCreate = async () =>{
    const user={
        firstName:'Yoneison',
        lastName: 'Bayona',
        email: 'yoneison',
        password: 'yoneison1234',
        phone: '123321'
    }

    await User.create(user)
}

module.exports = userCreate



