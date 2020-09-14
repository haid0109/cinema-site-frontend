<template>
    <v-container fluid ma-0 pa-0>
        <v-card class="d-flex flex-column" dark>
            <v-card-title>{{action}}</v-card-title>

            <v-text-field
            v-model="email"
            class="px-6"
            label="Email"
            :rules="[rules.required, rules.email]"/>

            <v-text-field
            v-model="password"
            class="px-6"
            label="Password"
            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show1 ? 'text' : 'password'"
            @click:append="show1 = !show1"
            :rules="[rules.required]"/>
            
            <v-text-field
            v-model="rePassword"
            class="px-6"
            label="Verify Password"
            v-if="action == 'Sign Up'"
            :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show2 ? 'text' : 'password'"
            @click:append="show2 = !show2"
            :rules="[rules.required, rules.matchPassword(rePassword, password)]"/>
            
            <v-text-field
            v-model="phoneNum"
            class="px-6"
            label="Phone Number"
            v-if="action == 'Sign Up'"
            :rules="[rules.numberOnly, rules.phoneNum]"/>
            
            <v-card class="ml-auto" >
                <v-btn
                class="ml-auto mr-4 mb-4" 
                @click="$emit('closeDialog')"
                v-if="!extended">
                    close
                </v-btn>

                <v-btn
                class="ml-auto mr-4 mb-4" 
                @click="updateCategory(selectedCategory)">
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
        show1: false,
        show2: false,
        unique: true,
        rules: {
          required: value => !!value || 'Required',
          email: value => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value) || 'Email must be valid',
          matchPassword: (rePassword, password) => rePassword == password || 'Password must match',
          numberOnly: value => value.length < 1 || /^\d+$/.test(value) || 'Phone number must be valid',
          phoneNum: value => value.length < 1 || value.length == 8 || 'Phone number must be 8 digits',
        }
    }),
    methods: {
    }
}
</script>
