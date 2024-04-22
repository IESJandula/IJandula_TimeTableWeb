import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TeacherView from '../views/TeacherView.vue';
import ConvivenciaView from '@/views/ConvivenciaView.vue';
import HorarioView from '@/views/HorarioView.vue';
import AlumnosView from '@/views/AlumnosView.vue'
import AdminView from '@/views/AdminView.vue';
import MapaView from '@/views/MapaView.vue';
import NotFoundView from '@/views/NotFoundView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/horarios',
      name: 'welcome page',
      component: HomeView
    },
    {
      path: '/horarios/profesores',
      name: 'profesores',
      component: TeacherView
    },
    {
      path: '/horarios/convivencia',
      name: 'convivencia',
      component: ConvivenciaView
    },
    {
      path: '/horarios/horas',
      name: 'horarios',
      component: HorarioView 
    },
    {
      path: '/horarios/alumnos',
      name: 'alumnos',
      component: AlumnosView
    },
    {
      path: '/horarios/admin',
      name: 'admin',
      component: AdminView
    },
    {
      path: '/horarios/mapa',
      name: 'mapa',
      component: MapaView
    },
    {
      path: '/error',
      name: 'notFoundPage',
      component: NotFoundView
    }
  ]
})

export default router
