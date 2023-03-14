const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const { sendWelcomeEmail, sendCancellationEmail } = require('../emails/account')
const router = new express.Router()

// async function allows for await
router.post('/users', async (req, res) => { // POST == Create
  const user = new User(req.body)

  try {
    const token = await user.generateAuthToken()
    await user.save() // instead of save().then(), we just await
    sendWelcomeEmail(user.email, user.name)
    res.status(201).send({ user, token })
  } catch (e) {
    res.status(400).send(e)
  }
})

router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password)
    const token = await user.generateAuthToken()
    res.send({ user, token })
  } catch (e) {
    res.status(400).send()
  }
})

router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token)
    await req.user.save()
    res.send()
  } catch (e) {
    res.status(500).send()
  }
})

router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = []
    await req.user.save()
    res.send()
  } catch (e) {
    res.status(500).send()
  }
})

router.get('/users/me', auth, async (req, res) => { // GET == read
  res.send(req.user)
})

router.patch('/users/me', auth, async (req, res) => { // patch == update
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'email', 'password', 'age']
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' })
  }

  try {
    updates.forEach((update) => req.user[update] = req.body[update])
    await req.user.save()
    res.send(req.user)
  } catch (e) {
    res.status(400).send(e)
  }
})

router.delete('/users/me', auth, async (req, res) => {
  try {
    await req.user.deleteOne()
    sendCancellationEmail(req.user.email, req.user.name)
    res.send(req.user)
  } catch (err) {
    res.status(500).send(e.message)
  }
})

router.delete('/users/me/avatar', auth, async (req, res) => {
  req.user.avatar = undefined
  await req.user.save()
  res.status(200).send()
})

router.get('/users/:id/avatar', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user || !user.avatar) {
      throw new Error()
    }
    res.set('Content-Type', 'image/png')
    res.send(user.avatar)
  } catch (e) {s
    res.status(404).send()
  }
})

const upload = multer({
  // dest: 'avatars', // would save to directory instead of DB
  limits: {
    fileSize: 1000000 // 1 MB = 1,000,000 bytes
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) { // regex101.com
      return cb(new Error('Please upload a JPG, JPEG, or PNG!'))
    }
    cb(undefined, true)
  }
})
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
  const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer() // converts to png, resize
  req.user.avatar = buffer
  await req.user.save()
  res.send()
}, (error, req, res, next) => {
  res.status(400).send({ error: error.message })
})

module.exports = router