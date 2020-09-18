<template>
  <v-app>
    <v-app-bar
    app
    fixed
    dark
    v-if="
      $route.name != 'landingPage' &&
      $route.name != 'adminLogin' &&
      $route.name != 'adminDashboard' &&
      $route.name != 'login' &&
      $route.name != 'register'
    ">
      <v-row justify="center" align="center">
        <v-col class="d-none d-md-flex justify-center">
          <img  
          :src="require('./assets/logo.png')" 
          height="70"
          />
        </v-col>
        <v-col class="d-flex justify-center">
          <searchBar ref="search"/>
          <v-btn icon class="mt-2" @click="search">
              <v-icon>mdi-magnify</v-icon>
          </v-btn>
          <burgerMenu
          :login="login"
          :signUp="signUp"
          :account="account"
          :logOut="logOut"
          @login="openLogin"
          @signUp="openSignUp"
          @account="true"
          @logOut="true"
          />
        </v-col>
        <v-col class="d-none d-md-flex justify-center">
          <v-toolbar-items>
              <v-btn text color="white">Program</v-btn>
              <v-btn text color="white">Upcoming</v-btn>
              <v-btn text color="white" v-if="login" @click="loginDialog = true">Login</v-btn>
              <v-btn text color="white" v-if="signUp" @click="signUpDialog = true">Sign up</v-btn>
              <v-btn text color="white" v-if="account" to="account">Account</v-btn>
              <v-btn text color="white" v-if="logOut" @click="loggedOut">Log Out</v-btn>
          </v-toolbar-items>
        </v-col>
      </v-row>
    </v-app-bar>
    <v-dialog v-model="loginDialog" width="400px">
      <authForm 
        :type="'user'" 
        :action="'Login'"  
        @closeDialog="closeLogin"
        @loggedIn="loggedIn"
      />
    </v-dialog>
    <v-dialog v-model="signUpDialog" width="400px">
      <authForm 
        :type="'user'" 
        :action="'Sign Up'" 
        @closeDialog="closeSignUp"
        @loggedIn="loggedIn"
      />
    </v-dialog>
    <v-content>
      <router-view @loggedIn="loggedIn"/>
    </v-content>
  </v-app>
</template>

<script>
import searchBar from './components/searchBar';
import burgerMenu from './components/burgerMenu';
import authForm from './components/authForm';

export default {
  components: {
    searchBar,
    burgerMenu,
    authForm
  },
  data: () => ({
    login: true,
    signUp: true,
    account: false,
    logOut: false,
    loginDialog: false,
    signUpDialog: false
  }),
  created: async function(){
    if(sessionStorage.getItem('jwt')) this.loggedIn();
  },
  methods: {
    search: function(){this.$refs.search.searchMovie();},
    closeLogin: function(){this.loginDialog = false;},
    closeSignUp: function(){this.signUpDialog = false;},
    loggedIn: function(){
      this.loginDialog = false;
      this.signUpDialog = false;
      this.login = false;
      this.signUp = false;
      this.account = true;
      this.logOut = true;
    },
    loggedOut: function(){
      sessionStorage.setItem('jwt', '');
      this.login = true;
      this.signUp = true;
      this.account = false;
      this.logOut = false;
      if(this.$route.name != 'home') this.$router.push(sessionStorage.getItem('cinema') || '/');
    }
  }
}
</script>

<style>
#app {
  background: rgb(33, 34, 31);
}
</style>
