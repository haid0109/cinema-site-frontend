<template>
    <v-container fluid ma-0 pa-0 class="d-flex justify-center">
        <v-container fluid ma-0 pa-0 style="max-width:1300px;">
            <v-row class="ma-0 pa-0 mt-10 d-flex flex-wrap">
                <v-col 
                class="ma-0 pa-0 d-flex row justify-center" 
                style="
                    max-width: 450px; 
                    min-width: 200px;
                "
                >
                    <v-img :src="cover"/>
                    <v-btn
                    :href="trailer"
                    target="_blank"
                    class="mt-5"
                    text
                    dark>
                        <v-icon left>mdi-play-circle-outline</v-icon>
                        Watch Trailer
                    </v-btn>
                </v-col>
                <v-col class="ma-0 pa-0 d-flex justify-start">
                    <div class="ml-7">
                        <v-card
                        dark
                        outlined
                        color="rgb(0,0,0,0)"
                        style="border-color: rgb(0,0,0,0);"
                        >
                            <v-card-title
                            style="font-size: 4vw;"
                            >{{title}}</v-card-title>

                            <v-card-subtitle
                            style="font-size: 1.5vw;"
                            class="ma-0 pa-0 ml-7 mt-7"
                            >
                                Choose Date and Time
                            </v-card-subtitle>

                            <v-select
                            v-model="date"
                            :items="dates"
                            item-text="text"
                            item-value="dateObj"
                            class="ma-0 pa-0 ml-7 mt-7"
                            style="width: 200px;"
                            label="Date"
                            single-line
                            outlined
                            />

                            <v-card
                            outlined
                            color="rgb(0,0,0,0)"
                            style="border-color: rgb(0,0,0,0);"
                            class="d-flex flex-wrap"
                            >
                                <v-btn
                                outlined
                                dark
                                class="my-2 ml-7"
                                v-for="(time, index) in times"
                                :key="index"
                                @click="goToPerformance(time.time)"
                                >{{time.text}}</v-btn>
                            </v-card>
                        </v-card>
                    </div>
                </v-col>
            </v-row>
            <v-row class="ma-0 pa-0 my-10 d-flex flex-wrap">
                <v-col 
                class="ma-0 pa-0"
                style="
                    max-width: 450px; 
                    min-width: 200px;
                "
                >
                    <div class="white--text" style="font-size: 1.3vw;">
                        {{bio}}
                    </div>
                </v-col>
                <v-col class="ma-0 pa-0 d-flex justify-end">
                    <v-card dark width="25vw">
                        <v-card-subtitle style="font-size: 1.2vw;">
                            Title
                        </v-card-subtitle>
                        <v-card-text class="ml-2" style="font-size: 0.9vw;">
                            {{title}}
                        </v-card-text>

                        <v-card-subtitle style="font-size: 1.2vw;">
                            Status
                        </v-card-subtitle>
                        <v-card-text class="ml-2" style="font-size: 0.9vw;">
                            {{status}}
                        </v-card-text>

                        <v-card-subtitle style="font-size: 1.2vw;">
                            Length
                        </v-card-subtitle>
                        <v-card-text class="ml-2" style="font-size: 0.9vw;">
                            {{length}}
                        </v-card-text>

                        <v-card-subtitle style="font-size: 1.2vw;">
                            Release Date
                        </v-card-subtitle>
                        <v-card-text class="ml-2" style="font-size: 0.9vw;">
                            {{release.split('T')[0]}}
                        </v-card-text>

                        <v-card-subtitle style="font-size: 1.2vw;">
                            Age Rating
                        </v-card-subtitle>
                        <v-card-text class="ml-2" style="font-size: 0.9vw;">
                            {{rating}}
                        </v-card-text>

                        <v-card-subtitle style="font-size: 1.2vw;">
                            Gengres
                        </v-card-subtitle>
                        <v-card-text class="ml-2" style="font-size: 0.9vw;">
                            {{stringArray(genres)}}
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-container>
</template>

<script>
export default {
    data: () => ({
        title: '',
        status: '',
        length: '',
        bio: '',
        release: '',
        cover: null,
        trailer: '',
        rating: '',
        date: '',
        genres: [],
        performances: [],
        dates: [],
        times: [],
        days: [
            'Sunday', 
            'Monday', 
            'Tuesday', 
            'Wednesday', 
            'Thursday', 
            'Friday', 
            'Saturday'
        ],

    }),
    created: async function(){
        if(this.$route.params.movieId) await this.retrieveMovie();
        this.date = this.dates[0];
    },
    methods: {
        retrieveMovie: async function(){
            await fetch(`http://localhost:2020/movie/${this.$route.params.movieId}`)
            .then(async (resp) => {
                const movie = await resp.json();

                let dateObjs = [];
                movie.performances.forEach(performance => {
                    dateObjs.push(new Date(performance.start));
                });
                this.dates = this.organizeDates(dateObjs);

                this.title = movie.title;
                this.status = movie.status;
                this.length = movie.length;
                this.bio = movie.bio;
                this.release = movie.release;
                this.trailer = movie.trailer;
                this.rating = movie.rating;
                this.genres = movie.genre;
                this.performances = movie.performances;

                let base64 = 'data:image/jpeg;base64,' + this.arrayBufferToBase64(movie.cover.data);
                movie.cover = base64;
                this.cover = movie.cover;
            })
            .catch((error) => {
                console.error('Error: ', error);
                alert('something went wrong, try again');
            });
        },
        arrayBufferToBase64: function(buffer) {
            let binary = '';
            let bytes = new Uint8Array(buffer);
            let length = bytes.byteLength;
            for(let index = 0; index < length; index++) {
                binary += String.fromCharCode(bytes[index]);
            }
            return btoa(binary);
        },
        organizeDates: function(dateObjs){
            let dates = [];
            for(let i = 0; i < dateObjs.length; i++){
                let dateText = 
                    this.days[dateObjs[i].getDay()] + ' t. ' +
                    ('0' + dateObjs[i].getDate()).slice(-2) + '/' +
                    ('0' + (dateObjs[i].getMonth() + 1)).slice(-2)
                ;
                dates.push({
                    date: dateObjs[i],
                    text: dateText
                });
            }
            dates = dates.filter((date, index, datesArray) =>
                index == datesArray.findIndex((element) => (
                    element.text == date.text
                ))
            )
            return dates;

        },
        organizeTimes: function(dateTime, performances){
            let dayStart = new Date(
                dateTime.getFullYear(),
                dateTime.getMonth(),
                dateTime.getDate()
            );

            let dayEnd = new Date(
                dateTime.getFullYear(),
                dateTime.getMonth(),
                dateTime.getDate() + 1
            );

            let times = [];
            performances.forEach(performance => {
                let start = new Date(performance.start);
                if(start > dayStart && start < dayEnd){
                    times.push({
                        time: performance.start,
                        text: 
                            ('0' + start.getHours()).slice(-2) 
                            + ':' + 
                            ('0' + start.getMinutes()).slice(-2)
                    });
                }
            });
            return times;
        },
        stringArray: function(array){
            let string = '';
            array.forEach(element => {
                string += element + ', '
            });
            return string
        },
        goToPerformance: function(time){
            this.$router.push(
                '/' + this.$route.params.cinema + '/movie/' +
                this.$route.params.movieId + '/' + time
            );
        }
    },
    watch: {
        date: function(){
            let times = this.organizeTimes(this.date.date, this.performances);
            this.times = times;
        }
    }
}
</script>
