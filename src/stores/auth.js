import { reactive, computed } from 'vue'
import * as authApi from '../api/auth.js'
import * as userApi from '../api/user.js'
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

function hydrateState() {
  try {
    const saved = sessionStorage.getItem('auth')
    if (saved) {
      const parsed = JSON.parse(saved)
      state.user = parsed.user
      state.token = parsed.token
    }
  } catch {}
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

hydrateState()

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

  // --- Profile / addresses / orders: still local-only; Blocks 4 & 5 wire these to the API.

  function updateProfile(fields) {
    if (!state.user) return
    Object.assign(state.user, fields)
    persistState()
  }

  function addAddress(address) {
    if (!state.user) return
    const newAddr = { ...address, id: 'addr_local_' + Date.now().toString(36) }
    if (newAddr.isDefault) {
      state.user.addresses.forEach(a => (a.isDefault = false))
    }
    state.user.addresses.push(newAddr)
    persistState()
    return newAddr
  }

  function updateAddress(id, fields) {
    if (!state.user) return
    const addr = state.user.addresses.find(a => a.id === id)
    if (!addr) return
    if (fields.isDefault) {
      state.user.addresses.forEach(a => (a.isDefault = false))
    }
    Object.assign(addr, fields)
    persistState()
  }

  function deleteAddress(id) {
    if (!state.user) return
    state.user.addresses = state.user.addresses.filter(a => a.id !== id)
    persistState()
  }

  function addOrder(order) {
    const newOrder = {
      ...order,
      id: 'ord_local_' + Date.now().toString(36),
      date: new Date().toISOString(),
      status: 'processing',
    }
    if (state.user) {
      state.user.orders.unshift(newOrder)
      persistState()
    }
    return newOrder
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
    addOrder,
  }
}
