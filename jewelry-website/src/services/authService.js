import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/auth",
});

export const loginUser = (data) => API.post("/login", data);

export const registerUser = (data) => API.post("/register", data);

export const getProfile = (token) =>
  API.get("/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const logoutUser = () => API.post("/logout");
