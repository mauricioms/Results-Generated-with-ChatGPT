<script setup lang="ts">
import type { Pergunta } from './PerguntaComponent.vue'
import moment from 'moment'

interface Props {
  perguntas?: Pergunta[]
  callMethod?: any
}

const props = withDefaults(defineProps<Props>(), {
  perguntas: () => [],
  callMethod: async () => {}
})

const perguntas = props.perguntas

function formatDateTime(_dateTime: any) {
  return moment(_dateTime, 'YYYY-MM-DD hh:mm:ss').format('DD/MM/YYYY HH:mm')
}

async function deletarPergunta(idPergunta: number): Promise<any> {
  const deletarPergunta: any = async (_id: number) => {
    const myHeaders: Headers = new Headers()
    myHeaders.append('Content-Type', 'application/json')

    const myInit: RequestInit = {
      method: 'DELETE',
      headers: myHeaders
    }

    const myRequest: Request = new Request('/app-forum/api/pergunta/' + _id + '/deletar', myInit)
    const response = await fetch(myRequest)
    const data = await response.json()
    return data
  }

  deletarPergunta(idPergunta).then(() => {
    props.callMethod().then(() => {})
  })
}
</script>

<template>
  <table class="table">
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Question</th>
        <th scope="col">User</th>
        <th scope="col">Datetime</th>
        <th scope="col" colspan="2">-</th>
      </tr>
    </thead>
    <tbody class="table-group-divider">
      <tr v-for="pergunta in perguntas" :key="pergunta.id">
        <th scope="row">{{ pergunta.id }}</th>
        <td>{{ pergunta.subject }}</td>
        <td>{{ pergunta.user.name }}</td>
        <td>{{ formatDateTime(pergunta.dtregisted) }}</td>
        <td>
          <button type="button" class="btn btn-primary" @click="$router.push('/pergunta/' + pergunta.id)">
            <i class="bi bi-binoculars"></i>
            View
          </button>
        </td>
        <td>
          <button type="button" class="btn btn-danger" @click="deletarPergunta(pergunta.id)">
            <i class="bi bi-trash"></i>
            Remove
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>
