const path = require('path')
const { sequelize, Pizza } = require(path.join(__dirname, 'models'))

async function randomizePizzaVotes () {
  console.log('Starting to randomize pizza votes...')

  try {
    // Authenticate with the database using the instance
    await sequelize.authenticate()
    console.log('Database connection has been established successfully.')

    // Find all pizzas
    const pizzas = await Pizza.findAll()

    if (pizzas.length === 0) {
      console.log('No pizzas found in the database. Nothing to update.')
      return
    }

    console.log(`Found ${pizzas.length} pizzas. Updating votes...`)

    // Create an array of update promises
    const updatePromises = pizzas.map(pizza => {
      const randomVotes = Math.floor(Math.random() * 31) // Generates a number between 0 and 30
      return pizza.update({ votes: randomVotes })
    })

    // Wait for all updates to complete
    await Promise.all(updatePromises)

    console.log('Successfully updated all pizza votes with random values.')
  } catch (error) {
    console.error('An error occurred while randomizing pizza votes:', error)
  } finally {
    // Close the database connection using the instance
    await sequelize.close()
    console.log('Database connection closed.')
  }
}

// Ensure the script runs only when executed directly
if (require.main === module) {
  randomizePizzaVotes()
}
