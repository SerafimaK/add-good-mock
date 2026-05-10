import { api } from './client.js'

// POST /promo/first-order — emails the 15% first-order code. Server enforces
// eligibility (email must have no prior orders). Re-requests are allowed.
export const requestFirstOrderCode = (email) => api.post('/promo/first-order', { email })
