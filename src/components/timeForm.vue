<template>
    <v-container fluid class="ma-0 pa-0">
        <v-time-picker
        v-model="time"
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
            @click="$emit('closeTimeDialog')"
            >
                Close
            </v-btn>

            <v-btn
            dark
            class="ml-auto mr-2"
            @click="$emit('setTime', time)"
            >
                Pick
            </v-btn>
        </v-time-picker>
    </v-container>
</template>

<script>
export default {
    data: () => ({
        time: ''
    })
}
</script>
