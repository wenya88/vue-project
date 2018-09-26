<template>
    <div class="subtasksList">
        <section v-for="(items,index) in taskList"  @click="editWindow(items)" :key="index" class="taskList">

            <p class="pause"  >{{items.status|status}}</p>
            <p class="sign" :class="'sign'+items.status"></p>

            <p class="taskListTitle">{{items.name}}</p>
            <div class="info">
                <span>{{items.expect_work_day}}个工作日</span><span><img class="headImg" src=""
                                                                     alt=""><span
                    style="margin-left: 10px;">{{items.remark_name}}</span></span>
            </div>
        </section>
    </div>
</template>

<script>
    import api from 'api';
    import {mapState} from 'vuex'

    export default {
        created() {
        },
        mounted() {
            if(this.infoId){
                this.listInit()
            }
        },
        data() {
            return {
                taskList: []
            }
        },
        methods: {
            async listInit() {
                const {data} = await api.taskTaskList({father: this.infoId.id});
                if (data.err_code === 0 && data.data) {
                    this.taskList = [...data.data];
                }
            },
            timeType(time) {
                return time.split(' ')[0].split('-')[1] + '/' + time.split(' ')[0].split('-')[2]
            },
            editWindow(items){
                this.$emit('editWindow',items)
            }
        },
        filters:{
            status(value){
                if(value === '1'){
                    return '未开始'
                }else if(value === '2'){
                    return '制作中'
                }else if(value === '3'){
                    return '暂停中'
                }else if(value === '4'){
                    return '已完成'
                }
            }
        },
        computed: {
            ...mapState({
                infoId(value){
                    return value.project.detail.setDetailAll
                }
            })
        },
        watch:{
            infoId(value){
                if(value){
                    this.listInit();
                }
            }
        },
        components: {}
    }
</script>

<style lang="less">

    .subtasksList {
        .taskList {
            position: relative;
            padding: 15px;
            color: #fff;
            background: #3bceb6;
            border: 1px solid #ccc;
            border-radius: 4px;
            margin: 10px 0;
            cursor: pointer;
            .pause {
                position: absolute;
                top: 7px;
                right: -3px;
                z-index: 3;
                color: #fff;
                transform: rotate(41deg);
            }
            .sign1{
                border-right: 60px solid #fcc44a !important;
            }
            .sign2{
                border-right: 60px solid #7cbefc !important;
            }
            .sign4{
                border-right: 60px solid #78c97c !important;
            }
            .sign {
                position: absolute;
                top: 20px;
                right: 0px;
                width: 0;
                height: 0;
                margin-top: -20px;
                border-top:  none;
                border-right: 60px solid #ff7970;
                border-bottom: 50px solid transparent;
                border-left: 50px solid transparent;
                z-index: 2;
            }
            .taskListTitle {
                font-size: 16px;
                font-weight: bold;
            }
            .info {
                display: flex;
                margin-top: 8px;
                justify-content: space-between;
                align-items: center;
                .headImg {
                    width: 26px;
                    height: 26px;
                    border-radius: 50%;
                    vertical-align: middle;
                }
            }


        }

    }
</style>
