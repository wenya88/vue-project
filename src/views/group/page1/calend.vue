<template>
    <div>
        <div class="dateSelect">节假日:
             <select v-model="selct" @change="selectVal" id="selval">
            <option v-for="item in option" :value="item.value">{{item.text}}</option>
        </select>
            <button @click="today" class="dateBtn">按回今天</button>
        </div>
        <vue-event-calendar :events="demoEvents" @day-changed="changeDate" @month-changed="monthChange"></vue-event-calendar>

        <div id="dataTip"><span class="tipimg"></span>
            <dl>
                <dt>
                    <a href="#" class="active">请假</a>
                    <a href="#">加班</a>
                    <a href="#">提醒我</a>
                </dt>
                <dd style="display:block;">
                    <p><input type="text" class="qj-select" /> 至 <input type="text" class="qj-select" /></p>
                    <button @click.stop="qjbtn($event)">确定</button>
                </dd>
                <dd>
                    <p>设置<input type="text" class="jbrqdate">加班？</p>
                    <button @click.stop="jiaban($event)">确定</button>
                </dd>
                <dd>
                    <label><input type="radio"/>当日提醒</label>
                    <label><input type="radio"/>每周提醒</label>
                    <label><input type="radio"/>每月提醒</label>
                    <p>
                        <textarea></textarea>
                    </p>
                    <button @click.stop="jiaban($event)">确定</button>
                </dd>
            </dl>
        </div>
    </div>
</template>
<style>
    #dataTip{background:#f1f1f1;position:absolute;top:0;left:0;width:300px;height:140px;display:inline-block;display:none;z-index:100}
    #dataTip .tipimg{position:absolute;top:-8px;left:26px;width:15px;height:8px;background:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAICAYAAAAm06XyAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2RkI3NUFFMTIxRTcxMUU4QjM2MkY2RDE0NEQyQUI3MCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo2RkI3NUFFMjIxRTcxMUU4QjM2MkY2RDE0NEQyQUI3MCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjZGQTNDM0FBMjFFNzExRThCMzYyRjZEMTQ0RDJBQjcwIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjZGQTNDM0FCMjFFNzExRThCMzYyRjZEMTQ0RDJBQjcwIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+sDpH9gAAAEZJREFUeNpi+P//PwMurHR993988kwMOIDyjT3/kWlsgAmfRlx8nJpxKcQmzkSMRlzyTMRqxKaOiRSN6AYwgqKDgUwAEGAAT4FP0pvFUIAAAAAASUVORK5CYII=")}
    #dataTip dt{background:#22d7bb;height:30px;line-height:30px;padding:0px 10px;}
    #dataTip dt a{color:#fff;background:#ccc;padding:3px 5px;margin-right:4px;}
    #dataTip dt .active{background:#fff;color:#3bc3ad;}
    #dataTip dl{margin:0px;padding:0px;font-size:12px;}
    #dataTip dd{padding:0px;margin:0px;padding-left:10px;display:none;padding:5px 10px;}
    #dataTip dd span{color:#ff6600;margin:0px 4px;font-size:14px;font-weight:bold;}
    #dataTip dd input{width:100px;}
    #dataTip dd textarea{width:280px;resize:none;margin-top:5px;}
    #dataTip dd p{margin-bottom:5px;}
    .select-event{border:1px solid #f29543;border-radius:100%;width:36px;height:36px;position:absolute;left:50%;top:50%;z-index:1;margin-left:-18px;margin-top:-19px}
    .deleteBtn{background:#e43;color:#fff;width:16px;height:16px;position:absolute;line-height:16px;z-index:200;top:6px;right:-5px;text-align:center;border-radius:2px;cursor:pointer;}
    .dateSelect{position:absolute;z-index:200;margin-left:250px;margin-top:25px;}
    .dateBtn{border:0px;background:#18bfa4;color:#fff;padding:2px 10px;cursor:pointer;border-radius:4px;}
</style>
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
    }

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
        value:'',
      }
    },

    methods: {
      monthChange (month) {
        console.log(month)
      },
      changeDate(day) {
        deletTiem()
//      dblClick
        $(".dates .item").unbind('dblclick').dblclick(function(){

          let str =$.trim($(this).find('p').text())
          if(str==""){
            return
          }

          $(".jbrqdate").val(day.date)
          $(".qj-select").val(day.date)

          var top=$(this).offset().top-15;
          var left=$(this).offset().left-200;

          $("#dataTip").css({'top':top,'left':left,'display':'block'});

//        tag
          $("#dataTip dt a").click(function(){
            $(this).addClass("active").siblings().removeClass("active");
            var index=$(this).index();
            $("#dataTip dd:eq("+index+")").show().siblings("dd").hide();
          })

          $(document).click(function(){
            $("#dataTip").hide()
          })

          $("#dataTip").click(function(e){
            $(this).show()
            e.stopPropagation()
          })

        })

//      Append
        $(".dates .item").unbind('click').click(function(){
          $(".select-event").remove();
          $(this).append('<span class="select-event"></span>')

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
      jiaban(){
        let jbVal=$(".jbrqdate").val();
        let jbobj={
          date:jbVal,
          title:'加班'
        };
        arr.push(jbobj);
        $("#dataTip").hide();
        $(".select-event").remove();
      },

    }
  }
</script>