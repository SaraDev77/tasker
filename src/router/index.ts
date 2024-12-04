import { createRouter, createWebHistory, type NavigationGuard } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DetailsView from '../views/DetailsView.vue'
import NotFound from '../views/NotFound.vue'
import { useTasksStore } from '../stores/tasks'
import DiagramsView from '../views/DiagramsView.vue'
const routeGuard: NavigationGuard = async (to, from, next) => {
  const { id } = to.params
  try {
    useTasksStore().fetchSingleTask(id.toString())
    next()
    console.log('object')
  } catch (error) {
    console.error('Invalid Task ID:', error)
    next({ name: 'not-found' })
  }
}
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/diagrams',
      name: 'diagrams',
      component: DiagramsView,
    },
    {
      path: '/details/:id',
      name: 'task-details',
      component: DetailsView,
      beforeEnter: [routeGuard],
      strict: true,
    },
    {
      name: 'not-found',
      path: '/:catchAll(.*)',
      component: NotFound,
    },
  ],
})

export default router
