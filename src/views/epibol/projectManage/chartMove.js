
const runMove=()=>{
	let oBox = document.getElementById('move');
	let nBox= document.getElementsByClassName('chartNav')[0];
		oBox.onmousedown = function(e){
			var oEvent =e || window.event,
				disL = oEvent.clientX - oBox.offsetLeft;
			document.onmousemove = function(e){
				var oEvent = e || window.event,
					disX = oEvent.clientX - disL;
				oBox.style.cursor='pointer';
                oBox.style.left = disX + 'px';
				nBox.style.left = disX + 'px';
			}
			return false
		}
		document.onmouseup = function(){
			document.onmousemove = null;
			oBox.style.cursor='default'
        };
        document.onmouseout=function(){
			document.onmousemove = null;
			oBox.style.cursor='default'
		}
	
}
const initW=(val)=>{
	let oBox = document.getElementById('move');
	let nBox= document.getElementsByClassName('chartNav')[0];
	oBox.style.left = -val + 'px';
    nBox.style.left = -val + 'px';
}
export {runMove,initW}