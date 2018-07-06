//canvas
const imgCanvas=(action,canvasW,canvasH)=>{
    var cavs,cavT;
    var iMouse=false;
    var startT={x:0,y:0};
    function cavsTo(x,y){
        var cbox=cavs.getBoundingClientRect();
        return {x:x-cbox.left,y:y-cbox.top}
    }
   
   function canvasRun(){
        cavs=document.getElementById("cav");
        cavT=cavs.getContext("2d");
        cavT.fillStyle='rgba(0,0,0,0.5)';
        cavT.fillRect(0,0,canvasW,canvasH);
        if(action=="true"){
            cavT.clearRect(0,0,10000,10000);
        }
        cavs.onmouseup=function(e){
            iMouse=false;
        }
        cavs.onmouseout=function(e){
            iMouse=false;
        }
        
        cavs.onmousedown=function(e){
            iMouse=true;
            startT=cavsTo(e.clientX,e.clientY);
        }
        cavs.onmousemove=function(e){
            if(iMouse){
                var stopT=cavsTo(e.clientX,e.clientY);
                cavT.beginPath();
                cavT.lineWidth="3";
                cavT.strokeStyle="#e43";
                cavT.moveTo(startT.x,startT.y);
                cavT.lineTo(stopT.x,stopT.y);
                cavT.lineJoin="round";
                cavT.lineCap="round";
                cavT.stroke();
                startT=stopT;
            }
        }
    }
    canvasRun();
}
export{imgCanvas}