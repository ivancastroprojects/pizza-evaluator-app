// server/src/populate_pizzas.js
// Import the Sequelize instance and Pizza model from your central models/index.js file
const { sequelize, Pizza } = require('./models')
const fs = require('fs')
const path = require('path')

const axios = require('axios')
const cheerio = require('cheerio')

async function scrapeDominosPizza () {
  console.log('Starting scraping for Domino\'s Pizza...')
  const dominosPizzas = []
  const baseUrl = 'https://www.dominospizza.es'

  try {
    const response = await axios.get(baseUrl)
    const $ = cheerio.load(response.data)

    $('div#CartaPizzas li.PizzaContent').each((index, element) => {
      const pizzaName = $(element).find('h3.pizza-title').first().text().trim()

      let imageUrl = $(element).find('img.lazyOwl').attr('src')
      if (!imageUrl) {
        imageUrl = $(element).find('img.lazyOwl').attr('data-src')
      }
      if (imageUrl && imageUrl.startsWith('//')) {
        imageUrl = 'https:' + imageUrl
      } else if (imageUrl && !imageUrl.startsWith('http')) {
        imageUrl = baseUrl + imageUrl
      }

      let websiteUrl = ''
      const recogerButton = $(element).find('button[data-tipopedido="Recoger"]')
      if (recogerButton.length) {
        const onclickAttr = recogerButton.attr('onclick')
        if (onclickAttr) {
          const match = onclickAttr.match(/location.href='([^']*)'/)
          if (match && match[1]) {
            websiteUrl = baseUrl + match[1]
          }
        }
      }

      const description = $(element).find('div.pizza-detail > span').first().text().trim()

      if (pizzaName && pizzaName.toLowerCase() === 'elige por mitades') {
        return
      }

      if (pizzaName && websiteUrl) {
        dominosPizzas.push({
          name: pizzaName,
          imageUrl: imageUrl || null,
          websiteUrl: websiteUrl,
          sourceName: "Domino's Pizza",
          description: description || null,
          votes: 0
        })
      } else {
        // console.log(`Skipping an item. Name: ${pizzaName}, URL: ${websiteUrl}, Image: ${imageUrl}`)
      }
    })
  } catch (error) {
    console.error("Error scraping Domino's Pizza:", error)
  }
  console.log(`Finished scraping for Domino's Pizza. Found ${dominosPizzas.length} pizzas.`)
  return dominosPizzas
}

async function scrapeTelepizza () {
  console.log('Starting scraping for Telepizza...')
  const telepizzaPizzas = []
  const baseUrl = 'https://www.telepizza.es'
  const pizzasUrl = baseUrl + '/comida-a-domicilio/pizzas'

  try {
    const response = await axios.get(pizzasUrl)
    const $ = cheerio.load(response.data)

    $('.product-tile').each((index, element) => {
      const pizzaName = $(element).find('.product-tile__name-text').first().text().trim()
      const imageUrl = $(element).find('.product-tile__image').attr('src') || null
      const description = $(element).find('.description-short.product-tile__description-text').first().text().trim() || null
      let websiteUrl = $(element).find('input[name="product-url"]').attr('value') || ''
      if (websiteUrl && !websiteUrl.startsWith('http')) {
        websiteUrl = baseUrl + websiteUrl
      }
      if (pizzaName && imageUrl && websiteUrl) {
        telepizzaPizzas.push({
          name: pizzaName,
          imageUrl: imageUrl,
          websiteUrl: websiteUrl,
          sourceName: 'Telepizza',
          description: description,
          votes: 0
        })
      }
    })
  } catch (error) {
    console.error('Error scraping Telepizza:', error)
  }
  console.log(`Finished scraping for Telepizza. Found ${telepizzaPizzas.length} pizzas.`)
  return telepizzaPizzas
}

async function scrapePapaJohns () {
  console.log('Starting scraping for Papa John\'s (Placeholder - No data will be returned)...')
  const papaJohnsPizzas = []
  // TODO: Implement actual scraping logic for Papa John's (https://www.papajohns.es/#Pizzas)
  console.log(`Finished scraping for Papa John's. Found ${papaJohnsPizzas.length} pizzas.`)
  return papaJohnsPizzas
}

