<template>
    <div class="newContractData autoHeight">
        {{contractCostData}}
    </div>
</template>
<script>
export default {
    data(){
        return{

        }
    },
    props:{
        contractCostData:{
            type:Array
        }
    },
    mounted(){
        this.autoHeight();
    },
    methods:{
        // autoH
        autoHeight(){
            $(".newContractData .autoHeight").height($(window).height()-212);
            $(".contractSchedle").height($(window).height()-280);
        },
    }
}
</script>
<style scoped>

</style>
