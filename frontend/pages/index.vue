<template>
  <ClientOnly>
    <template #fallback>
      <div class="fixed inset-0 z-[1000] bg-theme-bg" aria-hidden="true" />
    </template>
    <div
      v-if="authLoading"
      class="fixed inset-0 z-[1000] bg-theme-bg flex items-center justify-center px-5"
    >
      <p class="text-sm text-theme-text-muted">Loading&hellip;</p>
    </div>
    <AuthPortal v-else-if="!user" />
    <div v-else class="min-h-screen">
      <header class="nav-section dark relative min-h-svh h-svh sm:min-h-screen sm:h-screen overflow-hidden bg-theme-bg">
        <div class="absolute inset-0 z-10 pointer-events-none bg-black/40" aria-hidden="true" />
        <div class="absolute inset-0 z-[5] h-full w-full">
          <Swiper
            :modules="heroSwiperModules"
            class="hero-swiper h-full w-full"
            :pagination="{ clickable: true }"
            :autoplay="{ delay: 5000, disableOnInteraction: false }"
            :loop="true"
            :grab-cursor="true"
            :speed="500"
          >
            <SwiperSlide v-for="(slide, idx) in heroSlides" :key="idx">
              <div class="relative h-full w-full overflow-hidden bg-zinc-800">
                <div class="absolute inset-0 z-10 pointer-events-none bg-black/40" aria-hidden="true" />
                <picture class="pointer-events-none block h-full w-full">
                  <source media="(min-width: 640px)" :srcset="slide">
                  <img
                    :src="slide"
                    :alt="`Slide ${idx + 1}`"
                    class="ken-burns h-full w-full select-none object-cover"
                    :loading="idx === 0 ? 'eager' : 'lazy'"
                  >
                </picture>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
        <div
          class="pointer-events-none relative z-20 flex min-h-full flex-col items-center justify-center px-5 pt-0 pb-0 sm:px-8 sm:pt-24 sm:pb-32 md:px-24 lg:px-40 xl:px-56"
        >
          <h1 class="mb-3 text-center text-4xl font-black tracking-tight text-white sm:text-5xl md:text-6xl">
            Browse Units
          </h1>
          <p class="mt-1 text-center text-sm font-medium uppercase tracking-[0.2em] text-zinc-300/90 sm:text-base">
            {{ apartmentsHeadline }}
          </p>
        </div>
      </header>

      <div class="w-full bg-theme-bg px-5 py-6 text-center sm:px-8 md:px-24">
        <p class="text-[11px] font-semibold uppercase tracking-[0.25em] text-theme-text-primary">
          {{ soldUnitsLabel }}
        </p>
      </div>

      <div class="w-full">
        <div class="relative z-[140] mt-5 bg-theme-bg/95 pt-0 pb-0">
          <div class="filterbar-container w-full">
            <ShowFiltersTriggerButton tone="light" @click="showFiltersDrawer = true" />
          </div>
        </div>
      </div>

      <Teleport to="body">
        <Transition name="filters-drawer">
          <div
            v-if="showFiltersDrawer"
            class="fixed inset-0 z-[3200]"
            role="dialog"
            aria-modal="true"
            aria-label="Filter units"
          >
            <div class="absolute inset-0 bg-black/40" aria-hidden="true" @click="showFiltersDrawer = false" />
            <div class="filters-drawer-panel-wrap absolute bottom-0 left-0 right-0 w-full sm:mb-5 sm:px-[10rem]">
              <div
                class="filters-drawer-panel flex max-h-[88vh] flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl"
              >
                <div class="filters-drawer-scroll min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-5">
                  <FilterBar
                    :embedded="true"
                    :hide-clear="isDesktopViewport"
                    :filters="filters"
                    :view-mode="viewMode"
                    :unit-types="unitTypes"
                    :floor-options="floorOptions"
                    :direction-options="directionOptions"
                    @update:filters="filters = $event"
                    @update:view-mode="viewMode = $event"
                  />
                  <div class="mt-4 flex items-center" :class="isDesktopViewport ? 'justify-between' : 'justify-end'">
                    <button
                      v-if="isDesktopViewport"
                      type="button"
                      class="filter-bar-clear inline-flex items-center gap-2 text-xs font-medium capitalize text-zinc-500 underline underline-offset-2 transition-colors hover:text-zinc-300"
                      @click="resetFilters()"
                    >
                      Clear All Filters
                    </button>
                    <button
                      type="button"
                      class="inline-flex h-[2.375rem] w-full items-center justify-center rounded-lg bg-[#18181B] px-4 text-xs font-medium capitalize text-white transition-colors hover:bg-zinc-800 sm:h-auto sm:w-auto sm:rounded-none sm:bg-transparent sm:text-zinc-500 sm:hover:bg-transparent sm:hover:text-zinc-300 sm:hover:underline sm:underline-offset-2"
                      @click="showFiltersDrawer = false"
                    >
                      Hide Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>

      <div class="mb-[2.5rem] mt-10 flex w-full justify-center px-2">
        <div class="flex w-full max-w-lg flex-col items-center">
          <div class="mb-[1.25rem] text-center">
            <p class="text-[11px] font-semibold uppercase tracking-[0.25em]" style="color: rgb(0, 0, 0)">
              Choose your view
            </p>
            <p class="mt-1 text-[13px]" style="color: rgb(0, 0, 0)">
              Switch how you browse units:
              <span class="font-semibold">Grid</span>,
              <span class="font-semibold">List</span>, or
              <span class="font-semibold">Plans</span>.
            </p>
          </div>
          <div class="flex w-full justify-center">
            <div
              class="relative inline-flex w-full max-w-[95%] items-center rounded-full bg-white p-1 sm:max-w-xl"
              role="tablist"
              aria-label="View switcher"
            >
              <button
                v-for="mode in viewModeTabs"
                :key="mode"
                type="button"
                class="relative z-10 flex min-h-10 flex-1 items-center justify-center gap-2 rounded-full px-2 py-2 text-[11px] font-medium transition-colors duration-200 sm:min-h-8 sm:py-1.5 sm:text-xs"
                :class="viewMode === mode ? 'bg-[#18181B] text-white' : 'text-black'"
                :aria-pressed="viewMode === mode"
                @click="viewMode = mode"
              >
                {{ mode === 'GRID' ? 'Grid' : mode === 'LIST' ? 'List' : 'Plans' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <section class="bg-theme-bg w-full px-5 pb-20 sm:px-8 md:px-24">
        <div v-if="catalogError" class="mx-auto max-w-3xl rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {{ catalogError }}
        </div>
        <div v-else-if="unitsLoading && !units.length" class="mx-auto max-w-xl text-center text-sm text-theme-text-muted">
          Loading units&hellip;
        </div>
        <div v-else-if="!displayedUnits.length" class="mx-auto max-w-xl text-center text-sm text-theme-text-muted">
          No units match your filters.
        </div>
        <div
          v-else-if="viewMode === 'GRID'"
          class="mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <UnitCard
            v-for="unit in displayedUnits"
            :key="unit.id"
            :unit="unit"
            :is-wishlisted="isWishlisted(unit.id)"
            :reserving-unit-id="reservingUnitId"
            @select="onSelectUnit"
            @reserve="onReserveUnit"
            @toggle-wishlist="onToggleWishlist"
          />
        </div>
        <div v-else-if="viewMode === 'LIST'" class="mx-auto flex max-w-5xl flex-col gap-4">
          <UnitListRow
            v-for="unit in displayedUnits"
            :key="unit.id"
            :unit="unit"
            :is-wishlisted="isWishlisted(unit.id)"
            :reserving-unit-id="reservingUnitId"
            @select="onSelectUnit"
            @reserve="onReserveUnit"
            @toggle-wishlist="onToggleWishlist"
          />
        </div>
        <div
          v-else
          class="mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <button
            v-for="unit in displayedUnits"
            :key="unit.id"
            type="button"
            class="group overflow-hidden rounded-lg border border-zinc-100 bg-white text-left shadow-sm transition hover:shadow-md"
            @click="onSelectUnit(unit)"
          >
            <div class="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100">
              <img
                :src="planImageFor(unit)"
                :alt="`Plan ${unit.unitNumber}`"
                class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                loading="lazy"
              >
            </div>
            <div class="px-4 py-3 text-sm font-semibold text-zinc-900">Unit {{ unit.unitNumber }}</div>
          </button>
        </div>
      </section>

    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { Pagination, Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/pagination'
import type { Unit, SearchFilters, ViewMode } from '~/types/catalog'

const { user, authLoading } = useAuth()
const { units, loading: unitsLoading, error: catalogError } = useCatalog()
const { wishlistIds, toggle, isWishlisted } = useWishlist()

const heroSwiperModules = [Pagination, Autoplay]
const heroSlides = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920',
]

const showFiltersDrawer = ref(false)
const isDesktopViewport = ref(false)
const viewMode = ref<ViewMode>('GRID')
const viewModeTabs: ViewMode[] = ['GRID', 'LIST', 'PLANS']
const reservingUnitId = ref<string | null>(null)

const filters = ref<SearchFilters>({
  maxPrice: 'all',
  minPrice: 'all',
  bedrooms: 'all',
  bathrooms: 'all',
  status: 'all',
  searchQuery: '',
  orderBy: 'unitNumber',
  orderDir: 'asc',
  layout: 'any',
  floor: 'any',
  direction: 'any',
  parking: 'any',
  wishlistFilter: 'all',
})

const unitTypes = computed(() => {
  const set = new Set(units.value.map((u) => u.unitType).filter(Boolean))
  return Array.from(set).sort()
})
const floorOptions = computed(() => {
  const set = new Set(units.value.map((u) => u.floor).filter((f): f is string => Boolean(f)))
  return Array.from(set).sort()
})
const directionOptions = computed(() => {
  const set = new Set(units.value.map((u) => u.direction).filter((d): d is string => Boolean(d)))
  return Array.from(set).sort()
})

const apartmentsHeadline = computed(() => {
  if (unitsLoading.value) return 'APARTMENTS'
  const count = units.value.length
  return `${count} ${count === 1 ? 'APARTMENT' : 'APARTMENTS'}`
})

const soldCount = computed(
  () => units.value.filter((u) => u.status === 'Sold' || u.status === 'Reserved').length,
)

const soldUnitsLabel = computed(() => {
  if (unitsLoading.value) return 'UNITS SOLD'
  if (!units.value.length) return 'UNITS SOLD'
  return `${soldCount.value} OF ${units.value.length} UNITS SOLD`
})

const displayedUnits = computed(() => {
  let list = units.value.filter((unit) => {
    const matchesPrice =
      (filters.value.maxPrice === 'all' || unit.price <= Number(filters.value.maxPrice)) &&
      (filters.value.minPrice === 'all' || unit.price >= Number(filters.value.minPrice))
    const matchesBeds =
      filters.value.bedrooms === 'all' || unit.bedrooms.toString() === filters.value.bedrooms
    const matchesBaths =
      filters.value.bathrooms === 'all' ||
      unit.bathrooms.toString() === filters.value.bathrooms
    const matchesStatus =
      filters.value.status === 'all' || unit.status === filters.value.status
    const matchesSearch =
      !filters.value.searchQuery?.trim() ||
      unit.unitNumber.toLowerCase().includes(filters.value.searchQuery!.toLowerCase())
    const matchesLayout =
      !filters.value.layout || filters.value.layout === 'any' || unit.unitType === filters.value.layout
    const matchesFloor =
      !filters.value.floor || filters.value.floor === 'any' || (unit.floor ?? '') === filters.value.floor
    const matchesDirection =
      !filters.value.direction ||
      filters.value.direction === 'any' ||
      (unit.direction ?? '') === filters.value.direction
    const matchesParking =
      !filters.value.parking || filters.value.parking === 'any' || unit.parking.toString() === filters.value.parking
    const matchesWishlist =
      (filters.value.wishlistFilter ?? 'all') === 'all' || wishlistIds.value.includes(unit.id)
    return (
      matchesPrice &&
      matchesBeds &&
      matchesBaths &&
      matchesStatus &&
      matchesSearch &&
      matchesLayout &&
      matchesFloor &&
      matchesDirection &&
      matchesParking &&
      matchesWishlist
    )
  })
  const by = filters.value.orderBy ?? 'unitNumber'
  const dir = filters.value.orderDir ?? 'asc'
  list = [...list].sort((a, b) => {
    let aVal: string | number
    let bVal: string | number
    if (by === 'unitNumber') {
      aVal = a.unitNumber
      bVal = b.unitNumber
    } else if (by === 'price') {
      aVal = a.price
      bVal = b.price
    } else {
      aVal = a.bedrooms
      bVal = b.bedrooms
    }
    const cmp =
      typeof aVal === 'number' ? (aVal as number) - (bVal as number) : aVal < bVal ? -1 : aVal > bVal ? 1 : 0
    return dir === 'asc' ? cmp : -cmp
  })
  return list
})

function planImageFor(unit: Unit) {
  return unit.floorplanUrl || unit.imageUrl
}

function resetFilters() {
  filters.value = {
    maxPrice: 'all',
    minPrice: 'all',
    bedrooms: 'all',
    bathrooms: 'all',
    status: 'all',
    searchQuery: '',
    orderBy: 'unitNumber',
    orderDir: 'asc',
    layout: 'any',
    floor: 'any',
    direction: 'any',
    parking: 'any',
    wishlistFilter: 'all',
  }
}

function onSelectUnit(unit: Unit) {
  void navigateTo(`/unit/${unit.unitNumber}`)
}

async function onReserveUnit(unit: Unit) {
  reservingUnitId.value = unit.id
  try {
    await navigateTo(`/reserve/${unit.unitNumber}`)
  } finally {
    reservingUnitId.value = null
  }
}

function onToggleWishlist(unitId: string) {
  void toggle(unitId)
}

function syncBrowseBodyScrollLock() {
  if (typeof document === 'undefined') return
  document.body.style.overflow = showFiltersDrawer.value ? 'hidden' : ''
}

watch(showFiltersDrawer, syncBrowseBodyScrollLock)

function updateDesktopViewport() {
  if (typeof window === 'undefined') return
  isDesktopViewport.value = window.matchMedia('(min-width: 1024px)').matches
}

onMounted(() => {
  updateDesktopViewport()
  window.addEventListener('resize', updateDesktopViewport, { passive: true })
})

onBeforeUnmount(() => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updateDesktopViewport)
  }
})
</script>

