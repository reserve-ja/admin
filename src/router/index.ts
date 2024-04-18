import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/Default.vue'),
    children: [
      { path: '', name: 'Home',  component: () => import('@/views/Home.vue') },
      { path: 'hotel', name: 'HotelDetails', component: () => import('@/views/HotelDetails.vue')},
      { path: 'hotel/edit', name: 'HotelEdit', component: () => import('@/views/HotelEdit.vue') },
      { path: 'hotel/edit-pms-config', name: 'HotelEditPmsConfig', component: () => import('@/views/HotelEditPmsConfig.vue') },
      { path: 'rooms',         name: 'Rooms', component: () => import('@/views/Rooms.vue') },
      { path: 'rooms/:roomId', name: 'Room',  component: () => import('@/views/Room.vue'), props: true },
      { path: 'bookings', name: 'Bookings',  component: () => import('@/views/Bookings.vue') },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
