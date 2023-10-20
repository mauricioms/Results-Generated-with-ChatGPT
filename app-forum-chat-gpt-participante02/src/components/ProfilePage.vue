<template>
  <div class="container">
    <div class="email">{{ userEmail }}</div>
    <router-link to="/home">Go Back</router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { userEmail } from '@/store/auth';

export default defineComponent({
    name: 'ProfilePage',
  setup() {
    return {
      userEmail,
    };
  },
});
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.email {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}
</style>