<style scoped>
.filterbar-container {
  @apply w-full px-4 sm:px-[15rem];
}

.filters-drawer-enter-active,
.filters-drawer-leave-active {
  transition: opacity 0.25s ease;
}
.filters-drawer-enter-active .filters-drawer-panel,
.filters-drawer-leave-active .filters-drawer-panel {
  transition: transform 0.3s ease;
}
.filters-drawer-enter-from,
.filters-drawer-leave-to {
  opacity: 0;
}
.filters-drawer-enter-from .filters-drawer-panel,
.filters-drawer-leave-to .filters-drawer-panel {
  transform: translateY(100%);
}
.filters-drawer-enter-to .filters-drawer-panel,
.filters-drawer-leave-from .filters-drawer-panel {
  transform: translateY(0);
}

.filters-drawer-panel {
  -webkit-overflow-scrolling: touch;
}
.filters-drawer-scroll {
  -webkit-overflow-scrolling: touch;
  transform: translateZ(0);
  backface-visibility: hidden;
}

.hero-swiper :deep(.swiper-pagination) {
  left: auto;
  right: 1.25rem;
  bottom: 1.25rem;
  width: auto;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.hero-swiper :deep(.swiper-pagination-bullet) {
  background: white;
  opacity: 0.45;
  width: 0.5rem;
  height: 0.5rem;
  margin: 0;
  border-radius: 9999px;
  transition:
    width 0.25s ease,
    height 0.25s ease,
    opacity 0.25s ease,
    border-radius 0.25s ease;
}
.hero-swiper :deep(.swiper-pagination-bullet-active) {
  opacity: 1;
  width: 1.5rem;
  height: 0.5rem;
  border-radius: 9999px;
}

.ken-burns {
  animation: ken-burns 12s ease-out both;
}
@keyframes ken-burns {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.08);
  }
}
</style>
