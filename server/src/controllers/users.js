const {User, Pizza, Vote, Manager} = require('../models')
const bcrypt = require('bcrypt')

module.exports = {
  async register (req, res) {
    try {
      const { name, gender, birthday, password } = req.body
      const hashedPassword = await bcrypt.hash(password, 10)

      let avatarUrl = null
      if (req.file) {
        // Construct URL to be saved in DB, e.g., /public/uploads/filename.jpg
        avatarUrl = `/public/uploads/${req.file.filename}`
      }

      const user = await User.create({
        name,
        gender,
        birthday,
        password: hashedPassword,
        avatarUrl
      })

      // Standardize the response object to match the login response
      const userJson = {
        id: user.id,
        name: user.name,
        avatarUrl: user.avatarUrl,
        role: 'user'
      }

      res.send({ user: userJson })
    } catch (err) {
      if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).send({ error: 'Este nombre de usuario ya está en uso.' })
      }
      console.error('Registration error:', err)
      res.status(500).send({ error: 'Ha ocurrido un error inesperado durante el registro.' })
    }
  },
  async login (req, res) {
    try {
      const { name, password } = req.body

      // 1. Check if it's a regular user
      const user = await User.findOne({ where: { name } })

      if (user) {
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (isPasswordValid) {
          // Explicitly build the user object to ensure consistency
          const userJson = {
            id: user.id,
            name: user.name,
            avatarUrl: user.avatarUrl,
            role: 'user'
          }
          return res.send({ user: userJson })
        }
      }

      // 2. If not a user, check if it's a manager
      const manager = await Manager.findOne({ where: { username: name } })

      if (manager) {
        const isPasswordValid = await bcrypt.compare(password, manager.password)
        if (isPasswordValid) {
          // Standardize the response to look like a user object
          const userObject = {
            id: manager.id,
            name: manager.username, // Use 'name' to be consistent
            role: 'manager',
            avatarUrl: null // Managers don't have avatars, but keep the field for consistency
          }
          return res.send({ user: userObject })
        }
      }

      // 3. If neither user nor manager is found, or password invalid
      return res.status(403).send({ error: 'La información de login es incorrecta.' })
    } catch (err) {
      console.error('Login error:', err)
      res.status(500).send({ error: 'Ha ocurrido un error al intentar iniciar sesión.' })
    }
  },
  async index (req, res) {
    const managers = await Manager.findAll({
      attributes: ['id', 'username', 'createdAt', 'updatedAt']
    })
    res.send(managers)
  },
  async delete (req, res) {
    const username = req.query.name
    console.log(req.query)
    try {
      const user = await User.findOne({
        where: {
          name: username
        }
      })
      if (user) {
        user.destroy()
        res.send({
          message: 'success'
        })
      } else {
        res.status(404).send({
          message: 'user does not exist'
        })
      }
    } catch (e) {
      res.status(400)
      res.send({
        message: e
      })
    }
  },
  async getPizzas (req, res) {
    const namecount = await Pizza.findAll({
      order: [
        ['votes', 'DESC']
      ]
    })
    res.send(namecount)
  },
  async votePizza (req, res) {
    try {
      const { voterUsername, pizzaName } = req.body
      if (!voterUsername || !pizzaName) {
        return res.status(400).send({ message: 'Faltan datos: voterUsername y pizzaName son requeridos.' })
      }

      const user = await User.findOne({ where: { name: voterUsername } })
      const pizza = await Pizza.findOne({ where: { name: pizzaName } })

      if (!user || !pizza) {
        return res.status(404).send({ message: 'Usuario o Pizza no encontrados.' })
      }

      const existingVote = await Vote.findOne({ where: { voterUsername, pizzaName } })

      if (existingVote) {
        // User is un-voting
        await existingVote.destroy()
        await Pizza.decrement('votes', { by: 1, where: { name: pizzaName } })
        await User.decrement('votes_cast', { by: 1, where: { name: voterUsername } })

        return res.send({
          message: 'Voto retirado exitosamente.',
          action: 'unvoted',
          votes: pizza.votes - 1
        })
      } else {
        // User is voting
        if (user.votes_cast >= 5) {
          return res.status(403).send({ message: 'Has alcanzado el máximo de 5 votos.' })
        }

        await Vote.create({ voterUsername, pizzaName })
        await Pizza.increment('votes', { by: 1, where: { name: pizzaName } })
        await User.increment('votes_cast', { by: 1, where: { name: voterUsername } })

        return res.send({
          message: 'Voto registrado exitosamente.',
          action: 'voted',
          votes: pizza.votes + 1
        })
      }
    } catch (err) {
      console.error('Error al votar:', err)
      res.status(500).send({
        message: 'Error interno al procesar el voto.',
        error: err.message
      })
    }
  },
  async edit (req, res) {
    try {
      const updateData = { ...req.body }
      if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 10)
      } else {
        delete updateData.password
      }
      await User.update(updateData, {
        where: {
          name: req.body.name
        }
      })
      res.json({ message: 'Usuario actualizado' })
    } catch (e) {
      res.status(400).json({ message: e.message })
    }
  },
  async getVotesLeft (req, res) {
    try {
      const { voterUsername } = req.params
      if (!voterUsername) {
        return res.status(400).send({ message: 'Falta el parámetro voterUsername.' })
      }
      const user = await User.findOne({ where: { name: voterUsername } })

      if (!user) {
        // If user not found, maybe it's a manager? Handle as you see fit.
        // For now, let's assume managers don't vote and return a clear message or default value.
        // Let's check managers just in case, though they don't have votes_cast.
        const manager = await Manager.findOne({ where: { username: voterUsername } })
        if (manager) {
          return res.send({ votesRemaining: 0, of: 5 }) // Managers don't vote
        }
        return res.status(404).send({ message: 'Usuario no encontrado.' })
      }

      const maxVotes = 5
      const remaining = maxVotes - user.votes_cast
      res.send({ votesRemaining: remaining < 0 ? 0 : remaining, of: maxVotes })
    } catch (err) {
      console.error('Error al obtener votos restantes:', err)
      res.status(500).send({ message: 'Error interno al obtener votos restantes.', error: err.message })
    }
  },
  async allUsers (req, res) {
    try {
      const users = await User.findAll({
        attributes: ['id', 'name', 'createdAt', 'updatedAt']
      })
      res.send(users)
    } catch (err) {
      res.status(500).send({ message: 'Error al obtener usuarios', error: err.message })
    }
  },
  async getAvatar (req, res) {
    try {
      const { username } = req.params
      const user = await User.findOne({
        where: { name: username },
        attributes: ['avatarUrl']
      })

      if (user && user.avatarUrl) {
        res.send({ avatarUrl: user.avatarUrl })
      } else {
        res.status(404).send({ error: 'User or avatar not found.' })
      }
    } catch (err) {
      res.status(500).send({ error: 'An error occurred while fetching the avatar.' })
    }
  }
}
