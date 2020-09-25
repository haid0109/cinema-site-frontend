<template>
    <v-container fluid ma-0 pa-0 class="d-flex justify-center">
        <v-card dark class="ma-0 pa-0 mt-16 pa-10">
            <v-text-field
            v-model="phoneNum"
            label="Phone Number"
            :rules="[rules.required]"/>

            <v-select
            dark
            v-model="ticket"
            :items="tickets"
            item-text="text"
            item-value="_id"
            label="Choose Ticket"
            single-line
            :rules="[rules.required]"
            />

            <div class="mb-5">
                price: {{price}}
            </div>

            <v-btn @click="buyTicket">
                Done
            </v-btn>
        </v-card>
    </v-container>
</template>

<script>
export default {
    data: () => ({
        phoneNum: '',
        ticket: null,
        price: null,
        code: null,
        tickets: [],
        rules: {required: value => !!value || 'Required'}
    }),
    created: async function(){
        await this.retrieveTickets();
    },
    methods: {
        retrieveTickets: async function(){
            const filters = {
                cinemaId: sessionStorage.getItem('cinemaId'),
                movieId: this.$route.params.movieId,
                start: this.$route.params.start
            };

            await fetch(`http://localhost:2020/movie/tickets/${JSON.stringify(filters)}`)
            .then(async (resp) => {
                let tickets = await resp.json();
                for (let i = 0; i < tickets.length; i++) {
                    tickets[i].text = tickets[i].row + ', ' + tickets[i].seat;
                }
                for (let i = 0; i < tickets.length; i++) {
                    if(tickets[i].status == 'Reserved' || tickets[i].status == 'Sold'){
                        tickets.splice(i, 1);
                    }
                }
                this.tickets = tickets;
            })
            .catch((error) => {
                console.error('Error: ', error);
                alert('something went wrong, try again');
            });
        },
        buyTicket: function(){
            if(!this.phoneNum) return alert('you need to specify a phone number');
            if(!this.ticket) return alert('you need to specify a ticket');
            let body = {
                phoneNum: this.phoneNum,
                ticketId: this.ticket
            };

            fetch(`http://localhost:2020/buy`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })
            .then(async (resp) => {
                if(resp.status != 200) return alert('something went wrong, try again');
                this.$router.push('/bought/'+this.phoneNum+'/'+this.code);
            })
            .catch((error) => {
                console.error('Error: ', error);
                alert('something went wrong, try again');
            });
        }
    },
    watch: {
        ticket: function(){
            if(this.ticket){
                let ticketObj = this.tickets.find(ticket => ticket._id == this.ticket);
                this.price = ticketObj.price;
                this.code = ticketObj.code;
            }
        }
    }
}
</script>
