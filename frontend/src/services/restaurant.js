import axios from "axios";

const http = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    "Content-type": "application/json"
  }
});

export function getAll(page = 0) {
  return http.get(`?page=${page}`);
}

export function get(id) {
  return http.get(`/id/${id}`);
}

export function find(query, by = "name", page = 0) {
  return http.get(`?${by}=${query}&page=${page}`);
}

export function createReview(data) {
  return http.post("/review", data);
}

export function updateReview(data) {
  console.info(data)
  return http.put("/review", data);
}

export function deleteReview(id, userId) {
  return http.delete(`/review?id=${id}`, { data: { user_id: userId } });
}

export function getCuisines(id) {
  return http.get(`/cuisines`);
}
