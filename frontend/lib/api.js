import axios from 'axios'
import { getToken, removeToken } from './auth'

const api = axios.create({
  // Empty string → relative URLs.  When frontend and backend share the same
  // domain (unified Render service) this means API calls go to the same origin.
  // Override with NEXT_PUBLIC_API_URL when running the dev servers separately.
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
})

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      removeToken()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
