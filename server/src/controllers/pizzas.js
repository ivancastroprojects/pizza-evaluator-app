const { Pizza, Sequelize, Vote, PizzaSuggestion } = require('../models') // Ajusta la ruta si tu index.js de modelos está en otro lugar o exporta de forma diferente
const Op = Sequelize.Op

module.exports = {
  // Crear una nueva pizza
  async createPizza (req, res) {
    try {
      const { name, ingredients, description, imageUrl, price, websiteUrl, sourceName, votes } = req.body
      // 'votes' se puede incluir opcionalmente en la creación, o dejar que tome el defaultValue del modelo
      const newPizza = await Pizza.create({
        name,
        ingredients,
        description,
        imageUrl,
        price,
        websiteUrl,
        sourceName,
        votes: votes === undefined ? 0 : votes // Asegurar que votes tenga un valor si no se pasa
      })
      res.status(201).send(newPizza)
    } catch (error) {
      console.error('Error al crear pizza:', error)
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).send({ error: 'Ya existe una pizza con ese nombre.' })
      }
      res.status(500).send({ error: 'Ocurrió un error al intentar crear la pizza.' })
    }
  },

  // Obtener todas las pizzas
  async getAllPizzas (req, res) {
    try {
      const { search, username } = req.query // Captura el username
      const whereCondition = {}

      if (search) {
        whereCondition[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } }
        ]
      }

      const pizzas = await Pizza.findAll({
        where: whereCondition,
        order: [['name', 'ASC']]
      })

      if (username) {
        // Si hay un usuario, comprobamos sus votos
        const userVotes = await Vote.findAll({ where: { voterUsername: username } })
        const votedPizzaNames = new Set(userVotes.map(vote => vote.pizzaName))

        const pizzasWithVoteStatus = pizzas.map(pizza => {
          const pizzaJson = pizza.toJSON()
          pizzaJson.userVoted = votedPizzaNames.has(pizza.name)
          return pizzaJson
        })
        return res.send(pizzasWithVoteStatus)
      }

      res.send(pizzas)
    } catch (error) {
      console.error('Error al obtener pizzas:', error)
      res.status(500).send({ error: 'Ocurrió un error al intentar obtener las pizzas.' })
    }
  },

  // Obtener una pizza por ID (opcional por ahora, pero útil)
  async getPizzaById (req, res) {
    try {
      const pizza = await Pizza.findByPk(req.params.pizzaId)
      if (!pizza) {
        return res.status(404).send({ error: 'Pizza no encontrada.' })
      }
      res.send(pizza)
    } catch (error) {
      console.error('Error al obtener pizza por ID:', error)
      res.status(500).send({ error: 'Ocurrió un error al buscar la pizza.' })
    }
  },

  // Actualizar una pizza existente (datos generales o solo votos)
  async updatePizza (req, res) {
    try {
      const pizzaId = req.params.pizzaId
      const pizza = await Pizza.findByPk(pizzaId)

      if (!pizza) {
        return res.status(404).send({ error: 'Pizza no encontrada para actualizar.' })
      }

      // Campos que se pueden actualizar. Si solo vienen 'votes', solo se actualiza eso.
      // Si vienen otros campos, se actualizan también.
      const { name, ingredients, description, imageUrl, price, websiteUrl, sourceName, votes } = req.body

      // Actualizar campos solo si se proporcionan en el body
      if (name !== undefined) pizza.name = name
      if (ingredients !== undefined) pizza.ingredients = ingredients
      if (description !== undefined) pizza.description = description
      if (imageUrl !== undefined) pizza.imageUrl = imageUrl
      if (price !== undefined) pizza.price = price
      if (websiteUrl !== undefined) pizza.websiteUrl = websiteUrl
      if (sourceName !== undefined) pizza.sourceName = sourceName
      if (votes !== undefined) pizza.votes = votes

      await pizza.save()
      res.send(pizza)
    } catch (error) {
      console.error('Error al actualizar pizza:', error)
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).send({ error: 'Ya existe otra pizza con ese nombre.' })
      }
      res.status(500).send({ error: 'Ocurrió un error al intentar actualizar la pizza.' })
    }
  },

  // Eliminar una pizza
  async deletePizza (req, res) {
    try {
      const pizzaId = req.params.pizzaId
      const pizza = await Pizza.findByPk(pizzaId)

      if (!pizza) {
        return res.status(404).send({ error: 'Pizza no encontrada para eliminar.' })
      }

      await pizza.destroy()
      res.send({ message: 'Pizza eliminada exitosamente.' })
    } catch (error) {
      console.error('Error al eliminar pizza:', error)
      res.status(500).send({ error: 'Ocurrió un error al intentar eliminar la pizza.' })
    }
  },

  // Suggest a new pizza
  async suggestPizza (req, res) {
    try {
      const { name, sourceName, description, submittedBy } = req.body
      if (!name || !sourceName || !submittedBy) {
        return res.status(400).send({ error: 'El nombre, la marca y el autor son obligatorios.' })
      }
      const suggestion = await PizzaSuggestion.create({
        name,
        sourceName,
        description,
        submittedBy
      })
      res.status(201).send(suggestion)
    } catch (error) {
      console.error('Error al sugerir pizza:', error)
      res.status(500).send({ error: 'Ocurrió un error al procesar la sugerencia.' })
    }
  }
}
