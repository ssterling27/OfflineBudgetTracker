const router = require('express').Router()
const { Transaction, User } = require('../models')
const passport = require('passport')

router.get('/transactions', passport.authenticate('jwt'), async function (req, res) {
  const transactions = await Transaction.find({}).populate('user')
  res.json(transactions)
})

router.post('/transactions', passport.authenticate('jwt'), async function (req, res) {
  const transaction = await Transaction.create({ ...req.body, user: req.user._id })
  await User.findByIdAndUpdate(req.user._id, { $push: { transactions: transaction._id } })
  res.json(transaction)
})

router.post('/transactions/bulk', passport.authenticate('jwt'), async function (req, res) {
  const transactions = await Transaction.create(req.body.map(transaction => ({ ...transaction, user: req.user._id })))
  await User.findByIdAndUpdate(req.user._id, { $push: { transactions: { $each: transactions.map(transaction => transaction._id) } } })
  res.json(transactions)
})

router.put('/transactions/:id', passport.authenticate('jwt'), async function (req, res) {
  await Transaction.findByIdAndUpdate(req.params.id, { $set: req.body })
  res.sendStatus(200)
})

router.delete('/transactions/:id', passport.authenticate('jwt'), async function (req, res) {
  await Transaction.findByIdAndDelete(req.params.id)
  res.sendStatus(200)
})

module.exports = router