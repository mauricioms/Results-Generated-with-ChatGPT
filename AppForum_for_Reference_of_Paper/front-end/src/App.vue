<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import ForumListView from './views/ForumListView.vue'
import UsuarioView from './views/UsuarioView.vue'

const loadAuthenticated = async () => {
  const myHeaders: Headers = new Headers()
  myHeaders.append('Content-Type', 'application/json')
  const myInit: RequestInit = {
    method: 'GET',
    headers: myHeaders
  }

  const myRequest: Request = new Request('/app-forum/authenticated', myInit)
  const response = await fetch(myRequest)
  const data = await response.json()
  user.value.username = data.user.username
  user.value.name = data.user.name
  user.value.email = data.user.email

  if (!data.authenticated) {
    window.location.replace(document.location.pathname + '/')
  }
}

onMounted(loadAuthenticated)

interface User {
  name: string
  username: string
  email: string
  roles: string[]
  urlPhoto: string
}

const user = ref<User>({
  username: '',
  name: '',
  email: '',
  roles: [],
  urlPhoto: ''
})

const routes: any = {
  '/': ForumListView,
  '/user': UsuarioView
}

const currentPath = ref(window.location.hash)

window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash
})

const currentView = computed(() => {
  return routes[currentPath.value.slice(1) || '/']
})
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <a class="navbar-brand" href="#">App Forum</a>
      <div class="collapse navbar-collapse">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0"></ul>
      </div>
      <div class="d-flex" role="search">
        <a href="#/user" class="btn btn-default">
          <i class="bi bi-person-circle"></i>
          {{ user.name }}
        </a>
        <a href="/app-forum/logout" class="btn btn-detault">
          <i class="bi bi-escape"></i>
          Logout
        </a>
      </div>
    </div>
  </nav>
  <component :is="currentView" />
</template>
