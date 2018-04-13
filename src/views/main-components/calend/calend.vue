<style>
    #remind,#leave{display:none;}
    .dataTip{background:#f1f1f1;position:absolute;top:0;left:0;width:300px;height:140px;display:inline-block;z-index:100}
    .dataTip .tipimg{position:absolute;top:-6px;left:26px;width:12px;height:6px;background:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAGCAYAAAD37n+BAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo3RDcyQzBGNzMyNUExMUU4ODMzN0VCQTFBODZBNkU4QSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo3RDcyQzBGODMyNUExMUU4ODMzN0VCQTFBODZBNkU4QSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjdENzJDMEY1MzI1QTExRTg4MzM3RUJBMUE4NkE2RThBIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjdENzJDMEY2MzI1QTExRTg4MzM3RUJBMUE4NkE2RThBIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+VXLT/QAAADtJREFUeNpi/P//PwM6UL6xByx4V8OFEV2OCZdidDZWDdgUoIsx4VOMTY6JkGJ0TYxK13cTVIwMAAIMAIu/H2tJSNbHAAAAAElFTkSuQmCC')}
    .dataTip dt{background:#22d7bb;height:30px;line-height:30px;padding:0px 10px;font-size:12px!important;color:#fff;}
    .dataTip dt label{margin-right:10px;float:left;}
    .dataTip dt label>input[type=radio]{float:left;margin-top:7px;margin-right:2px;}
    .dataTip dl{margin:0px;padding:0px;font-size:12px;}
    .dataTip dd{padding:0px;margin:0px!important;padding:5px 10px;}
    .dataTip dd span{color:#ff6600;margin:0px 4px;font-size:14px;font-weight:bold;}
    .dataTip dd input{width:100px;}
    .dataTip dd textarea{width:280px;resize:none;margin-top:5px;height:55px;padding:5px;}
    .dataTip dd button{padding:0px 10px;margin-right:5px;}
    .dataTip dd p{margin-bottom:5px;height:65px;}
    .dataTip dd .seletTime{padding-top:16px;}
    .dataTip dd .seletTime input{height:30px;line-height:30px;width:120px;font-size:14px;border:1px solid #d7dde4;color:#777;padding-left:5px;}
    .select-event{border:1px solid #f29543;border-radius:100%;width:36px;height:36px;position:absolute;left:50%;top:50%;z-index:1;margin-left:-18px;margin-top:-19px}
    .deleteBtn{background:#e43;color:#fff;width:16px;height:16px;position:absolute;line-height:16px;z-index:200;top:6px;right:-5px;text-align:center;border-radius:2px;cursor:pointer;}
    .dateSelect{position:absolute;z-index:200;margin-left:150px;margin-top:12px;}
    .dateBtn{border:0px;background:#18bfa4;color:#fff;padding:1px 10px;cursor:pointer;float:right;margin-top:-2px;margin-left:5px;}
</style>
<template>
    <div>
        <dl>
            <dt><Icon type="calendar"></Icon><span>日程</span><em class="more"><a @click="addRemind">增加提醒</a> <a @click="addLeave">标识请假</a></em></dt>
            <dd>
                    <div class="dateSelect">节假日:
                        <select v-model="selct" @change="selectVal" id="selval">
                            <option v-for="item in option" :value="item.value">{{item.text}}</option>
                        </select>
                        <button @click="today" class="dateBtn">按回今天</button>
                    </div>
                    <vue-event-calendar :events="demoEvents" @day-changed="changeDate" @month-changed="monthChange"></vue-event-calendar>

                    <!--提醒-->
                    <div id="remind" class="dataTip"><span class="tipimg"></span>
                        <dl>
                            <dt>
                                <label><input type="radio" name="remind" checked/>当日提醒</label>
                                <label><input type="radio" name="remind"/>每周提醒</label>
                                <label><input type="radio" name="remind"/>每月提醒</label>
                            </dt>
                            <dd>
                                <p>
                                    <textarea></textarea>
                                </p>
                                <button @click.stop="addRem($event)">确定</button>
                                <button @click.stop="escRem($event)">取消</button>
                            </dd>
                        </dl>
                    </div>

                    <!--请假-->
                    <div id="leave" class="dataTip"><span class="tipimg"></span>
                        <dl>
                            <dt>请选择请假时间</dt>
                            <dd>
                                <p class="seletTime">
                                    <input type="text" class="sTime"/>&nbsp;&nbsp;至&nbsp;&nbsp;<input type="text" class="eTime"/>
                                </p>
                                <button @click.stop="addRem($event)">确定</button>
                                <button @click.stop="escRem($event)">取消</button>
                            </dd>
                        </dl>
                    </div>
            </dd>
        </dl>

    </div>
</template>
<script>
    var arr=[
      {
        date: '2018/3/15',
        title: '315消费者节',
      },{
        date: '2018/3/12',
        title: '请假',
      },
      {
        date:'2018/3/16',
        title:'周五是一个值得庆祝的日子'
      },
      {
        date:'2018/4/5',
        title:'清明节'
      },
      {
        date:'2018/5/15',
        title:'端午节',
      }
    ];

    window.onload=function(){
      deletTiem();

    };

    function deletTiem(){
      $(".cal-events .event-item").hover(function(){
        $(this).append("<span class='deleteBtn'>X</span>");
        $(".deleteBtn").unbind('click').click(function(){
          if(confirm('确认删除吗？')){
            var i=$(this).parent().index();
            arr.splice(i,1)
          }else{
            return
          }
        });
      },function(){
        $(".deleteBtn").remove()
      });
    }



  export default {
    data () {
      return {
        demoEvents:arr,
        option:[
          {text:'清明节',value:'2018/4/5'},
          {text:'端午节',value:'2018/5/15'}
        ],
        selct:'',
        value:''
      }
    },

    methods: {
      monthChange (month) {
        console.log(month)
      },
      changeDate(day) {
        deletTiem()

//      Append
        $(".dates .item").unbind('click').click(function(){
          $(".select-event").remove();
          $(".dates .item").removeClass("today");
          $(this).append('<span class="select-event"></span>').addClass("today");

        });

        $(".dates .item").click(function(){
          var ttoday=$.trim($(this).text());
          if(!(ttoday=="")){
            $(".events-wrapper .date").text(ttoday)
          }else{
            $(".events-wrapper .date").text('--')
          }
        })

      },

      selectVal(){
        let sval= $("#selval").val();
        this.$EventCalendar.toDate(sval);
        let l=sval.lastIndexOf('/')+1;
        let s=sval.slice(l);
        $(".events-wrapper .date").text(s)
      },

      today(){
        let tdata=new Date();
        let y=tdata.getFullYear();
        let m=tdata.getMonth()+1;
        let d=tdata.getDate();
        this.$EventCalendar.toDate(y+'/'+m+'/'+d)
        $(".events-wrapper .date").text(d)
      },

      qjbtn(){
        let qjVal=$(".qj-select").val();
        let obj={
          date:qjVal,
          title:'请假'
        }
        arr.push(obj);
        $("#dataTip").hide();
        $(".select-event").remove();
      },

      addRemind(){
        if($(".dates .item").hasClass("today")){
          if($.trim($(".today").text())!=""){
            let Atop = $(".today").offset().top;
            let Aleft = $(".today").offset().left;
            let dateD=$.trim($(".today").text())
            let dateYM=$(".cal-header .title").text().replace('年','/').replace('月','/');
            $("#remind").css({'top':Atop-20,'left':Aleft-196,'display':'block'});
            $("#leave").hide();
            console.log(dateYM+dateD)
          }else{
            console.log("Date is Null")
          }
        }
      },
      escRem(){
        $("#remind,#leave").hide();
      },
      addLeave(){
        if($(".dates .item").hasClass("today") ) {
          if ($.trim($(".today").text()) != "") {
            let Atop = $(".today").offset().top;
            let Aleft = $(".today").offset().left;
            let dateD = $.trim($(".today").text())
            let dateYM = $(".cal-header .title").text().replace('年', '/').replace('月', '/');
            $("#leave").css({'top': Atop - 20, 'left': Aleft - 196, 'display': 'block'});
            $("#remind").hide();
            $(".sTime").val(dateYM + dateD+" "+"9:00")
            $(".eTime").val(dateYM + dateD+" "+"18:00")
            console.log(dateYM + dateD)
          }
        }
      }

    }
  }
</script>