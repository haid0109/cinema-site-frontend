<template>
    <v-container fluid fill-height class="d-flex justify-center">
        <v-autocomplete
        label="search movie name"
        :search-input.sync="searchValue"
        :items="movieNames"
        @keyup.enter="searchMovie"
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
        searchValue: ''
    }),
    created: async function(){
    },
    methods: {
        searchMovie: function(){
            let searchValue = this.searchValue;
            this.searchValue = '';
            console.log(searchValue);
        },
    }
}
</script>
