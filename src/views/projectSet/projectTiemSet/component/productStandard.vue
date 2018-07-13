<template>
    <div class="projectSpeContainer">
        <!--tab头部-->
        <section class="tabHead">
            <ul class="typeTabsContainer">
                <li class="typeTab" v-for="(item,index) in typeTabs" @click="tabsHandle(index)"
                    :class="{'tabGreen':index === tabsColor}" :key="index">{{item.name}}
                </li>
            </ul>
            <div class="addType">
                <div class="addButton">
                    <Dropdown trigger="click" style="margin-left: 20px">
                        <a href="javascript:void(0)">
                            <Icon type="plus-round"></Icon>
                            <span>添加规范</span>
                        </a>
                        <DropdownMenu style="padding: 10px;" slot="list">
                            <div class="header">
                                <p>系统默认(12)</p>
                                <p>系统默认(12)</p>
                                <p>系统默认(12)</p>
                            </div>
                            <dl v-for="(item,index) in typeList" :key="index">
                                <dt>{{item.name}}</dt>
                                <ul class="typsList">
                                    <li class="typs" v-for="(children,index) in item.children">{{children}}</li>
                                </ul>
                            </dl>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </div>
        </section>
        <!--规范表单-->
        <standard-info>
            <div slot="item">
                <h4 :style="{paddingBottom:'10px'}">内容规范</h4>
                <Row v-for="(item,index) in attrContent" :key="item.config" class="fileAttr">
                    <Col span="5">
                    <AutoComplete v-model="item.config_name" placeholder="额外属性名称" clearable>
                        <!-- <Option v-for="item in reqData" :value="item.config_name" :key="item.conf">{{ item.config_name }}</Option> -->
                    </AutoComplete>
                    </Col>
                    <Col span="10">
                    <AutoComplete v-model="item.value" placeholder="额外属性说明" clearable style="margin-left:20px">
                        <!-- <Option v-for="item in reqData" :value="item.value" :key="item.conf">{{ item.value }}</Option> -->
                    </AutoComplete>
                    </Col>
                    <Icon @click.native="removeContentat(index)" type="trash-b" class="delIcon"></Icon>
                </Row>
                <template v-if="content.show" :style='{margin:"10px 0"}'>
                    <Col span="5">
                    <AutoComplete v-model="content.name" placeholder="额外属性名称" clearable>
                        <!-- <Option v-for="item in reqData" :value="item.config_name" :key="item.conf">{{ item.config_name }}</Option> -->
                    </AutoComplete>
                    </Col>
                    <Col span="10">
                    <AutoComplete v-model="content.main" placeholder="额外属性说明" clearable style="margin-left:20px">
                        <!-- <Option v-for="item in reqData" :value="item.value" :key="item.conf">{{ item.value }}</Option> -->
                    </AutoComplete>
                    </Col>
                    <Button type="text" @click="addContentat()">确认</Button>
                    <Button type="text" @click="closeContentat()">取消</Button>
                </template>

                <Button v-if="!content.show" icon="plus-round" type="dashed" long @click="contentListAdd"
                        style="width:718px">
                    增加制作规范
                </Button>
            </div>
        </standard-info>
    </div>
</template>

<script>
    import standardInfo from '@/views/epibol/typeLibrary/standardInfo.vue'

    export default {
        created() {
        },
        mounted() {
        },
        data() {
            return {
                typeList: [
                    {
                        name: '3D模型', children: ['3d', '2d', '场景']
                    },
                    {
                        name: '2D模型', children: ['任务', '地编', '绘画']
                    }
                ],
                typeMenu: false,
                tabsColor: 0,
                typeTabs: [
                    {name: '原画', id: 1},
                    {name: '科技', id: 2},
                    {name: '地编', id: 3},
                    {name: '场景', id: 4},
                ],
                content: {
                    show: false,
                    name: '',
                    main: '',
                },
                attrContent: [{config_name: "", value: ""}],
            }
        },
        methods: {
            /*内容规范的增删修改*/
            addContentat() {
            },
            closeContentat() {
            },
            contentListAdd() {
            },
            removeContentat() {
            },
            /*tab的切换*/
            tabsHandle(index) {
                this.tabsColor = index;
            },
            handleOpen() {
                this.visible = true;
            },
            handleClose() {
                this.visible = false;
            }
        },
        computed: {},
        components: {
            standardInfo
        }
    }
</script>

<style lang="less" scoped>
    @green: #31bb9f;
    .projectSpeContainer {
        .tabHead {
            display: flex;
            .typeTabsContainer {
                display: flex;
                padding: 21px 0 0 21px;
                background: #fff;
                .typeTab {
                    padding: 10px;
                    font-size: 16px;
                    border-bottom: 1px solid @green;
                }
                .tabGreen {
                    border: 1px solid @green !important;
                    border-bottom: none !important;
                }
            }
            .addType {
                position: relative;
                flex: 1;
                border-bottom: 1px solid @green;
                background: #fff;
                .addButton {
                    position: absolute;
                    top: 18px;
                    right: 30px;
                }
                a {
                    color: @green;
                }
                .header {
                    display: flex;
                    margin-bottom: 25px;
                    font-size: 16px;
                    color: #6b6b6b;
                    p {
                        min-width: 100px;
                        word-break: keep-all;
                        white-space: nowrap;
                        margin: 0 6px;
                    }
                }
                dt {
                    height: 30px;
                    padding-left: 20px;
                    line-height: 30px;
                    font-size: 14px;
                    color: black;
                    font-weight: 600;
                    background: #e4e4e4;
                }
                .typsList {
                    display: flex;
                    padding-left: 20px;
                    margin: 14px 0 25px 0;
                    font-size: 14px;
                    .typs {
                        flex: 1;
                        color: #6b6b6b;
                    }
                }

            }
        }
    }
</style>
