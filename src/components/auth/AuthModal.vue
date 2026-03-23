<script setup>
import { ref, watch } from 'vue'
import { useAuth } from '../../stores/auth.js'
import FormInput from './FormInput.vue'
import OtpInput from './OtpInput.vue'
import GoogleAuthButton from './GoogleAuthButton.vue'

const {
  state, login, sendOtp, verifyOtp, register, loginWithGoogle, closeAuthModal,
} = useAuth()

// Form state
const tab = ref('email') // 'email' | 'phone'
const emailOrPhone = ref('')
const password = ref('')
const confirmPassword = ref('')
const name = ref('')
const otpSent = ref(false)
const otpVerified = ref(false)
const localError = ref('')

function resetForm() {
  tab.value = 'email'
  emailOrPhone.value = ''
  password.value = ''
  confirmPassword.value = ''
  name.value = ''
  otpSent.value = false
  otpVerified.value = false
  localError.value = ''
  state.error = null
}

watch(() => state.authModal.isOpen, (open) => {
  if (open) resetForm()
})

watch(() => state.authModal.mode, () => {
  resetForm()
})

function switchMode(mode) {
  state.authModal.mode = mode
}

function inputValue() {
  return tab.value === 'phone' ? emailOrPhone.value : emailOrPhone.value
}

// Login handlers
async function handleLogin() {
  localError.value = ''
  if (!emailOrPhone.value || !password.value) {
    localError.value = 'Please fill in all fields'
    return
  }
  await login(emailOrPhone.value, password.value)
}

async function handleLoginOtp() {
  localError.value = ''
  if (!emailOrPhone.value) {
    localError.value = tab.value === 'email' ? 'Please enter your email' : 'Please enter your phone number'
    return
  }
  state.authModal.otpPurpose = 'login'
  await sendOtp(emailOrPhone.value)
  otpSent.value = true
}

async function handleOtpComplete(code) {
  if (state.authModal.mode === 'login' || state.authModal.otpPurpose === 'login') {
    await verifyOtp(code)
  } else {
    // Register flow: verify OTP then show password fields
    const ok = await verifyOtp(code)
    if (ok) {
      otpVerified.value = true
      state.authModal.otpPurpose = null
    }
  }
}

// Register handlers
async function handleSendRegisterOtp() {
  localError.value = ''
  if (!name.value) { localError.value = 'Please enter your name'; return }
  if (!emailOrPhone.value) {
    localError.value = tab.value === 'email' ? 'Please enter your email' : 'Please enter your phone number'
    return
  }
  state.authModal.otpPurpose = 'register'
  await sendOtp(emailOrPhone.value)
  otpSent.value = true
}

async function handleRegister() {
  localError.value = ''
  if (!password.value) { localError.value = 'Please set a password'; return }
  if (password.value.length < 6) { localError.value = 'Password must be at least 6 characters'; return }
  if (password.value !== confirmPassword.value) { localError.value = 'Passwords do not match'; return }
  await register(name.value, emailOrPhone.value, password.value)
}

