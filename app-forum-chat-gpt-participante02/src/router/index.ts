// src/router/index.ts

import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import LoginForm from '../components/LoginForm.vue';
import SignUpForm from '../components/SignUpForm.vue';
import HomePage from '../components/HomePage.vue';
import PostDetails from '../components/PostDetails.vue';
import ProfilePage from '../components/ProfilePage.vue';

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginForm },
  { path: '/signup', component: SignUpForm },
  { path: '/home', component: HomePage },
  {
    path: '/post/:postId',
    name: 'PostDetails',
    component: PostDetails,
    props: true,
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfilePage,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
