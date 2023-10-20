<template>
  <div class="container">
    <h1 class="mb-4">Login</h1>
    <form @submit.prevent="handleSubmit">
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
      <button type="submit" class="btn btn-primary">Login</button>
    </form>
    <div class="mt-3">
      <router-link to="/register" class="btn btn-secondary">Register</router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '../auth';

export default defineComponent({
  name: 'Login',
  setup() {
    const email = ref('');
    const password = ref('');
    const errorMessage = ref('');
    const router = useRouter();

    const handleSubmit = async () => {
      if (await login(email.value, password.value)) {
        // Redirect to the questions page after successful login
        router.push('/questions');
      } else {
        errorMessage.value = 'Invalid email or password';
      }
    };

    return {
      email,
      password,
      errorMessage,
      handleSubmit,
    };
  },
});
</script>

<style scoped>
/* Your styles */
.error-message {
  color: red;
  margin-top: 1rem;
}
</style>

