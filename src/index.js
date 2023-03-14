const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT

// app.use((req, res, next) => { // middleware example
//   if (req.method === 'GET') {
//     res.send('GET requests are disabled')
//   } else {
//     next() // this is necessary to continue the chain
//   }
// })

app.use(express.json()) // use json
app.use(userRouter)
app.use(taskRouter)

// CRUD: Create Read Update Delete
//       POST   GET  PATCH  DELETE

// with middleware: new request --> do something --> run route handler

app.listen(port, () => { // express runs server and listens for requests
  console.log('Server is running on port ' + port)
})

// const Task = require('./models/task')
// const User = require('./models/user')

// const main = async () => {
//   const task = await Task.findById('640f8d0d0aca3ae6f21ef5a9')
//   await task.populate('owner')
//   console.log(task.owner.name)

//   const user = await User.findById('640f8a8e12b566c73f55f3c7')
//   await user.populate('tasks')
//   console.log(user.tasks)
// }

// main()