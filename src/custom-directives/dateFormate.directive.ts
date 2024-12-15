import type { Directive } from 'vue'

export const vFormateDate: Directive<HTMLElement, Date> = {
  mounted(el, binding) {
    const date = new Date(binding.value)
    el.textContent = date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  },
  updated(el, binding) {
    const date = new Date(binding.value)
    el.textContent = date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  },
}
