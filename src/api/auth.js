import { api } from './client.js'

export const register    = (name, emailOrPhone, password) => api.post('/auth/register', { name, emailOrPhone, password })
export const login       = (emailOrPhone, password)       => api.post('/auth/login', { emailOrPhone, password })
export const sendOtp     = (emailOrPhone, intent)         => api.post('/auth/otp/send', { emailOrPhone, intent })
export const verifyOtp   = (emailOrPhone, code, intent, extras = {}) => api.post('/auth/otp/verify', { emailOrPhone, code, intent, ...extras })
export const googleLogin = (idToken)                      => api.post('/auth/google', { idToken })
export const logout      = ()                             => api.post('/auth/logout')
