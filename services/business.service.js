import axios from "axios";

const baseUrl = "/node-api/server.js/api/business/search";

export function search(searchString, pageIndex, pageSize) {
  const url = encodeURI(
    `${baseUrl}?searchString=${searchString}&pageIndex=${pageIndex}&pageSize=${pageSize}`
  );
  return axios.get(url);
}

export function put(payload) {
  return axios.put("/node-api/server.js/api/business/" + payload.id, payload).then(response => {
    return response;
  });
}

export function del(payload) {
  return axios.delete("/node-api/server.js/api/business/" + payload).then(response => {
    return response;
  });
}

export function getById(payload) {
  return axios.get("/node-api/server.js/api/business/" + payload).then(response => {
    return response;
  });
}

export function post(payload) {
  return axios.post("/node-api/server.js/api/business", payload).then(response => {
    return response;
  });
}

export function getAll() {
  return axios.get("/node-api/server.js/api/business").then(response => {
    return response;
  });
}

export function submitCreds(payload) {
  return axios.put("/api/business/social", payload).then(response => {
    return response;
  });
}

export function getSocial(id) {
  return axios.get("/api/business/" + id).then(response => {
    return response;
  });
}
