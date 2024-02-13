<template>
  <v-app>
    <v-container fluid fill-height-12 class="pa-4">
      <v-row align="center" justify="center">
        <v-col cols="15" sm="3" md="15">
          <v-card class="max-width: 200px rounded-0">
            <v-card-title class="headline primary--text">Login</v-card-title>
            <v-card-text>
              <v-form>
                <v-text-field
                  class="inputUsername"
                  v-model="username"
                  label="Benutzername"
                  required
                ></v-text-field>

                <v-text-field
                  class="inputPassword"
                  v-model="password"
                  label="Passwort"
                  type="password"
                  required
                ></v-text-field>

                <v-btn color="primary" @click="login">Anmelden</v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import { inject } from 'vue';

export default {
  name: "LogIn",
  setup() {
    const createUser = inject('createUser');

    return {
      createUser,
    };
  },

  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    login() {
      if (this.username && this.password) {
        // Verwende createUser Methode hier
        this.createUser(this.username, this.password);
        
        // Navigiere zur StartingPage
        this.$router.push('/startseite');
      }
    },
  },
};
</script>
