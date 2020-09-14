<template>
    <v-menu bottom offset-y>
        <template v-slot:activator="{on}">
            <v-app-bar-nav-icon 
            class="d-md-none mt-2"
            v-on="on"
            />
        </template>
        <v-list>
            <v-list-item to="/">
                <v-list-item-title>Program</v-list-item-title>
            </v-list-item>
            <v-list-item to="/">
                <v-list-item-title>Upcoming</v-list-item-title>
            </v-list-item>
            <v-list-item v-if="login" @click="$emit('login')">
                <v-list-item-title>Login</v-list-item-title>
            </v-list-item>
            <v-list-item v-if="signUp" @click="$emit('signUp')">
                <v-list-item-title>Sign up</v-list-item-title>
            </v-list-item>
            <v-list-item v-if="account" @click="$emit('account')">
                <v-list-item-title>Account</v-list-item-title>
            </v-list-item>
            <v-list-item v-if="logOut" @click="$emit('logOut')">
                <v-list-item-title>Log Out</v-list-item-title>
            </v-list-item>
        </v-list>
    </v-menu>
</template>

<script>
export default {
    props: ['login', 'signUp', 'account', 'logOut'],
}
</script>
