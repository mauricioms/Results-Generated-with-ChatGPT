<template>
  <div class="top-bar">
    <div class="top-bar-left">
      <div class="app-forum">App Forum</div>
      <button class="new-question" @click="openForm = true">
        <i class="fas fa-plus"></i>
        Nova pergunta
      </button>
    </div>
    <router-link to="/profile">
      <i class="fas fa-user"></i>
      Perfil
    </router-link>
    <button @click="logout" class="logout">Logout</button>
  </div>

  <modal v-if="openForm" @close="openForm = false">
    <h3 slot="header">New Question</h3>
    <div slot="body">
      <input type="text" v-model="newQuestion.assunto" placeholder="Assunto" />
      <textarea
        v-model="newQuestion.conteudo"
        placeholder="Conteúdo"
      ></textarea>
      <button @click="submitNewQuestion">Enviar</button>
      <button @click="openForm = false">Cancelar</button>
    </div>
  </modal>

  <div class="main-content">
    <h1 v-if="userEmail">Hello, {{ userEmail }}</h1>
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Assunto</th>
          <th>Usuário</th>
          <th>Data</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in items" :key="index">
          <td>{{ item.id }}</td>
          <td>{{ item.assunto }}</td>
          <td>{{ item.usuario }}</td>
          <td>{{ item.data }}</td>
          <td>
            <button class="view-button" @click="viewItem(item.id)">
              <font-awesome-icon icon="binoculars" />
              Visualizar
            </button>
            <button class="remove-button" @click="removeItem(item.id)">
              <font-awesome-icon icon="trash-alt" />
              Remover
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<!-- src/components/HomePage.vue -->
<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from "vue";
import { userEmail } from "@/store/auth";
import { useRouter } from "vue-router";
import axios from "axios";

export default defineComponent({
  name: "HomePage",
  setup() {
    const router = useRouter();
    const items = ref([
      {
        id: 1,
        assunto: "Assunto 1",
        usuario: "Usuario 1",
        data: "2023-05-01 10:30:00",
      },
      {
        id: 2,
        assunto: "Assunto 2",
        usuario: "Usuario 2",
        data: "2023-05-02 11:30:00",
      },
      // Add more items if needed
    ]);
    const openForm = ref(false);
    const newQuestion = reactive({
      id: Math.random(), // change this to a more suitable ID generation
      assunto: "",
      usuario: userEmail, // fetch logged-in user email
      data: new Date().toISOString(),
      conteudo: "",
    });

    const submitNewQuestion = () => {
      axios
        .post("http://localhost:3030/api/posts", newQuestion)
        .then(() => {
          newQuestion.assunto = "";
          newQuestion.conteudo = "";
          openForm.value = false;
          fetchPosts(); // Refresh posts after adding new one
        })
        .catch((error) => console.error(error));
    };

    const fetchPosts = () => {
      axios
        .get("http://localhost:3030/api/posts")
        .then((response) => {
          items.value = response.data; // Assuming your table data is stored in 'items' ref
        })
        .catch((error) => console.error(error));
    };

    // Fetch posts when component is mounted
    onMounted(fetchPosts);

    return {
      openForm,
      newQuestion,
      submitNewQuestion,
      userEmail,
      items,
      logout() {
        localStorage.removeItem("email");
        router.push("/login");
      },
      viewItem(itemId: number) {
        console.log(`View item with ID: ${itemId}`);
        router.push({ name: "PostDetails", params: { postId: itemId } });
        // Perform the view item action, e.g., navigate to a different page, display a modal, etc.
      },
      removeItem(itemId: number) {
        console.log(`Remove item with ID: ${itemId}`);
        axios
          .delete(`http://localhost:3030/api/posts/${itemId}`)
          .then(() => {
            fetchPosts(); // Refresh posts after deletion
          })
          .catch((error) => console.error(error));
      },
      createNewQuestion() {
        const newItem = {
          id: items.value.length + 1,
          assunto: "Random Assunto " + Math.random().toString(36).substring(7),
          usuario: "Random Usuario " + Math.random().toString(36).substring(7),
          data: new Date().toISOString().slice(0, 10),
        };
        items.value.push(newItem);
      },
    };
  },
});
</script>

<style scoped>
table {
  border-collapse: collapse;
  width: 100%;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}
.main-content {
  margin-top: 120px;
}
.view-button,
.remove-button {
  border: none;
  color: white;
  cursor: pointer;
  margin-right: 10px;
  padding: 6px 12px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 14px;
  transition-duration: 0.4s;
}

.view-button {
  background-color: blue;
}

.view-button:hover {
  background-color: darkblue;
}

.remove-button {
  background-color: red;
}

.remove-button:hover {
  background-color: darkred;
}

.binoculars-icon,
.trash-bin-icon {
  /* You can use any icon library you prefer, e.g., Font Awesome, Material Icons, etc. */
  /* Here's an example using Font Awesome: */
  font-family: "Font Awesome 5 Free";
  font-weight: 900;
  margin-right: 5px;
}

.binoculars-icon::before {
  content: "\f1e5"; /* Font Awesome code for the binoculars icon */
}

.trash-bin-icon::before {
  content: "\f2ed"; /* Font Awesome code for the trash bin icon */
}

.top-bar {
  background-color: #d3d3d3;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0.5rem;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
}

.app-forum {
  font-size: 1.5rem;
  font-weight: bold;
  margin-right: auto;
}

.new-question {
  background-color: green;
  color: white;
  margin-right: 1rem;
  border: none;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.new-question i {
  margin-right: 0.5rem;
}

.top-bar-left {
  display: flex;
  flex-direction: column;
  margin-right: auto;
}

.logout {
  background-color: transparent;
  border: none;
  color: #000;
  cursor: pointer;
  font-size: 16px;
  padding: 8px 16px;
}
</style>
