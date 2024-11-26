import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

export function useResponsiveBreakpoints() {
  const breakpoints = useBreakpoints(breakpointsTailwind)
  return {
    smAndLarger: breakpoints.greaterOrEqual('sm'),
    largeAndXl: breakpoints.greaterOrEqual('lg'),
    activeBreakpoint: breakpoints.active(),
  }
}
