exports = async function (payload, response) {
  switch (context.request.httpMethod) {
    case "POST": return onPost(payload, response);
    case "PUT": return onPut(payload, response);
    case "DELETE": return onDelete(payload, response);
    default:
      // error case 405: method not allowed
      response.setStatusCode(405);
  }
}

async function onPost(payload, response) {

  response.setStatusCode(201)
  //TODO: return the new entity
}
async function onPut(payload, response) {

  response.setStatusCode(202)
  //TODO: return the updated entity
}

async function onDelete(payload, response) {

  response.setStatusCode(204)
}
