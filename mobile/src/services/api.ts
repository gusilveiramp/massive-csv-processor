import axios from "axios";

export const baseURL = process.env.EXPO_PUBLIC_API_URL;

const api = axios.create({
  baseURL,
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    __DEV__ && console.log("[Error Axios]: ", JSON.stringify(error));
    if (error.message === "Network Error") {
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default api;
