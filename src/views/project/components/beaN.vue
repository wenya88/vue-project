<template>
    <div>
        <Row>
            <Col span="7">
            <Form label-position="left" :label-width="80">
                <FormItem label="任务名称">
                    <Input v-model="datl.name"></Input>
                    <!--@on-blur="blurTj()"-->
                </FormItem>
                <FormItem label="任务时间">
                    <DatePicker :value="datl.end_date" format="yyyy年MM月dd日" type="date" :options="disableTime"
                                placeholder="选择时间" style="width: 100%"></DatePicker>
                    <!--@on-blur="blurTj()"-->
                </FormItem>
                <FormItem label="子项目">
                    <Select v-model="model1">
                        <Option v-for="item in cityList" :value="item.end_date"
                                :key="item.end_date"></Option>
                    </Select>
                </FormItem>
                <FormItem label="参与人">
                    <Tag v-for="item in fruit" :key="item" :name="item" closable
                         @on-close="handleClose2" type="border">{{item}}
                    </Tag>
                    <Dropdown trigger="click" class="dropBig">
                        <a href="javascript:void(0)">
                            <Button icon="ios-plus-empty" type="dashed" size="small">
                                添加
                            </Button>
                        </a>
                        <DropdownMenu slot="list">
                            <Input v-model="value1" placeholder="参与人姓名/名字首字母" clearable
                                   style="width: 100%"></Input>
                            <Row :gutter="16">
                                <Col span="10" class="demo-tabs-style2 memberList">
                                <ul class="meberli">
                                    <li
                                            v-for="(item,index) in tabs"
                                            :class="{active:index == num}"
                                            @click="memberList(index)">{{item}}
                                    </li>
                                </ul>
                                </Col>
                                <Col span="12" align="center" class="scrollBorder">
                                <Scroll :on-reach-bottom="handleReachBottom">
                                    <div class="tabCon">
                                        <div
                                                v-for='(itemCon,index) in tabContents'
                                                v-show="index == num">
                                            <Card dis-hover>
                                                <CheckboxGroup v-model="fruit">
                                                    <Checkbox :label="i"
                                                              v-for='(i,d) in itemCon'></Checkbox>
                                                </CheckboxGroup>
                                            </Card>
                                        </div>
                                    </div>
                                </Scroll>
                                </Col>
                            </Row>
                        </DropdownMenu>
                    </Dropdown>
                </FormItem>
                <FormItem label="任务类型">
                    <Select v-model="model2">
                        <Option v-for="item in cityList1" :value="item.value"
                                :key="item.value"></Option>
                    </Select>
                </FormItem>
                <FormItem label="文件要求">
                    <div>
                        <Card :bordered="true" style="text-align: center">
                            <Row :gutter="16">
                                <Col span="8">
                                <div class="car-bg">模型</div>
                                </Col>
                                <Col span="8">
                                <div>PSD</div>
                                </Col>
                                <Col span="8">
                                <div>贴图</div>
                                </Col>
                            </Row>
                            <Tag>大小：8000*200</Tag>
                            <Tag>分辨率：72PDI</Tag>
                            <Tag>坐标：默认归零</Tag>
                            <Tag>贴面：2000</Tag>
                        </Card>
                    </div>
                </FormItem>
                <h2 style="color: #39f;margin-bottom: 20px">
                    <Icon type="grid"></Icon>
                    任务要求
                </h2>
                <FormItem label="参考图片">
                    <div class="demo-upload-list" v-for="item in uploadList">
                        <template v-if="item.status === 'finished'">
                            <img :src="item.url">
                            <div class="demo-upload-list-cover">
                                <!--<Icon type="ios-eye-outline"-->
                                <!--@click.native="handleView(item.name)"></Icon>-->
                                <Icon type="ios-trash-outline"
                                      @click.native="handleRemove(item)"></Icon>
                            </div>
                        </template>
                        <template v-else>
                            <Progress v-if="item.showProgress" :percent="item.percentage"
                                      hide-info></Progress>
                        </template>
                    </div>
                    <Upload
                            ref="upload"
                            :show-upload-list="false"
                            :default-file-list="defaultList"
                            :on-success="handleSuccess"
                            :format="['jpg','jpeg','png']"
                            :max-size="2048"
                            :on-format-error="handleFormatError"
                            :on-exceeded-size="handleMaxSize"
                            :before-upload="handleBeforeUpload"
                            multiple
                            type="drag"
                            action="//jsonplaceholder.typicode.com/posts/"
                            style="display: inline-block;width:80px;">
                        <div style="width: 80px;height:58px;line-height: 28px;">
                            <Icon type="camera" size="20"></Icon>
                            <p>可拖拽上传</p>
                        </div>
                    </Upload>
                </FormItem>
                <FormItem label="参考附件">
                    <Upload
                            :format="['jpg','jpeg','png']"
                            multiple
                            action="//jsonplaceholder.typicode.com/posts/">
                        <Button type="ghost" icon="ios-cloud-upload-outline">上传
                        </Button>
                    </Upload>
                </FormItem>
                <FormItem label="要求说明">
                    <Input v-model="formLeft.head" type="textarea"
                           :autosize="{minRows: 2,maxRows: 5}" placeholder="补充说明"></Input>
                    <!--@on-blur="blurTj()"-->
                </FormItem>
            </Form>
            </Col>
            <Col span="16">
            <div class="area_model" align="center">
                模型
            </div>
            </Col>
        </Row>
    </div>
