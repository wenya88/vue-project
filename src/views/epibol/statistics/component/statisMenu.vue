<template>
    <div class="ivu-div">
        <Menu :open-names="[1]" width="auto" @on-select="selectMenu" :active-name="activeName" ref="side_menu">
            <Submenu :name="(index+1)" v-for="(item,index) in menuData" :key="index">
                <template slot="title">
                    <i :class="`iconfont ${item.icon}`"></i>
                    {{item.title}}
                </template>
                <MenuGroup>
                    <MenuItem :name="kitem.title" v-for="(kitem,Kindex) in item.Titem" :key="Kindex" style="padding-left:70px">{{kitem.title}}</MenuItem>
                </MenuGroup>
            </Submenu>
        </Menu>
     </div>
</template>
<script>
export default {
    data(){
        return{
            menuData:[],
            activeName:''
        }
    },
    mounted(){
        this.getMenuData();
    },
    methods:{
        // changeMenu
        selectMenu(name){
            console.log(name)
        },
        // MenuData
        getMenuData(){
            let _this=this;
            let url=_this.GLOBAL.baseRouter+'task/count/catalog-list';
            _this.$axios.get(url).then(msg=>{
                delete msg.data.err_code;
                delete msg.data.err_message
                for(let i in msg.data){
                   _this.menuData.push(msg.data[i])
                }
                _this.$nextTick(() => {
                    _this.$refs.side_menu.updateOpened()
                    _this.$refs.side_menu.updateActiveName();
                    _this.activeName=_this.menuData[0].Titem[0].title;
                })
            })
        }

    }
}
</script>
