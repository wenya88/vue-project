<template>

    <div class="personalInfo">
        <section class="headPortrait">
            <p class="title">个人头像</p>
            <div class="headPortraitMain avatar">
                <div style="position: relative">
                    <img v-if="formInline.headimage" :src="defaultUrl" class="avatarImg" alt="头像">
                    <Avatar v-else class="headPortraitImg" icon="person" size="large"/>
                    <Upload
                            class="upLoadImg"
                            ref="upload"
                            :show-upload-list="false"
                            :format="['jpg','jpeg','png']"
                            :max-size="2048"
                            multiple
                            type="drag"
                            :action="imgUrl"
                            :on-success="upLoadImg"
                    >
                        <div style="width: 70px;height:70px;line-height: 70px;">
                            <Icon type="camera" size="20"></Icon>
                        </div>
                    </Upload>
                </div>
                <p>点击上传头像</p>
                <p>（限jpg,png,gif格式，头像建议大小 200*200）</p>
            </div>
            <!--<div>-->
            <!--<img src="./image/timg.jpg" @click="haha = false" width="70" height="70" alt="">-->
            <!--<div v-if="haha">-->
            <!--<p>点击上传头像</p>-->
            <!--<p>（限jpg,png,gif格式，头像建议大小 200*200）</p>-->
            <!--</div>-->
            <!--<Card v-if="!haha">-->
            <!--<p slot="title">-->
            <!--<Icon type="qr-scanner"></Icon>-->
            <!--头像裁剪-->
            <!--</p>-->
            <!--<Row :gutter="10">-->
            <!--<Col span="14" class="image-editor-con1">-->
            <!--<div class="cropper">-->
            <!--<img id="cropimg1" width="200" height="200" src="./image/timg.jpg" alt="">-->
            <!--</div>-->
            <!--</Col>-->
            <!--<Col span="10" class="image-editor-con1">-->
            <!--<Row type="flex" justify="center" align="middle" class="image-editor-con1-preview-con">-->
            <!--<div id="preview1"></div>-->
            <!--</Row>-->
            <!--<div class="image-editor-con1-btn-con margin-top-10">-->
            <!--<input type="file" accept="image/png, image/jpeg, image/gif, image/jpg" @change="handleChange1" id="fileinput1" class="fileinput" />-->
            <!--<span><Button @click="handlecrop1" type="primary" icon="crop">裁剪</Button></span>-->
            <!--<span><Button @click="editImgShow = !editImgShow" type="primary" icon="arrow-right-a">返回</Button></span>-->
            <!--</div>-->
            <!--</Col>-->
            <!--</Row>-->
            <!--</Card>-->
            <!--</div>-->
        </section>
        <section class="headPortrait">
            <p class="title">基本资料</p>
            <Form class="headPortraitMain" ref="formInline" :model="formInline" :rules="ruleInline" inline>
                <div>
                    <FormItem prop="basic">
                        <span v-model="formInline.account">{{formInline.account}}</span>
                    </FormItem>
                </div>
                <div>
                    <FormItem prop="nickname">
                        <Input type="text" @change.native="changeNickname('nickname')" v-model="formInline.nickname"
                               placeholder="输入您的昵称"></Input>
                    </FormItem>
                </div>
                <div>
                    <FormItem prop="realname">
                        <Input type="text" @change.native="changeNickname('realname')" v-model="formInline.realname"
                               placeholder="输入您的姓名"></Input>
                    </FormItem>
                </div>
                <div>
                    <FormItem prop="job">
                        <Input type="text" @change.native="changeNickname('job')" v-model="formInline.job"
                               placeholder='输入您的工种如 “原画”、“动作”，“地编”'></Input>
                    </FormItem>
                </div>
            </Form>
        </section>
        <section class="headPortrait">
            <p class="title">修改密码 <img style="vertical-align: top;cursor :pointer;" width="20" height="20"
                                       :src="pwpic3.src" @click="changeType()"/></p>
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" class="headPortraitMain" inline>
                <div>
                    <FormItem prop="currentPassword">
                        <Input v-model="formValidate.currentPassword" :type="pwpic3.pwdType3"
                               placeholder="输入原密码（6-32位）"></Input>
                    </FormItem>
                </div>
                <div>
                    <FormItem prop="newPassword">
                        <Input v-model="formValidate.newPassword" :type="pwpic3.pwdType3"
                               placeholder="输入新密码（6-32位）"></Input>
                    </FormItem>
                </div>
                <div>
                    <FormItem prop="repPassword">
                        <Input v-model="formValidate.repPassword" :type="pwpic3.pwdType3" placeholder="确认新密码"></Input>
                    </FormItem>
                </div>
                <div>
                    <FormItem>
                        <!--<Button @click="_verifyPassword()">确认修改</Button>-->
                        <Button @click="handleSubmit('formValidate')">确认修改</Button>
                    </FormItem>
                </div>
            </Form>
        </section>
        <section class="headPortrait">
            <p class="mobileTitle title">手机</p>
            <div class="headPortraitMain">
                <div><span>{{userInfo.phone}}</span><span class="sign">已认证</span></div>
                <Button class="marginBtn" @click="mobileShow = true">修改</Button>
                <Modal class="changeMobileWindow" v-model="mobileShow" width="360">
                    <p>修改手机</p>
                    <Form ref="mobileValidate" :model="mobileValidate" :rules="ruleValidate">
                        <FormItem prop="mPassword">
                            <Input type="password" v-model="mobileValidate.mPassword" placeholder="请输入登录密码进行验证"></Input>
                        </FormItem>
                        <FormItem prop="phoneNumber">
                            <Input type="text" v-model="mobileValidate.phoneNumber" placeholder="请输入手机号"></Input>
                        </FormItem>
                        <FormItem prop="mobileCode">
                            <Input type="text" v-model="mobileValidate.mobileCode" placeholder="请输入验证码">
                            <div style="width: 70px;" @click="sendEmail('phone')" slot="append">{{mobileAuthCode}}</div>
                            </Input>
                        </FormItem>
                    </Form>
                    <div slot="footer">
                        <Button @click="handleSubmit('mobileValidate')" >确认</Button>
                    </div>
                </Modal>
            </div>
        </section>
        <section class="headPortrait">
            <p class="emailTitle title">邮箱</p>
            <div class="headPortraitMain">
                <div><span>{{userInfo.email}}</span><span class="sign">已认证</span></div>
                <Button class="marginBtn" @click="emailShow = true">修改</Button>
                <Modal class="changeMobileWindow" v-model="emailShow" width="360">
                    <p>修改邮箱</p>
                    <Form ref="emailValidate" :model="emailValidate" :rules="ruleValidate">
                        <FormItem prop="ePassword">
                            <Input v-model="emailValidate.ePassword" type="password" placeholder="请输入登录密码进行验证"></Input>
                        </FormItem>
                        <FormItem prop="address">
                            <Input v-model="emailValidate.address" type="text" placeholder="请输入电子邮箱"></Input>
                        </FormItem>
                        <FormItem prop="emailCode">
                            <Input v-model="emailValidate.emailCode" type="text" placeholder="请输入验证码">
                            <div style="width: 70px;" @click="sendEmail('email')" slot="append">{{emailAuthCode}}</div>
                            </Input>
                        </FormItem>
                    </Form>
                    <div slot="footer">
                        <Button @click="handleSubmit('emailValidate')">确认修改</Button>
                    </div>
                </Modal>
            </div>
        </section>
    </div>


