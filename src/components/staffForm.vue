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
                    v-if="action == 'Update' || action == 'Create'"/>
                </v-col>
                <v-col class="ma-0 pa-0" cols="6">
                    <v-text-field
                    v-model="lastName"
                    class="px-6"
                    label="Last Name"
                    v-if="action == 'Update' || action == 'Create'"/>
                </v-col>
            </v-row>

            <v-text-field
            v-model="email"
            class="px-6"
            label="Email"
            v-if="action == 'Update' || action == 'Create'"
            :rules="[
                rules.userNotFound(notFound),
                rules.emailUnique(emailUnique),
                rules.email
            ]"/>

            <v-text-field
            v-model="password"
            class="px-6"
            label="Password"
            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show1 ? 'text' : 'password'"
            @click:append="show1 = !show1"
            v-if="action == 'Update' || action == 'Create'"/>
            
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
            ]"/>

            <v-text-field
            v-model="phoneNum"
            class="px-6"
            label="Phone Number"
            v-if="action == 'Update' || action == 'Create'"
            :rules="[
                rules.numberOnly,
                rules.phoneNum
            ]"/>

            <v-text-field
            v-model="address"
            class="px-6"
            label="Address"
            v-if="action == 'Update' || action == 'Create'"/>

            <v-select
            v-model="admin"
            :items="admins"
            item-text="fullName"
            item-value="_id"
            class="px-6"
            label="Admins"
            single-line
            v-if="action == 'Delete'"/>
            
            <v-card class="ml-auto">

                <v-btn
                class="ml-auto mr-4 mb-4"
                @click="updateAdmin"
                v-if="action == 'Update'">
                    Update
                </v-btn>

                <v-btn
                class="ml-auto mr-4 mb-4"
                @click="createAdmin"
                v-if="action == 'Create'">
                    Create
                </v-btn>
                
                <v-btn
                class="ml-auto mr-4 mb-4"
                @click="deleteAdmin"
                v-if="action == 'Delete'">
                    Delete
                </v-btn>
            </v-card>
        </v-card>
    </v-container>
</template>

<script>
export default {
    props: ['action'],
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
        notFound: false,
        emailUnique: true,
        rules: {
            userNotFound: (notFound) => !notFound || 'User does not exist',
            emailUnique: (emailUnique) => emailUnique || 'Email must be unique',
            email: value => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value) || 'Email must be valid',
            matchPassword: (rePassword, password) => rePassword == password || 'Password must match',
            numberOnly: value => value.length < 1 || /^\d+$/.test(value) || 'Phone number must be valid',
            phoneNum: value => value.length < 1 || value.length == 8 || 'Phone number must be 8 digits',
        }
    }),
    created: async function(){
        await this.retrieveAdmins();
    },
    methods: {
        retrieveAdmins: function(){
            fetch(`http://localhost:2020/admin/names/${sessionStorage.getItem('cinema')}`, {
                headers: {
                    authorization: `Bearer ${sessionStorage.getItem('jwtAdmin')}`,
                    role: 'admin'
                }
            })
            .then(async (resp) => {
                if(resp.status == 401){
                    sessionStorage.setItem('jwt', '');
                    sessionStorage.setItem('cinema', '');
                    return this.$router.push('/admin');
                }
                const admins = await resp.json();
                this.admins = admins;
            })
            .catch((error) => {
                console.error('Error: ', error);
                alert('something went wrong, try again');
            });
        },
        updateAdmin: function(){
        },
        createAdmin: function(){
        },
        deleteAdmin: function(){
        }
    }
}
</script>
