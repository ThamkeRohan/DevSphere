import { makeRequest } from "./makeRequest";

export function passwordBasedSignup({ data }) {
  return makeRequest("auth/password-based/signup", {
    method: "POST",
    data,
  });
}


export function passwordBasedLogin({data}) {
    return makeRequest("auth/password-based/login", {
        method: "POST",
        data
    })
}

export function googleLogin() {
  return makeRequest("auth/oauth/google", {
    method: "GET"
  })
}

export function logout() {
    return makeRequest("auth/logout", {
        method: "GET"
    })
}