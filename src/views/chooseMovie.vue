<template>
  <v-container>
    <v-row>
      <v-col cols="1"/>
      <v-col cols="10">
        <v-img src="../assets/logo.png" width="500"></v-img>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="1"/>
      <v-col cols="10">
        <div class="display-4 ml-5 font-weight-bold grey--text text--darken-3">
          VÆLG DIN BY
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="1"/>
      <v-col cols="10">
        <v-btn
          text tile
          v-for="(cinema, index) in cinemaNames"
          :key="index"
          :href="`${cinema.name}`"
          :ripple="false"
          height="125"
          width="45%"
          class="ml-10 display-3 font-weight-bold white--text buttonUnderline">
          <div class="textTopLeft">{{cinema.name}}</div>
        </v-btn>
      </v-col>
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
        resp.json().then((namesArr) => {
          this.cinemaNames = namesArr;
          console.log("retrieve locations: ", resp.status);
        });
      })
      .catch((error) => {console.error('Error: ', error);});
    }
  } 
}
</script>

<style>
.buttonUnderline {
  border-bottom: 1px solid grey;
}
.v-btn {
  margin-top: 40px;
}
.textTopLeft {
  text-align: left;
  margin-top: -50px;
  height: 100% !important;
  width: 100% !important;
}
</style>
