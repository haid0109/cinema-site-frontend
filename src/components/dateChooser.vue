<template>
    <v-container fluid class="ma-0 pa-0 fill-height align-start justify-center">
        <v-row class="ma-0 pa-0 d-flex">
            <v-col class="ma-0 pa-0 d-flex justify-center align-center">
                <v-btn
                icon
                fab
                dark
                large
                @click="cycleDate('left')"
                >
                    <v-icon>mdi-chevron-left </v-icon>
                </v-btn>
            </v-col>
            <v-col class="ma-0 pa-0 d-flex justify-space-around flexOnMobile">
                <v-btn
                outlined
                dark
                class="ma-5"
                v-for="(date, index) in dates"
                :key="index"
                @click="dateChosen(date.date)"
                >{{date.text}}</v-btn>
            </v-col>
            <v-col class="ma-0 pa-0 d-flex justify-center align-center">
                <v-btn
                icon
                fab
                dark
                large
                @click="cycleDate('right')"
                >
                    <v-icon>mdi-chevron-right </v-icon>
                </v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    data: () => ({
        dates: [],
        days: [
            'Sunday', 
            'Monday', 
            'Tuesday', 
            'Wednesday', 
            'Thursday', 
            'Friday', 
            'Saturday'
        ],
        cycleIndex: 0
    }),
    created: async function(){
        this.fetchDate();
    },
    methods: {
        fetchDate: function(){
            this.dates = [];
            for(let index = 0; index <= 6; index++){
                let date = new Date();
                date.setDate(date.getDate() + index + this.cycleIndex);
                let dateText = 
                    this.days[date.getDay()] + ' t. ' +
                    ('0' + date.getDate()).slice(-2) + '/' +
                    ('0' + (date.getMonth() + 1)).slice(-2);
                this.dates.push({
                    date: date,
                    text: dateText
                });
            }
        },
        cycleDate: function(direction){
            if(this.cycleIndex < 7 && direction == 'left') return alert('cannot check previous dates');
            else{
                if(direction == 'right') this.cycleIndex += 7;
                else this.cycleIndex -= 7;
                this.fetchDate();
            }
        },
        dateChosen: function(date){
            let dateShortened = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
            if(this.$route.params.date != dateShortened)
                this.$router.push('/' + this.$route.params.cinema + '/' + dateShortened);
        }
    }
}
</script>

<style scoped>
@media (max-width: 1730px) and (min-width: 0px) {
    .flexOnMobile{flex-direction: column;}
}
</style>
