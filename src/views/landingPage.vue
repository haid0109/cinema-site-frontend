<template>
  <v-container fluid ma-0 pa-0>
    <v-row class="ma-0 pa-0">
      <v-col cols="1"/>
      <v-col cols="10">
        <v-img src="../assets/logo.png" width="500"></v-img>
      </v-col>
      <v-col cols="1"/>
    </v-row>
    <v-row class="ma-0 pa-0 justify-center">
      <v-col cols="1"/>
      <v-col cols="10">
        <v-btn
          text tile
          v-for="(cinema, index) in cinemaNames"
          :key="index"
          @click="goToHome(cinema.name, cinema._id)"
          :ripple="false"
          height="125"
          width="45%"
          class="font-weight-bold white--text locationButton">
          <div class="header">{{cinema.name}}</div>
        </v-btn>
      </v-col>
      <v-col cols="1"/>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    cinemaNames: []
  }),
  created: async function(){
    if(sessionStorage.getItem('cinemaName') && sessionStorage.getItem('cinemaId'))
      return this.$router.push('/' + sessionStorage.getItem('cinemaName'));
    await this.retrieveLocations();
  },
  methods: {
    retrieveLocations: async function(){
      fetch(`http://localhost:2020/cinemas/names`)
      .then((resp) => {
          return resp.json();
      })
      .then((resp) => this.cinemaNames = resp)
      .catch((error) => {
        console.error('Error: ', error);
        alert('Something went wrong, try again');
      });
    },
    goToHome: function(name, _id){
      sessionStorage.setItem('cinemaName', name);
      sessionStorage.setItem('cinemaId', _id);
      this.$emit('cinemaPicked');
    }
  } 
}
</script>

<style scoped>
.locationButton {
  margin-left: 2vw;
  border-bottom: 1px solid grey;
}
.header{
  font-size: 4vw;
}
</style>
