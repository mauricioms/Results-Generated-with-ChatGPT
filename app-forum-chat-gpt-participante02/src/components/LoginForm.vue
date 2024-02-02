<template>
  <div class="login-page">
    <div class="login-container">
      <h1>Acesso ao <strong>App Forum</strong></h1>
      <form @submit.prevent="submitForm">
        <input type="text" v-model="email" placeholder="Usuário" required />
        <input
          type="password"
          v-model="password"
          placeholder="Senha"
          required
        />
        <button type="submit" class="btn btn-signin">Entrar</button>
      </form>
    </div>
    <button type="button" @click.prevent="goToSignUp" class="btn btn-signup">
      Novo Usuário
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { userEmail } from "@/store/auth";

export default defineComponent({
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async submitForm() {
      try {
        await axios.post("http://localhost:3030/api/signin", {
          email: this.email,
          password: this.password,
        });
        userEmail.value = this.email;
        this.$router.push("/home");
      } catch (error) {
        console.error("Error signing in:", error);
      }
    },
    goToSignUp() {
      this.$router.push("/signup");
    },
  },
});
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
}

.login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 50%;
  min-height: 30%;
  background-color: #d3d3d3;
  border: 4px solid black; /* Black border */
  border-radius: 8px;
  padding: 20px;
  box-sizing: border-box;
}

h1 {
  font-size: 24px;
  margin-bottom: 16px;
}

input {
  width: 100%;
  height: 32px;
  margin-bottom: 16px;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.btn {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 50px;
  color: white;
  cursor: pointer;
  margin-top: 16px;
}

.btn-signin {
  background-color: #32cd32;
}

.btn-signup {
  background-color: #32cd32;
  margin-top: 64px;
  width: 120px;
  height: 32px;
}
</style>
