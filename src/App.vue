<template>
  <router-view></router-view>
</template>

<script>
import { provide } from 'vue';

export default {
  name: "App",
  setup() {
    const createUser = (username, password) => {
      fetch("https://vue-users-4be32-default-rtdb.firebaseio.com/users.json", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
    };

    provide('createUser', createUser);
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
