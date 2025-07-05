import axios from "axios"
import toast from "react-hot-toast"

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000"

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const refreshToken = localStorage.getItem("refresh_token")
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/api/auth/token/`, {
            grant_type: "refresh_token",
            refresh_token: refreshToken,
            client_id: process.env.REACT_APP_OAUTH_CLIENT_ID,
            client_secret: process.env.REACT_APP_OAUTH_CLIENT_SECRET,
          })

          const { access_token } = response.data
          localStorage.setItem("access_token", access_token)
          api.defaults.headers.common["Authorization"] = `Bearer ${access_token}`

          return api(originalRequest)
        } catch (refreshError) {
          localStorage.removeItem("access_token")
          localStorage.removeItem("refresh_token")
          window.location.href = "/login"
        }
      }
    }

    if (error.response?.status >= 500) {
      toast.error("Server error. Please try again later.")
    }

    return Promise.reject(error)
  },
)

// API methods
export const issuesApi = {
  getAll: (params) => api.get("/api/issues/", { params }),
  getById: (id) => api.get(`/api/issues/${id}/`),
  create: (data) =>
    api.post("/api/issues/", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, data) => api.patch(`/api/issues/${id}/`, data),
  delete: (id) => api.delete(`/api/issues/${id}/`),
  getComments: (id) => api.get(`/api/issues/${id}/comments/`),
  addComment: (id, data) => api.post(`/api/issues/${id}/comments/`, data),
}

export const analyticsApi = {
  getDashboardStats: () => api.get("/api/analytics/dashboard/"),
  getDailyStats: () => api.get("/api/analytics/daily-stats/"),
}

export const usersApi = {
  getAll: () => api.get("/api/users/"),
  create: (data) => api.post("/api/users/", data),
  update: (id, data) => api.patch(`/api/users/${id}/`, data),
  delete: (id) => api.delete(`/api/users/${id}/`),
}
