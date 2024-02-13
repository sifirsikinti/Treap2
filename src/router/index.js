import { createRouter, createWebHistory } from 'vue-router';
import LogIn from '../components/LogIn.vue';
import StartingPage from '../components/StartingPage.vue';

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'Login',
    component: LogIn,
  },
  {
    path: '/startseite',
    name: 'StartingPage',
    component: StartingPage,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
