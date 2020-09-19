<template>
    <v-container fluid class="ma-0 pa-0">
        <v-card class="d-flex flex-column" dark>
            <v-card-title>{{action}}</v-card-title>

            <v-autocomplete
            v-model="movie"
            :items="movies"
            item-text="title"
            item-value="_id"
            class="px-6"
            label="Movie"
            clearable
            v-if="action == 'Update' || action == 'Delete'"
            />

            <v-text-field
            v-model="title"
            class="px-6"
            label="Title"
            v-if="action == 'Add' || action == 'Update'"
            :rules="[
                rules.required(title, action),
                rules.titleUnique(titleUnique)
            ]"
            />

            <v-select
            v-model="status"
            :items="statusOptions"
            class="px-6"
            label="Status"
            single-line
            v-if="action == 'Add' || action == 'Update'"
            :rules="[rules.required(status, action)]"
            />

            <v-text-field
            v-model="length"
            readonly
            class="px-6"
            label="Length"
            append-icon="mdi-clock-outline"
            @click="timeDialog = true"
            @click:append="timeDialog = true"
            v-if="action == 'Add' || action == 'Update'"
            />

            <v-textarea
            v-model="bio"
            class="px-6"
            label="Biography"
            rows="3"
            filled
            v-if="action == 'Add' || action == 'Update'"
            />

            <v-text-field
            v-model="release"
            readonly
            class="px-6"
            label="Release Date"
            append-icon="mdi-calendar"
            @click="dateDialog = true"
            @click:append="dateDialog = true"
            v-if="action == 'Add' || action == 'Update'"
            />

            <v-file-input
            v-model="cover"
            class="px-6"
            label="Movie Cover"
            accept="image/*"
            show-size
            v-if="action == 'Add' || action == 'Update'"
            />

            <v-text-field
            v-model="trailer"
            class="px-6"
            label="Trailer"
            v-if="action == 'Add' || action == 'Update'"
            />

            <v-select
            v-model="rating"
            :items="ratingOptions"
            class="px-6"
            label="Rating"
            single-line
            v-if="action == 'Add' || action == 'Update'"
            />

            <v-select
            v-model="genres"
            :items="genreOptions"
            class="px-6"
            label="Genre"
            single-line
            multiple
            chips
            v-if="action == 'Add' || action == 'Update'"
            />
            
            <v-card class="ml-auto">
                <v-btn
                class="ml-auto mr-4 mb-4"
                @click="clear">
                    Clear
                </v-btn>

                <v-btn
                class="ml-auto mr-4 mb-4"
                @click="addMovie"
                v-if="action == 'Add'">
                    Add
                </v-btn>

                <v-btn
                class="ml-auto mr-4 mb-4"
                @click="updateMovie"
                v-if="action == 'Update'">
                    Update
                </v-btn>
                
                <v-btn
                class="ml-auto mr-4 mb-4"
                @click="deleteMovie"
                v-if="action == 'Delete'">
                    Delete
                </v-btn>
            </v-card>
        </v-card>
        <v-dialog v-model="timeDialog" width="300px">
            <timeForm
            @closeTimeDialog="closeTimeDialog"
            @setLength="setLength"
            />
        </v-dialog>
        <v-dialog v-model="dateDialog" width="300px">
            <dateForm
            @closeDateDialog="closeDateDialog"
            @setReleaseDate="setReleaseDate"
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
        movie: '',
        title: '',
        status: '',
        length: '',
        bio: '',
        release: '',
        cover: null,
        trailer: '',
        rating: '',
        genres: [],
        movies: [],
        statusOptions: ['Coming Soon', 'In Cinemas', 'Expired'],
        ratingOptions: ['G', 'PG', 'PG-13', 'R', 'NC-17'],
        genreOptions: [
                'Action', 
                'Drama', 
                'Adventure', 
                'Comedy', 
                'Animation',
                'Sci-Fi',
                'Fantasy',
                'Crime',
                'Thriller',
                'Family',
                'Romance',
                'Mystery',
                'Sport',
                'Horror',
                'War',
                'History',
                'Music'
        ],
        timeDialog: false,
        dateDialog: false,
        titleUnique: true,
        rules: {
            titleUnique: (titleUnique) => titleUnique || 'Title must be unique',
            required: (value, action) => action == 'Update' || action == 'Delete' || !!value || 'Required',
        }
    }),
    created: async function(){
        await this.retrieveMovies();
    },
    methods: {
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
        retrieveInfo: async function(){
            fetch(`http://localhost:2020/movie/${this.movie}`)
            .then(async (resp) => {
                const info = await resp.json();
                
                if(info.release){
                    info.release = new Date(Date.parse(info.release));
                    let year = info.release.getFullYear();
                    let month = ('0' + (info.release.getMonth() + 1)).slice(-2);
                    let day = info.release.getDate();
                    info.release = year + '-' + month + '-' + day;
                }

                this.title = info.title;
                this.status = info.status;
                this.length = info.length;
                this.bio = info.bio;
                this.release = info.release;
                this.trailer = info.trailer;
                this.rating = info.rating;
                this.genres = info.genre;
            })
            .catch((error) => {
                console.error('Error: ', error);
                alert('something went wrong, try again');
            });
        },
        closeTimeDialog: function(){this.timeDialog = false;},
        setLength: function(time){
            if(!time) return;
            this.length = time;
            this.timeDialog = false;
        },
        closeDateDialog: function(){this.dateDialog = false;},
        setReleaseDate: function(date){
            if(!date) return;
            this.release = date;
            this.dateDialog = false;
        },
        addMovie: function(){
            let formData = new FormData();

            if(!this.title || !this.status) return alert('you need to specify a title and status');
            let movie = {
                title: this.title,
                status: this.status,
            }

            if(this.length) movie.length = this.length;
            if(this.bio) movie.bio = this.bio;
            if(this.release) movie.release = this.release;
            if(this.trailer) movie.trailer = this.trailer;
            if(this.rating) movie.rating = this.rating;
            if(this.genres.length) movie.genre = this.genres;

            formData.append('cover', this.cover);
            formData.append('movie', JSON.stringify(movie));

            fetch(`http://localhost:2020/movie`, {
                method: 'POST',
                headers: {
                    'authorization': `Bearer ${sessionStorage.getItem('jwtAdmin')}`,
                    'role': 'admin'
                },
                body: formData
            })
            .then(async (resp) => {
                if(resp.status == 403) return this.titleUnique = false;
                if(resp.status != 200) return alert('something went wrong, try again');
                this.clear();
                await this.retrieveMovies();
            })
            .catch((error) => {
                console.error('Error: ', error);
                alert('something went wrong, try again');
            });
        },
        updateMovie: function(){
            let formData = new FormData();
            let movie = {};

            if(!this.movie) return alert('you need to specify a movie');
            if(this.title) movie.title = this.title;
            if(this.status) movie.status = this.status;
            if(this.length) movie.length = this.length;
            if(this.bio) movie.bio = this.bio;
            if(this.release) movie.release = this.release;
            if(this.trailer) movie.trailer = this.trailer;
            if(this.rating) movie.rating = this.rating;
            if(this.genres.length) movie.genre = this.genres;

            formData.append('cover', this.cover);
            formData.append('movie', JSON.stringify(movie));

            fetch(`http://localhost:2020/movie/${this.movie}`, {
                method: 'PUT',
                headers: {
                    'authorization': `Bearer ${sessionStorage.getItem('jwtAdmin')}`,
                    'role': 'admin'
                },
                body: formData
            })
            .then(async (resp) => {
                if(resp.status == 403) return this.titleUnique = false;
                if(resp.status != 200) return alert('something went wrong, try again');
                this.clear();
                await this.retrieveMovies();
            })
            .catch((error) => {
                console.error('Error: ', error);
                alert('something went wrong, try again');
            });
        },
        deleteMovie: function(){
            fetch(`http://localhost:2020/movie`, {
                method: 'DELETE',
                headers: {
                    'authorization': `Bearer ${sessionStorage.getItem('jwtAdmin')}`,
                    'role': 'admin',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({_id: this.movie})
            })
            .then(async (resp) => {
                if(resp.status != 200) return alert('something went wrong, try again');
                await this.retrieveMovies();
            })
            .catch((error) => {
                console.error('Error: ', error);
                alert('something went wrong, try again');
            });
        },
        clear: function(){
            this.movie = '';
            this.title = '';
            this.status = '';
            this.length = '';
            this.bio = '';
            this.release = '';
            this.cover = null;
            this.trailer = '';
            this.rating = '';
            this.genres = [];
        }
    },
    watch: {
        clearForm: function(){
            if(this.clearForm){
                this.clear();
                this.$emit('formCleared');
            }
        },
        movie: function(){
            if(this.movie) this.retrieveInfo();
        }
    }
}
</script>
