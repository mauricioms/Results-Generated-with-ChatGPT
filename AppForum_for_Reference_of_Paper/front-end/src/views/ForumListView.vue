<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ForumList from '../components/ForumList.vue'
import PerguntaComponent from '../components/PerguntaComponent.vue'
import type { Pergunta } from '../components/PerguntaComponent.vue'

const perguntas = ref<any>([])

const loadPerguntas = async () => {
  perguntas.value.splice(0, perguntas.value.length)

  const response = await fetch('/app-forum/api/perguntas/load')

  const data = await response.json()

  for (let d of data) {
    perguntas.value.push(d)
  }
}

const idPergunta = ref(0)
const isNewPergunta = ref(false)

function ok(): boolean {
  const route = useRoute()

  idPergunta.value = Number(route.params.id)

  if (idPergunta.value > 0) {
    isNewPergunta.value = false
  }

  return idPergunta.value > 0
}

onMounted(loadPerguntas)

const pergunta = ref<Pergunta>({
  id: 0,
  subject: '',
  content: '',
  dtregisted: '',
  user: { name: '' },
  respostas: []
})

function salvarPergunta() {
  isNewPergunta.value = false

  const sendPergunta: any = async (_body: any) => {
    const myHeaders: Headers = new Headers()
    myHeaders.append('Content-Type', 'application/json')

    const myInit: RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(_body)
    }

    const myRequest: Request = new Request('/app-forum/api/perguntas/new', myInit)
    const response = await fetch(myRequest)
    const data = await response.json()

    perguntas.value.splice(0, perguntas.value.length)
    for (let d of data) {
      perguntas.value.push(d)
    }
  }
  sendPergunta(pergunta.value).then(() => {})
}

function addPergunta() {
  pergunta.value.subject = ''
  pergunta.value.content = ''
  isNewPergunta.value = true
}

const deletarPerguntas = async () => {
  await loadPerguntas()
}

function cancelar() {
  isNewPergunta.value = false
}
</script>
<template>
  <nav class="navbar bg-body-tertiary">
    <form class="container-fluid justify-content-start">
      <button type="button" class="btn btn-success me-2" @click="addPergunta" v-if="!ok() && !isNewPergunta">
        <i class="bi bi-plus"></i>
        New Question
      </button>
    </form>
  </nav>
  <div class="form-row mb-2" v-if="isNewPergunta">
    <div class="col">
      <label for="topic-text">
        <b>Subject:</b>
      </label>
      <div>
        <input name="assunto" id="assunto" v-model="pergunta.subject" class="form-control" style="width: 100%" />
      </div>
      <label for="topic-text">
        <b>Write the content of the question:</b>
      </label>
      <div>
        <textarea name="content" id="content" rows="5" v-model="pergunta.content" class="form-control" style="width: 100%"></textarea>
      </div>
      <div class="d-flex flex-wrap">
        <div class="px-4 pt-3" style="width: 50%">
          <button type="button" class="btn btn-default" @click="cancelar">
            <i class="bi bi-x-circle"></i>
            Cancel
          </button>
        </div>
        <div class="px-4 pt-3" style="width: 50%; text-align: right">
          <button type="button" class="btn btn-success" @click="salvarPergunta">
            <i class="bi bi-save"></i>
            Save Question
          </button>
        </div>
      </div>
    </div>
  </div>
  <hr />
  <ForumList :perguntas="perguntas" v-if="!ok()" :call-method="deletarPerguntas" />
  <PerguntaComponent v-if="ok()" :id="idPergunta" />
</template>
