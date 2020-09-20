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
            
            <cinemaForm
            v-if="tabPicker[0].picked"
            :action="'Add'"
            :clearForm="clearForm"
            @formCleared="formCleared"
            />

            <cinemaForm
            v-if="tabPicker[1].picked"
            :action="'Update'"
            :clearForm="clearForm"
            @formCleared="formCleared"
            />
            
            <cinemaForm
            v-if="tabPicker[2].picked"
            :action="'Delete'"
            :clearForm="clearForm"
            @formCleared="formCleared"
            />
        </v-card>
    </v-container>
</template>

<script>
import cinemaForm from './cinemaForm';

export default {
    components: {cinemaForm},
    data: () => ({
        tab: '',
        tabs: [
            {title: 'Add Cinema'},
            {title: 'Update Cinema Information'},
            {title: 'Delete Cinema'},
        ],
        tabPicker: [
            {title: 'Add Cinema', picked: true},
            {title: 'Update Cinema Information', picked: false},
            {title: 'Delete Cinema', picked: false},
        ],
        clearForm: false
    }),
    methods: {
        pickTab: function(title){
            this.clearForm = true;
            this.tabPicker.forEach(element => {
                if(element.title == title){element.picked = true;}
                else{element.picked = false;}
            });
        },
        formCleared: function(){
            this.clearForm = false;
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
