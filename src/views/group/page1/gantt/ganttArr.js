
window.onload=function(){
  var arr={"tasks":[
    {"id":-1,"name":"新飞翔设计公司","code":"","level":1,"status":"STATUS_ACTIVE","canWrite":true,"start":1396994400000,"duration":5,"end":1399672799999,"startIsMilestone":true,"endIsMilestone":false,"collapsed":false,"assigs":[],"hasChild":true},
    {"id":-2,"name":"20个图标","code":"特效","level":1,"status":"STATUS_DONE","canWrite":true,"start":1396994400000,"duration":15,"end":1399672799999,"startIsMilestone":true,"endIsMilestone":false,"collapsed":false,"assigs":[],"hasChild":false},
    {"id":-3,"name":"Gantt editor","code":"地编","level":1,"status":"STATUS_SUSPENDED","canWrite":true,"start":1396994400000,"duration":15,"end":1399672799999,"startIsMilestone":true,"endIsMilestone":false,"collapsed":false,"assigs":[],"hasChild":true}
  ],"selectedRow":0,"canWrite":true,"canWriteOnParent":true}

    var ssta='{"tasks":[';
    for(var i=0;i<arr.tasks.length;i++){
      var fsta
      fsta+="{"+'"id":'+arr.tasks[i].id+','+'"name":'+'"'+arr.tasks[i].name+'",'+'"code"'+":"+'"'+arr.tasks[i].code+'",'+'"level"'+":"+arr.tasks[i].level+","+'"status"'+":"+'"'+arr.tasks[i].status+'",'+'"canWrite"'+":"+arr.tasks[i].canWrite+',"start":'+arr.tasks[i].start+',"duration":'+arr.tasks[i].duration+',"end":'+arr.tasks[i].end+',"startIsMilestone":'+arr.tasks[i].startIsMilestone+',"endIsMilestone":'+arr.tasks[i].endIsMilestone+',"collapsed":'+arr.tasks[i].collapsed+',"assigs":'+'['+arr.tasks[i].assigs+']'+',"hasChild":'+arr.tasks[i].hasChild+"},"
    }
    var este='],"selectedRow":0,"canWrite":true,"canWriteOnParent":true}';
    var rfast = fsta.substring(9,fsta.length-1);

    document.getElementById('ta').value=ssta+rfast+este;
  loadGanttFromServer()
}
