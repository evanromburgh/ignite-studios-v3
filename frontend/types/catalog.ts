export interface Unit {
  id: string
  unitNumber: string
  bedrooms: number
  bathrooms: number
  parking: number
  sizeSqm: number
  price: number
  originalPrice?: number | null
  status: 'Available' | 'Reserved' | 'Sold' | 'Held by Developer'
  unitType: string
  floor?: string | null
  direction?: string | null
  imageUrl: string
  imageUrl2?: string | null
  imageUrl3?: string | null
  floorplanUrl?: string | null
  viewers?: Record<string, number>
  lockExpiresAt?: number
  lockedBy?: string
}

export const ViewMode = {
  GRID: 'GRID',
  LIST: 'LIST',
  PLANS: 'PLANS',
} as const

export type ViewMode = (typeof ViewMode)[keyof typeof ViewMode]

export interface SearchFilters {
  maxPrice: number | 'all'
  minPrice: number | 'all'
  bedrooms: string
  bathrooms: string
  status: string
  searchQuery?: string
  orderBy?: 'unitNumber' | 'price' | 'bedrooms'
  orderDir?: 'asc' | 'desc'
  layout?: string
  floor?: string
  direction?: string
  parking?: string
  wishlistFilter?: 'all' | 'yes'
}
