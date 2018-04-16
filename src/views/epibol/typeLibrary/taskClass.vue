<style>
.layout-logo {
    width: 100px;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 15px;
    left: 20px;
}

.layout-nav {
    /*width: 500px;*/
    margin: 0 auto;
    margin-right: 20px;
}

.stem-logo img {
    max-width: 8rem;
}

.stem-l {
    margin-left: 10rem;
}

.spaceTb {
    padding: 21px 21px;
}

.restdele {
    position: relative;
    color: red;
    top: 10px;
    left: 12px;
    z-index: 999999;
    font-size: 14px;
    cursor: pointer;
}

.show {
    display: block;
}

.hide {
    display: none;
}
</style>
<template>
    <Content :style="{padding: '24px 0', minHeight: '280px', background: '#fff'}">
        <Row>
            <Col span="4">
            <type-list :listData="formLeft" @getListId="change"></type-list>
            </Col>
            <Col span="19">
            <Content :style="{padding: '26px 0 100px', minHeight: '280px', background: '#fff'}">
                <Row>
                    <Col span="22">
                    <h2 class="spaceTb">基础管理</h2>
                    </Col>
                </Row>
                <Form class="spaceTb" :model="formLeft" label-position="left" :label-width="100">
                    <h4 :style="{paddingBottom:'10px'}">类型名称</h4>
                    <Input :style="{width:'800px',paddingBottom:'20px'}" placeholder="输入任务类型名称" v-model="formLeft.tasktype_name"></Input>
                    <h4 :style="{paddingBottom:'10px'}">沟通确认阶段</h4>
                    <Row>
                        <Col span="22">
                        <h2 class="spaceTb">
                            <div @mouseover="overShow" @mouseout="outHide">
                                <Steps :style="{width:'800px'}" :current="1" size="small">
                                    <span :class="{show:showText,hide:hideText}" class="restdele">x</span>
                                    <Step title="已完成" content="这里是该步骤的描述信息" v-for="step in stepCount" :key="step" :name="step">
                                    </Step>
                                </Steps>
                            </div>
                        </h2>
                        </Col>
                        <Col span="2">
                        <div @click="addSteps">
                            <Icon :style="{fontSize:'36px',color:'#39f'}" type="plus-circled"></Icon>
                        </div>
                        </Col>
                    </Row>
                    <h2 :style="{padding:'20px 0 20px'}">任务主文件</h2>
                    <h4 :style="{paddingBottom:'10px'}">文件名称</h4>
                    <Input :style="{width:'800px',paddingBottom:'20px'}" placeholder="输入文件名称" v-model="fileData.file_name"></Input>
                    <h4 :style="{paddingBottom:'10px'}">文件格式</h4>
                    <Select :style="{width:'800px',paddingBottom:'20px'}" @on-change="getSelectId">
                        <Option v-for="(item,index) in formLeft.file" :value="index" :key="index">{{ item.file_name }}</Option>
                    </Select>
                    <h4 :style="{paddingBottom:'10px'}">文件属性</h4>
                    <Row>
                        <Col span="4">
                        <Select :style="{padding:'0 20px 20px 0'}" v-model="reqArrt.value">
                            <Option v-for="(item,index) in reqeData.require" :value="item.value" :key="index">{{item.config_name}}</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                        <Input :style="{padding:'0 20px 20px 0'}" v-model="reqArrt.value"></Input>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="4">
                        <Select :style="{padding:'0 20px 20px 0'}" v-model="arrtCoor.value" placeholder="跟坐标">
                            <Option v-for="(item,index) in reqeData.require" :value="item.value" :key="index">{{item.config_name}}</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                        <Input :style="{padding:'0 20px 20px 0'}" placeholder="归零" v-model="arrtCoor.value"></Input>
                        </Col>
                    </Row>
                    <Row v-for="(item, index) in formDynamic.items" v-if="item.status" :prop="'items.' + index + '.value'" :key="index" :rules="{required: true, message: 'Item ' + item.index +' can not be empty', trigger: 'blur'}">
                        <Col span="4">
                        <Select :style="{padding:'0 20px 20px 0'}" v-model="arrtnature.value" placeholder="输入/选择属性名">
                            <Option v-for="(item,size) in reqeData.require" :value="item.value" :key="size">{{item.config_name}}</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                        <Input :style="{padding:'0 20px 20px 0'}" type="text" placeholder="输入/选择属性值" v-model="arrtnature.value"></Input>
                        </Col>
                        <Col span="2" offset="1">
                        <Button :style='{cursor:"pointer"}' type="error" @click="removeFileat(index)">移除</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="2">
                        <Button :style='{cursor:"pointer"}' type="dashed" long @click="addFileat" icon="">
                            <Icon type="plus-round"></Icon>
                            增加
                        </Button>
                        </Col>
                    </Row>
                    <h2 :style="{padding:'40px 0 20px'}">任务附加文件</h2>
                    <template>
                        <Table style="margin-bottom: 20px" :columns="acces" :data="accesData"></Table>
                        <div v-for="(item, index) in acfileAdd.items" v-if="item.status" :prop="'items.' + index + '.value'" :key="index" :rules="{required: true, message: 'Item ' + item.index +' can not be empty', trigger: 'blur'}">
                            <Form class="spaceTb" :model="formLeft" label-position="left" :label-width="100">
                                <Row>
                                    <Col span="4">
                                    <Input :style="{paddingBottom:'20px',paddingRight:'40px'}" placeholder="输入任务类型名称" v-model="formLeft.input6"></Input>
                                    </Col>
                                    <Col span="4">
                                    <Select :style="{paddingBottom:'20px',paddingRight:'60px'}" v-model="formItem.select" placeholder="跟坐标">
                                        <Option value="beijing">面数</Option>
                                        <Option value="shanghai">比较单位</Option>
                                    </Select>
                                    </Col>
                                    <Col span="12">
                                    <Row v-for="(item, index) in accefile.items" v-if="item.status" :prop="'items.' + index + '.value'" :key="index" :rules="{required: true, message: 'Item ' + item.index +' can not be empty', trigger: 'blur'}">
                                        <Col span="8">
                                        <Select :style="{paddingBottom:'20px'}" v-model="item.value" placeholder="输入/选择属性名">
                                            <Option value="8000">3D</Option>
                                            <Option value="6000">原画</Option>
                                            <Option value="8000">模型</Option>
                                        </Select>
                                        </Col>
                                        <Col span="12">
                                        <Input :style="{paddingBottom:'20px'}" type="text" placeholder="输入/选择属性值" v-model="item.value"></Input>
                                        </Col>
                                        <Col span="2" offset="1">
                                        <Button :style='{cursor:"pointer"}' type="error" @click="acceRemove(index)">移除
                                        </Button>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span="4">
                                        <Button :style='{cursor:"pointer"}' type="dashed" long @click="acceAdd" icon="">
                                            <Icon type="plus-round"></Icon>
                                            增加
                                        </Button>
                                        </Col>
                                    </Row>
                                    </Col>
                                    <Col span="2" offset="1">
                                    <Button :style='{cursor:"pointer"}' type="warning" @click="accefileRemove(index)">
                                        移除附件文件
                                    </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                        <Row>
                            <Col span="2">
                            <Button :style='{cursor:"pointer"}' type="dashed" long @click="accefileAdd" icon="">
                                <Icon type="plus-round"></Icon>
                                增加附件文件
                            </Button>
                            </Col>
                        </Row>
                    </template>
                </Form>
            </Content>
            </Col>
        </Row>
        <Row>
            <Col span="7">
            <Button type="primary" style="float: right;width: 200px">提交</Button>
            </Col>
        </Row>
    </Content>
    <!-- <Footer class="layout-footer-center">2011-2016 &copy; TalkingData</Footer> -->
