<style lang="less">
    @import '../../../styles/calend.less';
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
          var ttoday=$.trim($(this).text());
          if(!(ttoday=="")){
            $(".events-wrapper .date").text(ttoday)
          }else{
            $(".events-wrapper .date").text('--')
          }

          console.log($(".today").offset().top)

        });
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
            let Atop = $(".today").position().top+194;
            let Aleft = $(".today").offset().left;
            let dateD=$.trim($(".today").text())
            let dateYM=$(".cal-header .title").text().replace('年','/').replace('月','/');
            $("#remind").css({'top':Atop-20,'left':Aleft-257,'display':'block'});
            $("#leave").hide();
            console.log(Atop)
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
            let Atop = $(".today").position().top+194;
            let Aleft = $(".today").offset().left;
            let dateD = $.trim($(".today").text())
            let dateYM = $(".cal-header .title").text().replace('年', '/').replace('月', '/');
            $("#leave").css({'top': Atop - 20, 'left': Aleft - 257, 'display': 'block'});
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