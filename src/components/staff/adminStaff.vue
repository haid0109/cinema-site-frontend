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
            <staffForm
            v-if="tabPicker[0].picked"
            :action="'Update'"
            :clearForm="clearForm"
            :getInfo="getInfo"
            @formCleared="formCleared"
            @gotInfo="gotInfo"
            />
            
            <staffForm
            v-if="tabPicker[1].picked"
            :action="'Create'"
            :clearForm="clearForm"
            @formCleared="formCleared"
            />
            
            <staffForm
            v-if="tabPicker[2].picked"
            :action="'Delete'"
            :clearForm="clearForm"
            @formCleared="formCleared"
            />
        </v-card>
    </v-container>
</template>

<script>
import staffForm from './staffForm';

export default {
    components: {staffForm},
    data: () => ({
        tab: '',
        tabs: [
            {title: 'Update Your Information'},
            {title: 'Create Admin'},
            {title: 'Delete Admin'},
        ],
        tabPicker: [
            {title: 'Update Your Information', picked: true},
            {title: 'Create Admin', picked: false},
            {title: 'Delete Admin', picked: false},
        ],
        clearForm: false,
        getInfo: false
    }),
    methods: {
        pickTab: function(title){
            this.clearForm = true;
            this.tabPicker.forEach(element => {
                if(element.title == title){element.picked = true;}
                else{element.picked = false;}
                if(element.title == 'Update Your Information') this.getInfo = true;
            });
        },
        formCleared: function(){this.clearForm = false;},
        gotInfo: function(){this.getInfo = false;}
    }
}
</script>

<style scoped>
.resizeOnMobile{width: 400px;}

@media (max-width: 400px) and (min-width: 0px) {
    .resizeOnMobile{width: 250px;}
}
</style>
