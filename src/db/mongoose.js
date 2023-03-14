const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL)

// /Users/jsod/mongodb/bin/mongod --dbpath=/Users/jsod/mongodb-data


// REST API (or RESTful API): Representational State Transfer - API
// API: toolset for building software applications


// const me = new User({ // create new user
//   name: '  JSOD  ',
//   password: '123456789',
//   email: ' ABC@gMaiL.CoM  ',
//   age: 22
// })

// me.save().then(() => { // save user to db
//   console.log(me)
// }).catch((error) => {
//   console.log('Error!', error)
// })