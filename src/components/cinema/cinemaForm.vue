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
            v-if="action == 'Update' || action == 'Delete'"
            />

            <v-text-field
            v-model="name"
            class="px-6"
            label="Name"
            v-if="action == 'Add' || action == 'Update'"
            :rules="[
                rules.required(name, action),
                rules.nameUnique(nameUnique)
            ]"
            />

            <v-text-field
            v-model="address"
            class="px-6"
            label="Address"
            v-if="action == 'Add' || action == 'Update'"
            :rules="[
                rules.required(address, action),
                rules.addressUnique(addressUnique)
            ]"
            />

            <v-card class="ml-auto">
                <v-btn
                class="ml-auto mr-4 mb-4"
                @click="clear">
                    Clear
                </v-btn>

                <v-btn
                class="ml-auto mr-4 mb-4"
                @click="addCinema"
                v-if="action == 'Add'">
                    Add
                </v-btn>

                <v-btn
                class="ml-auto mr-4 mb-4"
                @click="updateCinema"
                v-if="action == 'Update'">
                    Update
                </v-btn>
                
                <v-btn
                class="ml-auto mr-4 mb-4"
                @click="deleteCinema"
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
        name: '',
        address: '',
        cinemas: [],
        nameUnique: true,
        addressUnique: true,
        rules: {
            required: (value, action) => action == 'Update' || action == 'Delete' || !!value || 'Required',
            nameUnique: (nameUnique) => nameUnique || 'Name must be unique',
            addressUnique: (addressUnique) => addressUnique || 'Address must be unique',
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
        retrieveInfo: async function(){
            fetch(`http://localhost:2020/cinema/${this.cinema}`)
            .then(async (resp) => {
                const info = await resp.json();

                this.name = info.name;
                this.address = info.address;
            })
            .catch((error) => {
                console.error('Error: ', error);
                alert('something went wrong, try again');
            });
        },
        addCinema: function(){
            if(!this.name || !this.address) return alert('name and address cannot be empty');
            
            let cinema = {
                name: this.name,
                address: this.address
            }

            fetch(`http://localhost:2020/cinema`, {
                method: 'POST',
                headers: {
                    'authorization': `Bearer ${sessionStorage.getItem('jwtAdmin')}`,
                    'role': 'admin',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cinema)
            })
            .then(async (resp) => {
                if(resp.status == 403) {
                    this.nameUnique = false;
                    this.addressUnique = false;
                    return;
                }
                if(resp.status != 200) return alert('something went wrong, try again');

                this.clear();
                await this.retrieveCinemas();
            })
            .catch((error) => {
                console.error('Error: ', error);
                alert('something went wrong, try again');
            });
        },
        updateCinema: function(){
            let cinema = {};
            if(!this.cinema) return alert('you need to specify a cinema');
            if(this.name) cinema.name = this.name;
            if(this.address) cinema.address = this.address;

            fetch(`http://localhost:2020/cinema/${this.cinema}`, {
                method: 'PUT',
                headers: {
                    'authorization': `Bearer ${sessionStorage.getItem('jwtAdmin')}`,
                    'role': 'admin',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cinema)
            })
            .then(async (resp) => {
                if(resp.status == 403) return this.titleUnique = false;
                if(resp.status != 200) return alert('something went wrong, try again');
                this.clear();
                await this.retrieveCinemas();
            })
            .catch((error) => {
                console.error('Error: ', error);
                alert('something went wrong, try again');
            });
        },
        deleteCinema: function(){
            fetch(`http://localhost:2020/cinema`, {
                method: 'DELETE',
                headers: {
                    'authorization': `Bearer ${sessionStorage.getItem('jwtAdmin')}`,
                    'role': 'admin',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({_id: this.cinema})
            })
            .then(async (resp) => {
                if(resp.status != 200) return alert('something went wrong, try again');
                await this.retrieveCinemas();
            })
            .catch((error) => {
                console.error('Error: ', error);
                alert('something went wrong, try again');
            });
        },
        clear: function(){
            this.cinema = '';
            this.name = '';
            this.address = '';
        }
    },
    watch: {
        cinema: function(){
            if(this.cinema) this.retrieveInfo();
        },
        clearForm: function(){
            this.clear();
            if(this.clearForm) this.$emit('formCleared');
        }
    }
}
</script>
