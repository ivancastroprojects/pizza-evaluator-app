const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const {sequelize} = require('./models')
const path = require('path')

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

// Serve static files from the 'public' directory
app.use('/public', express.static(path.join(__dirname, '..', 'public')))

require('./routes')(app)

const startServer = async () => {
  try {
    // Drop the backup table before syncing to prevent constraint errors
    await sequelize.query('DROP TABLE IF EXISTS users_backup;')
    await sequelize.sync({ alter: true })
    console.log('Database synced successfully.')
    app.listen(process.env.PORT || 8081, () => {
      console.log(`Server is running on port ${process.env.PORT || 8081}`)
    })
  } catch (error) {
    console.error('Unable to sync database:', error)
    process.exit(1)
  }
}

startServer()
