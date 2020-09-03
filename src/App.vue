<template>
  <v-app>
    <v-app-bar
    app 
    dark
    v-if="$route.name != 'landingPage'"
    >
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
          <burgerMenu/>
        </v-col>
        <v-col class="d-none d-md-flex justify-center">
          <v-toolbar-items>
              <v-btn text color="white">Program</v-btn>
              <v-btn text color="white">Upcoming</v-btn>
              <v-btn text color="white">Login</v-btn>
              <v-btn text color="white">Sign up</v-btn>
          </v-toolbar-items>
        </v-col>
      </v-row>
    </v-app-bar>
    <router-view/>
  </v-app>
</template>

<script>
import searchBar from './components/searchBar';
import burgerMenu from './components/burgerMenu';

export default {
  components: {
    searchBar,
    burgerMenu
  },
  data: () => ({
  }),
  created: async function(){
  },
  methods: {
    search: function(){
      this.$refs.search.searchMovie();
    }
  }
}
</script>

<style>
#app {
  background: rgb(33, 34, 31);
}
</style>
