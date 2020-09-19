<template>
    <v-container fluid class="ma-0 pa-0">
        <v-card class="d-flex flex-column" dark>
            <v-card-title>{{action}}</v-card-title>

            <v-row class="ma-0 pa-0">
                <v-col class="ma-0 pa-0" cols="6">
                    <v-text-field
                    v-model="firstName"
                    class="px-6"
                    label="First Name"
                    v-if="action == 'Update' || action == 'Create'"
                    :rules="[rules.required(firstName, action)]"
                    />
                </v-col>
                <v-col class="ma-0 pa-0" cols="6">
                    <v-text-field
                    v-model="lastName"
                    class="px-6"
                    label="Last Name"
                    v-if="action == 'Update' || action == 'Create'"
                    :rules="[rules.required(lastName, action)]"
                    />
                </v-col>
            </v-row>

            <v-text-field
            v-model="email"
            class="px-6"
            label="Email"
            v-if="action == 'Update' || action == 'Create'"
            :rules="[
                rules.emailUnique(emailUnique),
                rules.email,
                rules.required(email, action)
            ]"/>

            <v-text-field
            v-model="password"
            class="px-6"
            label="Password"
            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show1 ? 'text' : 'password'"
            @click:append="show1 = !show1"
            v-if="action == 'Update' || action == 'Create'"
            :rules="[rules.required(password, action)]"
            />
            
            <v-text-field
            v-model="rePassword"
            class="px-6"
            label="Verify Password"
            :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show2 ? 'text' : 'password'"
            @click:append="show2 = !show2"
            v-if="action == 'Update' || action == 'Create'"
            :rules="[
                rules.matchPassword(rePassword, password),
                rules.required(rePassword, action)
            ]"/>

            <v-text-field
            v-model="phoneNum"
            class="px-6"
            label="Phone Number"
            v-if="action == 'Update' || action == 'Create'"
            :rules="[
                rules.numberOnly,
                rules.phoneNum,
                rules.required(phoneNum, action)
            ]"/>

            <v-text-field
            v-model="address"
            class="px-6"
            label="Address"
            v-if="action == 'Update' || action == 'Create'"
            :rules="[rules.required(address, action)]"
            />

            <v-autocomplete
            v-model="admin"
            :items="admins"
            item-text="fullName"
            item-value="_id"
            class="px-6"
            label="Admin"
            clearable
            v-if="action == 'Delete'"
            />
            
            <v-card class="ml-auto">
                <v-btn
                class="ml-auto mr-4 mb-4"
                @click="clear"
                >
                    Clear
                </v-btn>

                <v-btn
                class="ml-auto mr-4 mb-4"
                @click="updateAdmin"
                v-if="action == 'Update'"
                >
                    Update
                </v-btn>

                <v-btn
                class="ml-auto mr-4 mb-4"
                @click="createAdmin"
                v-if="action == 'Create'"
                >
                    Create
                </v-btn>
                
                <v-btn
                class="ml-auto mr-4 mb-4"
                @click="deleteAdmin"
                v-if="action == 'Delete'"
                >
                    Delete
                </v-btn>
            </v-card>
        </v-card>
    </v-container>
</template>

