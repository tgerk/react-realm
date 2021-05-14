import backend from "mongodb"
import RestaurantsDAO from "./restaurantsDAO.js"
import ReviewsDAO from "./reviewsDAO.js"

const { RESTREVIEWS_DB_URI: mongoURI } = process.env;

export default backend.MongoClient.connect(mongoURI, {
  poolSize: 50,
  // wtimeout: 2500,
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .catch((err) => {
    console.error(err.stack)
    process.exit(1)
  })
  .then(async (client) => ({
    restaurants: await RestaurantsDAO.injectDB(client),
    reviews: await ReviewsDAO.injectDB(client),
  }))
