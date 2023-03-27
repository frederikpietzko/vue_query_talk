import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'beastlist',
      component: () => import('../views/BeastList.vue')
    },
    {
      path: '/beast/:beastId',
      name: 'beast',
      component: () => import('../views/BeastView.vue'),
      props: true
    }
  ]
})

export default router
