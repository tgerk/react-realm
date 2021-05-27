exports = async function (payload, response) {

  if ("id" in payload.query) {
    return await getOne(payload, response)
  }

  const count = parseInt(payload.query.count) || parseInt(payload.query.restaurantsPerPage) || 20,
    offset = parseInt(payload.query.offset) || parseInt(payload.query.page) * count || 0;

  const query = {},
    filters = {};
  if (payload.query.cuisine) {
    filters.cuisine = payload.query.cuisine;
    query.cuisine = { $eq: payload.query.cuisine };
  } else if (payload.query.zipcode) {
    filters.zipcode = payload.query.zipcode;
    query["address.zipcode"] = { $eq: payload.query.zipcode };
  } else if (payload.query.text) {
    filters.text = payload.query.text;
    query.$text = { $search: payload.query.text };
  }

  const db = context.services.get("mongodb-atlas").db("sample_restaurants");
  const search = db.restaurants.find(query).skip(offset).limit(count),
    restaurantsCount = await search.clone().count(false, { limit: 9999 }),
    restaurants = await search.toArray();

  const result = {
    restaurants: restaurants.map(({ _id, ...rest }) => ({ id: _id.toString(),  ...rest })),
    filters: String(new URLSearchParams(filters)),
    restaurantCount: restaurantsCount
  };

  if (offset > 0) {
    result.first = String(new URLSearchParams({ ...filters, count }));

    if (offset >= count) {
      result.prev = String(new URLSearchParams({ ...filters, offset: max(offset - count, 0), count }));
    }
  }

  if (offset + count < restaurantsCount) {
    if (offset + count + count < restaurantsCount) {
      result.next = String(new URLSearchParams({ ...filters, offset: (offset + count), count }));
    }

    result.last = String(new URLSearchParams({ ...filters, offset: count * Math.floor(restaurantsCount / count), count }));
  }

  return result;
};

async function getOne(payload, response) {

  const pipeline = restaurantAggregationPipeline(payload.query.id);  //TODO: uncaught exception, handle error case 400: invalid id

  const db = context.services.get("mongodb-atlas").db("sample_restaurants");
  const { _id, reviews = [], ...rest } = await db.restaurants.aggregate(pipeline).next()  //TODO: uncaught exception, handle error case 404: NOT FOUND

  return {
    id: _id.toString(),
    ...rest,
    reviews: reviews?.map(({ _id, date, ...rest }) => ({
      id: _id.toString(),
      date: new Date(date),
      ...rest
    }))
  }
}

const restaurantAggregationPipeline = (id) => ([
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
])