<template>
    <v-container fluid class="ma-0 pa-0">
        <v-date-picker
        v-model="date"
        class="rounded-0"
        format="24hr"
        full-width
        scrollable
        dark
        >
            <v-spacer></v-spacer>
            <v-btn
            dark
            class="ml-auto mr-4"
            @click="$emit('closeDateDialog')"
            >
                Close
            </v-btn>

            <v-btn
            dark
            class="ml-auto mr-2"
            @click="$emit('setDate', date)"
            >
                Pick
            </v-btn>
        </v-date-picker>
    </v-container>
</template>

<script>
export default {
    data: () => ({
        date: ''
    })
}
</script>
