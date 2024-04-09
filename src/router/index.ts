import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/Default.vue'),
    children: [
      { path: '', name: 'Home',  component: () => import('@/views/Home.vue') },
      {
        path: '/hotel',
        children: [
          { path: '',               name: 'Hotel', component: () => import('@/views/Hotel.vue') },
          { path: '/rooms',         name: 'Rooms', component: () => import('@/views/Rooms.vue') },
          { path: '/rooms/:roomId', name: 'Room',  component: () => import('@/views/Room.vue'), props: true },
        ],
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
