import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import DocumentsPage from '~/pages/documents.vue'

describe('pages/documents.vue', () => {
  it('renders downloads heading and document cards from static metadata', async () => {
    const wrapper = await mountSuspended(DocumentsPage)
    const text = wrapper.text()
    expect(text).toContain('Downloads')
    expect(text).toContain('Site Development Plan')
    expect(text).toContain('Floorplan Pack')
    expect(text).toMatch(/Download/i)
  })
})
