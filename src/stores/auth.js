import { reactive, computed } from 'vue'
import * as authApi from '../api/auth.js'
import * as userApi from '../api/user.js'
import * as ordersApi from '../api/orders.js'
import { ApiError } from '../api/client.js'

const state = reactive({
  user: null,
  token: null,
  loading: false,
  error: null,
  authModal: {
    isOpen: false,
    mode: 'login', // 'login' | 'register' | 'reset'
    otpTarget: null,
    otpPurpose: null, // 'login' | 'register' | 'reset'
    pendingRegistration: null, // { name, password } kept between sendOtp and verifyOtp
    pendingReset: null, // { password } — new password for the reset flow
  },
})

function hydrateLocal() {
  try {
    const saved = sessionStorage.getItem('auth')
    if (saved) {
      const parsed = JSON.parse(saved)
      state.user = parsed.user
      state.token = parsed.token
    }
  } catch {}
}

// Fetches the latest profile from the server and replaces the local copy.
// Called once on app start (see main.js → awaits hydrateAuth) so that stale
// fields (addresses, orders, hasPassword) stay in sync across tabs and after
// server-side changes. If the token is rejected, the session is dropped.
export async function hydrateAuth() {
  hydrateLocal()
  if (!state.token) return
  try {
    const fresh = await userApi.getProfile()
    state.user = fresh
    persistState()
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      state.user = null
      state.token = null
      persistState()
    }
    // Other errors (server down, network) → keep the local copy so the user
    // still sees their data; the next authenticated request will retry.
  }
}

function persistState() {
  if (state.user) {
    sessionStorage.setItem('auth', JSON.stringify({ user: state.user, token: state.token }))
  } else {
    sessionStorage.removeItem('auth')
  }
}

function applyAuthResult({ token, user }) {
  state.user = user
  state.token = token
  persistState()
}

function describeError(err, fallback) {
  if (err instanceof ApiError) return err.message || err.code || fallback
  return err?.message || fallback
}

hydrateLocal()

