<script setup>
import { ref, watch } from 'vue'
import { useAuth } from '../../stores/auth.js'
import FormInput from './FormInput.vue'
import OtpInput from './OtpInput.vue'
import GoogleAuthButton from './GoogleAuthButton.vue'

const {
  state, login, sendOtp, verifyOtp, register, loginWithGoogle, closeAuthModal,
} = useAuth()

// Form state — email only for now (SMS is not wired up yet).
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const name = ref('')
const otpSent = ref(false)
const localError = ref('')
// When login-via-OTP is requested for an unknown email, we prompt the user
// to create an account instead of silently registering them.
const offerRegister = ref(false)

function resetForm() {
  email.value = ''
  password.value = ''
  confirmPassword.value = ''
  name.value = ''
  otpSent.value = false
  localError.value = ''
  offerRegister.value = false
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

// Login handlers
async function handleLogin() {
  localError.value = ''
  if (!email.value || !password.value) {
    localError.value = 'Please fill in all fields'
    return
  }
  await login(email.value, password.value)
}

async function handleLoginOtp() {
  localError.value = ''
  offerRegister.value = false
  if (!email.value) {
    localError.value = 'Please enter your email'
    return
  }
  const result = await sendOtp(email.value, 'login')
  if (result.ok) {
    otpSent.value = true
    return
  }
  // No account for this email — offer to switch to registration instead of
  // silently creating one.
  if (result.code === 'USER_NOT_FOUND') {
    offerRegister.value = true
    state.error = null
  }
}

// The user confirmed they want to create an account from the OTP-login flow.
// We send the OTP with intent="register" and let them complete sign-up with
// just the code — no name or password required. They can set a password later
// from their profile.
async function confirmCreateAccount() {
  offerRegister.value = false
  localError.value = ''
  state.authModal.pendingRegistration = { name: null, password: null }
  const result = await sendOtp(email.value, 'register')
  if (result.ok) otpSent.value = true
}

async function handleOtpComplete(code) {
  await verifyOtp(code)
}

// Register handlers — password is collected before the OTP step and sent
// together with the verification call (see stores/auth.js → verifyOtp).
async function handleSendRegisterOtp() {
  localError.value = ''
  if (!email.value) { localError.value = 'Please enter your email'; return }
  if (!password.value) { localError.value = 'Please set a password'; return }
  if (password.value.length < 6) { localError.value = 'Password must be at least 6 characters'; return }
  if (password.value !== confirmPassword.value) { localError.value = 'Passwords do not match'; return }

  state.authModal.pendingRegistration = {
    name: name.value.trim() || null,
    password: password.value,
  }
  const result = await sendOtp(email.value, 'register')
  if (result.ok) otpSent.value = true
}

// Password reset — ask for new password up front, then OTP to confirm.
// On verify, the backend sets the new hash and returns a fresh session.
async function handleSendResetOtp() {
  localError.value = ''
  if (!email.value) { localError.value = 'Please enter your email'; return }
  if (!password.value) { localError.value = 'Please choose a new password'; return }
  if (password.value.length < 6) { localError.value = 'Password must be at least 6 characters'; return }
  if (password.value !== confirmPassword.value) { localError.value = 'Passwords do not match'; return }

  state.authModal.pendingReset = { password: password.value }
  const result = await sendOtp(email.value, 'reset')
  if (result.ok) otpSent.value = true
}

function handleClose() {
  closeAuthModal()
}

function handleOverlayClick() {
  // Multi-step flows (register, password reset) hold entered data — prevent
  // accidental dismissal on misclick.
  const mode = state.authModal.mode
  if (mode === 'register' || mode === 'reset') return
  closeAuthModal()
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="state.authModal.isOpen" class="am-overlay" @click.self="handleOverlayClick">
        <div class="am-card">
          <button class="am-close" @click="handleClose">&times;</button>

          <!-- LOGIN MODE -->
          <template v-if="state.authModal.mode === 'login'">
            <h2 class="am-title">Welcome back</h2>

            <template v-if="!otpSent">
              <FormInput
                v-model="email"
                label="Email"
                type="email"
                placeholder="jane@example.com"
              />

              <FormInput
                v-model="password"
                label="Password"
                type="password"
                placeholder="Your password"
              />

              <div v-if="state.error || localError" class="am-error">{{ state.error || localError }}</div>

              <button class="am-link-btn am-link-btn--right" :disabled="state.loading" @click="switchMode('reset')">
                Forgot password?
              </button>

              <button class="am-btn" :disabled="state.loading" @click="handleLogin">
                {{ state.loading ? 'Logging in...' : 'Log in' }}
              </button>

              <div class="am-divider"><span>or</span></div>

              <!-- No account was found when requesting an OTP. We never silently
                   register — always confirm intent first. If confirmed, the
                   same OTP both verifies the email and creates the account. -->
              <div v-if="offerRegister" class="am-prompt">
                <p>No account found for <b>{{ email }}</b>.<br>Send a code to this address and create one?</p>
                <button class="am-btn am-btn--sm" :disabled="state.loading" @click="confirmCreateAccount">
                  {{ state.loading ? 'Sending...' : 'Send code &amp; create account' }}
                </button>
                <button class="am-link-btn" @click="offerRegister = false">Cancel</button>
              </div>

              <template v-else>
                <button class="am-method" :disabled="state.loading" @click="handleLoginOtp">
                  <svg class="am-method-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <rect x="3" y="5" width="18" height="14" rx="2"/>
                    <path d="M3 7l9 6 9-6"/>
                  </svg>
                  <span>{{ state.loading ? 'Sending...' : 'Use a one-time code' }}</span>
                </button>

                <GoogleAuthButton :loading="state.loading" @click="loginWithGoogle" />
              </template>
            </template>

            <!-- OTP sent for login -->
            <template v-else>
              <p class="am-subtitle">Code sent to <b>{{ email }}</b></p>
              <OtpInput :error="state.error" :disabled="state.loading" @complete="handleOtpComplete" />
              <button class="am-link-btn" @click="otpSent = false; state.error = null">Back</button>
            </template>

            <p class="am-footer-text">
              Don't have an account?
              <button class="am-switch" @click="switchMode('register')">Create one</button>
            </p>
          </template>

          <!-- REGISTER MODE -->
          <template v-if="state.authModal.mode === 'register'">
            <h2 class="am-title">Create your account</h2>

            <template v-if="!otpSent">
              <FormInput v-model="name" label="Name (optional)" placeholder="Jane Doe" />

              <FormInput
                v-model="email"
                label="Email"
                type="email"
                placeholder="jane@example.com"
              />

              <FormInput v-model="password" label="Password" type="password" placeholder="At least 6 characters" />
              <FormInput v-model="confirmPassword" label="Confirm password" type="password" placeholder="Repeat password" />

              <div v-if="state.error || localError" class="am-error">{{ state.error || localError }}</div>

              <button class="am-btn" :disabled="state.loading" @click="handleSendRegisterOtp">
                {{ state.loading ? 'Sending...' : 'Send verification code' }}
              </button>
            </template>

            <!-- OTP verification for registration -->
            <template v-else>
              <p class="am-subtitle">Code sent to <b>{{ email }}</b></p>
              <OtpInput :error="state.error" :disabled="state.loading" @complete="handleOtpComplete" />
              <button class="am-link-btn" @click="otpSent = false; state.error = null">Back</button>
            </template>

            <div class="am-divider"><span>or</span></div>
            <GoogleAuthButton :loading="state.loading" @click="loginWithGoogle" />

            <p class="am-footer-text">
              Already have an account?
              <button class="am-switch" @click="switchMode('login')">Log in</button>
            </p>
          </template>

          <!-- RESET MODE — forgot password flow -->
          <template v-if="state.authModal.mode === 'reset'">
            <h2 class="am-title">Reset password</h2>

            <template v-if="!otpSent">
              <p class="am-subtitle">Enter your email and a new password. We'll send a one-time code to confirm it's you.</p>

              <FormInput
                v-model="email"
                label="Email"
                type="email"
                placeholder="jane@example.com"
              />

              <FormInput v-model="password" label="New password" type="password" placeholder="At least 6 characters" />
              <FormInput v-model="confirmPassword" label="Confirm new password" type="password" placeholder="Repeat password" />

              <div v-if="state.error || localError" class="am-error">{{ state.error || localError }}</div>

              <button class="am-btn" :disabled="state.loading" @click="handleSendResetOtp">
                {{ state.loading ? 'Sending...' : 'Send verification code' }}
              </button>
            </template>

            <template v-else>
              <p class="am-subtitle">Code sent to <b>{{ email }}</b></p>
              <OtpInput :error="state.error" :disabled="state.loading" @complete="handleOtpComplete" />
              <button class="am-link-btn" @click="otpSent = false; state.error = null">Back</button>
            </template>

            <p class="am-footer-text">
              Remembered it?
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
.am-btn--sm { padding: .7rem; font-size: .8rem; margin-bottom: .4rem; }
.am-prompt {
  background: rgba(27,133,74,.06);
  border: 1px solid rgba(27,133,74,.2);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: .8rem;
  text-align: center;
}
.am-prompt p {
  font-size: .85rem;
  color: var(--dark);
  margin: 0 0 .8rem;
}
.am-prompt b { color: var(--forest); }
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
.am-link-btn--right {
  display: block;
  margin: 0 0 .8rem auto;
  padding: 0;
}

/* Alt-method button — matches .g-btn (Google) visually so email-OTP and
   Google sit as equal-weight options. */
.am-method {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: .6rem;
  width: 100%;
  padding: .75rem 1rem;
  border: 1.5px solid var(--sand);
  border-radius: 50px;
  background: #fff;
  font-family: var(--sans);
  font-size: .85rem;
  font-weight: 600;
  color: var(--dark);
  cursor: pointer;
  transition: all .2s;
  margin-bottom: .6rem;
}
.am-method:hover { border-color: var(--mid); background: var(--bg); }
.am-method:disabled { opacity: .6; cursor: not-allowed; }
.am-method-icon { width: 18px; height: 18px; flex-shrink: 0; color: var(--forest); }
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
