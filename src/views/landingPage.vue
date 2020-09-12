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
          :to="{name: 'home', params: { cinema: cinema.name}}"
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
    await this.retrieveLocations();
  },
  methods: {
    retrieveLocations: async function(){
      fetch(`http://localhost:2020/cinema/names`)
      .then((resp) => {
          console.log("retrieve locations: ", resp.status);
          return resp.json();
      })
      .then((resp) => this.cinemaNames = resp)
      .catch((error) => {console.error('Error: ', error);});
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
