'use strict'
const mongoose = require('mongoose')

const connectUrl = `mongodb://admin:LetMeAccessDbPass@localhost:57017/nexlelive?serverSelectionTimeoutMS=2000&authSource=admin&directConnection=true`
mongoose
   .connect(connectUrl)
   .then(() => {
      console.log(`Connect MongoDb success`)
   })
   .catch((err) => console.log(err))
// env dev
if (1 === 1) {
   mongoose.set('debug', true)
   mongoose.set('debug', { color: true })
}
module.exports = mongoose
