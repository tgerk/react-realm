import axios from "axios"

const http = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    "Content-type": "application/json"
  }
});

function getWithAbort(uri) {
  console.debug(uri)
  const source = axios.CancelToken.source(),
    req = http.get(uri, { cancelToken: source.token })
  
  // tack a method onto the returned Promise object
  req.abort = () => source.cancel()
  return req
}

export function getAll(page = 0) {
  return getWithAbort(`restaurants?page=${page}`);
}

export function search(query, page = 0) {
  query = new URLSearchParams({ ...query, page })
  return getWithAbort(`restaurants?${query}`);
}

export function get(id) {
  return http.get(`/restaurant?id=${id}`);
}

export function createReview(data) {
  return http.post("/review", data);
}

export function updateReview(data) {
  console.info(data)
  return http.put("/review-update", data);
}

export function deleteReview(id, userId) {
  return http.delete(`/review-delete?id=${id}`, { data: { user_id: userId } });
}

export function getCuisines(id) {
  return getWithAbort(`/cuisines`);
}