</template>
<script>
    import {mapMutations,mapActions} from 'vuex'
    import qs from 'querystring'
    import jsencrypt from 'jsencrypt'
    import md5 from 'md5'
    //    import Cropper from 'cropperjs';
    import './cropper.min.css';
    import src from '@/images/close_eyes.png'
    import src2 from '@/images/open_eyes.png'

    export default {
        created() {
            this.getUserInfo()
        },
        mounted() {
            /*let img1 = document.getElementById('cropimg1');
            this.cropper1 = new Cropper(img1, {
                dragMode: 'move',
                preview: '#preview1',
                restore: false,
                center: false,
                highlight: false,
                cropBoxMovable: false,
                toggleDragModeOnDblclick: false,
                aspectRatio: 1 / 1,
            });
            */

        },
        data() {
            const phoneNumber = (rule, value, callback) => {
                let reg = new RegExp(/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/);
                if (reg.test(value)) {
                    callback();
                } else {
                    callback(new Error('请输入合法的手机号'));

                }
            };
            const repPassword = (rule, value, callback) => {
                if (this.formValidate.newPassword === this.formValidate.repPassword) {
                    callback();
                } else {
                    callback(new Error('请确认密码'));
                }
            };
            return {
                timer:null,
                is_success: null,
                haha: true,
                pwpic3: {
                    pwdType3: 'password',
                    src
                },
                secretKey: null,
                cropper1: {},
                option1: {
                    showCropedImage: false,
                    cropedImg: ''
                },
                defaultUrl: null,
                editImgShow: true,
                mobileAuthCode: '验证码',
                emailAuthCode: '验证码',
                imgUrl: `http://192.168.2.19/index.php?r=file/file/file-upload`,
                userId: null,
                mobileShow: false,
                emailShow: false,
                files: [],
                loadingStatus: false,
                userInfo: {},
                formValidate: {
                    currentPassword: ''
                },
                mobileValidate: {},
                emailValidate: {},
                ruleInline: {},
                formInline: {},
                ruleValidate: {
                    currentPassword: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {type: 'string', max: 32, min: 6, message: '请输入合法的密码', trigger: 'blur'}
                    ],
                    newPassword: [
                        {required: true, message: '请输入新密码', trigger: 'blur'},
                        {type: 'string', max: 32, min: 6, message: '请输入合法的密码', trigger: 'blur'}
                    ],
                    repPassword: [
                        {required: true, message: '请确认密码', trigger: 'blur'},
                        {validator: repPassword, trigger: 'blur'}
                    ],
                    address: [
                        {required: true, message: '请输入邮箱地址', trigger: 'blur'},
                        {type: 'email', message: '请输入合法的邮箱地址', trigger: 'blur'}
                    ],
                    emailCode: [
                        {required: true, message: '请输入验证码', trigger: 'blur'}
                    ],
                    phoneNumber: [
                        {required: true, message: '请输入手机号', trigger: 'blur'},
                        {validator: phoneNumber, trigger: 'blur'},
                    ],
                    mobileCode: [
                        {required: true, message: '请输入验证码', trigger: 'blur'}
                    ],
                    mPassword: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ],
                    ePassword: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ],
                    job: [
                        {required: true, message: '请输入职业', trigger: 'blur'}
                    ],
                },
            }
        },
        methods: {
            // 获取用户信息
            getUserInfo() {
                this.userId = sessionStorage.getItem('userId')
                this.$axios.post(this.GLOBAL.baseRouter + 'system/user/info', qs.stringify({id: this.userId}))
                    .then((res) => res.data)
                    .then(res => {
                        if (res.err_code === 0) {
                            this.userInfo = {...res};
                            this.formInline = {...res};
                            this.defaultUrl = res.headimage;
                        }
                    })

            },
            // 更改用户信息
            changeNickname(type) {
                let data = null;
                switch (type) {
                    case 'nickname':
                        data = {id: this.userId, nickname: this.formInline.nickname};
                        if (this.formInline.nickname === '') {
                            this.messageError('内容不能为空');
                            return false
                        }
                        break;
                    case 'realname':
                        data = {id: this.userId, realname: this.formInline.realname};
                        if (this.formInline.nickname === '') {
                            this.messageError('内容不能为空');
                            return false;
                        }
                        break;
                    case 'headimage':
                        data = {id: this.userId, headimage: this.formInline.headimage};
                        break;
                    case 'job':
                        data = {id: this.userId, job: this.formInline.job};
                        break;
                }
                this.$axios.post(this.GLOBAL.baseRouter + 'system/user/update', qs.stringify(data))
                    .then(res => res.data)
                    .then(res => {
                        if (res.err_code === 0) {
                            this.messageSuccess('修改成功');
                        }
                    })
            },
            upLoadImg(data) {
                this.formInline.headimage = data.file.url;
                this.changeNickname('headimage');
                this.defaultUrl = data.file.url;
            },

            // 邮箱验证
            sendEmail(type) {
              let fn = ()=>{
                  if(type ==='email' && !(this.emailValidate.ePassword && this.emailValidate.address) ){
                      this.messageError('密码或邮箱不能为空');
                      return
                  }
                  if(type ==='phone' && !(this.mobileValidate.mPassword && this.mobileValidate.phoneNumber) ){
                      this.messageError('密码或手机不能为空');
                      return
                  }
                  // 之前没有秘钥
                  if (this.secretKey === null) {
                      let password = async () => {
                          await this._encryption();
                          const is_success = await this._verifyPassword(type);
                          if (is_success !== '1') {
                              this.messageSuccess('密码验证失败');
                              return false;
                          } else {
                              if(type === 'email'){
                                  this.getMailCode();
                              }else{
                                  this.getCodePhone();
                              }
                          }
                      };
                      password();
                  } else {
                      //  有秘钥
                      this._verifyPassword(type).then((is_success) => {
                          if (is_success !== '1') {
                              this.messageSuccess('密码验证失败');
                              return false;
                          } else {
                              if(type === 'email'){
                                  this.getMailCode();
                              }else{
                                  this.getCodePhone();
                              }

                          }
                      })

                  }

              };
              this._reduce(fn);
            },
            getMailCode(){
                if (this.emailAuthCode !== '验证码') {
                    return false;
                }
                this.$axios.post(this.GLOBAL.baseRouter + 'system/user/send-email', qs.stringify({email: this.emailValidate.address}))
                    .then(res => res.data)
                    .then(res => {
                        if (res.err_code === 0 && res.msg) {
                            if (res.msg !== '该邮箱已被其他用户绑定') {
                                this.messageSuccess(res.msg);
                            } else {
                                this.getAuthCode('emailAuthCode');

                            }
                        }
                    })

            },
            getCodePhone(){
                if (this.mobileAuthCode !== '验证码') {
                    return false;
                }
                let reg = new RegExp(/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/);
                if(!reg.test(this.mobileValidate.phoneNumber)){
                    this.messageError('请输入正确的格式的手机号');
                    return
                }

                this.$axios.post(this.GLOBAL.baseRouter + 'system/user/send-message', qs.stringify({tel: this.mobileValidate.phoneNumber}))
                    .then(res => res.data)
                    .then(res => {
                        if (res.err_code === 0 && res.msg) {
                            this.getAuthCode('mobileAuthCode');
                            this.messageSuccess(res.msg);
                        }
                    })
            },
            // 更改邮箱
            updateEmail() {
                this.$axios.post(this.GLOBAL.baseRouter + 'system/user/update-email', qs.stringify({
                    email: this.emailValidate.address,
                    validate_code: this.emailValidate.emailCode
                }))
                    .then(res => res.data)
                    .then(res => {
                        if (res.err_code === 0) {
                            this.messageSuccess('修改成功');
                            this.clearData('emailValidate');
                        } else {
                            this.messageError(res.err_message);
                        }
                    })
            },
            // 更改手机号
            updatePhone() {
                let reg = new RegExp(/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/);
                if(!reg.test(this.mobileValidate.phoneNumber)){
                    this.messageError('请输入正确的格式的手机号');
                    return
                }
                this.$axios.post(this.GLOBAL.baseRouter + 'system/user/check-edit-phone-number', qs.stringify({
                    tel: this.mobileValidate.phoneNumber,
                    validate: this.mobileValidate.mobileCode
                }))
                    .then(res => res.data)
                    .then(res => {
                        if (res.err_code === 0) {
                            this.messageSuccess('修改成功');
                            this.clearData('mobileValidate');
                        } else {
                            this.messageError(res.err_message);
                        }
                    })
            },
            // 提交
            handleSubmit(name) {
                let fn = ()=>{
                    this.$refs[name].validate((valid) => {
                        if (valid) {
                            if (name === 'emailValidate') {
                                this.updateEmail();
                            }else if(name === 'mobileValidate'){
                                this.updatePhone()
                            }
                            else {
                                this.passwordCorrelation()
                            }
                        } else {
                            this.messageError('提交失败');
                        }
                    })
                }
                this._reduce(fn)
            },
            // 修改密码
            async passwordCorrelation() {
                await this._encryption();
                const is_success = await this._verifyPassword();
                this._editPassword(is_success);

            },
            // 获取秘钥
            _encryption() {
                return new Promise((resolve) => {
                    this.$axios.get(this.GLOBAL.baseRouter + 'system/login/get-public-secret-key')
                        .then(res => res.data)
                        .then(res => {
                            if (res.err_code == 0) {
                                this.secretKey = res.public_key;
                                resolve()
                            }
                        })
                })
            },
            // 验证密码
            _verifyPassword(data) {
                return new Promise((resolve) => {
                    let encrypt = new JSEncrypt();
                    encrypt.setPublicKey(this.secretKey);
                    let password = null;
                    if(data === 'email'){
                        password = encrypt.encrypt(md5(md5(this.emailValidate.ePassword)))
                    }else if(data === 'phone'){
                        password = encrypt.encrypt(md5(md5(this.mobileValidate.mPassword)))
                    } else{
                        password = encrypt.encrypt(md5(md5(this.formValidate.currentPassword)));
                    }

                    this.$axios.post(this.GLOBAL.baseRouter + 'system/user/check-user-by-password', qs.stringify({password: password}))
                        .then(res => res.data)
                        .then(res => {
                            if (res.err_code === 0) {
                                this.is_success = res.is_success;
                                resolve(res.is_success)
                            }
                        })
                })
            },
            // 修改密码
            _editPassword(is_success) {
                if (is_success !== '1') {
                    return false
                }
                let encrypt = new JSEncrypt();
                encrypt.setPublicKey(this.secretKey);
                let password = encrypt.encrypt(md5(md5(this.formValidate.newPassword)));
                this.$axios.post(this.GLOBAL.baseRouter + 'system/user/edit-password', qs.stringify({
                    id: this.userId,
                    password: password
                }))
                    .then((res) => res.data)
                    .then(res => {
                        if (res.err_code === 0) {
                            this.clearData('formValidate')
                        }
                    })

            },
            // 验证码倒计时
            getAuthCode(type) {
                console.log(11)
                if (this[type] = '验证码') {
                    let s = 60;
                    this[type] = s;
                    let timeId = setInterval(() => {
                        this[type] = --s;
                        if (this[type] <= 0) {
                            this[type] = '验证码';
                            clearInterval(timeId)
                        }
                    }, 1000)
                }
            },
            // 显示密码
            changeType() {
                this.clearData('formValidate');
                this.pwpic3.pwdType3 = this.pwpic3.pwdType3 === 'password' ? 'text' : 'password';
                this.pwpic3.src = this.pwpic3.src == src ? src2 : src;
            },
            _reduce(fn) {
                clearTimeout(this.timer);
                this.timer = setTimeout(() => {
                    fn();
                }, 800)
            },
            // 截图
            handleChange1(e) {
                let file = e.target.files[0];
                let reader = new FileReader();
                reader.onload = () => {
                    this.cropper1.replace(reader.result);
                    reader.onload = null;
                };
                reader.readAsDataURL(file);
            },
            handlecrop1() {
                let file = this.cropper1.getCroppedCanvas().toDataURL();
                this.upLoadImg(file);
                this.editImgShow = !this.editImgShow;
            },
            clearData(data) {
                for (let k in this[data]) {
                    delete this[data][k];
                }
            },
            messageSuccess(data) {
                this.$Message.success(data);
            },
            messageError(data) {
                this.$Message.error(data);
            }
        }
    }
