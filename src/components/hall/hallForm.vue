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
            label="cinema"
            clearable
            />

            <v-autocomplete
            v-model="hall"
            :items="halls"
            item-text="name"
            item-value="_id"
            class="px-6"
            label="Hall"
            clearable
            v-if="action == 'Update' || action == 'Delete'"
            />

            <v-text-field
            v-model="name"
            class="px-6"
            label="Name"
            v-if="action == 'Add' || action == 'Update'"
            :rules="[
                rules.required(name, action)
            ]"
            />

            <v-select
            v-model="rowNum"
            :items="numberPicker"
            class="px-6"
            label="Number Of Rows"
            single-line
            v-if="action == 'Add' || action == 'Update'"
            :rules="[rules.required(rowNum, action)]"
            />

            <v-row class="ma-0 pa-0 d-flex align-start">
                <v-col class="ma-0 pa-0">
                    <v-select
                    v-model="row"
                    :items="rows"
                    item-text="name"
                    item-value="name"
                    style="width: 90px"
                    class="ml-6"
                    label="Row"
                    single-line
                    v-if="action == 'Add' || action == 'Update'"
                    :rules="[rules.required(row, action)]"
                    />
                </v-col>
                <v-col class="ma-0 pa-0">
                    <v-select
                    v-model="seatNum"
                    :items="numberPicker"
                    style="width: 170px"
                    class="px-3"
                    label="Number Of Seats"
                    single-line
                    v-if="action == 'Add' || action == 'Update'"
                    :rules="[rules.required(seatNum, action)]"
                    />
                </v-col>
                <v-col class="ma-0 pa-0">
                    <v-select
                    v-model="seatType"
                    :items="seatTypes"
                    style="width: 90px"
                    label="Seat Type"
                    single-line
                    v-if="action == 'Add' || action == 'Update'"
                    :rules="[rules.required(seatType, action)]"
                    />
                </v-col>
            </v-row>

            <v-card class="ml-auto">
                <v-btn
                class="ml-auto mr-4 mb-4"
                @click="clear">
                    Clear
                </v-btn>

                <v-btn
                class="ml-auto mr-4 mb-4"
                @click="addHall"
                v-if="action == 'Add'">
                    Add
                </v-btn>

                <v-btn
                class="ml-auto mr-4 mb-4"
                @click="updateHall"
                v-if="action == 'Update'">
                    Update
                </v-btn>
                
                <v-btn
                class="ml-auto mr-4 mb-4"
                @click="deleteHall"
                v-if="action == 'Delete'">
                    Delete
                </v-btn>
            </v-card>
        </v-card>
    </v-container>
</template>

<script>

