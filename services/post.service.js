import axios from "axios";

const baseUrl = "/node-api/server.js/api/post";

export function search(searchString, pageIndex, pageSize) {
  const url = encodeURI(
    `${baseUrl}/search?searchString=${searchString}&pageIndex=${pageIndex}&pageSize=${pageSize}`
  );
  return axios.get(url);
}

export function GetPostById(id) {
  return axios.get(`${baseUrl}/${id}`).then(res => {
    return res;
  });
}

export function PostInsert(payload) {
  return axios.post(`${baseUrl}`, payload).then(res => {
    return res;
  });
}
export function DeletePost(payload) {
  return axios.delete("/node-api/server.js/api/post/" + payload).then(res => {
    return res;
  });
}
