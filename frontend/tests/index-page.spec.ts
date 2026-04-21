import { describe, it, expect, vi } from 'vitest'
import { ref } from 'vue'
import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime'
import IndexPage from '~/pages/index.vue'
import type { AppUser } from '~/types/user'

const mockUser = ref<AppUser | null>({
  id: '00000000-0000-4000-8000-000000000001',
  email: 'buyer@example.com',
  displayName: 'Test Buyer',
  role: 'user',
  firstName: 'Test',
  lastName: 'Buyer',
  phone: '+27123456789',
  idPassportNumber: null,
  reasonForBuying: null,
})

mockNuxtImport('useAuth', () => () => ({
  user: mockUser,
  authLoading: ref(false),
  sessionRef: ref(null),
  signUp: vi.fn(),
  login: vi.fn(),
  logout: vi.fn(),
  resetPasswordForEmail: vi.fn(),
  signInWithOtp: vi.fn(),
  verifyOtp: vi.fn(),
  checkEmailExists: vi.fn(),
}))

mockNuxtImport('useCatalog', () => () => ({
  units: ref([]),
  loading: ref(false),
  error: ref(null),
  refresh: vi.fn(),
}))

mockNuxtImport('useWishlist', () => () => ({
  wishlistIds: ref([]),
  toggle: vi.fn(),
  isWishlisted: vi.fn(() => false),
}))

describe('pages/index.vue', () => {
  it('renders the browse hero when authenticated', async () => {
    const wrapper = await mountSuspended(IndexPage)
    expect(wrapper.text()).toContain('Browse Units')
  })
})
