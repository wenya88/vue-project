<template>
    <div>
    <!-- <Upload
    multiple
    :before-upload="handleUpload"
    action="http://192.168.2.19/index.php?r=task/task/stage-upload">
    <Button type="ghost" icon="ios-cloud-upload-outline">Select the file to upload</Button>
    </Upload>
    <div v-for="item in files">
    文件名称: {{ item.name }}
    <img v-bind:src="item.url">
    </div>
    <Button type="primary" @click="upload" :loading="loadingStatus">
    {{ loadingStatus ? 'Uploading' : 'Click to upload' }}
    </Button> -->
    <Button type="primary" @click="notification">修改文件</Button>
    <p id="text"></p>
    </div>



</template>
<script>
    var qs = require('querystring');
    export default {
        data() {
            return {
                files: [],
                loadingStatus: false,
                theme2:'light'
            }
        },
        created() {
            let title = "正在开发中";
            let content = '<p>程序小哥哥正在努力开发中</p><p>敬请期待后续内容！</p>'
            this.$Modal.warning({
            title: title,
            content: content
            });
        },
        methods: {
            handleUpload(file) {
                file.url = window.URL.createObjectURL(file);
                console.log(file.url)
                this.files.push(file);
                console.log(file)
                return false;
            },
            upload() {
                this.loadingStatus = true;
                console.log(this.files)
                this.$axios.post('http://192.168.2.19/index.php?r=task/task/stage-upload', qs.stringify(this.files))
                    .then(res => res.data)
                    .then(res => {
                        if (res.err_code == 0) {

                        } else {
                            this.$Message.warning(res.err_message);
                        }
                    })
                setTimeout(() => {
                    this.file = null;
                    this.loadingStatus = false;
                    this.$Message.success('Success')
                }, 1500);
            },
            notification() {
                if (window.Notification) {
                    var text = document.getElementById('text');

                    var popNotice = function () {
                        if (Notification.permission == "granted") {
                            var notification = new Notification("原画-陈科宇:", {
                                body: '阴阳师-茨木童子已上传最新修改，请查阅！',
                                icon: 'https://yys.res.netease.com/pc/zt/20161108171335/data/before_awake/265.jpg'
                            });

                            notification.onclick = function () {
                                text.innerHTML = 'xxx已于' + new Date().toTimeString().split(' ')[0] + '查看任务！';
                                notification.close();
                            };
                        }
                    };

                    if (Notification.permission == "granted") {
                        popNotice();
                    } else if (Notification.permission != "denied") {
                        Notification.requestPermission(function (permission) {
                            popNotice();
                        });
                    }
                } else {
                    alert('浏览器不支持Notification');
                }
            }

        }
    }
</script>

<style lang="less" >
.single-page{
    height: 100%;
}


</style>

