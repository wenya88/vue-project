<template>
    <div>
        <!--筛选条件暂时影藏-->
        <ul class="screenBar" style="display: none">
            <li>
                <dl>
                    <dd class="byAsc">交稿剩余</dd>
                    <dd class="byDesc">测试金额</dd>
                    <dd class="byDesc">项目预计</dd>
                </dl>
            </li>
            <li class="searchBar">
                <div>
                    <input type="text"  placeholder="任务 / 负责人" />
                    <button></button>
                </div>
            </li>
        </ul>
        <div style="clear:both"></div>
        <div class="contractRow">
            <dl>
                <dd v-for="item in taskData" :key="item.id" v-if="item.end_days>0">
                    <div class="statusRow">
                        <div class="status" v-if="item.end_days > 0">
                            <Icon type="ios-stopwatch-outline"></Icon>
                            交稿剩余时间 {{item.end_days}} 天
                        </div>
                        <div class="status" v-else>
                            <Icon type="ios-stopwatch-outline"></Icon>
                            投稿已结束
                        </div>
                    </div>
                    <div class="Rprojectinfo" @click="showDetails(item.test_name,item.task_type,item,item.id,item.is_join)">
                        <div class="RprojectName">
                            <span>{{item.test_name}}</span>
                            <i v-if="item.task_type">{{item.task_type}}</i>
                            <i class="companyNumber">{{item.join_num}}家报名</i>
                        </div>
                        <p v-if="item.test_price">测试金额：<span>￥{{item.test_price}}</span></p>
                        <p v-else>测试金额：<span>服务商报价</span></p>

                        <p>项目预计：<span>￥{{item.project_max_price}}</span></p>
                        <p>{{item.company}}</p>
                    </div>
                </dd>
            </dl>
        </div>
        <!-- Modal组件 -->
        <Modal
            v-model="taskDetails"
            class="task"
            :transfer="false"
            width="662px">
            <task-details :emitDetailsData="detailsData"></task-details>
            <div slot="header" class="taskTitle">
                <span>{{taskTitle}}， 欢迎报名！</span>
                <p class="taskTitle-type" v-if="taskType">{{taskType}}</p>
            </div>
            <div slot="footer" >
                <div class="bjTbDiv" >
                    <div v-if="companyType != 1 && !detailsData.test_price">
                        <p v-if="detailsData.bid_end_days >0 && !detailsData.is_join"><input v-model="BJprice" type="number" placeholder="输入您的报价"/><span @click="nowBJFun">立即报价</span></p>
                        <p v-if="detailsData.bid_end_days >0 && detailsData.is_join" class="yiBJ">您已报价（{{detailsData.bid_price}}）元</p>
                        <p v-if="detailsData.bid_end_days <= 0 " class="yiBJ">报名已结束</p>
                    </div>
                    <Button v-if="companyType != 1 && detailsData.test_price" type="success" long :disabled='flag' :class="[flag ? 'noJoin' : 'isJoin']" @click="nowBJFun">{{joinStatut}}</Button>
                </div>
            </div>
        </Modal>
    </div>
