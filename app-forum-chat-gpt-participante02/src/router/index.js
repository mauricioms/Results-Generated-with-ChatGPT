// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import LoginForm from '../components/LoginForm.vue';
import SignUpForm from '../components/SignUpForm.vue';
const routes = [
    {
        path: '/',
        name: 'Login',
        component: LoginForm,
    },
    {
        path: '/signup',
        name: 'SignUp',
        component: SignUpForm,
    },
    // Add other routes as needed
];
const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});
export default router;
//# sourceMappingURL=index.js.map