<template>
    <v-container fluid fill-height class="d-flex justify-center">
        <v-autocomplete
        label="search movie title"
        v-model="clickItem"
        :search-input.sync="searchValue"
        :items="movies"
        item-text="title"
        item-value="_id"
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
        movies: [],
        searchValue: '',
        clickItem: '',
    }),
    created: async function(){
        await this.retrieveMovieTitles();
    },
    methods: {
        retrieveMovieTitles: async function(){
            fetch(`http://localhost:2020/movies/titles`)
            .then(async (resp) => {
                const movies = await resp.json();
                this.movies = movies;
            })
            .catch((error) => {
                console.error('Error: ', error);
                alert('Something went wrong, try again');
            });
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
