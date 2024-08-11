// Set up instance of Axios- HTTP client for making requests from JS aplications
// Used to make HTTP requests to servers to retrieve data (commonly used with Node.js)

import axios from 'axios';
import { BASE_URL } from './constants';

// Create new instance of Axios with custom configurations
const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

/* Ensures that every request made using axiosInstance includes the authorization
   token if available so that we don't need to manually add it to each request */
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token"); // Checks if access token exists in localStorage
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;