<template>
    <div>
        <div v-if="filetype == 'NULL'" class="notIMG">
            暂未上传任务文件
        </div>
        <div v-if="filetype == 'IMG'">
            <imgeditor ref="imgeditor"></imgeditor>
        </div>
        <div v-if="filetype == 'VIDEO'">
            <videoeditor ref="videoeditor"></videoeditor>
        </div>
        <div v-if="filetype == '3d'">
            <modeleditor ref="modeleditor"></modeleditor>
        </div>
    </div>
</template>

<script>
import imgeditor from './imgEditor'
import videoeditor from './vedioEditor'
import modeleditor from './threeModule'

var qs = require("querystring");
export default {
    mounted(){
        this.$bus.on('closeModel',()=>{
            this.filetype="NULL";
        });
        this.$bus.on('initFileBrowse',({taskid,type}) => {
            this.initFileBrowse(taskid,type)
        })
    },
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
        initFileBrowse(taskid,type)
        {
            if (type.indexOf('image') !== -1) {
                this.filetype = 'IMG';
                this.getFileDetails(taskid);
                return false
            }
            //显示不同的组件
            switch (type) {
                case 'image':
                    // console.log("file type is "+type);
                    this.filetype = 'IMG';
                    this.getFileDetails(taskid);
                    break;
                case 'video':
                    this.filetype = 'VIDEO';
                    // console.log("file type is "+type);
                    break;
                case '3d':
                    this.filetype = '3d';
                    // console.log("file type is "+type);
                    break;
                default:
                    this.filetype = 'NULL';
                    break;
            }
        },
        getFileDetails(taskid)
        {
            if(taskid!=0)
            {
                this.taskID = taskid;
                this.$axios.post(this.GLOBAL.baseRouter + 'task/task/task-stage',qs.stringify({task_id: this.taskID}))
                .then( res => res.data)
                .then( res => {
//                        sessionStorage.TaskID = taskid;
                        this.$refs.imgeditor.initImgEditor();
                    }
                )
                .catch(error => {
                    console.log(error);
//                    this.$Message.error("获取任务信息失败，请重试！");
                });
            }
        }
    }
}
</script>

<style>
</style>