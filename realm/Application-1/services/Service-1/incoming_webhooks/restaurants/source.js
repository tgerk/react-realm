exports = async function (payload, response) {
  if ("id" in payload.query ) {
    // adopt the strategy that each logical collection (in the RESTful web-resource sense) has a single webhook
    // (unfortunately subcollections are not acheivable on Realm; related collections are grouped in a Service)

    // return a single item from the restaurants collection (in the MongoDB sense)
    return getOne(payload, response)
  }

  const pipeline = (query, skip, limit) => ([
    {
      $match: query
    },
    {
      $facet: {
        total: [
          { $count: "count" }
        ],
        page: [
          { $skip: skip },
          { $limit: limit }
        ]
      }
    }
  ])

  const count = parseInt(payload.query.count) || parseInt(payload.query.restaurantsPerPage) || 20,  // results per page
    offset = parseInt(payload.query.offset) || parseInt(payload.query.page) * count || 0,  // index of first result
    query = {},
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

  //TODO: handle uncaught exception, error case 404: NOT FOUND
  const restaurants = context.services.get("mongodb-atlas").db("sample_restaurants").collection("restaurants"),
    { total, page } = await restaurants.aggregate(pipeline(query, offset, count)).next(),
    totalCount = total[0].count;

  const result = {
      restaurants: page.map(({ _id, ...rest }) => ({ id: _id.toString(), ...rest })),
      totalCount,
      nav: {}
    };

  if (offset > 0) {
    result.nav.first = String(new URLSearchParams({ ...filters, count }));

    if (offset >= count) {
      result.nav.prev = String(new URLSearchParams({ ...filters, offset: max(offset - count, 0), count }));
    }
  }

  if (offset < totalCount - count) {
    if (offset < totalCount - count - count) {
      result.nav.next = String(new URLSearchParams({ ...filters, offset: (offset + count), count }));
    }

    result.nav.last = String(new URLSearchParams({ ...filters, offset: count * Math.floor(totalCount / count), count }));
  }

  // clients should not have to digest extended JSON encoding!
  response.setBody(JSON.stringify(result));
};

async function getOne(payload, response) {
  const pipeline = (id) => ([
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
  ]);

  //TODO: handle uncaught exceptions, error cases 400: invalid id, 404: NOT FOUND
  const restaurants = context.services.get("mongodb-atlas").db("sample_restaurants").collection("restaurants"),
    { _id, reviews = [], ...rest } = await restaurants.aggregate(pipeline(payload.query.id)).next();

  const result = {
    id: _id.toString(),
    ...rest,
    reviews: reviews.map(({ _id, date, ...rest }) => ({
      id: _id.toString(),
      date: new Date(date),
      ...rest
    }))
  };

  // clients should not have to digest extended JSON encoding!
  response.setBody(JSON.stringify(result));
}
