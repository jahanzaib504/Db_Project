import axios from "axios";

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:3000',
});

// Function to set the token dynamically
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Retrieve token from localStorage and set it, if present
const token = localStorage.getItem('authToken');
if (token) {
  setAuthToken(token);  // Call after defining the function
}

export default api;
