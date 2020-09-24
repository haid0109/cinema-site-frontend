<template>
  <v-container fluid class="ma-0 pa-0 fill-height">
    <v-row class="ma-0 pa-0 justify-center">
      <v-card class="resizeOnMobile">
        <authForm
          :type="'admin'"
          :action="'Login'"
          :extended="true"
          @loggedIn="loggedIn"
        />
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
import authForm from '../components/authForm';

export default {
    components: {authForm},
    created: async function(){
      if(sessionStorage.getItem('jwtAdmin') && sessionStorage.getItem('cinemaId')) 
        this.loggedIn();
    },
    methods: {
      loggedIn: function(){
        this.$router.push('/admin/dashboard');
      }
    }
}
</script>

<style scoped>
.resizeOnMobile{width: 400px;}

@media (max-width: 400px) and (min-width: 0px) {
    .resizeOnMobile{width: 250px;}
}
</style>
