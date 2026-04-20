import { api } from './client.js'

export const getBoosters = () => api.get('/products/boosters')
export const getBonuses  = () => api.get('/products/bonuses')
