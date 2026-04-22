import { api } from './client.js'

// Profile
export const getProfile    = ()       => api.get('/user/me')
export const updateProfile = (fields) => api.patch('/user/me', fields)
export const setPassword   = (body)   => api.post('/user/password', body)

// Addresses. IDs are prefixed strings like `addr_17` — pass them through as-is;
// the backend strips the prefix when matching rows.
export const listAddresses  = ()             => api.get('/user/addresses')
export const createAddress  = (body)         => api.post('/user/addresses', body)
export const updateAddress  = (id, body)     => api.patch(`/user/addresses/${id}`, body)
export const deleteAddress  = (id)           => api.delete(`/user/addresses/${id}`)
