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
</style>
<template>
    <Content :style="{padding: '24px 0', minHeight: '280px', background: '#fff'}">
        <Row>
            <Col span="4">
            <Tree :data="data5" :render="renderContent"></Tree>
            </Col>
            <Col span="19">
            <Content :style="{padding: '26px 0 100px', minHeight: '280px', background: '#fff'}">
                <Row>
                    <Col span="22">
                    <h2 class="spaceTb">基础管理</h2></Col>
                    <Col span="2">
                    <Button type="success">删除</Button>
                    </Col>
                </Row>
                <Form class="spaceTb" :model="formLeft" label-position="left" :label-width="100">
                    <h4 :style="{paddingBottom:'10px'}">类型名称</h4>
                    <Input :style="{width:'800px',paddingBottom:'20px'}" placeholder="输入任务类型名称"
                           v-model="formLeft.input1"></Input>
                    <h4 :style="{paddingBottom:'10px'}">沟通确认阶段</h4>
                    <Row>
                        <Col span="22">
                        <h2 class="spaceTb">
                            <Steps :style="{width:'800px'}" :current="1">
                                <Step title="已完成" content="这里是该步骤的描述信息"></Step>
                                <Step title="进行中" content="这里是该步骤的描述信息"></Step>
                                <Step title="待进行" content="这里是该步骤的描述信息"></Step>
                                <Step title="待进行" content="这里是该步骤的描述信息"></Step>
                            </Steps>
                        </h2>
                        </Col>
                        <Col span="2">
                        <Icon :style="{fontSize:'36px',color:'#19be6b'}" type="plus-circled"></Icon>
                        </Col>
                    </Row>
                    <h2 :style="{padding:'20px 0 20px'}">任务主文件</h2>
                    <h4 :style="{paddingBottom:'10px'}">文件名称</h4>
                    <Input :style="{width:'800px',paddingBottom:'20px'}" placeholder="输入文件名称"
                           v-model="formLeft.input2"></Input>
                    <h4 :style="{paddingBottom:'10px'}">文件格式</h4>
                    <Select :style="{width:'800px',paddingBottom:'20px'}" v-model="formItem.select">
                        <Option value="FBX">FBX</Option>
                        <Option value="3DS">3DS</Option>
                        <Option value="OBJ">OBJ</Option>
                    </Select>
                    <h4 :style="{paddingBottom:'10px'}">文件属性</h4>
                    <Row>
                        <Col span="4">
                        <Select :style="{padding:'0 20px 20px 0'}" v-model="formItem1.select" placeholder="大小">
                            <Option value="8000">3D</Option>
                            <Option value="6000">原画</Option>
                            <Option value="6000">模型</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                        <Input :style="{padding:'0 20px 20px 0'}" v-model="formLeft.input3"
                               placeholder="8000*6000"></Input></Col>
                    </Row>
                    <Row>
                        <Col span="4">
                        <Select :style="{padding:'0 20px 20px 0'}" placeholder="跟坐标">
                            <Option value="beijing">面数</Option>
                            <Option value="shanghai">比较单位</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                        <Input :style="{padding:'0 20px 20px 0'}" placeholder="归零"
                               v-model="formLeft.input4"></Input></Col>
                    </Row>
                    <Row v-for="(item, index) in formDynamic.items" v-if="item.status"
                         :prop="'items.' + index + '.value'" :key="index"
                         :rules="{required: true, message: 'Item ' + item.index +' can not be empty', trigger: 'blur'}">
                        <Col span="4">
                        <Select :style="{padding:'0 20px 20px 0'}" v-model="item.value" placeholder="输入/选择属性名">
                            <Option value="8000">3D</Option>
                            <Option value="6000">原画</Option>
                            <Option value="8000">模型</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                        <Input :style="{padding:'0 20px 20px 0'}" type="text" placeholder="输入/选择属性值"
                               v-model="item.value"></Input>
                        </Col>
                        <Col span="2" offset="1">
                        <Button :style='{cursor:"pointer"}' type="error" @click="handleRemove(index)">移除</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="2">
                        <Button :style='{cursor:"pointer"}' type="dashed" long @click="handleAdd" icon="">
                            <Icon type="plus-round"></Icon>
                            增加
                        </Button>
                        </Col>
                    </Row>
                    <h2 :style="{padding:'40px 0 20px'}">任务附加文件</h2>
                    <template>
                        <Table style="margin-bottom: 20px" :columns="acces" :data="accesData"></Table>
                        <div v-for="(item, index) in acfileAdd.items" v-if="item.status"
                             :prop="'items.' + index + '.value'" :key="index"
                             :rules="{required: true, message: 'Item ' + item.index +' can not be empty', trigger: 'blur'}">
                            <Form class="spaceTb" :model="formLeft" label-position="left" :label-width="100">
                                <Row>
                                    <Col span="4">
                                    <Input :style="{paddingBottom:'20px',paddingRight:'40px'}" placeholder="输入任务类型名称"
                                           v-model="formLeft.input6"></Input></Col>
                                    <Col span="4">
                                    <Select :style="{paddingBottom:'20px',paddingRight:'60px'}"
                                            v-model="formItem.select" placeholder="跟坐标">
                                        <Option value="beijing">面数</Option>
                                        <Option value="shanghai">比较单位</Option>
                                    </Select>
                                    </Col>
                                    <Col span="12">
                                    <Row v-for="(item, index) in accefile.items" v-if="item.status"
                                         :prop="'items.' + index + '.value'" :key="index"
                                         :rules="{required: true, message: 'Item ' + item.index +' can not be empty', trigger: 'blur'}">
                                        <Col span="8">
                                        <Select :style="{paddingBottom:'20px'}" v-model="item.value"
                                                placeholder="输入/选择属性名">
                                            <Option value="8000">3D</Option>
                                            <Option value="6000">原画</Option>
                                            <Option value="8000">模型</Option>
                                        </Select>
                                        </Col>
                                        <Col span="12">
                                        <Input :style="{paddingBottom:'20px'}" type="text" placeholder="输入/选择属性值"
                                               v-model="item.value"></Input>
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
    </Content>
    <!-- <Footer class="layout-footer-center">2011-2016 &copy; TalkingData</Footer> -->
