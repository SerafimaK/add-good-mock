# Add Good — Backend API Specification

All endpoints return JSON. Authentication uses JWT Bearer tokens.

---

## Authentication

### POST /api/auth/send-otp
Send a one-time password to email or phone.

**Request:**
```json
{ "emailOrPhone": "jane@example.com" }
```

**Response (200):**
```json
{ "success": true, "message": "Code sent" }
```

---

### POST /api/auth/verify-otp
Verify OTP code. Returns a temporary token for registration, or logs in existing user.

**Request:**
```json
{ "emailOrPhone": "jane@example.com", "code": "123456" }
```

**Response (200):**
```json
{ "verified": true, "tempToken": "tmp_xxx" }
```

---

### POST /api/auth/register
Create a new user account. Requires verified OTP.

**Request:**
```json
{
  "name": "Jane Doe",
  "emailOrPhone": "jane@example.com",
  "password": "securepassword",
  "otpToken": "tmp_xxx"
}
```

**Response (201):**
```json
{
  "user": {
    "id": "usr_001",
    "email": "jane@example.com",
    "phone": "",
    "name": "Jane Doe",
    "avatar": null,
    "provider": "email"
  },
  "token": "eyJhbGciOi..."
}
```

**Errors:** 409 if email/phone already registered.

---

### POST /api/auth/login
Log in with email/phone and password.

**Request:**
```json
{ "emailOrPhone": "jane@example.com", "password": "securepassword" }
```

**Response (200):**
```json
{ "user": { ... }, "token": "eyJhbGciOi..." }
```

**Errors:** 401 invalid credentials.

---

### POST /api/auth/login-otp
Log in using OTP code (passwordless).

**Request:**
```json
{ "emailOrPhone": "jane@example.com", "code": "123456" }
```

**Response (200):**
```json
{ "user": { ... }, "token": "eyJhbGciOi..." }
```

If no account exists for this email/phone, creates a new account automatically.

---

### POST /api/auth/google
Authenticate with Google. Frontend sends the Google ID token.

**Request:**
```json
{ "googleIdToken": "eyJhbGciOi..." }
```

**Response (200):**
```json
{ "user": { ... }, "token": "eyJhbGciOi..." }
```

Backend verifies the Google ID token, creates or finds the user, returns JWT.

---

### GET /api/auth/me
Get current user profile.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{ "user": { "id": "usr_001", "email": "jane@example.com", "phone": "", "name": "Jane Doe", "avatar": null, "provider": "email" } }
```

---

## User Profile

### PUT /api/users/profile
Update user profile fields.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{ "name": "Jane Smith", "phone": "+1234567890" }
```

**Response (200):**
```json
{ "user": { ... } }
```

---

## Addresses

### GET /api/users/addresses

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "addresses": [
    {
      "id": "addr_001",
      "label": "Home",
      "fullName": "Jane Doe",
      "line1": "123 Elm Street",
      "line2": "Apt 4B",
      "city": "Portland",
      "state": "OR",
      "zip": "97201",
      "country": "US",
      "isDefault": true
    }
  ]
}
```

### POST /api/users/addresses
Create a new address.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "label": "Office",
  "fullName": "Jane Doe",
  "line1": "456 Oak Avenue",
  "line2": "",
  "city": "Portland",
  "state": "OR",
  "zip": "97204",
  "country": "US",
  "isDefault": false
}
```

**Response (201):**
```json
{ "address": { "id": "addr_002", ... } }
```

### PUT /api/users/addresses/:id
Update an existing address.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{ "address": { ... } }
```

### DELETE /api/users/addresses/:id

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{ "success": true }
```

---

## Orders

### POST /api/orders
Place a new order. Auth is optional (guest checkout supported).

**Headers:** `Authorization: Bearer <token>` (optional)

**Request:**
```json
{
  "items": [
    {
      "boosterId": "glow",
      "bonuses": ["centella"],
      "redGold": true,
      "price": 12.90
    }
  ],
  "shippingAddress": {
    "fullName": "Jane Doe",
    "line1": "123 Elm Street",
    "line2": "Apt 4B",
    "city": "Portland",
    "state": "OR",
    "zip": "97201",
    "country": "US"
  },
  "guestEmail": "guest@example.com"
}
```

- If authenticated: order is saved to user's order history.
- If not authenticated and `guestEmail` is provided: send confirmation email, do not create account.

**Response (201):**
```json
{
  "order": {
    "id": "ord_001",
    "date": "2026-03-23T10:30:00Z",
    "status": "processing",
    "items": [ ... ],
    "total": 12.90,
    "shippingAddress": { ... }
  }
}
```

### GET /api/orders
List current user's orders (newest first).

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{ "orders": [ ... ] }
```

### GET /api/orders/:id
Get a specific order.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{ "order": { ... } }
```

---

## Order Statuses

Orders follow this lifecycle:

```
processing → shipped → delivered
     ↓
  cancelled
```

- `processing` — order received, being prepared
- `shipped` — order dispatched, in transit
- `delivered` — order delivered to customer
- `cancelled` — order cancelled (from any state)

---

## Notes for Backend Implementation

1. **JWT tokens** — expire after 7 days. Consider adding refresh token flow.
2. **OTP** — codes expire after 5 minutes. Rate limit: max 3 per email/phone per 10 minutes.
3. **Google OAuth** — verify ID token with Google's tokeninfo endpoint or library.
4. **Guest checkout** — store order with guest email, send confirmation. No account created.
5. **Passwords** — hash with bcrypt (min 10 rounds). Enforce min 6 characters.
6. **CORS** — allow frontend origin.
7. **Rate limiting** — especially on auth endpoints.
