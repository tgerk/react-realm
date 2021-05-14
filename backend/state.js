import { MongoClient } from "mongodb"
import RestaurantsDAO from "./dao/restaurantsDAO.js"
import ReviewsDAO from "./dao/reviewsDAO.js"

const state = MongoClient.connect(process.env.RESTREVIEWS_DB_URI, {
  poolSize: 50,
  wtimeout: 2500,
  useNewUrlParse: true,
})
  .catch((err) => {
    console.error(err.stack)
    process.exit(1)
  })
  .then(async (client) => ({
    restaurants: await RestaurantsDAO.injectDB(client),
    reviews: await ReviewsDAO.injectDB(client),
  }))

export default await state
