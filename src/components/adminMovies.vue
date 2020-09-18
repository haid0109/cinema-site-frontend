<template>
    <v-container fluid class="ma-0 pa-0 fill-height align-start justify-center">
        <v-tabs
        fixed-tabs 
        dark
        >
            <v-tab
            v-for="(tab, index) in tabs"
            :key="index"
            @click="pickTab(tab.title)"
            >
                {{tab.title}}
            </v-tab>
        </v-tabs>

        <v-card class="resizeOnMobile">
            <moviesForm
            v-if="tabPicker[0].picked"
            :action="'Add'"
            />
            
            <moviesForm
            v-if="tabPicker[1].picked"
            :action="'Update'"
            />
            
            <moviesForm
            v-if="tabPicker[2].picked"
            :action="'Delete'"
            />
        </v-card>
    </v-container>
</template>

<script>
import moviesForm from './moviesForm';

export default {
    components: {moviesForm},
    data: () => ({
        tab: '',
        tabs: [
            {title: 'Add Movie'},
            {title: 'Update Movie Information'},
            {title: 'Delete Movie'},
        ],
        tabPicker: [
            {title: 'Add Movie', picked: true},
            {title: 'Update Movie Information', picked: false},
            {title: 'Delete Movie', picked: false},
        ]
    }),
    methods: {
        pickTab: function(title){
            this.tabPicker.forEach(element => {
                if(element.title == title){element.picked = true;}
                else{element.picked = false;}
            });
        }
    }
}
</script>

<style scoped>
.resizeOnMobile{width: 400px;}

@media (max-width: 400px) and (min-width: 0px) {
    .resizeOnMobile{width: 250px;}
}
</style>
