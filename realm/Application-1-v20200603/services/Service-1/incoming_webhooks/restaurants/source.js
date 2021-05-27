exports = async function (payload, response) {

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
  const resultCount = await db.restaurants.find(query).count(),
    resultPage = await db.restaurants.find(query)
      .skip(offset)
      .limit(count);

  const responseData = {
    restaurants: resultPage.map(({ _id, ...restaurant }) =>
      ({ _id: _id.toString(), ...restaurant })
    ),
    filters: String(new URLSearchParams(filters)),
    restaurantCount: resultCount
  };

  if (offset > 0) {
    responseData.first = String(new URLSearchParams({ ...filters, count }));

    if (offset >= count) {
      responseData.prev = String(new URLSearchParams({ ...filters, offset: max(offset - count, 0), count }));
    }
  }

  if (offset + count < resultCount) {
    if (offset + count + count < resultCount) {
      responseData.next = String(new URLSearchParams({ ...filters, offset: (offset + count), count }));
    }
    
        responseData.last = String(new URLSearchParams({ ...filters, offset: count * Math.floor(resultCount / count), count }));
  }

  return responseData;
};