</template>
<script>
import { typeInfo, cateList } from '../../../config/env.js';
import Icon from "iview/src/components/icon/icon";
import Caspanel from "iview/src/components/cascader/caspanel";
import typeList from "./typeList";

export default {
    components: {
        typeList,
        Caspanel,
        Icon,
    },
    data() {
        return {
            reqeData: {},
            reqarn: {},
            arrtCoor: {},
            arrtnature: {},
            reqArrt: {},
            showText: false,
            hideText: true,
            stepCount: [0],
            formLeft: {},
            fileData: {},
            formItem: {
                input: '',
                select: '',
                radio: 'male',
                checkbox: [],
                switch: true,
                date: '',
                time: '',
                slider: [20, 50],
                textarea: ''
            },
            index: 1,
            formDynamic: {
                items: [
                    {
                        value: '',
                        index: 1,
                        status: 1
                    }
                ]
            },
            accefile: {
                items: [
                    {
                        value: '',
                        index: 1,
                        status: 1
                    }
                ]
            },
            acfileAdd: {
                items: [
                    {
                        value: '',
                        index: 1,
                        status: 1
                    }
                ]
            },
            acces: [
                {
                    title: '文件名称',
                    key: 'fileName'
                },
                {
                    title: '文件格式',
                    key: 'fileFormat'
                },
                {
                    title: '文件属性',
                    key: 'fileAttribute',
                    render: function(h) {
                        return ([
                            h('Tag', {
                                props: {
                                    type: 'border'
                                },
                            }, '大小：8000*2000'),
                            h('Tag', {
                                props: {
                                    type: 'border'
                                },
                            }, '分辨率：72pdi'),
                            h('Tag', {
                                props: {
                                    type: 'border'
                                },
                            }, '坐标：归零')
                        ]);
                    }
                }
            ],
            fileformat: [],
            accesData: [
                {
                    fileName: '正面图',
                    fileFormat: '.max',
                    fileAttribute: '大小：8000*2000',
                },
                {
                    fileName: '侧面图',
                    fileFormat: '.psd',
                    fileAttribute: '大小：8000*2000',
                },
                {
                    fileName: '背面图',
                    fileFormat: '.jpg',
                    fileAttribute: '大小：8000*2000',
                }
            ]
        }
    },
    mounted() {
        this.ListEachId();
    },
    methods: {
        overShow() {
            this.showText = !this.showText
            this.hideText = !this.hideText
        },
        outHide() {
            this.showText = !this.showText
            this.hideText = !this.hideText
        },
        addSteps() {
            let aSp = this;
            if (aSp.stepCount.length >= 6) {
                // aSp.stepCount.push(aSp.stepCount[aSp.stepCount.length - 1] + 1);
                this.$Message.error('最多只能添加6个阶段');
                return;
            } else {
                aSp.stepCount.push(0);
            }
        },

        /**
         *文件列表分类
         */

        //添加文件类

        //移除文件类
        /**
         * 文件属性模块操作
         */
        //增加
        addFileat() {
            this.index++;
            this.formDynamic.items.push({
                value: '',
                index: this.index,
                status: 1
            });
        },
        //移除
        removeFileat(index) {
            this.formDynamic.items[index].status = 0;
        },
        /**
         * 任务附加模块操作
         */
        //移除
        acceRemove(index) {
            this.accefile.items[index].status = 0;
        },
        //增加
        acceAdd() {
            this.index++;
            this.accefile.items.push({
                value: '',
                index: this.index,
                status: 1
            });
        },
        //增加附件文件
        accefileAdd() {
            this.index++;
            this.acfileAdd.items.push({
                value: '',
                index: this.index,
                status: 1
            });
        },
        //移除附件文件
        accefileRemove(index) {
            this.acfileAdd.items[index].status = 0;
        },
        /**
         * get请求
         */
        get(url, params, call) {
            /*获取列表信息*/
            this.$http.get(url, { params: params }).then(function(res) {
                call(res);
            }, function(error) {
                this.$Message.error('数据加载出错了！请刷新浏览器');
            });
        },

        ListEachId() {
            let fiC = this;
            this.get(cateList,
                {
                    company_id: 1
                },
                (res) => {
                    let listId = res.data.data;
                    // listId.forEach((Id) => {
                    // });
                }
            );
        },
        //遍历列表数据
        forEach() {
            let fiC = this;
            this.get(typeInfo,
                {
                    id: fiC.listId
                },
                (res) => {
                    fiC.formLeft = res.data;
                    let getformData = fiC.formLeft.file;
                    getformData.forEach((file, index) => {
                        fiC.fileData = file
                    });
                }
            );
        },
        //获取id
        change(id) {
            this.listId = id;
            this.forEach();
        },
        //或者select文件格式选择后id
        getSelectId(r) {
            let requ = this.formLeft.file[r];//文件类型数据
            if (requ) {
                this.reqeData = requ;
            }
        },
        //文件属性的value
        getselecArrt() {
            this.reqArrt = this.reqeData.require[0];
            this.arrtCoor = this.reqeData.require[1];
            this.arrtnature = this.reqeData.require[2];
        },

    }
}
</script>