</script>

<style lang="less" scoped>
    .personalInfo {
        .headPortrait {
            display: flex;
            padding: 24px 0;
            flex-direction: row;
            border-bottom: 1px solid #ededed;
            .title {
                width: 190px;
                height: 115px;
                text-align: center;
                font-size: 14px;
                font-weight: 600;
                color: black;
            }
            .mobileTitle, .emailTitle {
                height: 55px;
            }
            .upLoadImg {
                display: inline-block;
                position: absolute;
                top: 0;
                left: 0;
                width: 70px;
                height: 70px;
                border-radius: 50%;
                opacity: 0;
            }
            .headPortraitMain {
                flex: 1;
                .avatar {
                    p:nth-of-type(1) {
                        margin: 5px 0 10px 0;
                        color: black;
                    }
                    p:nth-of-type(2) {
                        color: #AEAEAE;
                    }

                }
                .marginBtn {
                    margin-top: 15px;
                }

                .headPortraitImg, .avatarImg {
                    width: 70px;
                    height: 70px;
                    font-size: 57px;
                    border-radius: 50%;
                }
                .ivu-form-item {

                }
                .sign {
                    margin-left: 8px;
                    display: inline-block;
                    font-size: 12px;
                    color: #fff;
                    background: green;
                }
            }
        }
    }

</style>
<style lang="less">
    @gray: #d7dde4;
    @green: #31BB9F;
    .changeMobileWindow {
        .button {
            width: 135px;
            height: 35px;
            text-align: center;
            line-height: 35px;
            color: #fff;
            background: @green;
            cursor: pointer;
        }
        .ivu-modal-body {
            padding: 30px 15px 0 15px;
            p {
                margin-bottom: 20px;
                font-size: 18px;
                font-weight: 500;
                color: black;
            }
        }
        .ivu-modal-footer {
            text-align: left;
            border: none;
        }

    }
</style>
