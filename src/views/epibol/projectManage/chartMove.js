
const runMove=(style)=>{
	let oBox = document.getElementById('move');
	let nBox = document.getElementsByClassName('chartNav')[0];
	let mBox = document.getElementsByClassName('MchartNav')[0];
		oBox.onmousedown = function(e){
			var oEvent =e || window.event,
				disL = oEvent.clientX - oBox.offsetLeft;
			document.onmousemove = function(e){
				var oEvent = e || window.event,
					disX = oEvent.clientX - disL;
				oBox.style.cursor='pointer';
				oBox.style.left = disX + 'px';
				if(style=='week'){
					nBox.style.left = disX + 'px';
				}else if(style=='month'){
					mBox.style.left = disX + 'px';
				}
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
const initW=(val,style)=>{
	let num=null;
	let oBox = document.getElementById('move');
	let nBox = document.getElementsByClassName('chartNav')[0];
	let mBox = document.getElementsByClassName('MchartNav')[0];
	let oRangeW= document.getElementById('range').clientWidth/4;
	if(style=='week'){
		num=20;
		oBox.style.left = -((val*num)-oRangeW) + 'px';
		nBox.style.left = -((val*num)-oRangeW) + 'px';
	}else if(style=='month'){
		num=10;
		oBox.style.left = -((val*num)-oRangeW) + 'px';
		mBox.style.left = -((val*num)-oRangeW) + 'px';
	}
	
}
export {runMove,initW}