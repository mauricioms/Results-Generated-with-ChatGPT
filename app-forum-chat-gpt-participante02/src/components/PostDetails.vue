<!-- src/components/PostDetails.vue -->
<template>
  <div class="post-details">
    <div class="post-header">
      <h2>{{ post.usuario }}</h2>
      <span>{{ post.data }}</span>
    </div>
    <div class="post-content">{{ post.conteudo }}</div>
    <div class="answers">
      <div v-for="answer in answers" :key="answer.id" class="answer-container">
        <div class="answer-header">
          <h3>{{ answer.username }}</h3>
          <span>{{ answer.creationDate }}</span>
        </div>
        <div class="answer-content">{{ answer.content }}</div>
        <button @click="removeAnswer(answer.id)" class="remove-btn">
          <font-awesome-icon icon="trash-alt" /> Remove
        </button>
      </div>
    </div>
  </div>
  <div class="answer-form" v-if="showAnswerForm">
  <h3>Escreva uma resposta.</h3>
  <textarea v-model="answerContent" rows="5" cols="50" />
  <button @click="saveAnswer" class="save-answer-button">Salvar Resposta</button>
</div>
  <div class="buttons-container">
  <button @click="goBack" class="back-button">
    <font-awesome-icon icon="arrow-left" /> Voltar
  </button>
  <button @click="showAnswerForm = !showAnswerForm" class="respond-button">
    <font-awesome-icon icon="arrow-left" class="icon" /> Responder
  </button>
</div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

import { userEmail } from '@/store/auth';

export default defineComponent({
  name: 'PostDetails',
 setup() {
    const router = useRouter();
    const route = useRoute();
    const showAnswerForm = ref(false);
    const answerContent = ref('');
    
    const goBack = () => {
      router.push({ path: '/home' });
    };

    const answers = ref([{
      id: 0,
    }]);


 const saveAnswer = async () => {
  // Add logic to save the answer and update the list of answers
  const newAnswer = {
    id: 0,
    username: userEmail,
    creationDate: new Date().toISOString().split('T')[0],
    content: answerContent.value,
  };
  const response = await axios.post(`http://localhost:3030/api/posts/${post.value.id}/answers`, newAnswer);
  if (response.data.message === 'Answer successfully saved.') {
    // The answer was saved successfully, add it to the list of answers
    // To show the new answer immediately, we'll assume that the `id` of the new answer is the length of the array
    newAnswer.id = answers.value.length;
    answers.value.push(newAnswer);
  }
  answerContent.value = '';
  showAnswerForm.value = false;
};

    const post = ref({
      id: 1,
      username: 'John Doe',
      creationDate: '2022-11-30',
      content: 'Post content goes here',
    });

    onMounted(async () => {
      const postId = route.params.postId; // Replace 'id' with the name of your route parameter
      const response = await axios.get(`http://localhost:3030/api/posts/${postId}`);
      post.value = response.data;
      
      
      // Fetch answers
      const answersResponse = await axios.get(`http://localhost:3030/api/posts/${postId}/answers`);
      answers.value = answersResponse.data;
    });


    // const answers = ref([
    //   {
    //     id: 1,
    //     username: 'Jane Smith',
    //     creationDate: '2022-11-30',
    //     content: 'Answer 1 content goes here',
    //   },
    //   {
    //     id: 2,
    //     username: 'Jack Johnson',
    //     creationDate: '2022-11-30',
    //     content: 'Answer 2 content goes here',
    //   },
    // ]);

    const removeAnswer = async (answerId: number) => {
  const response = await axios.delete(`http://localhost:3030/api/answers/${answerId}`);
  if (response.data.message === 'Answer successfully deleted.') {
    // The answer was deleted successfully, remove it from the list of answers
    answers.value = answers.value.filter(answer => answer.id !== answerId);
  }
};

    return {
      post,
      answers,
      removeAnswer,
      goBack,
      showAnswerForm,
      answerContent,
      saveAnswer,
    };
  },
});
</script>

<style scoped>
.post-details {
  /* Add your custom styles for the post details page here */
}
.post-header,
.answer-header {
  display: flex;
  justify-content: space-between;
}
.remove-btn {
  background-color: red;
  color: white;
  padding: 5px 10px;
  border: none;
  cursor: pointer;
}

.buttons-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.back-button {
  background: none;
  border: none;
  cursor: pointer;
}

.respond-button {
  background-color: blue;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
}

.icon {
  margin-right: 5px;
}

.answer-form {
  margin-bottom: 20px;
}

.save-answer-button {
  background-color: green;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  margin-top: 10px;
}
</style>
