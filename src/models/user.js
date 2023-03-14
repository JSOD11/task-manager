const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({ // define User blueprint
  name: {
    type: String,
    required: true,
    trim: true // trims extra spaces
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 7,
    validate(value) {
      if (value.toLowerCase().includes('password')) {
        throw new Error('Your password cannot include "password".')
      }
    }
  },
  age: {
    type: Number,
    default: 0, // sets default age to be 0
    validate(value) {
      if (value < 0) {
        throw new Error('Age must be a positive number!')
      }
    }
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true, // makes lowercase
    trim: true, // trims spaces off
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email provided is invalid')
      }
    }
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }],
  avatar: {
    type: Buffer
  }
}, {
  timestamps: true
})

userSchema.virtual('tasks', { // links User with Task
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner'
})

userSchema.methods.toJSON = function () { // special function toJSON
  const user = this
  const userObject = user.toObject()

  delete userObject.password
  delete userObject.tokens
  delete userObject.avatar

  return userObject
}

userSchema.methods.generateAuthToken = async function () {
  const user = this
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)
  
  user.tokens = user.tokens.concat({ token })
  await user.save()
  
  return token
}

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email })
  if (!user) {
    throw new Error('Unable to login')
  }

  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    throw new Error('Unable to login')
  }

  return user
}

userSchema.pre('save', async function (next) { // hash password before saving
  const user = this

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }

  next()
})

userSchema.pre('deleteOne', { document: true }, async function(next) {
  const user = this
  await Task.deleteMany({ owner: user._id })
  next()
})

const User = mongoose.model('User', userSchema)

module.exports = User