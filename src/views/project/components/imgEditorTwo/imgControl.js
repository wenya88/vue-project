const canvasControl=()=>{
<<<<<<< HEAD
=======
       
>>>>>>> f130195071cc2d236642970d18c0f3f6f893b3a0
        let oSign = document.getElementById("signx");
        let oCanvas=document.getElementById("cav");
        let oImg=document.getElementById("oImg");
        let controlDiv=document.getElementsByClassName("oControl")[0];
        let addEvent=(obj, sType, fn)=>{
                if (obj.addEventListener) {
                    obj.addEventListener(sType, fn, false);
                } else {
                    obj.attachEvent('on' + sType, fn);
                }
            };
        
        let removeEvent=(obj, sType, fn)=>{
                if (obj.removeEventListener) {
                    obj.removeEventListener(sType, fn, false);
                } else {
                    obj.detachEvent('on' + sType, fn);
                }
            };
        
        let prEvent=(ev)=>{
                var oEvent = ev || window.event;
                if (oEvent.preventDefault) {
                    oEvent.preventDefault();
                }
                return oEvent;
            }
        
<<<<<<< HEAD
            
=======
>>>>>>> f130195071cc2d236642970d18c0f3f6f893b3a0
        let addWheelEvent=(obj, callback)=>{
                if (window.navigator.userAgent.toLowerCase().indexOf('firefox') != -1) {
                    addEvent(obj, 'DOMMouseScroll', wheel);
                } else {
                    addEvent(obj, 'mousewheel', wheel);
                }
                function wheel(ev) {
                    var oEvent = prEvent(ev),
                    delta = oEvent.detail ? oEvent.detail > 0 : oEvent.wheelDelta < 0;
                    callback && callback.call(oEvent, delta);
                    return false;
                }
        };

        addEvent(controlDiv, 'mousedown', function(ev) {
            let oEvent = prEvent(ev);
            let oParent = oSign.parentNode;
            let disX = oEvent.clientX - oSign.offsetLeft;
            let disY = oEvent.clientY - oSign.offsetTop;
            let startMove = function(ev) {
                if (oParent.setCapture) {
                    oParent.setCapture();
                }
                let oEvent = ev || window.event,
                l = oEvent.clientX - disX,
                t = oEvent.clientY - disY;
<<<<<<< HEAD
                // console.log(l,t)

=======
                // console.log("l:"+l,"t:"+t)
                
                // oCanvasMove
                // oCanvas.style.left = l +'px';
                // oCanvas.style.top = t +'px';

                // imageMove
                oImg.style.left = l +'px';
                oImg.style.top = t +'px';
    
>>>>>>> f130195071cc2d236642970d18c0f3f6f893b3a0
                // divMove
                oSign.style.left = l +'px';
                oSign.style.top = t +'px';

    
                oParent.onselectstart = function() {
                    return false;
                }
            }; 
            let endMove = function(ev) {
                if (oParent.releaseCapture) {
                    oParent.releaseCapture();
                }
                oParent.onselectstart = null;
                removeEvent(oParent, 'mousemove', startMove);
                removeEvent(oParent, 'mouseup', endMove);
            };
            addEvent(oParent, 'mousemove', startMove);
            addEvent(oParent, 'mouseup', endMove);
            return false;
        });
<<<<<<< HEAD
        let restrict=1.1;
        let totalNum=0;
        addWheelEvent(controlDiv, function(delta) {
            let ratioL = (this.clientX - oSign.offsetLeft) / oSign.offsetWidth;
            let ratioT = (this.clientY - oSign.offsetTop) / oSign.offsetHeight;
            let sginDiv=document.getElementsByClassName('signIndex');
            // let ratioDelta = !delta ? 1 + 0.1 : 1 - 0.1;
            let w,h
            if(!delta){
                totalNum++
                w = Math.round(oSign.offsetWidth * restrict);
                h = Math.round(oSign.offsetHeight * restrict);
                if(sginDiv.length>0){
                    for(let i=0;i<sginDiv.length;i++){
                        sginDiv[i].style.left=Math.round(parseInt(sginDiv[i].style.left)*restrict)+1+'px';
                        sginDiv[i].style.top=Math.round(parseInt(sginDiv[i].style.top)*restrict)+3+'px';
                    }
                }
            }else{
                totalNum--
                w = Math.round(oSign.offsetWidth / restrict);
                h = Math.round(oSign.offsetHeight / restrict);
                if(sginDiv.length>0){
                    for(let i=0;i<sginDiv.length;i++){
                        sginDiv[i].style.left=Math.round(parseInt(sginDiv[i].style.left)/restrict)-1+'px';
                        sginDiv[i].style.top=Math.round(parseInt(sginDiv[i].style.top)/restrict)-3+'px';
                    }
                }
            }
            sessionStorage.totalNum=totalNum;
            // let w = Math.ceil(oSign.offsetWidth * ratioDelta);
            // let h = Math.ceil(oSign.offsetHeight * ratioDelta);
            
            let l = Math.round(this.clientX - (w * ratioL));
            let t = Math.round(this.clientY - (h * ratioT));
           
            // console.log("w:"+w,"h:"+h,"l:"+l,"t:"+t,"totalNum:"+totalNum);
            // imgChange

            oImg.style.width=w +'px';
            oImg.style.height=h +'px';
            // oImg.style.left=l +'px';
            // oImg.style.top=t +'px';
=======
       
        addWheelEvent(controlDiv, function(delta) {
            let ratioL = (this.clientX - oSign.offsetLeft) / oSign.offsetWidth;
            let ratioT = (this.clientY - oSign.offsetTop) / oSign.offsetHeight;
            let ratioDelta = !delta ? 1 + 0.1 : 1 - 0.1;
            let w = parseInt(oSign.offsetWidth * ratioDelta);
            let h = parseInt(oSign.offsetHeight * ratioDelta);
            let l = Math.round(this.clientX - (w * ratioL));
            let t = Math.round(this.clientY - (h * ratioT));
            // console.log("w:"+w,"h:"+h,"l:"+l,"t:"+t)
            // imgChange
            oImg.style.transform=w +'px';
            oImg.style.height=h +'px';
            oImg.style.left=l +'px';
            oImg.style.top=t +'px';
>>>>>>> f130195071cc2d236642970d18c0f3f6f893b3a0
            
            // divChange
            oSign.style.width=w +'px';
            oSign.style.height=h +'px';
            oSign.style.left=l +'px';
            oSign.style.top=t +'px';

            // canvasChange
            oCanvas.style.width=w +'px';
            oCanvas.style.height=h +'px';
            // oCanvas.style.left=l +'px';
            // oCanvas.style.top=t +'px';

<<<<<<< HEAD
            controlDiv.style.width=w +'px';
            controlDiv.style.height=h +'px';

=======
>>>>>>> f130195071cc2d236642970d18c0f3f6f893b3a0
        });
        
}
export{canvasControl}