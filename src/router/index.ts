import { createRouter, createWebHistory, type NavigationGuard } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DetailsView from '../views/DetailsView.vue'
import NotFound from '../views/NotFound.vue'
import { useTasksStore } from '../stores/tasks.store'
import DiagramsView from '../views/DiagramsView.vue'
import LoginView from '../views/auth/LoginView.vue'
import RegisterView from '../views/auth/RegisterView.vue'
import { useAuthStore } from '../stores/auth.store'

const routeGuard: NavigationGuard = async (to, from, next) => {
  const { id } = to.params
  try {
    useTasksStore().fetchSingleTask(id.toString())
    next()
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
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { hideSidebar: true },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { hideSidebar: true },
    },
    {
      name: 'not-found',
      path: '/:catchAll(.*)',
      component: NotFound,
    },
  ],
})
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.name === 'login' || to.name === 'not-found' || to.name === 'register') {
    return next()
  }
  if (!authStore.user) {
    return next({ name: 'login' })
  }
  next()
})

export default router
