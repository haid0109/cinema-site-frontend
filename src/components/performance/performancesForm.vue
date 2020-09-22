<template>
    <v-container fluid class="ma-0 pa-0">
        <v-card class="d-flex flex-column" dark>
            <v-card-title>{{action}}</v-card-title>

            <v-autocomplete
            v-model="cinema"
            :items="cinemas"
            item-text="name"
            item-value="_id"
            class="px-6"
            label="Cinema"
            clearable
            :rules="[rules.required(cinema, action)]"
            />

            <v-autocomplete
            v-model="hall"
            :items="halls"
            item-text="name"
            item-value="_id"
            class="px-6"
            label="Hall"
            clearable
            :rules="[rules.required(hall, action)]"
            />

            <v-autocomplete
            v-model="movie"
            :items="movies"
            item-text="title"
            item-value="_id"
            class="px-6"
            label="Movie"
            clearable
            :rules="[rules.required(movie, action)]"
            />

            <v-autocomplete
            v-model="performance"
            :items="performances"
            item-text="timeRange"
            item-value="_id"
            class="px-6"
            label="Performance(start date)"
            clearable
            v-if="action == 'Update' || action == 'Delete'"
            :rules="[rules.required(performance, action)]"
            />

            <v-row class="ma-0 pa-0">
                <v-col class="ma-0 pa-0" cols="6">
                    <v-text-field
                    v-model="startDate"
                    readonly
                    class="pl-6 pr-3"
                    label="Start Date"
                    append-icon="mdi-calendar"
                    @click="dateDialog = true"
                    @click:append="dateDialog = true"
                    v-if="action == 'Add'"
                    :rules="[
                        rules.required(startDate, action),
                        rules.dateTimeUnique(dateTimeUnique)
                    ]"
                    />
                </v-col>
                <v-col class="ma-0 pa-0" cols="6">
                    <v-text-field
                    v-model="startTime"
                    readonly
                    class="pl-3 pr-6"
                    label="Start Time"
                    append-icon="mdi-clock-outline"
                    @click="timeDialog = true"
                    @click:append="timeDialog = true"
                    v-if="action == 'Add'"
                    :rules="[
                        rules.required(startTime, action),
                        rules.dateTimeUnique(dateTimeUnique)
                    ]"
                    />
                </v-col>
            </v-row>

            <v-row class="ma-0 pa-0">
                <v-col class="ma-0 pa-0" cols="4">
                    <v-text-field
                    v-model="priceNormal"
                    class="pl-6"
                    label="Normal Seat Price"
                    v-if="action == 'Add'"
                    :rules="[rules.required(priceNormal, action)]"
                    />
                </v-col>
                <v-col class="ma-0 pa-0" cols="4">
                    <v-text-field
                    v-model="priceVip"
                    class="px-3"
                    label="VIP Seat Price"
                    v-if="action == 'Add'"
                    :rules="[rules.required(priceVip, action)]"
                    />
                </v-col>
                <v-col class="ma-0 pa-0" cols="4">
                    <v-text-field
                    v-model="priceCouple"
                    class="pr-6"
                    label="Couple Seat Price"
                    v-if="action == 'Add'"
                    :rules="[rules.required(priceCouple, action)]"
                    />
                </v-col>
            </v-row>

            <v-select
            v-model="status"
            :items="statusOptions"
            class="px-6"
            label="Status"
            single-line
            v-if="action == 'Update'"
            />

            <v-card class="ml-auto">
                <v-btn
                class="ml-auto mr-4 mb-4"
                @click="clear">
                    Clear
                </v-btn>

                <v-btn
                class="ml-auto mr-4 mb-4"
                @click="addPerformance"
                v-if="action == 'Add'">
                    Add
                </v-btn>

                <v-btn
                class="ml-auto mr-4 mb-4"
                @click="updatePerformance"
                v-if="action == 'Update'">
                    Update
                </v-btn>
                
                <v-btn
                class="ml-auto mr-4 mb-4"
                @click="deletePerformance"
                v-if="action == 'Delete'">
                    Delete
                </v-btn>
            </v-card>
        </v-card>
        <v-dialog v-model="timeDialog" width="300px">
            <timeForm
            @closeTimeDialog="closeTimeDialog"
            @setTime="setStartTime"
            />
        </v-dialog>
        <v-dialog v-model="dateDialog" width="300px">
            <dateForm
            @closeDateDialog="closeDateDialog"
            @setDate="setStartDate"
            />
        </v-dialog>
    </v-container>
