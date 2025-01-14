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

// User authentication endpoints
export const login = (email, password) =>
  API.post("/users/login", { email, password });

export const register = (data) => API.post("users/register", data);

// Post endpoints
export const getPosts = () => API.get("posts");

export const createPost = (data) => API.post("posts", data);

export const getPostById = (postId) => API.get(`/posts/${postId}`);

export const deletePost = (postId) => API.delete(`/posts/${postId}`);

export const updatePost = (postId, data) => API.put(`/posts/${postId}`, data);

// Comment endpoints
export const addComment = (postId, commentData) =>
  API.post(`/comments/${postId}`, { postId, ...commentData });

export const deleteComment = (commentId) =>
  API.delete(`/comments/${commentId}`);

export const updateComment = (commentId, data) =>
  API.put(`/comments/${commentId}`, data);

// User endpoints
export const getCurrentUser = () => API.get("/users/me");
