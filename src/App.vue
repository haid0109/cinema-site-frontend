<template>
  <v-app>
    <v-app-bar
    app
    fixed
    dark
    height="80"
    v-if="
      $route.name != 'landingPage' &&
      $route.name != 'adminLogin' &&
      $route.name != 'adminDashboard' &&
      $route.name != 'login' &&
      $route.name != 'register'
    ">
      <v-row justify="center" align="center">
        <v-col class="d-none d-md-flex justify-center">
          <div>
            <router-link
            :to="homeLink"
            tag="img"
            :src="require('./assets/logo.png')"
            height="70"
            class="ma-0 pa-0"
            />

            <v-select
            v-model="cinema"
            :items="cinemas"
            item-text="name"
            item-value="name"
            class="selectWidth"
            label="cinema"
            single-line
            dense
            >
            </v-select>
          </div>
        </v-col>
        <v-col class="d-flex justify-center">
          <searchBar :searched="searched" @searchOver="searchOver"/>
          <v-btn icon class="mt-2" @click="search">
              <v-icon>mdi-magnify</v-icon>
          </v-btn>
          <burgerMenu
          :login="login"
          :signUp="signUp"
          :account="account"
          :logOut="logOut"
          @account="true"
          @logOut="true"
          />
        </v-col>
        <v-col class="d-none d-md-flex justify-center">
          <v-toolbar-items>
              <v-btn text dark @click="$router.push(homeLink)">Program</v-btn>
              <v-btn text dark>Upcoming</v-btn>
              <v-btn text dark v-if="login" @click="loginDialog = true">Login</v-btn>
              <v-btn text dark v-if="signUp" @click="signUpDialog = true">Sign up</v-btn>
              <v-btn text dark v-if="account" to="account">Account</v-btn>
              <v-btn text dark v-if="logOut" @click="loggedOut">Log Out</v-btn>
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
      <router-view @loggedIn="loggedIn" @cinemaPicked="cinemaPicked"/>
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
    cinema: '',
    homeLink: '',
    cinemas: [],
    searched: false,
    login: true,
    signUp: true,
    account: false,
    logOut: false,
    loginDialog: false,
    signUpDialog: false
  }),
  created: async function(){
    if(sessionStorage.getItem('jwt')) this.loggedIn();
    await this.retrieveCinemas();
    this.homeLink = '/' + sessionStorage.getItem('cinemaName');
  },
  methods: {
    retrieveCinemas: async function(){
      await fetch(`http://localhost:2020/cinemas/names`)
      .then(async (resp) => {
          let cinemas = await resp.json();
          this.cinemas = cinemas;
      })
      .catch((error) => {
          console.error('Error: ', error);
          alert('something went wrong, try again');
      });
    },
    search: function(){this.searched = true;},
    searchOver: function(){this.searched = false;},
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
      if(this.$route.name != 'home') this.$router.push(('/' + this.cinema) || '/');
    },
    cinemaPicked: function(){this.cinema = sessionStorage.getItem('cinemaName');}
  },
  watch: {
    cinema(){
      this.cinemas.forEach(cinema => {
        if(cinema.name == this.cinema) sessionStorage.setItem('cinemaId', cinema._id);
      });
      sessionStorage.setItem('cinemaName', this.cinema);
      this.$router.push('/' + this.cinema);
    }
  }
}
</script>

<style scoped>
#app{
  background: rgb(33, 34, 31);
}
.selectWidth{
  width: 130px;
  margin: -20px 0 0 30px;
}
</style>
