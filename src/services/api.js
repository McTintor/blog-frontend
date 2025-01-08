import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Interceptor to include token in headers
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const login = (email, password) =>
  API.post("/users/login", { email, password });

export const register = (data) => API.post("/users/register", data);

export const getPosts = () => API.get("/posts");
export const createPost = (data) => API.post("/posts", data);
