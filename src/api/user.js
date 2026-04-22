import { api } from './client.js'

// Block 3 only exposes the password endpoint — profile/address calls will be
// wired up in Block 4.
export const setPassword = (body) => api.post('/user/password', body)
