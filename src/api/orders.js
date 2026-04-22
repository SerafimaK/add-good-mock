import { api } from './client.js'

// POST /orders — optionalAuth. Authenticated requests attach the order to the
// user; guests must include `contact.email`. The server re-computes the total
// from boosters + bonuses and rejects mismatches, so the client total is only
// used as a sanity check.
export const createOrder = (body)   => api.post('/orders', body)

// GET /orders — authenticated only. Already included in GET /user/me, but
// handy for reloads that want a fresh list without re-hydrating the full user.
export const listOrders  = ()       => api.get('/orders')

// GET /orders/:id — optionalAuth. Guests can view by id (useful for the order
// confirmation page after a guest checkout); owners get their own orders.
export const getOrder    = (id)     => api.get(`/orders/${id}`)
