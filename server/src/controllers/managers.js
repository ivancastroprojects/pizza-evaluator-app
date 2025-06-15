const {Manager} = require('../models')
const bcrypt = require('bcrypt')

module.exports = {
  async register (req, res) {
    try {
      //  write into db
      const manager = await Manager.create(req.body)
      const userJson = manager.toJSON()
      res.send({
        username: userJson.username
      })
    } catch (err) {
      res.status(400).send({
        err
      })
    }
  },
  async login (req, res) {
    const {username, password} = req.body
    try {
      const manager = await Manager.findOne({
        where: {
          username: username
        }
      })
      if (!manager) {
        return res.status(403).send({
          error: 'Account log in failed'
        })
      }
      const valid = await bcrypt.compare(password, manager.password)
      if (!valid) {
        return res.status(403).send({
          error: 'Account log in failed'
        })
      }
      res.send({
        message: 'success'
      })
    } catch (err) {
      res.status(500).send(err)
    }
  },
  async updateManager (req, res) {
    try {
      const managerId = req.params.managerId
      const { password } = req.body

      if (!managerId) {
        return res.status(400).json({ message: 'ID del manager no proporcionado.' })
      }

      const manager = await Manager.findByPk(managerId)
      if (!manager) {
        return res.status(404).json({ message: 'Manager no encontrado.' })
      }

      const updateData = {}
      if (password) {
        if (password.trim() !== '') {
          updateData.password = await bcrypt.hash(password, 10)
        }
      }

      if (Object.keys(updateData).length === 0) {
        return res.status(200).json({ message: 'No se especificaron cambios para el manager.' })
      }

      await manager.update(updateData)

      res.json({ message: 'Manager actualizado exitosamente.' })
    } catch (e) {
      console.error('Error al actualizar manager:', e)
      res.status(500).json({ message: e.message || 'Error interno del servidor al actualizar manager.' })
    }
  },
  async deleteManager (req, res) {
    try {
      const managerId = req.params.managerId // Asumimos que el ID viene en los parámetros de la ruta

      if (!managerId) {
        return res.status(400).send({ error: 'ID del manager no proporcionado.' })
      }

      const manager = await Manager.findByPk(managerId)

      if (!manager) {
        return res.status(404).send({ error: 'Manager no encontrado.' })
      }

      await manager.destroy()
      res.send({ message: 'Manager eliminado exitosamente.' })
    } catch (error) {
      console.error('Error al eliminar manager:', error)
      res.status(500).send({ error: 'Ocurrió un error al intentar eliminar el manager.' })
    }
  }
}
