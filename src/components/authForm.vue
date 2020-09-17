<template>
    <v-container fluid ma-0 pa-0>
        <v-card class="d-flex flex-column" dark>
            <v-card-title>{{action}}</v-card-title>

            <v-text-field
            v-model="email"
            class="px-6"
            label="Email"
            :rules="[
                rules.userNotFound(notFound),
                rules.emailUnique(emailUnique),
                rules.required,
                rules.email
            ]"/>

            <v-text-field
            v-model="password"
            class="px-6"
            label="Password"
            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show1 ? 'text' : 'password'"
            @click:append="show1 = !show1"
            :rules="[
                rules.passwordIncorrect(passwordIncorrect),
                rules.required
            ]"/>
            
            <v-text-field
            v-model="rePassword"
            class="px-6"
            label="Verify Password"
            v-if="action == 'Sign Up'"
            :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show2 ? 'text' : 'password'"
            @click:append="show2 = !show2"
            :rules="[
                rules.matchPassword(rePassword, password),
                rules.required
            ]"/>
            
            <v-text-field
            v-model="phoneNum"
            class="px-6"
            label="Phone Number"
            v-if="action == 'Sign Up'"
            :rules="[
                rules.numberOnly,
                rules.phoneNum
            ]"/>

            <v-select
            v-model="cinemaValue"
            :items="items"
            item-text="name"
            item-value="_id"
            class="px-6"
            label="Cinema"
            single-line
            v-if="type == 'admin'"
            :rules="[rules.required]"/>
            
            <v-card class="ml-auto" >
                <v-btn
                class="ml-auto mr-4 mb-4"
                @click="$emit('closeDialog')"
                v-if="
                    type == 'user' && 
                    !extended
                ">
                    close
                </v-btn>

                <v-btn
                class="ml-auto mr-4 mb-4"
                to="register"
                v-if="
                    type == 'user' && 
                    action == 'Login' && 
                    extended
                ">
                    Sign Up
                </v-btn>

                <v-btn
                class="ml-auto mr-4 mb-4"
                to="login"
                v-if="
                    type == 'user' && 
                    action == 'Sign Up' && 
                    extended
                ">
                    Login
                </v-btn>

                <v-btn
                class="ml-auto mr-4 mb-4"
                @click="loginOrSignUp">
                    {{action}}
                </v-btn>
            </v-card>
        </v-card>
    </v-container>
</template>

<script>
export default {
    props: ['type', 'action', 'extended'],
    data: () => ({
        email: '',
        password: '',
        rePassword: '',
        phoneNum: '',
        items: [],
        cinemaValue: '',
        show1: false,
        show2: false,
        notFound: false,
        passwordIncorrect: false,
        emailUnique: true,
        rules: {
            userNotFound: (notFound) => !notFound || 'User does not exist',
            passwordIncorrect: (passwordIncorrect) => !passwordIncorrect || 'Password is incorrect',
            emailUnique: (emailUnique) => emailUnique || 'Email must be unique',
            required: value => !!value || 'Required',
            email: value => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value) || 'Email must be valid',
            matchPassword: (rePassword, password) => rePassword == password || 'Password must match',
            numberOnly: value => value.length < 1 || /^\d+$/.test(value) || 'Phone number must be valid',
            phoneNum: value => value.length < 1 || value.length == 8 || 'Phone number must be 8 digits',
        }
    }),
    created: async function(){
        await this.retrieveCinemaNames();
    },
    methods: {
        retrieveCinemaNames: async function(){
            fetch(`http://localhost:2020/cinema/names`)
            .then(async (resp) => {
                const cinemaNames = await resp.json();
                this.items = cinemaNames;
            })
            .catch((error) => {
                console.error('Error: ', error);
                alert('something went wrong, try again');
            });
        },
        loginOrSignUp: async function(){
            if(this.action == 'Login') this.login();
            else if(this.action == 'Sign Up') this.signUp();
            else alert('Something went wrong');
        },
        login: async function(){
            let credentials = {
                email: this.email,
                password: this.password
            }
            let endpoint = `http://localhost:2020/${this.type}/login/${JSON.stringify(credentials)}`;
            if(this.type == 'admin')
                endpoint = `http://localhost:2020/${this.type}/login/${this.cinemaValue}/${JSON.stringify(credentials)}`;
            fetch(endpoint)
            .then(async (resp) => {
                if(resp.status == 404) return this.notFound = true;
                else if(resp.status == 400) return this.passwordIncorrect = true;

                let token = await resp.text();
                
                if(this.type == 'user'){
                    sessionStorage.setItem('jwt', token);
                    this.$emit('loggedIn');
                    if(this.extended) this.$router.push(sessionStorage.getItem('cinema') || '/');
                }
                else if(this.type == 'admin'){
                    sessionStorage.setItem('jwtAdmin', token);
                    sessionStorage.setItem('cinema', this.cinemaValue);
                    this.$emit('loggedIn');
                }
            })
            .catch((error) => {
                console.error('Error: ', error);
                alert('something went wrong, try again');
            });
        },
        signUp: async function(){
            let body = {
                email: this.email,
                password: this.password
            }
            if(this.phoneNum) body.phoneNum = this.phoneNum;
            console.log(body);

            fetch(`http://localhost:2020/user`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })
            .then(async (resp) => {
                if(resp.status == 403) return this.emailUnique = false;
                let token = await resp.text();
                
                sessionStorage.setItem('jwt', token);
                this.$emit('loggedIn');
                if(this.extended) this.$router.push(sessionStorage.getItem('cinema') || '/');
            })
            .catch((error) => {
                console.error('Error: ', error);
                alert('something went wrong, try again');
            });
        }
    }
}
</script>
