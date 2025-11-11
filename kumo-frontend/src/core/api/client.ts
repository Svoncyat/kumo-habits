import axios from 'axios'
import { env } from '../config/env'
import { tokenStorage } from '../security/tokenStorage'

export const api = axios.create({
    baseURL: env.apiUrl,
})

api.interceptors.request.use((config) => {
    const token = tokenStorage.get()
    if (token) {
        config.headers = config.headers ?? {}
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})
