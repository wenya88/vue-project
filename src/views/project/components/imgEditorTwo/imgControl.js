const canvasControl=()=>{
       
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
                // console.log("l:"+l,"t:"+t)
                
                // oCanvasMove
                // oCanvas.style.left = l +'px';
                // oCanvas.style.top = t +'px';

                // imageMove
                oImg.style.left = l +'px';
                oImg.style.top = t +'px';
    
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

        });
        
}
export{canvasControl}