</template>
<script>
    import {typeInfo} from '../../config/env.js';
    import Icon from "iview/src/components/icon/icon";
    import Caspanel from "iview/src/components/cascader/caspanel";
    export default {
        components: {
            Caspanel,
            Icon,
        },
        data() {
            return {
                data5: [
                    {
                        title: '任务类型库管理',
                        expand: true,
                        render: (h, {root, node, data}) => {
                            return h('span', {
                                style: {
                                    display: 'inline-block',
                                    width: '100%'
                                }
                            }, [
                                h('span', [
                                    h('Icon', {
                                        props: {
                                            type: 'ios-folder-outline'
                                        },
                                        style: {
                                            marginRight: '8px'
                                        }
                                    }),
                                    h('span', data.title)
                                ]),
                                h('span', {
                                    style: {
                                        display: 'inline-block',
                                        float: 'right',
                                        marginRight: '32px'
                                    }
                                }, [
                                    h('Button', {
                                        props: Object.assign({}, this.buttonProps, {
                                            icon: 'ios-plus-empty',
                                            type: 'primary'
                                        }),
                                        style: {
                                            width: '52px'
                                        },
                                        on: {
                                            click: () => {
                                                this.append(data)
                                            }
                                        }
                                    })
                                ])
                            ]);
                        },
                        children: [
                            {
                                title: '系统默认(12)',
                                expand: true,
                                children: [
                                    {
                                        title: '特效',
                                        expand: true,
                                    },
                                    {
                                        title: '3D角色',
                                        expand: true,
                                    },
                                    {
                                        title: '地编',
                                        expand: true,
                                    },
                                    {
                                        title: '动作',
                                        expand: true,
                                    },
                                ]
                            },
                        ]
                    }
                ],
                buttonProps: {
                    type: 'ghost',
                    size: 'small',
                },
                formLeft: {
                    input1: '',
                    input2: '',
                    input3: '',
                    input4: '',
                    input5: '',
                },
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
                formItem1: {
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
                        render: function (h) {
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
        methods: {
            renderContent(h, {root, node, data}) {
                return h('span', {
                    style: {
                        display: 'inline-block',
                        width: '100%'
                    }
                }, [
                    h('span', [
                        h('Icon', {
                            props: {
                                type: 'ios-paper-outline'
                            },
                            style: {
                                marginRight: '8px'
                            }
                        }),
                        h('span', data.title)
                    ]),
                    h('span', {
                        style: {
                            display: 'inline-block',
                            float: 'right',
                            marginRight: '32px'
                        }
                    }, [
                        h('Button', {
                            props: Object.assign({}, this.buttonProps, {
                                icon: 'ios-plus-empty'
                            }),
                            style: {
                                marginRight: '8px'
                            },
                            on: {
                                click: () => {
                                    this.append(data)
                                }
                            }
                        }),
                        h('Button', {
                            props: Object.assign({}, this.buttonProps, {
                                icon: 'ios-minus-empty'
                            }),
                            on: {
                                click: () => {
                                    this.remove(root, node, data)
                                }
                            }
                        })
                    ])
                ]);
            },
            append(data) {
                const children = data.children || [];
                children.push({
                    title: 'appended node',
                    expand: true
                });
                this.$set(data, 'children', children);
            },
            remove(root, node, data) {
                const parentKey = root.find(el => el === node).parent;
                const parent = root.find(el => el.nodeKey === parentKey).node;
                const index = parent.children.indexOf(data);
                parent.children.splice(index, 1);
            },

            // handleSubmit (name) {
            //     this.$refs[name].validate((valid) => {
            //         if (valid) {
            //             this.$Message.success('Success!');
            //         } else {
            //             this.$Message.error('Fail!');
            //         }
            //     })
            // },
            // handleReset (name) {
            //     this.$refs[name].resetFields();
            // },
            handleAdd() {
                this.index++;
                this.formDynamic.items.push({
                    value: '',
                    index: this.index,
                    status: 1
                });
            },
            handleRemove(index) {
                this.formDynamic.items[index].status = 0;
            },
            acceAdd() {
                this.index++;
                this.accefile.items.push({
                    value: '',
                    index: this.index,
                    status: 1
                });
            },
            acceRemove(index) {
                this.accefile.items[index].status = 0;
            },
            accefileAdd() {
                this.index++;
                this.acfileAdd.items.push({
                    value: '',
                    index: this.index,
                    status: 1
                });
            },
            accefileRemove(index) {
                this.acfileAdd.items[index].status = 0;
            },
            forEach() {
                this.get(typeInfo,
                    {
                        id:1
                    },
                    (res) => {

                    }
                );
            }
        }
    }
</script>
