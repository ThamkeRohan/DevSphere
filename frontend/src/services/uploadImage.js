import { makeRequest } from "./makeRequest";

export function uploadImage({imageData}) {
  return makeRequest(`https://api.cloudinary.com/v1_1/dzmwluabx/image/upload`, {
    method: "POST",
    data: imageData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: false,
  },
  true
);
}