async function scrapePizzaHut () {
  console.log('Starting scraping for Pizza Hut from local file...')
  const pizzaHutPizzas = []
  const filePath = path.join(__dirname, 'pizzahut.html')
  const baseUrl = 'https://www.pizzahut.es'

  try {
    const htmlContent = fs.readFileSync(filePath, 'utf-8')
    const $ = cheerio.load(htmlContent)

    $('div.product-card-container').each((index, element) => {
      const pizzaName = $(element).find('h2[data-testid="product-card__label--title"]').text().trim()
      const imageUrl = $(element).find('.product-image-container img').attr('src')
      let websiteUrl = $(element).find('.product-card-details > a').attr('href')

      if (!websiteUrl || websiteUrl.trim() === '') {
        websiteUrl = `${baseUrl}/products/pizzas`
      }

      const description = $(element).find('p[data-testid="product-card__labe--description"]').text().trim()

      // Exclude custom pizza options
      if (pizzaName && !pizzaName.toLowerCase().includes('a tu gusto') && !pizzaName.toLowerCase().includes('mitad y mitad')) {
        pizzaHutPizzas.push({
          name: pizzaName,
          imageUrl: imageUrl || null,
          websiteUrl: websiteUrl,
          sourceName: 'Pizza Hut',
          description: description || null,
          votes: 0
        })
      }
    })
  } catch (error) {
    console.error('Error scraping Pizza Hut from file:', error)
  }

  console.log(`Finished scraping for Pizza Hut. Found ${pizzaHutPizzas.length} pizzas.`)
  return pizzaHutPizzas
}

// --- Database Operations ---

async function deleteAllPizzas () {
  try {
    await Pizza.destroy({ where: {}, truncate: true })
    console.log('Successfully deleted all existing pizzas from the database.')
  } catch (error) {
    console.error('Error deleting pizzas:', error)
    throw error
  }
}

async function insertPizzas (allPizzas) {
  if (!allPizzas || allPizzas.length === 0) {
    console.log('No pizzas to insert.')
    return
  }
  try {
    let createdCount = 0
    for (const p of allPizzas) {
      const [pizza, created] = await Pizza.findOrCreate({
        where: { name: p.name }, // Use name as the unique identifier
        defaults: {
          description: p.description || null,
          imageUrl: p.imageUrl,
          websiteUrl: p.websiteUrl,
          sourceName: p.sourceName,
          votes: p.votes || 0
        }
      })
      if (created) {
        createdCount++
        console.log(`Created new pizza: ${pizza.name}`)
      } else {
        console.log(`Pizza already exists, skipping: ${pizza.name}`)
      }
    }
    console.log(`Finished processing pizzas. Created ${createdCount} new entries.`)
  } catch (error) {
    console.error('Error during findOrCreate process for pizzas:', error)
  }
}

// --- Main Orchestration Function ---

async function populateDatabase () {
  console.log('Starting pizza database population process...')
  try {
    await sequelize.authenticate()
    console.log('Database connection has been established successfully.')

    console.log('Synchronizing database schema...')
    await sequelize.sync({ alter: true }) // Ensure DB schema is up-to-date
    console.log('Database schema synchronized.')

    await deleteAllPizzas()

    const scrapeWithFallback = (scraperFn) => scraperFn().catch(err => {
      console.error(`Error during scraping with ${scraperFn.name}, returning empty array. Error: ${err.message}`)
      return []
    })

    const [
      dominosPizzas,
      telepizzaPizzas,
      papaJohnsPizzas,
      pizzaHutPizzas
    ] = await Promise.all([
      scrapeWithFallback(scrapeDominosPizza),
      scrapeWithFallback(scrapeTelepizza),
      scrapeWithFallback(scrapePapaJohns),
      scrapeWithFallback(scrapePizzaHut)
    ])

    const allNewPizzas = [
      ...dominosPizzas,
      ...telepizzaPizzas,
      ...papaJohnsPizzas,
      ...pizzaHutPizzas
    ]

    console.log(`Total pizzas gathered from all sources: ${allNewPizzas.length}`)

    // Filter out duplicate pizzas by name before insertion
    const uniquePizzas = []
    const seenNames = new Set()
    for (const pizza of allNewPizzas) {
      if (!seenNames.has(pizza.name)) {
        seenNames.add(pizza.name)
        uniquePizzas.push(pizza)
      }
    }
    console.log(`Total unique pizzas to be inserted: ${uniquePizzas.length}`)

    await insertPizzas(uniquePizzas)

    console.log('Pizza database population process completed successfully.')
  } catch (error) {
    console.error('An error occurred during the database population process:', error)
  } finally {
    await sequelize.close()
    console.log('Database connection closed.')
  }
}

// --- Run the Script ---
if (require.main === module) {
  populateDatabase()
}

module.exports = {
  populateDatabase,
  scrapeDominosPizza,
  scrapeTelepizza,
  scrapePapaJohns,
  scrapePizzaHut,
  deleteAllPizzas,
  insertPizzas
}
