window.onload=function(){
  function getGantt(num){
    $.ajax({
      type:"get",
      url:ganttURL+"task/task/list&project_id="+num,
      async:true,
      dataType:"json",
      success:function(msg){
        var data=msg.data;
        if(msg.err_code==0){
          var arr=[];
          var Parr=[];
          $.each(data,function(index,item){
            var obj={
              "id":item.id,
              "name":item.name,
              "code":item.tasktype_name,
              "projectChild":item.project_child,
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
            var Pobj={
              "project":item.project
            }
            arr.push(obj)
            Parr.push(Pobj)
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
          });

          var proChild;
          var projectID=Parr[0].project;
          var projectID=1
            $.ajax({
              type:"get",
              async:false,
              url:ganttURL+"task/project/child-list&id="+projectID,
              dataType:"json",
              success:function(data){
                proChild=data.data
              }
            });
          

          proChild.forEach(function(pitem){
              arr.forEach(function(patime){
                if(patime.projectChild==pitem.id){
                  patime.projectChild=pitem.name
                }else{
                  patime.projectChild="----"
                }
              })
          });


          var ssta='{"tasks":[';
          for(var i=0;i<arr.length;i++){

            var fsta
            fsta+="{"+'"id":'+arr[i].id+','+'"name":'+'"'+arr[i].name+'",'+'"code"'+":"+'"'+arr[i].code+'",'+'"projectChild"'+":"+'"'+arr[i].projectChild+'",'+'"level"'+":"+arr[i].level+","+'"status"'+":"+'"'+arr[i].status+'",'+'"canWrite"'+":"+arr[i].canWrite+',"start":'+arr[i].start+',"duration":'+arr[i].duration+',"end":'+arr[i].end+',"startIsMilestone":'+arr[i].startIsMilestone+',"endIsMilestone":'+arr[i].endIsMilestone+',"collapsed":'+arr[i].collapsed+',"assigs":'+'['+arr[i].assigs+']'+',"hasChild":'+arr[i].hasChild+"},"
          }
          var este='],"selectedRow":0,"canWrite":true,"canWriteOnParent":true}';
          var rfast=fsta.substring(9,fsta.length-1);
          document.getElementById('ta').value=ssta+rfast+este;
          loadGanttFromServer();

          var taskTag=[
            {"name":"原画组","num":10,"taskID":"yh"},
            {"name":"特效组","num":7,"taskID":"tx"},
            {"name":"动作组","num":15,"taskID":"dz"},
            {"name":"策划组","num":3,"taskID":"ch"}
          ];
          var str="<option>----</option>"
          taskTag.forEach(function(item){
            str+="<option value="+item.name+">"+item.name+"</option>"
          })
          $(".selectStyle select").append(str)
        }
      },
      error:function() {
        // alert('请求失败')
      }
    })
  };
  getGantt(userId);
}
