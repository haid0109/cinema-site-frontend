<template>
    <v-container fluid fill-height class="d-flex justify-center">
        <v-autocomplete
        label="search movie name"
        v-model="clickItem"
        :search-input.sync="searchValue"
        :items="movieNames"
        append-icon=""
        solo-inverted
        clearable
        hide-details
        dense
        />
    </v-container>
</template>

<script>
export default {
    props: ['search'],
    data: () => ({
        movieNames: [],
        searchValue: '',
        clickItem: '',
    }),
    created: async function(){
        await this.retrieveMovieNames();
    },
    methods: {
        retrieveMovieNames: async function(){
            fetch(`http://localhost:2020/movie/names`)
            .then((resp) => {
                console.log("retrieve movie names: ", resp.status);
                return resp.json();
            })
            .then((resp) => {
                resp.forEach(nameObj => {
                    this.movieNames.push(nameObj.name)
                });
            })
            .catch((error) => {console.error('Error: ', error);});
        },
        searchMovie: async function(searchValue){
            if(searchValue){this.searchValue = searchValue}
            if(!this.searchValue) return alert('your search value is empty');
            console.log(this.searchValue);
        },
    },
    watch: {
        clickItem(searchValue){
            if(!searchValue) return
            this.searchMovie(searchValue);
        }
    }
}
</script>
