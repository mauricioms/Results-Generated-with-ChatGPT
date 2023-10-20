<script setup lang="ts">

  import { ref, watchEffect, onMounted, onUpdated, onActivated, computed } from 'vue';
  import md5 from 'md5';

  const loadAuthenticated = async () => {
    const myHeaders:Headers = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const myInit:RequestInit = {
      method: 'GET',
      headers: myHeaders
    };
    
    const myRequest:Request = new Request('/app-forum/authenticated', myInit);
    const response = await fetch(myRequest);
    const data = await response.json();

    user.value.username = data.user.username;
    user.value.name = data.user.name;
    user.value.email = data.user.email;
    user.value.urlPhoto = data.user.urlPhoto;
  };
  
  onMounted(loadAuthenticated);

  interface User {
      name: string;
      username: string;
      email: string;
      roles: string[];
      urlPhoto: string;
  }
  
  const user = ref<User>({
    username:'',
    name: '',
    email: '',
    roles:[],
    urlPhoto: ''
  }); 
</script>

<template>
  
  <div class="container">
      <div class="row">
        <div class="col">
        &nbsp;
        </div>
      </div>
  </div>

  <div class="container">
    <div class="row">
      <div class="col">
      </div>
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            User Profile
          </div>
          <div class="card-body">
            <div class="container">
              <div class="row">
                <div class="col">
                  <h4 class="card-title">{{user.name}}</h4>
                  <p class="card-text">
                    <b>E-mail:</b> <a :href="'mailto:' + user.email">{{user.email}}</a>
                  </p>
                </div>
                <div class="col">
                  <img :src="'https://www.gravatar.com/avatar/' + md5(user.email) + '?s=200'" class="rounded float-end" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
