exports = async function (payload, response) {
  if ("id" in payload.query) {
    // adopt the strategy that each logical collection (in the RESTful web-resource sense) has a single webhook
    // (unfortunately subcollections are not acheivable on Realm; related collections are grouped in a Service)

    // return a single item from the restaurants collection (in the MongoDB sense)
    return getOne(payload, response);
  }

  const pipeline = (query, skip, limit) => [
    {
      $match: query,
    },
    {
      $facet: {
        count: [{ $count: "count" }],
        page: [{ $skip: skip }, { $limit: limit }],
      },
    },
  ];

  const limit = // results per page
      parseInt(payload.query.limit) ||
      parseInt(payload.query.restaurantsPerPage) ||
      20,
    skip = // index of first result
      parseInt(payload.query.skip) || parseInt(payload.query.page) * limit || 0;

  const query = {},
    filters = {};
  if (payload.query.cuisine) {
    filters.cuisine = payload.query.cuisine;
    query.cuisine = { $eq: payload.query.cuisine };
  }
  if (payload.query.zipcode) {
    filters.zipcode = payload.query.zipcode;
    query["address.zipcode"] = { $eq: payload.query.zipcode };
  }
  if (payload.query.text) {
    filters.text = payload.query.text;
    query.$text = { $search: payload.query.text };
  }

  const restaurants = context.services
      .get("mongodb-atlas")
      .db("sample_restaurants")
      .collection("restaurants"),
    search = pipeline(query, skip, limit),
    {
      count: [{ count }],
      page,
    } = await restaurants.aggregate(search).next();

  response.setStatusCode(200);
  response.setBody(
    JSON.stringify({
      count,
      search,
      restaurants: page.map(transformRestaurant),
      nav: navLinks(count, skip, limit, filters),
    })
  );
};

async function getOne(payload, response) {
  const pipeline = (id) => [
    {
      $match: {
        _id: BSON.ObjectId(id),
      },
    },
    {
      $lookup: {
        from: "reviews",
        let: {
          id: "$_id",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$restaurant_id", "$$id"],
              },
            },
          },
          {
            $sort: {
              date: -1,
            },
          },
        ],
        as: "reviews",
      },
    },
    {
      $addFields: {
        reviews: "$reviews",
      },
    },
  ];

  //TODO: handle uncaught exceptions, error cases 400: invalid id, 404: NOT FOUND
  const restaurants = context.services
      .get("mongodb-atlas")
      .db("sample_restaurants")
      .collection("restaurants"),
    restaurant = await restaurants.aggregate(pipeline(payload.query.id)).next();

  response.setStatusCode(200);
  response.setBody(JSON.stringify(transformRestaurantWithReviews(restaurant)));
}

const transformRestaurant = ({ _id, ...rest }) => ({
  id: _id.toString(),
  ...rest,
});

const transformRestaurantWithReviews = ({ _id, reviews = [], ...rest }) => ({
  id: _id.toString(),
  ...rest,
  reviews: reviews.map(transformReview),
});

const transformReview = ({ _id, restaurant_id, user_id, date, ...rest }) => ({
  id: _id.toString(),
  restaurantId: restaurant_id.toString(),
  userId: user_id,
  date: new Date(date),
  ...rest,
});

const navLinks = (total, offset = 0, limit = 20, otherParams = {}) => {
  const nav = {};

  if (offset > 0) {
    nav.first = String(new URLSearchParams({ ...otherParams, limit }));

    if (offset >= limit) {
      nav.prev = String(
        new URLSearchParams({
          ...otherParams,
          offset: max(offset - limit, 0),
          limit,
        })
      );
    }
  }

  if (offset + limit < total) {
    if (offset + limit < total - limit) {
      nav.next = String(
        new URLSearchParams({
          ...otherParams,
          offset: offset + limit,
          limit,
        })
      );
    }

    nav.last = String(
      new URLSearchParams({
        ...otherParams,
        offset: limit * Math.floor(total / limit),
        limit,
      })
    );
  }

  return nav;
};
