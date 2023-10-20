import {createRouter,
        createWebHistory,
        RouteRecordRaw} from 'vue-router';

import {isAuthenticated} from '../auth';
import Answers from '../views/Answers.vue';
import Login from '../views/Login.vue';
import Questions from '../views/Questions.vue';
import Register from '../views/Register.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
  {
    path: '/questions',
    name: 'Questions',
    component: Questions,
    beforeEnter: (to, from, next) => {
      if (isAuthenticated())
      {
        next();
      }
      else
      {
        next('/login');
      }
    },
  },
  {
    path: '/questions/:questionId/answers',
    name: 'Answers',
    component: Answers,
    props: route => ({questionId: Number(route.params.questionId)}),
    beforeEnter: (to, from, next) => {
      if (isAuthenticated())
      {
        next();
      }
      else
      {
        next('/login');
      }
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
