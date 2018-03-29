
window.onload=function(){

  (function getGantt(num){
    $.ajax({
      type:"get",
      url:"http://192.168.2.19/index.php?r=task/task/list&project_id="+num,
      async:true,
      dataType:"json",
      success:function(msg){
        var data=msg.data;
        if(msg.err_code==0){
          var arr=[];
          $.each(data,function(index,item){
            var obj={
              "id":item.id,
              "name":item.name,
              "code":item.tasktype_name,
              "level":1,
              "status":item.status,
              "canWrite":true,
              "start":item.expect_start_time,
              "duration":item.expect_work_day,
              "end":item.expect_end_time,
              "startIsMilestone":true,
              "endIsMilestone":false,
              "collapsed":false,
              "assigs":[],
              "hasChild":true
            }
            arr.push(obj)
          });

          arr.forEach(function(aitem){
            if(aitem.status=='1'){
              aitem.status="STATUS_FAILED";
            }else if(aitem.status=='2'){
              aitem.status="STATUS_SUSPENDED";
            }else if(aitem.status=='3'){
              aitem.status="STATUS_DONE";
            }else if(aitem.status=='4'){
              aitem.status="STATUS_ACTIVE";
            }
          })

          var ssta='{"tasks":[';
          for(var i=0;i<arr.length;i++){

            var fsta
            fsta+="{"+'"id":'+arr[i].id+','+'"name":'+'"'+arr[i].name+'",'+'"code"'+":"+'"'+arr[i].code+'",'+'"level"'+":"+arr[i].level+","+'"status"'+":"+'"'+arr[i].status+'",'+'"canWrite"'+":"+arr[i].canWrite+',"start":'+arr[i].start+',"duration":'+arr[i].duration+',"end":'+arr[i].end+',"startIsMilestone":'+arr[i].startIsMilestone+',"endIsMilestone":'+arr[i].endIsMilestone+',"collapsed":'+arr[i].collapsed+',"assigs":'+'['+arr[i].assigs+']'+',"hasChild":'+arr[i].hasChild+"},"
          }
          var este='],"selectedRow":0,"canWrite":true,"canWriteOnParent":true}';
          var rfast=fsta.substring(9,fsta.length-1);
          document.getElementById('ta').value=ssta+rfast+este;
          loadGanttFromServer()
        }
      },
      error:function() {
        alert('Error')
      }
    })
  })(2);
}
