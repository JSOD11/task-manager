require('../src/db/mongoose')
const User = require('../src/models/user')
const Task = require('../src/models/task')

User.findByIdAndUpdate('640de54de5d6a52fd4a69b0b', { age: 1 }).then((user) => {
  console.log(user)
  return User.countDocuments({ age: 1 })
}).then((result) => {
  console.log(result)
}).catch((e) => {
  console.log(e)
})

const updateAgeAndCount = async (id, age) => {
  const user = await User.findByIdAndUpdate(id, { age })
  const count = await User.countDocuments({ age })
  return count
}

updateAgeAndCount('640de79a8f259cdf7c693bd4', 2).then((count) => {
  console.log(count)
}).catch((e) => {
  console.log(e)
})

const deleteTaskAndCount = async (id) => {
  const task = await Task.findByIdAndDelete(id)
  const count = await Task.countDocuments({ completed: false })
  return count
}

deleteTaskAndCount('640de9a83ba71112a38be5d5').then((count) => {
  console.log(count)
}).catch((e) => {
  console.log(e)
})