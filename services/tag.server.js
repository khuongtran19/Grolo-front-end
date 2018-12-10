import axios from "axios";
const baseUrl = "/node-api/server.js/api/tag";
export function tagGetAll(pageIndex, pageSize) {
  const url = encodeURI(`${baseUrl}/${pageIndex}/${pageSize}`);
  return axios.get(url).then(response => response.data);
}
export function search(search, pageIndex, pageSize) {
  const url = encodeURI(`${baseUrl}/search/${pageIndex}/${pageSize}?q=${search}`);
  return axios.get(url);
}
export function tagGetById(id) {
  return axios.get(`${baseUrl}/` + id).then(response => response.data);
}
export function tagPost(tag) {
  return axios.post(`${baseUrl}`, tag).then(response => response.data);
}
export function tagPut(id, tag) {
  return axios.put(`${baseUrl}/` + id, tag);
}
export function tagDelete(id) {
  return axios.delete(`${baseUrl}/` + id);
}
export function tagGetAllActiveStatus() {
  return axios.get(`${baseUrl}/active`).then(response => response.data);
}
export function tagGetAllPost(id) {
  return axios.get(`${baseUrl}/getPost/` + id).then(response => response.data);
}
