<template>
  <div class="container">
    <h1 class="mb-4">Register</h1>
    <form @submit.prevent="submitRegister">
      <div class="mb-3">
        <label for="email" class="form-label">Email address</label>
        <input
          type="email"
          class="form-control"
          id="email"
          v-model="email"
          required
        />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input
          type="password"
          class="form-control"
          id="password"
          v-model="password"
          required
        />
      </div>
      <button type="submit" class="btn btn-primary">Register</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { register } from '../auth';

export default defineComponent({
  name: 'Register',
  setup() {
    const email = ref('');
    const password = ref('');

    const submitRegister = async () => {
      try {
        await register(email.value, password.value);
        // Redirect to the login page or another page after successful registration
      } catch (error) {
        console.error(error);
        // Show error message to user
      }
    };

    return {
      email,
      password,
      submitRegister,
    };
  },
});
</script>

<style scoped>
/* Your styles */
</style>

