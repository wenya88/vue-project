<template>
    <div>
        <div v-if="filetype == 'NULL'" class="notIMG">
            暂未上传任务文件
        </div>
        <div v-if="filetype == 'IMG'">
            <imgeditor ref="imgeditor" :testData="testTaskData"></imgeditor>
        </div>
        <div v-if="filetype == 'VIDEO'">
            <videoeditor ref="videoeditor" :testData="testTaskData"></videoeditor>
        </div>
        <div  v-if="filetype == '3d'">
            <modeleditor ref="modeleditor" :testData="testTaskData"></modeleditor>
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
        this.$bus.on('initFileBrowse',({taskid,type,TestData}) => {
            this.initFileBrowse(taskid,type,TestData)
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
            testTaskData:{}
        }
    },
    methods: {
        initFileBrowse(taskid,type,TestData) {
            if(TestData && TestData.is_test == 1){
                this.testTaskData = TestData;
            }
            if (type.indexOf('image') !== -1) {
                this.filetype = 'IMG';
                if(TestData && TestData!=null){
                    this.$refs.imgeditor.initImgEditor(TestData);
                }else {
                    this.getFileDetails(taskid);
                }
                return false
            }
            //显示不同的组件
            switch (type) {
                case 'image':
                    // console.log("file type is "+type);
                    this.filetype = 'IMG';
                    if(TestData && TestData!=null){
                        this.$refs.imgeditor.initImgEditor(TestData);
                    }else {
                        this.getFileDetails(taskid);
                    }
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
        getFileDetails(taskid) {
            if(taskid!=0) {
                this.taskID = taskid;
                this.$axios.post(this.GLOBAL.baseRouter + 'task/task/task-stage',qs.stringify({task_id: this.taskID}))
                .then( res => res.data)
                .then( res => {
//                        sessionStorage.TaskID = taskid;
                        this.$refs.imgeditor.initImgEditor();
                    }
                )
                .catch(error => {
//                    this.$Message.error("获取任务信息失败，请重试！");
                });
            }
        }
    }
}
</script>

<style>
</style>
