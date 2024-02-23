// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/Default.vue'),
    children: [
      { path: '',       name: 'Home',  component: () => import('@/views/Home.vue') },
      { path: '/hotel', name: 'Hotel', component: () => import('@/views/Hotel.vue') },
      { path: '/rooms', name: 'Rooms', component: () => import('@/views/Rooms.vue') },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
