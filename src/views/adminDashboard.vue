<template>
    <v-container fluid class="ma-0 pa-0">
        <v-navigation-drawer
            app
            floating
            permanent
            expand-on-hover
            mini-variant
            dark
        >
          <v-list>
            <v-list-item
                v-for="(item, index) in items"
                :key="index"
                @click="pickComponent(item.title)"
            >
              <v-list-item-icon>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-icon>
  
              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-navigation-drawer>
        <adminStaff v-if="componentPicker[0].picked"/>
        <adminMovies v-if="componentPicker[1].picked"/>
        <adminPerformances v-if="componentPicker[2].picked"/>
        <adminCinemas v-if="componentPicker[3].picked"/>
    </v-container>
</template>

<script>
import adminStaff from '../components/adminStaff';
import adminMovies from '../components/adminMovies';
import adminPerformances from '../components/adminPerformances';
import adminCinemas from '../components/adminCinemas';

export default {
    components: {
        adminStaff,
        adminMovies,
        adminPerformances,
        adminCinemas
    },
    data: () => ({
        items: [
            { title: 'Staff', icon: 'mdi-account-cog' },
            { title: 'Movies', icon: 'mdi-video-vintage' },
            { title: 'Performances', icon: 'mdi-account-group' },
            { title: 'Cinemas', icon: 'mdi-theater' },
            { title: 'Log Out', icon: 'mdi-exit-to-app' },
        ],
        componentPicker: [
            { title: 'Staff', picked: true },
            { title: 'Movies', picked: false },
            { title: 'Performances', picked: false },
            { title: 'Cinemas', picked: false },
        ]
    }),
    created: async function(){
    },
    methods: {
        pickComponent: function(title){
            if(title == 'Log Out'){
                sessionStorage.setItem('cinema', '');
                this.$router.push('/admin');
            }
            this.componentPicker.forEach(element => {
                if(element.title == title){element.picked = true;}
                else{element.picked = false;}
            });
        }
    }
}
</script>
