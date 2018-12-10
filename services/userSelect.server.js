import axios from "axios";
const baseUrl = "/node-api/server.js/api/userSelect";

export function search(search, pageIndex, pageSize, role, businessId) {
  const url = encodeURI(
    `${baseUrl}/search/${pageIndex}/${pageSize}?q=${search}&r=${role}&businessId=${businessId ||
      ""}`
  );
  return axios.get(url);
}
