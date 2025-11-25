import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  signup: (userData) => api.post('/auth/signup', userData),
  getMe: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
}

export const assessmentsAPI = {
  getQuestions: (type) => api.get(`/assessments/questions/${type}`),
  submit: (data) => api.post('/assessments/submit', data),
  getHistory: (params) => api.get('/assessments/history', { params }),
  getAssessment: (id) => api.get(`/assessments/${id}`),
}

export const moodAPI = {
  track: (data) => api.post('/mood/track', data),
  getHistory: (params) => api.get('/mood/history', { params }),
  getStats: (params) => api.get('/mood/stats', { params }),
}

export const resourcesAPI = {
  getAll: () => api.get('/resources'),
  getByCategory: (category) => api.get(`/resources/category/${category}`),
}

export default api
