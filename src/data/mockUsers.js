export const MOCK_USERS = [
  {
    id: 'usr_001',
    email: 'jane@example.com',
    phone: '+1234567890',
    name: 'Jane Doe',
    password: 'password123',
    avatar: null,
    provider: 'email',
    addresses: [
      {
        id: 'addr_001',
        label: 'Home',
        fullName: 'Jane Doe',
        line1: '123 Elm Street',
        line2: 'Apt 4B',
        city: 'Portland',
        state: 'OR',
        zip: '97201',
        country: 'US',
        isDefault: true,
      },
      {
        id: 'addr_002',
        label: 'Office',
        fullName: 'Jane Doe',
        line1: '456 Oak Avenue',
        line2: 'Suite 200',
        city: 'Portland',
        state: 'OR',
        zip: '97204',
        country: 'US',
        isDefault: false,
      },
    ],
    orders: [
      {
        id: 'ord_001',
        date: '2026-03-10T14:30:00Z',
        status: 'delivered',
        items: [
          { boosterId: 'glow', bonuses: ['centella'], price: 12.90, sub: 'Rice Ferment + Niacinamide + Centella' },
          { boosterId: 'plump', bonuses: [], price: 11.90, sub: 'Snow Mushroom + HA' },
        ],
        total: 24.80,
        shippingAddress: {
          fullName: 'Jane Doe', line1: '123 Elm Street', line2: 'Apt 4B',
          city: 'Portland', state: 'OR', zip: '97201', country: 'US',
        },
      },
      {
        id: 'ord_002',
        date: '2026-03-18T09:15:00Z',
        status: 'shipped',
        items: [
          { boosterId: 'trio', bonuses: [], price: 29.90, sub: 'Glow + Plump + Firm' },
        ],
        total: 29.90,
        shippingAddress: {
          fullName: 'Jane Doe', line1: '456 Oak Avenue', line2: 'Suite 200',
          city: 'Portland', state: 'OR', zip: '97204', country: 'US',
        },
      },
      {
        id: 'ord_003',
        date: '2026-03-20T16:00:00Z',
        status: 'processing',
        items: [
          { boosterId: 'firm', bonuses: ['squalane', 'bakuchiol'], price: 11.90, sub: 'Sea Kelp + Peptides + Squalane, Bakuchiol' },
        ],
        total: 11.90,
        shippingAddress: {
          fullName: 'Jane Doe', line1: '123 Elm Street', line2: 'Apt 4B',
          city: 'Portland', state: 'OR', zip: '97201', country: 'US',
        },
      },
    ],
  },
  {
    id: 'usr_002',
    email: 'alex@example.com',
    phone: '+1987654321',
    name: 'Alex Kim',
    password: 'test456',
    avatar: null,
    provider: 'google',
    addresses: [
      {
        id: 'addr_003',
        label: 'Home',
        fullName: 'Alex Kim',
        line1: '789 Pine Road',
        line2: '',
        city: 'Seattle',
        state: 'WA',
        zip: '98101',
        country: 'US',
        isDefault: true,
      },
    ],
    orders: [],
  },
]

export const MOCK_OTP = '123456'
