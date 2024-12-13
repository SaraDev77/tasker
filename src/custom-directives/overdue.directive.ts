import type { Directive } from 'vue'

export const vOverdue: Directive<HTMLElement, Date> = {
  mounted(el, binding) {
    const currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)

    const dueDate = new Date(binding.value)
    dueDate.setHours(0, 0, 0, 0)

    if (currentDate > dueDate) {
      el.classList.add('!bg-red-100')
    }
  },
}
