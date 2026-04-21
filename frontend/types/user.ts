export type AppUserRole = 'admin' | 'user'

export interface AppUser {
  id: string
  email: string | null
  displayName: string | null
  role: AppUserRole
  firstName: string | null
  lastName: string | null
  phone: string | null
  idPassportNumber: string | null
  reasonForBuying: string | null
}
