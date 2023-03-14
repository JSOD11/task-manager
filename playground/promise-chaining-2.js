require('../src/db/mongoose')
const Task = require('../src/models/task')

Task.findByIdAndDelete('640dea1f3ba71112a38be5d8').then((task) => {
  console.log(task)
  return Task.countDocuments({ completed: false })
}).then((result) => {
  console.log(result)
}).catch((e) => {
  console.log(e)
})