<script>
export default {
    props: ['action', 'clearForm', 'getInfo'],
    data: () => ({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        rePassword: '',
        phoneNum: '',
        address: '',
        admin: '',
        admins: [],
        show1: false,
        show2: false,
        emailUnique: true,
        rules: {
            emailUnique: (emailUnique) => emailUnique || 'Email must be unique',
            email: value => value.length < 1 || /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value) || 'Email must be valid',
            matchPassword: (rePassword, password) => rePassword == password || 'Password must match',
            numberOnly: value => value.length < 1 || /^\d+$/.test(value) || 'Phone number must be valid',
            phoneNum: value => value.length < 1 || value.length == 8 || 'Phone number must be 8 digits',
            required: (value, action) => action == 'Update' || !!value || 'Required',
        }
    }),
    created: async function(){
        await this.retrieveAdmins();
        await this.retrieveInfo();
    },
    methods: {
        retrieveAdmins: async function(){
            fetch(`http://localhost:2020/admin/names/${sessionStorage.getItem('cinema')}`, {
                headers: {
                    authorization: `Bearer ${sessionStorage.getItem('jwtAdmin')}`,
                    role: 'admin'
                }
            })
            .then(async (resp) => {
                const admins = await resp.json();
                this.admins = admins;
            })
            .catch((error) => {
                console.error('Error: ', error);
                alert('something went wrong, try again');
            });
        },
        retrieveInfo: async function(){
            fetch(`http://localhost:2020/admin/${sessionStorage.getItem('cinema')}`, {
                headers: {
                    authorization: `Bearer ${sessionStorage.getItem('jwtAdmin')}`,
                    role: 'admin'
                }
            })
            .then(async (resp) => {
                const info = await resp.json();
                this.firstName = info.fullName.split(' ')[0];
                this.lastName = info.fullName.split(' ')[1];
                this.email = info.email;
                this.password = info.password;
                this.rePassword = info.password;
                this.phoneNum = '' + info.phoneNum;
                this.address = info.address;
                this.admin = info.admin;
            })
            .catch((error) => {
                console.error('Error: ', error);
                alert('something went wrong, try again');
            });
        },
        updateAdmin: function(){
            let admin = {};
            if(!this.firstName && !this.lastName){/* tslint:disable:no-empty */}
            else if(!this.firstName || !this.lastName)
                {return alert('both fields must be filled out if you want to update your name');}
            else admin.fullName = this.firstName + ' ' + this.lastName;

            if(this.email) admin.email = this.email;
            if(this.password) admin.password = this.password;
            if(this.phoneNum) admin.phoneNum = this.phoneNum;
            if(this.address) admin.address = this.address;

            fetch(`http://localhost:2020/admin/${sessionStorage.getItem('cinema')}`, {
                method: 'PUT',
                headers: {
                    'authorization': `Bearer ${sessionStorage.getItem('jwtAdmin')}`,
                    'role': 'admin',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(admin)
            })
            .then((resp) => {
                if(resp.status == 403) return this.emailUnique = false;
                if(resp.status != 200) return alert('something went wrong, try again');
                this.clear();
            })
            .catch((error) => {
                console.error('Error: ', error);
                alert('something went wrong, try again');
            });
        },
        createAdmin: function(){
            if(
                !this.firstName ||
                !this.lastName ||
                !this.email ||
                !this.password ||
                !this.rePassword ||
                !this.phoneNum ||
                !this.address
            ) return alert('some or all of the fields are empty');

            let admin = {
                fullName: this.firstName + ' ' + this.lastName,
                email: this.email,
                password: this.password,
                phoneNum: this.phoneNum,
                address: this.address
            }

            fetch(`http://localhost:2020/admin/${sessionStorage.getItem('cinema')}`, {
                method: 'POST',
                headers: {
                    'authorization': `Bearer ${sessionStorage.getItem('jwtAdmin')}`,
                    'role': 'admin',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(admin)
            })
            .then(async (resp) => {
                if(resp.status == 403) return this.emailUnique = false
                if(resp.status != 200) return alert('something went wrong, try again');
                this.clear();
                await this.retrieveAdmins();
            })
            .catch((error) => {
                console.error('Error: ', error);
                alert('something went wrong, try again');
            });
        },
        deleteAdmin: function(){
            fetch(`http://localhost:2020/admin/${sessionStorage.getItem('cinema')}`, {
                method: 'DELETE',
                headers: {
                    'authorization': `Bearer ${sessionStorage.getItem('jwtAdmin')}`,
                    'role': 'admin',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({_id: this.admin})
            })
            .then(async (resp) => {
                if(resp.status != 200) return alert('something went wrong, try again');
                await this.retrieveAdmins();
            })
            .catch((error) => {
                console.error('Error: ', error);
                alert('something went wrong, try again');
            });
        },
        clear: function(){
            this.firstName = '';
            this.lastName = '';
            this.email = '';
            this.password = '';
            this.rePassword = '';
            this.phoneNum = '';
            this.address = '';
            this.admin = '';
        }
    },
    watch: {
        clearForm: function(){
            if(this.clearForm){
                this.clear();
                this.$emit('formCleared');
            }
        },
        getInfo: function(){
            if(this.getInfo){
                this.retrieveInfo();
                this.$emit('gotInfo');
            }
        }
    }
}
</script>
