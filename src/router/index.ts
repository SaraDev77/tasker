import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DetailsView from '../views/DetailsView.vue'
import NotFound from '../views/NotFound.vue'
import { useTasksStore } from '../stores/tasks'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },

    {
      path: '/details/:id',
      name: 'task-details',
      component: DetailsView,
      beforeEnter: async (to,from, next) => {
        const { id } = to.params
        try {
          useTasksStore().fetchSingleTask(id.toString())
          next()
        } catch (error) {
          console.error('Invalid Task ID:', error)
          next({ name: 'not-found' })
        }
      },
    },
    {
      name: 'not-found',
      path: '/:catchAll(.*)',
      component: NotFound,
    },
  ],
})

export default router