export function useAuth() {
  const isAuthenticated = computed(() => !!state.user)

  function openAuthModal(mode = 'login') {
    state.authModal.isOpen = true
    state.authModal.mode = mode
    state.error = null
  }

  function closeAuthModal() {
    state.authModal.isOpen = false
    state.error = null
    state.authModal.otpTarget = null
    state.authModal.otpPurpose = null
    state.authModal.pendingRegistration = null
    state.authModal.pendingReset = null
  }

  async function login(emailOrPhone, password) {
    state.loading = true
    state.error = null
    try {
      const data = await authApi.login(emailOrPhone, password)
      applyAuthResult(data)
      closeAuthModal()
      return true
    } catch (err) {
      state.error = describeError(err, 'Login failed')
      return false
    } finally {
      state.loading = false
    }
  }

  async function sendOtp(emailOrPhone, intent) {
    state.loading = true
    state.error = null
    try {
      await authApi.sendOtp(emailOrPhone, intent)
      state.authModal.otpTarget = emailOrPhone
      state.authModal.otpPurpose = intent
      return { ok: true }
    } catch (err) {
      state.error = describeError(err, 'Could not send code')
      return {
        ok: false,
        code: err instanceof ApiError ? err.code : null,
        message: state.error,
      }
    } finally {
      state.loading = false
    }
  }

  async function verifyOtp(code) {
    state.loading = true
    state.error = null
    try {
      const intent = state.authModal.otpPurpose
      let extras = {}
      if (intent === 'register' && state.authModal.pendingRegistration) {
        extras = { ...state.authModal.pendingRegistration }
      } else if (intent === 'reset' && state.authModal.pendingReset) {
        extras = { ...state.authModal.pendingReset }
      }
      const data = await authApi.verifyOtp(state.authModal.otpTarget, code, intent, extras)
      applyAuthResult(data)
      closeAuthModal()
      return true
    } catch (err) {
      state.error = describeError(err, 'Invalid code')
      return false
    } finally {
      state.loading = false
    }
  }

  // Change or set the current account's password. For accounts that already
  // have one, currentPassword is required and verified server-side. OTP-only
  // and Google-only accounts can set an initial password without it.
  async function setPassword({ currentPassword, newPassword }) {
    state.loading = true
    state.error = null
    try {
      await userApi.setPassword({ currentPassword, newPassword })
      if (state.user) {
        state.user.hasPassword = true
        persistState()
      }
      return { ok: true }
    } catch (err) {
      state.error = describeError(err, 'Could not update password')
      return {
        ok: false,
        code: err instanceof ApiError ? err.code : null,
        message: state.error,
      }
    } finally {
      state.loading = false
    }
  }

  async function register(name, emailOrPhone, password) {
    state.loading = true
    state.error = null
    try {
      const data = await authApi.register(name, emailOrPhone, password)
      applyAuthResult(data)
      closeAuthModal()
      return true
    } catch (err) {
      state.error = describeError(err, 'Registration failed')
      return false
    } finally {
      state.loading = false
    }
  }

  async function loginWithGoogle() {
    state.loading = true
    state.error = null
    // TODO: integrate Google Identity Services SDK to obtain a real idToken.
    // For now surface a clear error so the flow is not silently broken.
    state.error = 'Google Sign-In is not configured yet'
    state.loading = false
    return false
  }

  async function logout() {
    if (state.token) {
      try {
        await authApi.logout()
      } catch {
        // best-effort — clear local session regardless
      }
    }
    state.user = null
    state.token = null
    persistState()
  }

  // --- Profile & addresses: backed by /user/* endpoints.
  // All methods resolve with `{ ok, data?, code?, message? }` so callers can
  // await + show feedback without leaking API shapes into components.
  // Orders remain local-only until Block 5.

  async function updateProfile(fields) {
    if (!state.user) return { ok: false }
    state.loading = true
    state.error = null
    try {
      const updated = await userApi.updateProfile(fields)
      // Server returns the full user object (with addresses + orders), so we
      // replace rather than merge to drop any stale fields.
      state.user = updated
      persistState()
      return { ok: true, data: updated }
    } catch (err) {
      state.error = describeError(err, 'Could not update profile')
      return {
        ok: false,
        code: err instanceof ApiError ? err.code : null,
        message: state.error,
      }
    } finally {
      state.loading = false
    }
  }

  // Keeps state.user.addresses sorted with the default first — matches the
  // order used by the server (ORDER BY is_default DESC, id).
  function sortAddresses() {
    if (!state.user?.addresses) return
    state.user.addresses.sort((a, b) => {
      if (a.isDefault !== b.isDefault) return a.isDefault ? -1 : 1
      // Numeric id compare by stripping the `addr_` prefix.
      return parseInt(String(a.id).replace('addr_', ''), 10)
           - parseInt(String(b.id).replace('addr_', ''), 10)
    })
  }

  async function addAddress(address) {
    if (!state.user) return null
    state.loading = true
    state.error = null
    try {
      const created = await userApi.createAddress(address)
      // Server enforced the "only one default" rule — mirror it locally.
      if (created.isDefault) {
        state.user.addresses.forEach(a => { a.isDefault = false })
      }
      state.user.addresses.push(created)
      sortAddresses()
      persistState()
      return created
    } catch (err) {
      state.error = describeError(err, 'Could not save address')
      return null
    } finally {
      state.loading = false
    }
  }

  async function updateAddress(id, fields) {
    if (!state.user) return null
    state.loading = true
    state.error = null
    try {
      const updated = await userApi.updateAddress(id, fields)
      if (updated.isDefault) {
        state.user.addresses.forEach(a => {
          if (a.id !== updated.id) a.isDefault = false
        })
      }
      const idx = state.user.addresses.findIndex(a => a.id === id)
      if (idx >= 0) state.user.addresses.splice(idx, 1, updated)
      else state.user.addresses.push(updated)
      sortAddresses()
      persistState()
      return updated
    } catch (err) {
      state.error = describeError(err, 'Could not update address')
      return null
    } finally {
      state.loading = false
    }
  }

  async function deleteAddress(id) {
    if (!state.user) return false
    state.loading = true
    state.error = null
    try {
      await userApi.deleteAddress(id)
      state.user.addresses = state.user.addresses.filter(a => a.id !== id)
      persistState()
      return true
    } catch (err) {
      state.error = describeError(err, 'Could not delete address')
      return false
    } finally {
      state.loading = false
    }
  }

  // Sends the cart to POST /orders. Works for guests (no token required) and
  // for authenticated users; in the latter case we also prepend the returned
  // order to state.user.orders so the account page reflects it immediately
  // without a re-hydration round-trip.
  //
  // Body shape (see backend/orders.js):
  //   { items: [{ boosterId, bonuses, price, sub }], total, shippingAddress,
  //     contact?: { email, phone? } }
  //
  // The server re-computes the total from the DB and returns 422 TOTAL_MISMATCH
  // if the client's figure disagrees — surfaces as result.code.
  async function placeOrder(body) {
    state.loading = true
    state.error = null
    try {
      const order = await ordersApi.createOrder(body)
      if (state.user) {
        // Server orders are DESC by created_at — new one goes first.
        state.user.orders.unshift(order)
        persistState()
      }
      return { ok: true, data: order }
    } catch (err) {
      state.error = describeError(err, 'Could not place order')
      return {
        ok: false,
        code: err instanceof ApiError ? err.code : null,
        message: state.error,
      }
    } finally {
      state.loading = false
    }
  }

  return {
    state,
    isAuthenticated,
    openAuthModal,
    closeAuthModal,
    login,
    sendOtp,
    verifyOtp,
    register,
    setPassword,
    loginWithGoogle,
    logout,
    updateProfile,
    addAddress,
    updateAddress,
    deleteAddress,
    placeOrder,
  }
}
