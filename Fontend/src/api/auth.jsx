import { apiFetch } from "./client.jsx";

export function login(credentials) {
  return apiFetch("/user/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export function signup(details) {
  return apiFetch("/user/signup", {
    method: "POST",
    body: JSON.stringify(details),
  });
}

export function logout() {
  return apiFetch("/user/logout", {
    method: "POST",
  });
}

export function fetchProfile() {
  return apiFetch("/user/profile");
}