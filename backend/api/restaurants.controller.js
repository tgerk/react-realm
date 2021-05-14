export default class RestaurantsController {
  static async apiGetRestaurants(req, res, next) {
    const { restaurants } = req.app.get("state")

    const restaurantsPerPage = req.query.restaurantsPerPage
      ? parseInt(req.query.restaurantsPerPage, 10)
      : 20
    const page = req.query.page ? parseInt(req.query.page, 10) : 0

    let filters = {}
    if (req.query.cuisine) {
      filters.cuisine = req.query.cuisine
    } else if (req.query.zipcode) {
      filters.zipcode = req.query.zipcode
    } else if (req.query.name) {
      filters.name = req.query.name
    }

    const {
      restaurantsList,
      totalNumRestaurants,
    } = await restaurants.getRestaurants({
      filters,
      page,
      restaurantsPerPage,
    })

    let response = {
      restaurants: restaurantsList,
      page: page,
      filters: filters,
      entries_per_page: restaurantsPerPage,
      total_results: totalNumRestaurants,
    }
    res.json(response)
  }

  static async apiGetRestaurantById(req, res, next) {
    const { restaurants } = req.app.get("state")

    let id = req.params.id || {}
    let restaurant = await restaurants.getRestaurantByID(id)
    if (!restaurant) {
      res.status(404).json({ error: "Not found" })
      return
    }

    res.json(restaurant)
  }

  static async apiGetRestaurantCuisines(req, res, next) {
    const { restaurants } = req.app.get("state")

    let cuisines = await restaurants.getCuisines()
    res.json(cuisines)
  }
}
