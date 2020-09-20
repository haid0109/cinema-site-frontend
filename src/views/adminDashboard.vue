<template>
    <v-container fluid class="ma-0 pa-0 fill-height align-start">
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
        <adminTickets v-if="componentPicker[0].picked"/>
        <adminPerformances v-if="componentPicker[1].picked"/>
        <adminMovies v-if="componentPicker[2].picked"/>
        <adminHalls v-if="componentPicker[3].picked"/>
        <adminCinemas v-if="componentPicker[4].picked"/>
        <adminStaff v-if="componentPicker[5].picked"/>
    </v-container>
</template>

<script>
import adminTickets from '../components/ticket/adminTickets';
import adminPerformances from '../components/performance/adminPerformances';
import adminMovies from '../components/movie/adminMovies';
import adminHalls from '../components/hall/adminHalls';
import adminCinemas from '../components/cinema/adminCinemas';
import adminStaff from '../components/staff/adminStaff';

export default {
    components: {
        adminTickets,
        adminPerformances,
        adminMovies,
        adminHalls,
        adminCinemas,
        adminStaff,
    },
    data: () => ({
        items: [
            { title: 'Tickets', icon: 'mdi-ticket-confirmation' },
            { title: 'Performances', icon: 'mdi-account-group' },
            { title: 'Movies', icon: 'mdi-video-vintage' },
            { title: 'Halls', icon: 'mdi-car-seat ' },
            { title: 'Cinemas', icon: 'mdi-theater' },
            { title: 'Staff', icon: 'mdi-account-cog' },
            { title: 'Log Out', icon: 'mdi-exit-to-app' },
        ],
        componentPicker: [
            { title: 'Tickets', picked: true },
            { title: 'Performances', picked: false },
            { title: 'Movies', picked: false },
            { title: 'Halls', picked: false },
            { title: 'Cinemas', picked: false },
            { title: 'Staff', picked: false },
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
