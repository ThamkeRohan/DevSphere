import axios from "axios"

const api = axios.create({
  withCredentials: true,
});

export function makeRequest(url, options, isAbsolute = false) {
  const newUrl = isAbsolute ? url : `/api/${url}`
  return api(newUrl, options)
    .then((res) => res.data)
    .catch((error) => {
      console.log(error);
      return Promise.reject(error?.response?.data?.message ?? error.message);
    });
}
