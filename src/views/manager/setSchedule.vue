<template>
    <div>
        <main-native>
            <div class="main-header-style iconfont"><span class="main-header-title"><i></i>{{this.$route.meta.title}}</span></div>
        </main-native>

    </div>
</template>

<script>
    import mainNative from '../main-components/mainNative.vue'
    export default {
        created() {
        },
        mounted() {
        },
        data() {
            return {}
        },
        methods: {},
        computed: {},
        components: {
            mainNative
        }
    }
</script>

<style lang="less" scoped>
    .app {
        text-align: center;
        margin-top: 30%;
    }
</style>