</template>

<script>
import timeForm from '../timeForm';
import dateForm from '../dateForm';

export default {
    components: {
        timeForm,
        dateForm,
    },
    props: ['action', 'clearForm'],
    data: () => ({
        cinema: '',
        hall: '',
        movie: '',
        performance: '',
        startDate: '',
        startTime: '',
        priceNormal: 0,
        priceVip: 0,
        priceCouple: 0,
        status: '',
        cinemas: [],
        halls: [],
        movies: [],
        performances: [],
        statusOptions: ['Available', 'Sold Out', 'Expired'],
        timeDialog: false,
        dateDialog: false,
        dateTimeUnique: true,
        rules: {
            required: (value, action) => action == 'Update' || action == 'Delete' || !!value || 'Required',
            dateTimeUnique: (dateTimeUnique) => dateTimeUnique || 'Date and time cannot overlap other performances',
        }
    }),
    created: async function(){
        await this.retrieveCinemas();
        await this.retrieveMovies();
    },
    methods: {
        retrieveCinemas: async function(){
            fetch(`http://localhost:2020/cinemas/names`)
            .then(async (resp) => {
                const cinemas = await resp.json();
                this.cinemas = cinemas;
            })
            .catch((error) => {
                console.error('Error: ', error);
                alert('something went wrong, try again');
            });
        },
        retrieveMovies: async function(){
            fetch(`http://localhost:2020/movies/titles`)
            .then(async (resp) => {
                const movies = await resp.json();
                this.movies = movies;
            })
            .catch((error) => {
                console.error('Error: ', error);
                alert('something went wrong, try again');
            });
        },
        retrieveHalls: async function(){
            fetch(`http://localhost:2020/cinema/halls/names/${this.cinema}`)
            .then(async (resp) => {
                const halls = await resp.json();
                this.halls = halls;
            })
            .catch((error) => {
                console.error('Error: ', error);
                alert('something went wrong, try again');
            });
        },
        retrievePerformances: async function(){
            fetch(`http://localhost:2020/movie/performances/names/${this.movie}`)
            .then(async (resp) => {
                const performances = await resp.json();
                performances.forEach(performance => {
                    performance.start = new Date(performance.start);
                    performance.cleanUpEnd = new Date(performance.cleanUpEnd);
                    performance.timeRange =
                        ('0' + performance.start.getHours()).slice(-2) + ':' +
                        ('0' + performance.start.getMinutes()).slice(-2) + '/' +
                        performance.start.getDate() + '/' +
                        (performance.start.getMonth() + 1) + '/' +
                        performance.start.getFullYear() + '-' +
                        ('0' + performance.cleanUpEnd.getHours()).slice(-2) + ':' +
                        ('0' + performance.cleanUpEnd.getMinutes()).slice(-2) + '/' +
                        performance.cleanUpEnd.getDate() + '/' +
                        (performance.cleanUpEnd.getMonth() + 1) + '/' +
                        performance.cleanUpEnd.getFullYear()
                    ;
                });
                this.performances = performances;
            })
            .catch((error) => {
                console.error('Error: ', error);
                alert('something went wrong, try again');
            });
        },
        retrieveInfo: async function(){
            fetch(`http://localhost:2020/movie/performance/${this.movie}/${this.performance}`)
            .then(async (resp) => {
                const info = await resp.json();

                info.start = new Date(info.start);
                let year = info.start.getFullYear();
                let month = ('0' + (info.start.getMonth() + 1)).slice(-2);
                let day = ('0' + info.start.getDate()).slice(-2);
                let hour = ('0' + info.start.getHours()).slice(-2);
                let minute = ('0' + info.start.getMinutes()).slice(-2);
                info.startDate = year + '-' + month + '-' + day;
                info.startTime = hour + ':' + minute;

                this.startDate = info.startDate;
                this.startTime = info.startTime;
                this.priceNormal = info.prices.normal;
                this.priceVip = info.prices.vip;
                this.priceCouple = info.prices.couple;
                this.status = info.status;
            })
            .catch((error) => {
                console.error('Error: ', error);
                alert('something went wrong, try again');
            });
        },
        closeTimeDialog: function(){this.timeDialog = false;},
        setStartTime: function(time){
            if(!time) return;
            this.startTime = time;
            this.timeDialog = false;
        },
        closeDateDialog: function(){this.dateDialog = false;},
        setStartDate: function(date){
            if(!date) return;
            this.startDate = date;
            this.dateDialog = false;
        },
        addPerformance: function(){
            if(
                !this.cinema ||
                !this.hall ||
                !this.movie ||
                !this.startDate ||
                !this.startTime ||
                !this.priceNormal ||
                !this.priceVip ||
                !this.priceCouple
            ) return alert('All fields must be filled out');

            const performance = {
                cinemaId: this.cinema,
                hallId: this.hall,
                startDate: this.startDate,
                startTime: this.startTime,
                prices: {
                    normal: this.priceNormal,
                    vip: this.priceVip,
                    couple: this.priceCouple
                }
            }

            fetch(`http://localhost:2020/movie/performance/${this.movie}`, {
                method: 'POST',
                headers: {
                    'authorization': `Bearer ${sessionStorage.getItem('jwtAdmin')}`,
                    'role': 'admin',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(performance)
            })
            .then(async (resp) => {
                if(resp.status == 403){
                    let error = await resp.json();
                    return alert(error.msg);
                }
                if(resp.status != 200) return alert('something went wrong, try again');
                this.clear();
            })
            .catch((error) => {
                console.error('Error: ', error);
                alert('something went wrong, try again');
            });
        },
        updatePerformance: function(){
            let status = '';
            if(!this.movie) return alert('you need to specify a movie');
            if(!this.performance) return alert('you need to specify a performance');
            if(!this.status) return alert('you need to specify a status');
            else status = this.status;

            fetch(`http://localhost:2020/movie/performance/${this.movie}/${this.performance}`, {
                method: 'PUT',
                headers: {
                    'authorization': `Bearer ${sessionStorage.getItem('jwtAdmin')}`,
                    'role': 'admin',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({status: status})
            })
            .then(async (resp) => {
                if(resp.status != 200) return alert('something went wrong, try again');
                this.clear();
            })
            .catch((error) => {
                console.error('Error: ', error);
                alert('something went wrong, try again');
            });
        },
        deletePerformance: function(){
            fetch(`http://localhost:2020/movie/performance/${this.movie}`, {
                method: 'DELETE',
                headers: {
                    'authorization': `Bearer ${sessionStorage.getItem('jwtAdmin')}`,
                    'role': 'admin',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({_id: this.performance})
            })
            .then(async (resp) => {
                if(resp.status != 200) return alert('something went wrong, try again');
                await this.retrievePerformances();
            })
            .catch((error) => {
                console.error('Error: ', error);
                alert('something went wrong, try again');
            });
        },
        clear: function(){
            this.cinema = '';
            this.hall = '';
            this.movie = '';
            this.performance = '';
            this.startDate = '';
            this.startTime = '';
            this.priceNormal = 0;
            this.priceVip = 0;
            this.priceCouple = 0;
            this.status = '';
            this.performances = [];
        }
    },
    watch: {
        cinema: function(){
            if(this.cinema) this.retrieveHalls();
        },
        movie: function(){
            if(this.movie) this.retrievePerformances();
        },
        performance: function(){
            if(this.performance) this.retrieveInfo();
        },
        clearForm: function(){
            if(this.clearForm){
                this.clear();
                this.$emit('formCleared');
            }
        }
    }
}
</script>
