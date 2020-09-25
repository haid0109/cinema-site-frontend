<template>
    <v-container fluid ma-0 pa-0 class="d-flex justify-center">
        <v-card dark class="ma-0 pa-0 mt-16 pa-10">
            <div>
                give your phone number and code when checking in
            </div>
            <div>
                phone number: {{phoneNum}}
                code: {{code}}
            </div>
        </v-card>
    </v-container>
</template>

<script>
export default {
    data: () => ({
        phoneNum: '',
        code: ''
    }),
    created: async function(){
        this.phoneNum = this.$route.params.phoneNum;
        this.code = this.$route.params.code
    },
}
</script>