</template>
<script>
var qs=require('querystring')
import {mapState} from 'vuex'
import taskDetails from './taskDetails';
import Cookies from 'js-cookie';
import api from 'api';
export default {
    data(){
        return{
          taskDetails:false,
          taskTitle:null,
          taskType:null,
          detailsData:{},
          Tid:null,
          joinStatut:null,
          flag:false,
          BJprice:null,
          companyType:JSON.parse(Cookies.get('company')).type,
        }
    },
    props:{
        taskData:{
            type:Array
        }
    },
    components:{
        taskDetails:taskDetails
    },
    mounted(){

    },
    methods:{
        //立即报价
        async nowBJFun(){
          let obj = {
              id:this.detailsData.id,
              price:this.BJprice
          }
          const postBJ = await api.postBaojia(obj);
          if(postBJ.data.err_code == 0){
              this.$bus.emit('joinSuccess');   //更新页面数据
              this.$Message.success(postBJ.data.err_message);
              this.BJprice = null;
              this.taskDetails = false;
          }else {
              this.BJprice = null;
              this.taskDetails = false;
              this.$Message.error(postBJ.data.err_message);
          }
        },
        showDetails(name,type,item,id,join){
            this.detailsData=item; //发送数据
            this.taskType=type;//标题类型
            this.taskTitle=name;//标题名字
            this.Tid=id;//任务ID
            if(join=='1'){
                this.joinStatut='已报名';
                this.flag=true;
            }else{
                this.joinStatut='立即报名';
                this.flag=false;
            }
            this.taskDetails=true;
        }
    },
    computed:{
        ...mapState({
            applyrole(value){
                return value.app.callForBidsdts.HaveTender
            }
        }),
    }
}
</script>
<style type="text/css" lang="less" scoped>
    @import '../../../styles/common.less';
    @import '../../../styles/newBase.less';
    .screenBar{
        overflow: hidden;height: 58px;padding: 12px 10px 12px 0;float: right;
        li{
            float: left;display: flex;align-items: center;height:100%;
            dl{
                height: 100%;
                dd{
                    float: left;font-size: 13px;color: #ccc;height: 100%;display: flex;align-items: center;border-left: 1px dashed #e7e7e7;padding: 0 15px;cursor: pointer;
                    &:after{
                        content: '';display: inline-block;height: 12px;width: 9px;
                        background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAB0CAYAAACIY2IQAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAANwSURBVGhD7ZdLaBNhFIVdiNWFUrrQQosoWvGxsAsV86hoiwsXiloQF+4EF1YsaBHEuhB0oRZBXIgIKuJjqYtmWkzSByoiNG3c1aKt2EWUElNaUbCaeO6fM8kkbTIPFQr+Hxzmv+e/9ySTTJLJAivb3hg1gUGjzz/UuZmWe4LxUB1CxqCMP2YkfYPGFm45xxc36gMxIyEheYVSgQEjwBZ7fLHOBjVUEJKVPxaa9g2EdrG1PMGhkD842NWER28tCEItvuyz1RlyGkVBzk/Lig6yZ/4FaTSassy/D60OsuePg/7aL63db38wZjSy1Z4SdyOTnl6n4vuj7UPdW7nlnuwdW6hfniEtjUbzD+jt7a2JRCJ9OHr/dxQOh+sQMhaNRjM4JlG7/3eEoXoEJCTEohR8599HGGiQIUuAVdOQs39HPT09fjxyE06n1Roitfiyz1ZnyGlYg1ydlhUdZM/8C9JoNK5Jp9OrIAPaQcsbCDiSATh20PIGApoZdJ6WNxBwkEHttLzhKQjNm6A70AZa1lPLBWG9HHoA7aNVCDZ2c2gG2kjvEL0LrKuhz/RaxJsTbJ5k0wwOFdBq1s3cT7C+qgaswNwJHWZpDXsLtUE/oWtQmP4ltkrvfmiPWXyTBrBQGQDeCXoy+ItLWV9hi4J2RhXY/MS6QhkEfit9BepZFyX9hCqw+EhjkTIswGuBfkAFz8QEvrwx42ZRMkjA1gouZ1EcNCFBqnAJgybMYpzPaKUyHIKRSs7lXqOjYghYT0HTDjTFEZlpU0ECilPQMDSJvZSdpA96D51jhEbzv4DLfil0DOrHx0GBdRw6jmUl28rD5hyox6BRlgrU5X910fCYjaPQASyXcUu+Mirg7YWG2WNwqxBsdLDhKa2SoOc6e2/RygKjlhsjtGxB7wvO5L8MUdymuYaWLeit5kyEljK/Q0mWjsHMOwkDS5QhK5jdqnABZu5zdp0yWHSpwgWYucfZ9abxFXVKFS7AnLq+cFysDKzv0qhVhgPQW8WZ57SUuZZmnJYt6H3GmezrYwLjMjee0CoJem6w9yKtQiSEDR+gRixztzkCvAbIfMvL/8Sj8Sz7FAwt/tA+4vEVx+YGDXKfeAbqg5LQF+g11I55dWeCtfqWwDF/ZXsFITcZ9pCWd+QZMew0Le8gZETCWHoHQVXpdPrlbwmk0RfpuGVuAAAAAElFTkSuQmCC") no-repeat;
                        background-position-y: -46px;margin-left: 5px;
                    };
                    &.byAsc{
                        &:after{background-position-y: 0 !important;}
                    };
                    &.byDesc{
                        &:after{background-position-y: -23px !important;}
                    }
                }
            }
        }
        .searchBar{
            div{
                position: relative;width: 200px;height: 100%;overflow: hidden;
                input{height: 100%;width: 100%;border: none;border-radius: 3px;padding-left: 10px;outline: none;};
                button{
                    position: absolute;top: 0;bottom:0;right: 0;width: 44px;height:100%;border: 0;outline: none;border-radius: 3px;
                    background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAB0CAYAAACIY2IQAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAANwSURBVGhD7ZdLaBNhFIVdiNWFUrrQQosoWvGxsAsV86hoiwsXiloQF+4EF1YsaBHEuhB0oRZBXIgIKuJjqYtmWkzSByoiNG3c1aKt2EWUElNaUbCaeO6fM8kkbTIPFQr+Hxzmv+e/9ySTTJLJAivb3hg1gUGjzz/UuZmWe4LxUB1CxqCMP2YkfYPGFm45xxc36gMxIyEheYVSgQEjwBZ7fLHOBjVUEJKVPxaa9g2EdrG1PMGhkD842NWER28tCEItvuyz1RlyGkVBzk/Lig6yZ/4FaTSassy/D60OsuePg/7aL63db38wZjSy1Z4SdyOTnl6n4vuj7UPdW7nlnuwdW6hfniEtjUbzD+jt7a2JRCJ9OHr/dxQOh+sQMhaNRjM4JlG7/3eEoXoEJCTEohR8599HGGiQIUuAVdOQs39HPT09fjxyE06n1Roitfiyz1ZnyGlYg1ydlhUdZM/8C9JoNK5Jp9OrIAPaQcsbCDiSATh20PIGApoZdJ6WNxBwkEHttLzhKQjNm6A70AZa1lPLBWG9HHoA7aNVCDZ2c2gG2kjvEL0LrKuhz/RaxJsTbJ5k0wwOFdBq1s3cT7C+qgaswNwJHWZpDXsLtUE/oWtQmP4ltkrvfmiPWXyTBrBQGQDeCXoy+ItLWV9hi4J2RhXY/MS6QhkEfit9BepZFyX9hCqw+EhjkTIswGuBfkAFz8QEvrwx42ZRMkjA1gouZ1EcNCFBqnAJgybMYpzPaKUyHIKRSs7lXqOjYghYT0HTDjTFEZlpU0ECilPQMDSJvZSdpA96D51jhEbzv4DLfil0DOrHx0GBdRw6jmUl28rD5hyox6BRlgrU5X910fCYjaPQASyXcUu+Mirg7YWG2WNwqxBsdLDhKa2SoOc6e2/RygKjlhsjtGxB7wvO5L8MUdymuYaWLeit5kyEljK/Q0mWjsHMOwkDS5QhK5jdqnABZu5zdp0yWHSpwgWYucfZ9abxFXVKFS7AnLq+cFysDKzv0qhVhgPQW8WZ57SUuZZmnJYt6H3GmezrYwLjMjee0CoJem6w9yKtQiSEDR+gRixztzkCvAbIfMvL/8Sj8Sz7FAwt/tA+4vEVx+YGDXKfeAbqg5LQF+g11I55dWeCtfqWwDF/ZXsFITcZ9pCWd+QZMew0Le8gZETCWHoHQVXpdPrlbwmk0RfpuGVuAAAAAElFTkSuQmCC") no-repeat @green;
                    background-position: 13px -88px;cursor: pointer;
                }
            }
        }
        .allDownBtn{
            background: @green;padding: 0 10px;margin-left: 10px;border-radius: 3px;overflow: hidden;width: 100px;
            button{
                border: 0;color: #fff;outline: none;cursor: pointer;background: @green;width: 100%;
                .downbtn{
                    background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAB0CAYAAACIY2IQAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAANwSURBVGhD7ZdLaBNhFIVdiNWFUrrQQosoWvGxsAsV86hoiwsXiloQF+4EF1YsaBHEuhB0oRZBXIgIKuJjqYtmWkzSByoiNG3c1aKt2EWUElNaUbCaeO6fM8kkbTIPFQr+Hxzmv+e/9ySTTJLJAivb3hg1gUGjzz/UuZmWe4LxUB1CxqCMP2YkfYPGFm45xxc36gMxIyEheYVSgQEjwBZ7fLHOBjVUEJKVPxaa9g2EdrG1PMGhkD842NWER28tCEItvuyz1RlyGkVBzk/Lig6yZ/4FaTSassy/D60OsuePg/7aL63db38wZjSy1Z4SdyOTnl6n4vuj7UPdW7nlnuwdW6hfniEtjUbzD+jt7a2JRCJ9OHr/dxQOh+sQMhaNRjM4JlG7/3eEoXoEJCTEohR8599HGGiQIUuAVdOQs39HPT09fjxyE06n1Roitfiyz1ZnyGlYg1ydlhUdZM/8C9JoNK5Jp9OrIAPaQcsbCDiSATh20PIGApoZdJ6WNxBwkEHttLzhKQjNm6A70AZa1lPLBWG9HHoA7aNVCDZ2c2gG2kjvEL0LrKuhz/RaxJsTbJ5k0wwOFdBq1s3cT7C+qgaswNwJHWZpDXsLtUE/oWtQmP4ltkrvfmiPWXyTBrBQGQDeCXoy+ItLWV9hi4J2RhXY/MS6QhkEfit9BepZFyX9hCqw+EhjkTIswGuBfkAFz8QEvrwx42ZRMkjA1gouZ1EcNCFBqnAJgybMYpzPaKUyHIKRSs7lXqOjYghYT0HTDjTFEZlpU0ECilPQMDSJvZSdpA96D51jhEbzv4DLfil0DOrHx0GBdRw6jmUl28rD5hyox6BRlgrU5X910fCYjaPQASyXcUu+Mirg7YWG2WNwqxBsdLDhKa2SoOc6e2/RygKjlhsjtGxB7wvO5L8MUdymuYaWLeit5kyEljK/Q0mWjsHMOwkDS5QhK5jdqnABZu5zdp0yWHSpwgWYucfZ9abxFXVKFS7AnLq+cFysDKzv0qhVhgPQW8WZ57SUuZZmnJYt6H3GmezrYwLjMjee0CoJem6w9yKtQiSEDR+gRixztzkCvAbIfMvL/8Sj8Sz7FAwt/tA+4vEVx+YGDXKfeAbqg5LQF+g11I55dWeCtfqWwDF/ZXsFITcZ9pCWd+QZMew0Le8gZETCWHoHQVXpdPrlbwmk0RfpuGVuAAAAAElFTkSuQmCC") no-repeat @green;
                    background-position-y: -70px;padding-left: 20px;
                }
                i{font-style: normal;
                    &:after{content: "\F29C";color: #fff;font-size: 15px;padding: 0 5px}
                }
            }
        }
    }
    .contractRow {
        margin-top: @p25;
        dl {
            margin-left: -1%;
            display: block;
            zoom: 1;
            overflow: auto;
        }
        dd {
            width: 23%;
            display: inline-block;
            margin: 0px 0px @p30 2%;
            white-space: nowrap;
            background: @white;
            border-radius: @r3;
            .ivu-icon-ios-more {
                color: #222222;
            }
            .statusRow {
                height: 54px;
                border-bottom: 1px dashed @line;
                .ivu-select-dropdown {
                    margin: -10px;
                    padding: 0px;
                }
                .status {
                    background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHMAAABSCAYAAABns+t1AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAydpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RTg4Q0NDMzE5RjkyMTFFODlBQjhBNEJFNzMyRURENTMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RTg4Q0NDMzA5RjkyMTFFODlBQjhBNEJFNzMyRURENTMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIFdpbmRvd3MiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmRpZDpmZjg5MTI5Ny1jMDNhLTI5NGUtYTQ2Ni1kZWRiODgzODhkNDIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6ZmY4OTEyOTctYzAzYS0yOTRlLWE0NjYtZGVkYjg4Mzg4ZDQyIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Fyhy2wAAAuhJREFUeNrsnD9rU1Echu/v3ktLgqak2jiURrAO4p+h0EL9M9giQuxSsEugm5DFmvYDCBb8BFcn03YREQQhxSGBLl0CmgR0k5bYweCipEjjEAom8XdtK7U0bcd7Xt4HXkKSm+U+nJNz4ZxXbn7MtS0SFLY0m5p1TUmT2339S2EoceSPbd6/QNGjuaDxrT3RFDUVzYwmdNyPKTP4XNQ816zd+pSfPOpC4TRrHBlNWqfcbY5M80lp8jpKI5SJwZgmq0K7KBOD8d3/UspEmXL3L4oo03w8FRqiTAzimgeUiUOaz5lYjHJk4nCXMnG4Tpk4XKJMHM5SJg6nKRMIysThF2XiUKNMHNYoE4f3lInDist7AEGlMJQocmRi8IyPJhhUNUuUicGsTrENyjSfBRW5vPeGMs2loHm0/wPKNJNVzcTBXe2UaR7+8YSEiqwf/ILPmWatWudUYrbTBZQZfDY0nmZxb9VKmWbgT501a+ewbVmTt3bOaJ5oB6X0vXja8cIfqcfC+2sONoUByeQIBJNJoWAyKRRMJoWCyaRQc5HfhXs8BRYYG+6W5YY3pfvcuhU+X5KeazmJ3SlRJoxg+4tEhz3pn1qSyJUGZWJQlejIrH15fpkyUXDCGXvwYVr6bm9TJgardnx6UgaS9WNXsyTwjLWqr7Ltb29Y6gTCeOvrS5Y6AZFqfphiqRMMzYbX+jzPUicQ4u2fZZY6AZHmowkS4rDUCYZ2k6VOQLDUCQiWOgHBUicgWOqEBGXiwFInIFjqBARLnYBgqRMM4qxQJgYV58Y7ljqBwFInEPwtmCx1gsAJ+XtpWeoEwIIz+palTgAU7Pg0S50A8DdBT8hA8r9d7WwbMe8/MmMPzhx6PIEyzVq1zulih6VO5iIb0jviSf/9RYlcZamTOd7cuuWGa9Id8w/bllVeXqLDRaur92SlTt9fn+l4YSxZ43F4g7ApDEgmRyCYTAoFk0mhYDIpFEzmP6HuKd4dw/gjwAATusRH9cSaQgAAAABJRU5ErkJggg==');
                    min-width: 115px;
                    height: 41px;
                    line-height: 34px;
                    color: @white;
                    text-align: center;
                    display: inline-block;
                    font-size: @f14;
                    position: relative;
                    margin-left: -7px;
                    margin-top: 10px;
                    padding: 0 10px;
                    background-size: 100% 200%;
                }
                .yellow {
                    background-position-y: -41px;
                }
            }
            .title {
                display: block;
                text-align: right;
                position: relative;
                margin-right: 21px;
                margin-top: -40px;
            }
            .ivu-icon-ios-more {
                color: #eee;
            }
            .Rprojectinfo{
                padding: 20px;
                .RprojectName{
                    position: relative;
                    display: flex;
                    align-items: center;
                    padding: 10px 0;
                    span{
                        font-size: 15px;
                    }
                    i{
                        font-style: normal;
                        padding: 0 5px;
                        border: 1px solid @green;
                        border-radius: 3px;
                        margin-left: 10px;
                        color: @green;
                    }
                    .companyNumber{
                        position: absolute;
                        right: 0;
                    }
                }
                p{
                    padding: 10px 0;
                    color: #ccc;
                    font-size: 13px;
                    span{
                        font-size: 13px;
                        color: #828080;
                    }
                }
            }
        }
    }
    .bjTbDiv{
        position: relative;
        text-align: left;
        border-radius: 3px;
        overflow: hidden;
        input{
            width: 100%;
            height: 32px;
            padding-left:10px;
            padding-right: 185px;
            border: 1px solid @green;
            color: #777;
            font-size: 15px;
        }
        span{
            display: inline-block;
            position: absolute;
            right: 0;
            bottom: 0;
            top: 0;
            background: @green;
            color: #fff;
            line-height: 32px;
            font-size: 13px;
            width: 200px;
            text-align: center;
            &:hover{
                background: #32CEB5;
                cursor: pointer;
            }
        }
        .yiBJ{
            text-align: center;
            background: #e0e0e0;
            height: 30px;
            line-height: 30px;
            font-size: 14px;
            color: #777;
            &:hover{
                background: #B0B3B0;
                cursor: pointer;
                color: #fff;
            }
        }
        button{
            color: #fff;
        }
        .isJoin{
            background: @green;
        }
        .noJoin{
            background: #b3b3b3;
        }
    }
</style>
