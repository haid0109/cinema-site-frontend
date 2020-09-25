<template>
    <v-container fluid ma-0 pa-0 class="d-flex justify-center">
        <v-container fluid ma-0 pa-0 mb-10 class="d-flex flex-wrap" style="max-width:1500px;">
            <v-card
            width="350"
            height="750px"
            dark class="d-flex flex-column ma-3"
            v-for="(card, index) in moviesWithPerformances"
            :key="index"
            >
                <router-link
                :to="`/${$route.params.cinema}/movie/${card._id}`"
                >
                    <v-img
                    min-height="400"
                    :src="card.cover"
                    />
                </router-link>

                <router-link
                :to="`/${$route.params.cinema}/movie/${card._id}`"
                class="white--text"
                style="text-decoration: none;"
                >
                    <v-card-title>{{card.title}}</v-card-title>
                </router-link>

                <v-card-subtitle class="py-2">{{`Movie Length: ${card.length}`}}</v-card-subtitle>
                
                <v-card outlined style="border-color: rgba(0,0,0,0);">
                    <v-btn
                    x-large
                    text
                    height="auto"
                    width="78"
                    class="mx-3"
                    v-for="(performance, index) in card.performances"
                    :key="index"
                    :to="`/${$route.params.cinema}/movie/${card._id}/${performance.start}`"
                    >
                        {{
                            getTime(performance.start)
                        }}
                    </v-btn>
                </v-card>

                <v-spacer></v-spacer>

                <v-card-actions class="mt-0 pt-0">
                    <v-btn 
                    text 
                    class="mt-0 pt-0"
                    :to="`/${$route.params.cinema}/movie/${card._id}`"
                    >Go To Movie</v-btn>
                </v-card-actions>
            </v-card>

            <div
            class="font-weight-bold grey--text text--darken-3 header"
            style="font-size: 6.5vw; margin: 0 5vw;"
            v-if="moviesWithPerformances.length <= 0"
            >
                No More Performances Today
            </div>
        </v-container>
    </v-container>
</template>

<script>
export default {
    data: () => ({
        cards: []
    }),
    created: async function(){
        if(!this.$route.params.date){
            this.setDateToday();
            await this.retrieveCards();
        }
        else await this.retrieveCards();
    },
    methods: {
        getTime: function(start){
            let startDateTime = new Date(start);
            let startTime = 
                ('0' + startDateTime.getHours()).slice(-2) + ':' +
                ('0' + startDateTime.getMinutes()).slice(-2)
            ;
            return startTime;
        },
        retrieveCards: async function(){
            if(!this.$route.params.date) this.setDateToday();
            let date = new Date(
                this.$route.params.date.split('-')[2],
                +this.$route.params.date.split('-')[1] - 1,
                this.$route.params.date.split('-')[0]
            );

            fetch(`http://localhost:2020/movie/cards/${sessionStorage.getItem('cinemaId')}/${JSON.stringify(date)}`)
            .then(async (resp) => {
                const cards = await resp.json();
                cards.forEach(card => {
                    card.cover = "data:image/jpeg;base64," + card.cover;
                });
                this.cards = cards;
            })
            .catch((error) => {
                console.error('Error: ', error);
                alert('something went wrong, try again');
            });
        },
        setDateToday: async function(){
            let today = new Date();
            this.$route.params.date =
                today.getDate() + '-' +
                (today.getMonth() + 1) + '-' +
                today.getFullYear()
            ;
        }
    },
    computed: {
        moviesWithPerformances: function() {
            return this.cards.filter(function(card) {
                return card.performances.length > 0;
            })
        }
    },
    watch: {
        '$route.params.date': function(){
            this.retrieveCards();
        },
        '$route.params.cinema': function(){
            this.retrieveCards();
        }
    }
}
</script>

<style scoped>
.noMinWidth {
  min-width: 0;
}
</style>