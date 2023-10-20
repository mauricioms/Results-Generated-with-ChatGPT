
<!-- src/components/SignUpForm.vue -->
<template>
  <div class="register-page">
    <h1>Novo Usuário</h1>
    <form @submit.prevent="submitForm" class="register-form">
      <input type="text" v-model="email" placeholder="Usuário (e-mail)" required />
      <input type="password" v-model="password" placeholder="Senha" required />
      <button type="submit" class="btn btn-signup">Cadastrar</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';

export default defineComponent({
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    async submitForm() {
      try {
        await axios.post('http://localhost:3030/api/register', { email: this.email, password: this.password });
        this.$router.push('/');
      } catch (error) {
        console.error('Error signing up:', error);
      }
    }
  }
});
</script>

<style scoped>
.register-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 16px;
}

.register-form {
  display: flex;
  flex-direction: column;
  width: 90%;
}

.register-form input {
  margin-bottom: 16px;
  height: 20px;
  width: 100%;
}

.btn-signup {
  background-color: #0047ab;
  color: white;
  border-radius: 18px;
  border: none;
  padding: 8px 16px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  width: 100px;
}
</style>
