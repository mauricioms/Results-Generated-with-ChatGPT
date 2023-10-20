<template>
  <p>&nbsp;</p>
  <div class="container">
    <h1 class="my-4">Questions</h1>
    <div>
      <span>Logged in as: </span><strong>{{ userEmail }}</strong>
    </div>
    <hr />
    <form
      @submit.prevent="askQuestion"
      style="border: 1px solid #000; padding: 30px"
    >
      <div class="mb-3">
        <label for="questionTitle" class="form-label">Question Title:</label>
        <input
          type="text"
          id="questionTitle"
          v-model="questionTitle"
          maxlength="100"
          required
          class="form-control"
        />
      </div>
      <div class="mb-3">
        <label for="questionContent" class="form-label"
          >Question Content:</label
        >
        <textarea
          id="questionContent"
          v-model="questionContent"
          rows="4"
          required
          class="form-control"
        ></textarea>
      </div>
      <button type="submit" class="btn btn-primary">Ask</button>
    </form>

    <hr style="border: 5px solid #000" />

    <h3><b>Questions List</b></h3>

    <table class="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Created At</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="question in questions" :key="question.id">
          <td>{{ question.id }}</td>
          <td>{{ question.title }}</td>
          <td>{{ new Date(question.createdAt).toLocaleString() }}</td>
          <td>
            <button class="btn btn-info me-2" @click="viewAnswers(question.id)">
              View Answers
            </button>
            <button class="btn btn-danger" @click="deleteQuestion(question.id)">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "../api";

export default defineComponent({
  name: "Questions",
  setup() {
    const questions = ref([]);
    const questionText = ref("");

    const questionTitle = ref("");
    const questionContent = ref("");
    const userEmail = ref("");

    const fetchQuestions = async () => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      userEmail.value = user.email || "";

      try {
        const response = await api.get("/questions");
        questions.value = response.data;
      } catch (error) {
        console.error(error);
        // Show error message to user
      }
    };

    const askQuestion = async () => {
      try {
        await api.post("/questions", {
          title: questionTitle.value,
          content: questionContent.value,
        });

        questionTitle.value = "";
        questionContent.value = "";

        await fetchQuestions();
      } catch (error) {
        console.error(error);
        // Show error message to user
      }
    };

    const router = useRouter();

    const viewAnswers = (questionId: number) => {
      router.push({ name: "Answers", params: { questionId } });
    };

    const deleteQuestion = async (questionId: number) => {
      try {
        await api.delete(`/questions/${questionId}`);
        await fetchQuestions();
      } catch (error) {
        console.error(error);
        // Show error message to user
      }
    };

    onMounted(fetchQuestions);

    return {
      questions,
      questionText,
      questionTitle,
      questionContent,
      askQuestion,
      viewAnswers,
      deleteQuestion,
      userEmail,
    };
  },
});
</script>

<style scoped>
/* Your styles */
</style>
