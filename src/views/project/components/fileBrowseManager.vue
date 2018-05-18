<template>
    <div>
        <div v-if="filetype === 'NULL'">
            暂未上传任务文件
        </div>
        <div v-if="filetype === 'IMG'">
            <imgeditor ref="imgeditor"></imgeditor>
        </div>
        <div v-if="filetype === 'VIDEO'">
            <videoeditor ref="videoeditor"></videoeditor>
        </div>
        <div v-if="filetype === 'MODEL'">
            <modeleditor ref="modeleditor"></modeleditor>
        </div>
    </div>
</template>

<script>
import imgeditor from './imgEditor'
import videoeditor from './vedioEditor'
import modeleditor from './vedioEditor'

var qs = require("querystring");
export default {
    components: {
        imgeditor,
        videoeditor,
        modeleditor,
    },
    data() {
        return {
        filetype:"IMG",
        fileData:{},
        taskID:0,
        }
    },
    methods: {
        initFileBrowse(taskid)
        {
            this.getFileDetails(taskid);
        },
        getFileDetails(taskid)
        {
            console.log(taskid);
            if(taskid!=0)
            {
                this.taskID = taskid;
                console.log(this.taskID);
                this.$axios.post(this.GLOBAL.baseRouter + 'task/task/task-stage',qs.stringify({task_id: this.taskID}))
                .then( res => res.data)
                .then( res => {
                        console.log(res);
                    }
                )
                .catch(error => {
                    console.log(error);
                    this.$Message.error("获取任务信息失败，请重试！");
                });
            }
        }
    }
}
</script>

<style>
</style>