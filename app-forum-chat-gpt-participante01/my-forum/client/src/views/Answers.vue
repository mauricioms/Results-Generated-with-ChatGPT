<template>
  <p>&nbsp;</p>
  <div class="container">
    <div>
      <span>Logged in as: </span><strong>{{ userEmail }}</strong>
    </div>

    <hr />

    <h3 class="mb-4">Answers for question: {{ question.title }}</h3>
    <p class="mb-4">{{ question.content }}</p>
    <ul class="list-group mb-4">
      <li v-for="answer in answers" :key="answer.id" class="list-group-item">
        <button
          @click="deleteAnswer(answer.id)"
          type="button"
          class="btn btn-danger btn-sm"
        >
          Delete
        </button>
        <strong>{{ answer.user_email }}</strong
        >: {{ answer.text }}
        <span>{{ answer.createdAt }}</span>
      </li>
    </ul>
    <form @submit.prevent="submitAnswer" class="mb-4">
      <div class="mb-3">
        <label for="new-answer" class="form-label">Your answer:</label>
        <textarea
          id="new-answer"
          v-model="newAnswerText"
          required
          class="form-control"
          rows="3"
        ></textarea>
      </div>
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
    <button @click="$router.go(-1)" class="btn btn-secondary">
      Back to questions
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import api from "../api";

export default defineComponent({
  name: "Answers",
  props: {
    questionId: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const answers = ref([]);
    const questionText = ref("");
    const question = ref({ title: "", content: "" });
    const newAnswerText = ref("");
    const userEmail = ref("");

    const fetchAnswers = async () => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      userEmail.value = user.email || "";
      try {
        const questionResponse = await api.get(
          `/questions/${props.questionId}`,
        );
        question.value = {
          title: questionResponse.data.title,
          content: questionResponse.data.content,
        };
        const answersResponse = await api.get(
          `/questions/${props.questionId}/answers`,
        );
        answers.value = answersResponse.data;
      } catch (error) {
        console.error(error);
        // Show error message to user
      }
    };

    const submitAnswer = async () => {
      try {
        await api.post(`/question/${props.questionId}/answers`, {
          text: newAnswerText.value,
        });
        newAnswerText.value = "";
        await fetchAnswers();
      } catch (error) {
        console.error(error);
        // Show error message to user
      }
    };

    const deleteAnswer = async (answerId: number) => {
      try {
        await api.delete(`/answers/${answerId}`);
        await fetchAnswers();
      } catch (error) {
        console.error(error);
        // Show error message to user
      }
    };

    onMounted(fetchAnswers);

    return {
      questionText,
      question,
      answers,
      fetchAnswers,
      newAnswerText,
      submitAnswer,
      deleteAnswer,
      userEmail,
    };
  },
});
</script>

<style scoped>
/* Your styles */
</style>
