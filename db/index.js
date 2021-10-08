const mongoose = require('mongoose')

module.exports = async function syncDB() { await mongoose.connect(process.env.MONODB_URI || 'mongodb://localhost:27017/budgettrackerdb') }