function handleClose() {
  closeAuthModal()
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="state.authModal.isOpen" class="am-overlay" @click.self="handleClose">
        <div class="am-card">
          <button class="am-close" @click="handleClose">&times;</button>

          <!-- LOGIN MODE -->
          <template v-if="state.authModal.mode === 'login'">
            <h2 class="am-title">Welcome back</h2>

            <template v-if="!otpSent">
              <!-- Tab toggle -->
              <div class="am-tabs">
                <button :class="{ active: tab === 'email' }" @click="tab = 'email'; emailOrPhone = ''">Email</button>
                <button :class="{ active: tab === 'phone' }" @click="tab = 'phone'; emailOrPhone = ''">Phone</button>
              </div>

              <FormInput
                v-model="emailOrPhone"
                :label="tab === 'email' ? 'Email' : 'Phone number'"
                :type="tab === 'email' ? 'email' : 'tel'"
                :placeholder="tab === 'email' ? 'jane@example.com' : '+1234567890'"
              />

              <FormInput
                v-model="password"
                label="Password"
                type="password"
                placeholder="Your password"
              />

              <div v-if="state.error || localError" class="am-error">{{ state.error || localError }}</div>

              <button class="am-btn" :disabled="state.loading" @click="handleLogin">
                {{ state.loading ? 'Logging in...' : 'Log in' }}
              </button>

              <button class="am-link-btn" @click="handleLoginOtp">
                Use a one-time code instead
              </button>
            </template>

            <!-- OTP sent for login -->
            <template v-else>
              <p class="am-subtitle">Code sent to <b>{{ emailOrPhone }}</b></p>
              <OtpInput :error="state.error" :disabled="state.loading" @complete="handleOtpComplete" />
              <button class="am-link-btn" @click="otpSent = false; state.error = null">Back</button>
            </template>

            <div class="am-divider"><span>or</span></div>
            <GoogleAuthButton :loading="state.loading" @click="loginWithGoogle" />

            <p class="am-footer-text">
              Don't have an account?
              <button class="am-switch" @click="switchMode('register')">Create one</button>
            </p>
          </template>

          <!-- REGISTER MODE -->
          <template v-if="state.authModal.mode === 'register'">
            <h2 class="am-title">Create your account</h2>

            <template v-if="!otpSent">
              <FormInput v-model="name" label="Name" placeholder="Jane Doe" />

              <div class="am-tabs">
                <button :class="{ active: tab === 'email' }" @click="tab = 'email'; emailOrPhone = ''">Email</button>
                <button :class="{ active: tab === 'phone' }" @click="tab = 'phone'; emailOrPhone = ''">Phone</button>
              </div>

              <FormInput
                v-model="emailOrPhone"
                :label="tab === 'email' ? 'Email' : 'Phone number'"
                :type="tab === 'email' ? 'email' : 'tel'"
                :placeholder="tab === 'email' ? 'jane@example.com' : '+1234567890'"
              />

              <div v-if="state.error || localError" class="am-error">{{ state.error || localError }}</div>

              <button class="am-btn" :disabled="state.loading" @click="handleSendRegisterOtp">
                {{ state.loading ? 'Sending...' : 'Send verification code' }}
              </button>
            </template>

            <!-- OTP verification for registration -->
            <template v-else-if="!otpVerified">
              <p class="am-subtitle">Code sent to <b>{{ emailOrPhone }}</b></p>
              <OtpInput :error="state.error" :disabled="state.loading" @complete="handleOtpComplete" />
              <button class="am-link-btn" @click="otpSent = false; state.error = null">Back</button>
            </template>

            <!-- Set password after OTP verified -->
            <template v-else>
              <p class="am-subtitle">Verified! Now set your password.</p>
              <FormInput v-model="password" label="Password" type="password" placeholder="At least 6 characters" />
              <FormInput v-model="confirmPassword" label="Confirm password" type="password" placeholder="Repeat password" />

              <div v-if="state.error || localError" class="am-error">{{ state.error || localError }}</div>

              <button class="am-btn" :disabled="state.loading" @click="handleRegister">
                {{ state.loading ? 'Creating account...' : 'Create account' }}
              </button>
            </template>

            <div class="am-divider"><span>or</span></div>
            <GoogleAuthButton :loading="state.loading" @click="loginWithGoogle" />

            <p class="am-footer-text">
              Already have an account?
              <button class="am-switch" @click="switchMode('login')">Log in</button>
            </p>
          </template>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.am-overlay {
  position: fixed; inset: 0; z-index: 400;
  background: rgba(0,0,0,.45);
  display: flex; align-items: center; justify-content: center;
  padding: 1rem;
}
.am-card {
  position: relative;
  background: var(--bg2);
  border-radius: 22px;
  padding: 2.5rem 2rem 2rem;
  width: 100%; max-width: 420px;
  max-height: 90vh; overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0,0,0,.15);
}
.am-close {
  position: absolute; top: 1rem; right: 1.2rem;
  background: none; border: none; font-size: 1.6rem; color: var(--lt);
  cursor: pointer; line-height: 1; transition: color .2s;
}
.am-close:hover { color: var(--dark); }
.am-title {
  font-family: var(--serif);
  font-size: 1.8rem;
  font-weight: 400;
  color: var(--dark);
  margin-bottom: 1.5rem;
  text-align: center;
}
.am-subtitle {
  font-size: .88rem;
  color: var(--mid);
  text-align: center;
  margin-bottom: 1.2rem;
}
.am-subtitle b { color: var(--dark); }
.am-tabs {
  display: flex;
  gap: 0;
  margin-bottom: 1.2rem;
  border: 1.5px solid var(--sand);
  border-radius: 50px;
  overflow: hidden;
}
.am-tabs button {
  flex: 1;
  padding: .55rem 1rem;
  border: none;
  background: transparent;
  font-family: var(--sans);
  font-size: .78rem;
  font-weight: 600;
  letter-spacing: .06em;
  text-transform: uppercase;
  color: var(--mid);
  cursor: pointer;
  transition: all .2s;
}
.am-tabs button.active {
  background: var(--dark);
  color: var(--bg);
}
.am-error {
  font-size: .8rem;
  color: #c44;
  text-align: center;
  margin-bottom: .8rem;
  padding: .5rem;
  background: rgba(204,68,68,.06);
  border-radius: 8px;
}
.am-btn {
  display: block;
  width: 100%;
  padding: .85rem;
  border: none;
  border-radius: 50px;
  background: var(--dark);
  color: var(--bg);
  font-family: var(--sans);
  font-size: .85rem;
  font-weight: 600;
  letter-spacing: .05em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all .3s;
  margin-bottom: .6rem;
}
.am-btn:hover { background: var(--forest); }
.am-btn:disabled { opacity: .6; cursor: not-allowed; }
.am-link-btn {
  display: block;
  margin: 0 auto .4rem;
  background: none;
  border: none;
  font-family: var(--sans);
  font-size: .78rem;
  color: var(--forest);
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 2px;
}
.am-link-btn:hover { color: var(--dark); }
.am-divider {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1.2rem 0;
  color: var(--lt);
  font-size: .75rem;
  text-transform: uppercase;
  letter-spacing: .1em;
}
.am-divider::before, .am-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--sand);
}
.am-footer-text {
  text-align: center;
  font-size: .82rem;
  color: var(--mid);
  margin-top: 1.2rem;
}
.am-switch {
  background: none;
  border: none;
  color: var(--forest);
  font-family: var(--sans);
  font-size: .82rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 2px;
}
.am-switch:hover { color: var(--dark); }

/* Transitions */
.modal-enter-active { transition: opacity .3s; }
.modal-enter-active .am-card { transition: transform .3s var(--ease-out), opacity .3s; }
.modal-leave-active { transition: opacity .2s; }
.modal-leave-active .am-card { transition: transform .2s, opacity .2s; }
.modal-enter-from { opacity: 0; }
.modal-enter-from .am-card { transform: translateY(20px) scale(.97); opacity: 0; }
.modal-leave-to { opacity: 0; }
.modal-leave-to .am-card { transform: translateY(10px) scale(.98); opacity: 0; }

@media (max-width: 480px) {
  .am-card { padding: 2rem 1.4rem 1.5rem; border-radius: 18px; }
  .am-title { font-size: 1.5rem; }
}
</style>
