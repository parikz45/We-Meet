import axios from "axios";

// Dev convenience: the app's API URLs are hardcoded to the production backend.
// To exercise the LOCAL backend instead, set VITE_LOCAL_API=true in frontend/.env
// and restart the dev server. Default (unset) keeps requests going to production.
const PROD_API = "https://we-meet-9jye.onrender.com";
const DEV_API = "http://localhost:8800";
axios.interceptors.request.use((config) => {
  if (import.meta.env.DEV && import.meta.env.VITE_LOCAL_API === "true" && config.url) {
    config.url = config.url.replace(PROD_API, DEV_API);
  }
  return config;
});

// Attach the Bearer token (stored inside the persisted user object) to every request.
axios.interceptors.request.use((config) => {
  const stored = localStorage.getItem("user");
  if (stored) {
    try {
      const token = JSON.parse(stored)?.token;
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch {
      // ignore malformed storage
    }
  }
  return config;
});

// If the token is missing/expired/invalid, clear the session and send the user to login.
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem("user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
