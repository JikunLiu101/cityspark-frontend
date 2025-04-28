import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'DNS name: CitySparkLoadBalancer-539527486.ap-southeast-1.elb.amazonaws.com/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add a request interceptor to attach token
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      if (token && config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// (Optional) Add a response interceptor to catch 401s
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Unauthorized. You might want to redirect to login.')
      // Optionally clear token and redirect to login
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
