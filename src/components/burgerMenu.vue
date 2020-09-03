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
            <v-list-item to="/">
                <v-list-item-title>Login</v-list-item-title>
            </v-list-item>
            <v-list-item to="/">
                <v-list-item-title>Sign up</v-list-item-title>
            </v-list-item>
        </v-list>
    </v-menu>
</template>