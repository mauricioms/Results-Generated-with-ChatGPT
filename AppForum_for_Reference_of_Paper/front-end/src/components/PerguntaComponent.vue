<script setup lang="ts">

  import { ref, watchEffect, onMounted, onUpdated, onActivated } from 'vue';
  import {useRoute} from "vue-router";
  import moment from 'moment';
  
  export interface Resposta {
    id:number;
    idPergunta:number;
    content:string;
    dtregisted:string;
    user:User;
  }
  
  export interface User {
    name:string;
  }

  export interface Pergunta {
    id:number;
    subject:string;
    content?:string;
    dtregisted:string;
    user:User;
    respostas:Resposta[];
  }

  interface Props {
     id?:number;
  };
  
  const props = withDefaults( defineProps<Props>() , {
    id:  () => {
      return 1
    }
  });

  const pergunta = ref<Pergunta>({
    id:0,
    subject:'',
    content:'',
    dtregisted:'',
    user: {name:''},
    respostas:[]
  })
  
  const loadRespostas = async (_id:number) => {
    
    const response = await fetch(
      '/app-forum/api/pergunta/' + _id
    );

    pergunta.value = await response.json();
  };

  onMounted(async () => {
    await loadRespostas(props.id);
  });

  function formatDateTime (_dateTime:any) {
    return moment(_dateTime, 'YYYY-MM-DD hh:mm:ss').format('DD/MM/YYYY HH:mm');
  }

  function addReply (idPergunta:number) {
    resposta.value.content = '';
    resposta.value.idPergunta = idPergunta;
  }

  function salvarReply() {

    const sendResposta:any = async (_body:any) => {

      const myHeaders:Headers = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const myInit:RequestInit = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(_body)
      };
      
      const myRequest:Request = new Request('/app-forum/api/resposta/' + _body.idPergunta + '/save', myInit);
      const response = await fetch(myRequest);
      const data = await response.json();
    };

    sendResposta(resposta.value).then(async (_data:any) => {
      resposta.value.idPergunta = 0;
      await loadRespostas(props.id);
    });
  }

  const resposta = ref<Resposta>({
    id: 0,
    idPergunta: 0,
    content: '',
    dtregisted: '',
    user: {
      name: ''
    }
  });

  function removerResposta (id:number) {

    const removerResposta:any = async (_id:number) => {

      const myHeaders:Headers = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const myInit:RequestInit = {
        method: 'DELETE',
        headers: myHeaders
      };
      
      const myRequest:Request = new Request('/app-forum/api/resposta/' + _id+ '/remover', myInit);
      const response = await fetch(myRequest);
      const data = await response.json();
    };

    removerResposta(id).then(async (_data:any) => {
      await loadRespostas(props.id);
    });
  }

</script>

<template>

  <div class="card mb-4">
      <div class="card-header">
          <div class="media flex-wrap w-100 align-items-center">
              <div class="media-body ml-3"> {{pergunta.user.name}}
                  <div class="text-muted small">{{formatDateTime(pergunta.dtregisted)}}</div>
              </div>
          </div>
      </div>

      <div class="card-body">
        <p>{{pergunta.content}}</p>
      </div>
      
      <div class="card-body" v-for="r in pergunta.respostas">
          <div style="border-radius: calc(0.25rem - 1px) calc(0.25rem - 1px) 0 0; margin-left: 5px; border: 1px solid #CACACA;padding:20px;margin-bottom:10px">
              <div class="media flex-wrap w-100 align-items-center">
                  <div class="media-body ml-3"> {{r.user.name}}
                      <div class="text-muted small">{{formatDateTime(r.dtregisted)}}</div>
                  </div>
              </div>

              <div class="d-flex flex-wrap justify-content-between align-items-center px-0 pt-0 pb-3">
                <div class="px-4 pt-3">
              	  <p>{{r.content}}</p>
                </div>
                <div class="px-4 pt-3">
              	  <button class="btn btn-danger" type="button" @click="removerResposta(r.id)">
              	    <i class="bi bi-trash"></i>
              	    Remove
              	  </button>
                </div>
              </div>
          </div>
      </div>

      <div class="card-body" v-if="resposta.idPergunta > 0">
          <div class="form-row mb-2">
              <div class="col">
                  <label for="topic-text">
                    <b>Write a response.</b>
                  </label>
                  <div>
                      <textarea name="reply" id="reply-text" rows="5" v-model="resposta.content" style="width: 100%;"></textarea>
                  </div>
                  <div style="text-align: right;">
                      <button type="button" class="btn btn-success" @click="salvarReply">Save Answer</button>
                  </div>
              </div>
          </div>
      </div>

      <div class="card-footer d-flex flex-wrap justify-content-between align-items-center px-0 pt-0 pb-3">
          <div class="px-4 pt-3">
              <a type="button" class="btn btn-default" href="/app-forum/local/#/" >
                  <i class="bi bi-reply"></i>&nbsp; Go Back
              </a>
          </div>

          <div class="px-4 pt-3">
              <button type="button" class="btn btn-primary" @click="addReply(pergunta.id)" >
                  <i class="bi bi-reply"></i>&nbsp; Answer
              </button>
          </div>
      </div>    
  </div>

</template>

<style scoped>
  
</style>

