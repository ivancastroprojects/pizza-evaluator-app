const usersController = require('./controllers/users')
const managersController = require('./controllers/managers')
const PizzasController = require('./controllers/pizzas')
const multer = require('multer')
const path = require('path')

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/uploads/'))
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})
const upload = multer({ storage })

module.exports = (app) => {
  // --- USER AUTHENTICATION ---
  app.post('/register', upload.single('avatar'), usersController.register)
  app.post('/login', usersController.login)
  app.get('/user-avatar/:username', usersController.getAvatar)

  // --- USER MANAGEMENT ---
  app.get('/users', usersController.allUsers)
  app.delete('/users', usersController.delete) // Consider changing to /users/:userId in the future
  app.post('/edit', usersController.edit) // Consider changing to /users/:userId in the future

  // --- PIZZA BROWSING & VOTING ---
  app.get('/pizzas', PizzasController.getAllPizzas)
  app.post('/pizzas/suggest', PizzasController.suggestPizza)
  app.post('/vote', usersController.votePizza)
  app.get('/votes-left/:voterUsername', usersController.getVotesLeft)

  // --- PIZZA CRUD (for Admins/Managers) ---
  app.post('/pizzas', PizzasController.createPizza)
  app.get('/pizzas/:pizzaId', PizzasController.getPizzaById)
  app.put('/pizzas/:pizzaId', PizzasController.updatePizza)
  app.delete('/pizzas/:pizzaId', PizzasController.deletePizza)

  // --- MANAGER AUTH & MANAGEMENT ---
  app.get('/managers', usersController.index) // This controller action correctly fetches managers
  app.post('/managers/register', managersController.register)
  app.post('/managers/login', managersController.login)
  app.put('/managers/:managerId', managersController.updateManager)
  app.delete('/managers/:managerId', managersController.deleteManager)
}
