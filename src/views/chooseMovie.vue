<template>
  <v-container fluid ma-0 pa-0>
    <v-carousel
    hide-delimiters
    cycle
    height="550"
    >
      <v-carousel-item
      v-for="(banner, index) in banners"
      :key="index"
      >
        <img :src="banner" width="100%" height="100%"/>
      </v-carousel-item>
    </v-carousel>
    <v-row class="ma-0 pa-0 justify-center">
      <div class="font-weight-bold grey--text text--darken-3 header">
        IN CINEMAS
      </div>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    banners: [
      require('../assets/banner1.jpg'),
      require('../assets/banner2.jpg'),
      require('../assets/banner3.jpg')
    ]
  }),
  created: async function(){
  },
  methods: {
  } 
}
</script>

<style scoped>
.header{
  font-size: 6.5vw;
}
</style>
