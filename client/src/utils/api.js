import axios from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_FIREBASE_BASEURL, // Set your base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercept all requests and add the Authorization token if present
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("authToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const fetchData = (url, options = {}) => {
  return axiosInstance.get(url, options).then((res) => res.data);
};

export const patchData = (url, data) => {
  return axiosInstance.patch(url, data).then((res) => res.data);
};

export const postData = (url, data) => {
  return axiosInstance.post(url, data).then((res) => res.data);
};
