const app = require('./src/app')

const PORT = process.env.PORT || 3045
const server = app.listen(PORT, () => {
   console.log(`Welcome to app ecommerce :: ${PORT}`)
})

process.on('SIGINT', () => {
   server.close(() => {
      console.log(`Exit server express`)
   })
})
