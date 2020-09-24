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
    props: ['searched'],
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
            this.$router.push(
                '/' + 
                this.$route.params.cinema + 
                '/movie/' +
                this.clickItem
            );
        },
    },
    watch: {
        clickItem(searchValue){
            if(!searchValue) return
            this.searchMovie(searchValue);
        },
        searched(){
            if(this.searched){console.log(this.clickItem);}
            this.$emit('searchOver');
            this.$router.push(
                '/' + 
                this.$route.params.cinema + 
                '/movie/' +
                this.clickItem
            );
        }
    }
}
</script>
