import ReviewsDAO from "../dao/reviewsDAO.js"

export default class ReviewsController {
  static async apiPostReview(req, res, next) {
    const { reviews } = req.app.get("state")

    const restaurantId = req.body.restaurant_id
    const review = req.body.text
    const userInfo = {
      name: req.body.name,
      _id: req.body.user_id,
    }
    const date = new Date()

    const reviewResponse = await reviews.addReview(
      restaurantId,
      userInfo,
      review,
      date
    )

    res.json({ status: "success" })
  }

  static async apiUpdateReview(req, res, next) {
    const { reviews } = req.app.get("state")

    const reviewId = req.body.review_id
    const text = req.body.text
    const date = new Date()

    const reviewResponse = await reviews.updateReview(
      reviewId,
      req.body.user_id,
      text,
      date
    )

    var { error } = reviewResponse
    if (error) {
      res.status(400).json({ error })
    }

    if (reviewResponse.modifiedCount === 0) {
      throw new Error(
        "unable to update review - user may not be original poster"
      )
    }

    res.json({ status: "success" })
  }

  static async apiDeleteReview(req, res, next) {
    const { reviews } = req.app.get("state")

    const reviewId = req.query.id
    const userId = req.body.user_id

    const reviewResponse = await reviews.deleteReview(reviewId, userId)

    res.json({ status: "success" })
  }
}
