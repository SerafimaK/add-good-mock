import { reactive, computed } from 'vue'
import { MOCK_USERS, MOCK_OTP } from '../data/mockUsers.js'

const state = reactive({
  user: null,
  token: null,
  loading: false,
  error: null,
  authModal: {
    isOpen: false,
    mode: 'login', // 'login' | 'register' | 'otp'
    otpTarget: null, // email or phone that OTP was sent to
    otpPurpose: null, // 'login' | 'register'
    pendingRegistration: null, // { name, emailOrPhone, type }
  },
})

// Deep clone users for mock DB
let mockDb = JSON.parse(JSON.stringify(MOCK_USERS))

function delay(ms = 500) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function generateId(prefix) {
  return prefix + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

function findUser(emailOrPhone) {
  return mockDb.find(u => u.email === emailOrPhone || u.phone === emailOrPhone)
}

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

// Hydrate on module load
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
  }

  async function login(emailOrPhone, password) {
    state.loading = true
    state.error = null
    await delay()
    const user = findUser(emailOrPhone)
    if (!user || user.password !== password) {
      state.error = 'Invalid credentials. Try jane@example.com / password123'
      state.loading = false
      return false
    }
    state.user = JSON.parse(JSON.stringify(user))
    state.token = 'mock_jwt_' + user.id
    state.loading = false
    persistState()
    closeAuthModal()
    return true
  }

  async function sendOtp(emailOrPhone) {
    state.loading = true
    state.error = null
    await delay(300)
    state.authModal.otpTarget = emailOrPhone
    state.loading = false
    return true
  }

  async function verifyOtp(code) {
    state.loading = true
    state.error = null
    await delay(300)
    if (code !== MOCK_OTP) {
      state.error = 'Invalid code. Use 123456'
      state.loading = false
      return false
    }

    if (state.authModal.otpPurpose === 'login') {
      const user = findUser(state.authModal.otpTarget)
      if (user) {
        state.user = JSON.parse(JSON.stringify(user))
        state.token = 'mock_jwt_' + user.id
        persistState()
        closeAuthModal()
      } else {
        // New user via OTP login — create minimal account
        const isPhone = state.authModal.otpTarget.startsWith('+')
        const newUser = {
          id: generateId('usr'),
          email: isPhone ? '' : state.authModal.otpTarget,
          phone: isPhone ? state.authModal.otpTarget : '',
          name: '',
          password: '',
          avatar: null,
          provider: isPhone ? 'phone' : 'email',
          addresses: [],
          orders: [],
        }
        mockDb.push(newUser)
        state.user = JSON.parse(JSON.stringify(newUser))
        state.token = 'mock_jwt_' + newUser.id
        persistState()
        closeAuthModal()
      }
    }

    state.loading = false
    return true
  }

  async function register(name, emailOrPhone, password) {
    state.loading = true
    state.error = null
    await delay()
    const existing = findUser(emailOrPhone)
    if (existing) {
      state.error = 'An account with this email or phone already exists'
      state.loading = false
      return false
    }
    const isPhone = emailOrPhone.startsWith('+')
    const newUser = {
      id: generateId('usr'),
      email: isPhone ? '' : emailOrPhone,
      phone: isPhone ? emailOrPhone : '',
      name,
      password,
      avatar: null,
      provider: isPhone ? 'phone' : 'email',
      addresses: [],
      orders: [],
    }
    mockDb.push(newUser)
    state.user = JSON.parse(JSON.stringify(newUser))
    state.token = 'mock_jwt_' + newUser.id
    state.loading = false
    persistState()
    closeAuthModal()
    return true
  }

  async function loginWithGoogle() {
    state.loading = true
    state.error = null
    await delay(800)
    // Mock Google user — always logs in as Alex Kim or creates new
    const googleUser = findUser('alex@example.com') || {
      id: generateId('usr'),
      email: 'alex@example.com',
      phone: '',
      name: 'Alex Kim',
      password: '',
      avatar: null,
      provider: 'google',
      addresses: [],
      orders: [],
    }
    state.user = JSON.parse(JSON.stringify(googleUser))
    state.token = 'mock_jwt_' + googleUser.id
    state.loading = false
    persistState()
    closeAuthModal()
    return true
  }

  function logout() {
    state.user = null
    state.token = null
    persistState()
  }

  function updateProfile(fields) {
    if (!state.user) return
    Object.assign(state.user, fields)
    // Sync to mock DB
    const dbUser = mockDb.find(u => u.id === state.user.id)
    if (dbUser) Object.assign(dbUser, fields)
    persistState()
  }

  function addAddress(address) {
    if (!state.user) return
    const newAddr = { ...address, id: generateId('addr') }
    if (newAddr.isDefault) {
      state.user.addresses.forEach(a => a.isDefault = false)
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
      state.user.addresses.forEach(a => a.isDefault = false)
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
      id: generateId('ord'),
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
    loginWithGoogle,
    logout,
    updateProfile,
    addAddress,
    updateAddress,
    deleteAddress,
    addOrder,
  }
}
