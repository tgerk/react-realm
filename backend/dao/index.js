import backend from "mongodb"
import RestaurantsDAO from "./restaurantsDAO.js"
import ReviewsDAO from "./reviewsDAO.js"

const { RESTREVIEWS_DB_URI: mongoURI } = process.env;
const state = backend.MongoClient.connect(mongoURI, {
  poolSize: 50,
  // wtimeout: 2500,
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .catch((err) => {
    console.error(err.stack)
    console.info(mongoURI)
    console.info(Object.entries(process.env).filter(([k,v]) => !/^npm_(config|package)_/.test(k)))
    process.exit(1)
  })
  .then(async (client) => ({
    restaurants: await RestaurantsDAO.injectDB(client),
    reviews: await ReviewsDAO.injectDB(client),
  }))

export default await state
