import {createRouter,
        createWebHistory} from 'vue-router'

import ForumListView from '../views/ForumListView.vue'
import UsuarioView from '../views/UsuarioView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/pergunta/:id',
      name: 'PerguntaEdit',
      component: ForumListView
    },
    {
      path: '/',
      name: 'forumList',
      component: ForumListView
    },
    {
      path: '/user',
      name: 'user',
      component: UsuarioView
    }
  ]
})

export default router
