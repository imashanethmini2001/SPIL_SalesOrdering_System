import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5225/api",
});

export default api;