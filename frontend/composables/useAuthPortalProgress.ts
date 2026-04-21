import { onBeforeUnmount, ref, watch, type Ref } from 'vue'

export type AuthPortalStep = 1 | 2 | 3

export function useAuthPortalProgress(step: Ref<AuthPortalStep>) {
  const progressStep = ref<AuthPortalStep>(1)
  let progressStepTimeout: ReturnType<typeof setTimeout> | null = null

  watch(step, (newStep, oldStep) => {
    if (progressStepTimeout) {
      clearTimeout(progressStepTimeout)
      progressStepTimeout = null
    }
    if (oldStep !== undefined && newStep > oldStep) {
      progressStepTimeout = setTimeout(() => {
        progressStep.value = newStep
        progressStepTimeout = null
      }, 200)
    } else {
      progressStep.value = newStep
    }
  })

  onBeforeUnmount(() => {
    if (progressStepTimeout) clearTimeout(progressStepTimeout)
  })

  return { progressStep }
}
