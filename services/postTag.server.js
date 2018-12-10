import axios from "axios";
const baseUrl = "/node-api/server.js/api/postTag/";
export function postTagPost(postId, tagId) {
  return axios.post(`${baseUrl}/`, postId, tagId).then(response => response.data);
}
export function postTagGetById(id) {
  return axios.get(`${baseUrl}/` + id).then(response => response.data);
}