export default {
    props: ['action', 'clearForm'],
    data: () => ({
        cinema: '',
        hall: '',
        name: '',
        rowNum: '',
        row: '',
        seatNum: '',
        seatType: '',
        gotInfo: false,
        cinemas: [],
        halls: [],
        rows: [],
        numberPicker: [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 
            11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 
            21, 22, 23, 24, 25,26, 27, 28, 29, 30, 
            31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 
            41, 42, 43, 44, 45, 46, 47, 48, 49, 50,
        ],
        seatTypes: ['Normal', 'VIP', 'Couple'],
        rules: {
            required: (value, action) => action == 'Update' || action == 'Delete' || !!value || 'Required',
        }
    }),
    created: async function(){
        await this.retrieveCinemas();
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
        retrieveInfo: async function(){
            fetch(`http://localhost:2020/cinema/hall/${this.cinema}/${this.hall}`)
            .then(async (resp) => {
                const info = await resp.json();
                this.gotInfo = true;
                this.name = info.name;
                this.rowNum = info.rows.length;
                this.rows = info.rows;
            })
            .catch((error) => {
                console.error('Error: ', error);
                alert('something went wrong, try again');
            });
        },
        addHall: function(){
            let error = '';

            if(!this.cinema) return alert('Cinema cannot be empty');
            if(!this.name) return alert('Name cannot be empty');
            if(!this.rows.length) return alert('Number of rows cannot be empty');
            this.rows.forEach(row => {
                if(!row.type) return error = 'Seat number and seat type must be filled out for all rows';
                if(!row.seats) return error = 'Seat number and seat type must be filled out for all rows';
                if(!row.seats.length) error = 'Seat number and seat type must be filled out for all rows';
            });
            if(error) return alert(error);
            
            const hall = {
                name: this.name,
                rows: this.rows
            }

            fetch(`http://localhost:2020/cinema/hall/${this.cinema}`, {
                method: 'POST',
                headers: {
                    'authorization': `Bearer ${sessionStorage.getItem('jwtAdmin')}`,
                    'role': 'admin',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(hall)
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
        updateHall: function(){
            let error = '';
            let hall = {};
            if(!this.cinema) return alert('you need to specify a cinema');
            if(!this.hall) return alert('you need to specify a hall');

            if(this.name) hall.name = this.name;
            if(this.rows.length > 0) {
                this.rows.forEach(row => {
                    if(!row.type) return error = 'Number and type of seats must be filled out if you want to update number of rows';
                    if(row.seats){
                        if(row.seats.length > 0) hall.rows = this.rows;
                        else return error = 'Number and type of seats must be filled out if you want to update number of rows';
                    }
                    else return error = 'Number and type of seats must be filled out if you want to update number of rows';
                });
            }
            else hall.rows = [];

            if(error) return alert(error);

            fetch(`http://localhost:2020/cinema/hall/${this.cinema}/${this.hall}`, {
                method: 'PUT',
                headers: {
                    'authorization': `Bearer ${sessionStorage.getItem('jwtAdmin')}`,
                    'role': 'admin',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(hall)
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
        deleteHall: function(){
            fetch(`http://localhost:2020/cinema/hall/${this.cinema}`, {
                method: 'DELETE',
                headers: {
                    'authorization': `Bearer ${sessionStorage.getItem('jwtAdmin')}`,
                    'role': 'admin',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({_id: this.hall})
            })
            .then(async (resp) => {
                if(resp.status != 200) return alert('something went wrong, try again');
                this.retrieveHalls();
            })
            .catch((error) => {
                console.error('Error: ', error);
                alert('something went wrong, try again');
            });
        },
        clear: function(){
            this.cinema = '';
            this.hall = '';
            this.name = '';
            this.rowNum = '';
            this.row = '';
            this.seatNum = '';
            this.seatType = '';
            this.halls = [];
            this.rows = [];
        }
    },
    watch: {
        cinema: function(){
            if(this.cinema) this.retrieveHalls();
        },
        hall: function(){
            if(this.hall) this.retrieveInfo();
        },
        rowNum: function(){
            if(this.gotInfo) return this.gotInfo = false;
            if(this.rowNum){
                this.row = '';
                this.seatNum = '';
                this.seatType = '';
                this.rows = [];
                for (let index = 1; index <= this.rowNum; index++) {
                    this.rows.push({name: 'Row ' + index});
                }
            }
        },
        row: function(){
            this.seatNum = '';
            this.seatType = '';

            if(this.row){
                this.rows.forEach(row => {
                    if(row.name == this.row) {
                        if(row.seats) this.seatNum = row.seats.length;
                        if(row.type) this.seatType = row.type;
                    }
                });
            }
        },
        seatNum: function(){
            if(this.seatNum){
                if(this.row){
                    this.rows.forEach(row => {
                        if(row.name == this.row){
                            row.seats = [];
                            for (let index = 1; index <= this.seatNum; index++) {
                                row.seats.push({name: 'Seat ' + index});
                            }
                        }                        
                    });
                }
            }
        },
        seatType: function(){
            if(this.seatType){
                if(this.row){
                    this.rows.forEach(row => {
                        if(row.name == this.row){
                            row.type = this.seatType;
                        }                        
                    });
                }
            }
        },
        clearForm: function(){
            this.clear();
            if(this.clearForm) this.$emit('formCleared');
        }
    }
}
</script>