</template>

<script>
    import UploadList from "iview/src/components/upload/upload-list";
    // import {updatetaskData} from "../../../../config/env.js";
    export default {
        props:['datl','handleRender'],
        components: {
            UploadList,
        },
        data() {
            return {
                disableTime: {
                    disabledDate(date) {
                        return date && date.valueOf() < Date.now() - 86400000;
                    }
                },
                subtaskCum: [
                    {
                        title: '子任务名称',
                        key: 'subtaskName',
                        align: 'center',
                    },
                    {
                        title: '进度',
                        key: 'schedule',
                        align: 'center',
                    },
                    {
                        title: '操作',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params.index)
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                subtaskData: [
                    {
                        subtaskName: '暂无名称',
                        schedule: '暂无进度',
                    },
                ],
                tabs: [
                    "全部成员(33)",
                    "3D模型(11)",
                    "地编组(11)",
                    "次世代(11)"
                ],
                tabContents: [
                    ['李霄霄', '王二帅', '王二帅', '王二帅', '王二帅', '王二帅', '王二帅', '王二帅', '王二帅', '王二帅', '王二帅', '王二帅', '王二帅', '王二帅', '王二帅', '王二帅', '王二帅', '王二帅'],
                    ['赵三娃', '陈无敌'],
                    ['哈哈', '嘻嘻洗洗'],
                    ['哇娃娃', '呜呜呜呜',]
                ],
                num: 1,
                value1: '',
                fruit: [],
                //上传图片
                defaultList: [
                    {
                        'name': 'a42bdcc1178e62b4694c830f028db5c0',
                        'url': 'https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar'
                    },
                    {
                        'name': 'bc7521e033abdd1e92222d733590f104',
                        'url': 'https://o5wwk8baw.qnssl.com/bc7521e033abdd1e92222d733590f104/avatar'
                    }
                ],
                imgName: '',
                visible: false,
                uploadList: [],
                //下拉列表
                cityList: [
                    {
                        end_date:''
                    },
                ],
                model1: '',
                cityList1: [
                    {
                        value: '原画组',
                    },
                ],
                model2: '',
                formLeft:{
                    name:'',
                    end_date:'',
                },
                dataList: []
            }
        },
        mounted() {
            //获取数据接口
            // let cIs = this;
            // this.get(updatetaskData,
            //     {
            //         project_id: 2
            //     },
            //     (res) => {
            //         cIs.dataList = res.data.data;
            //         console.log(res.data.data)
            //     }
            // );
            //调用图片上传功能
            this.uploadList = this.$refs.upload.fileList;
        },
        methods: {
            //参与人滚动条
            handleReachBottom() {
                return new Promise(resolve => {
                    setTimeout(() => {
                        const last = this.list1[this.list1.length - 1];
                        for (let i = 1; i < 11; i++) {
                            this.list1.push(last + i);
                        }
                        resolve();
                    }, 2000);
                });
            },
            //参与人选项卡
            memberList(index) {
                this.num = index;
            },
            //移除已选参与人
            removePartici(event, name) {
                const index = this.fruit.indexOf(name);
                this.fruit.splice(index, 1);
            },
            /**
             * 上传图片
             */
            // 删除图片
            handleRemove(file) {
                const fileList = this.$refs.upload.fileList;
                this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
            },
            // 上传成功返回数据
            handleSuccess(res, file) {
                file.url = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar';
                file.name = '7eb99afb9d5f317c912f08b5212fd69a';
            },
            //判断图片格式
            handleFormatError(file) {
                this.$Notice.warning({
                    title: '文件格式不正确',
                    desc: '文件格式 ' + file.name + ' 不正确，请选择jpg或png'
                });
            },
            //判断图片大小
            handleMaxSize(file) {
                this.$Notice.warning({
                    title: '文件大小超过限制',
                    desc: '文件  ' + file.name + ' 太大了，不超过2M。'
                });
            },
            //判断图片最多上传张数
            handleBeforeUpload() {
                const check = this.uploadList.length < 5;
                if (!check) {
                    this.$Notice.warning({
                        title: '最多可以上传5张图片。'
                    });
                }
                return check;
            },
            //失去焦点，发送数据
            // blurTj() {
            //     this.get(gettasklist,
            //         this.formLeft,
            //         (callSave) => {
            //         }
            //     );
            // },
            /**
             * get请求
             */
            get(url, params, call) {
                /*获取列表信息*/
                this.$http.get(url,{params: params}).then(function (res) {
                    call(res);
                }, function (error) {
                    console.log("error");
                });
            },

        }

    }
</script>
