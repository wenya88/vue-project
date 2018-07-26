const AutoResizeImage=(maxWidth,maxHeight,objImg)=>{
    let img = new Image();
    img.src = objImg.src;
    let hRatio;
    let wRatio;
    let Ratio = 1;
    let w = img.width;
    let h = img.height;
    wRatio = maxWidth / w;
    hRatio = maxHeight / h;
    if (maxWidth ==0 && maxHeight==0){
        Ratio = 1;
      }else if (maxWidth==0){//

        if (hRatio<1) Ratio = hRatio;

      }else if (maxHeight==0){

        if (wRatio<1) Ratio = wRatio;
      }else if (wRatio<1 || hRatio<1){

        Ratio = (wRatio<=hRatio?wRatio:hRatio);

      }
      if (Ratio<1){
      w = w * Ratio;
      h = h * Ratio;
    }
    objImg.height = h;
    objImg.width = w;
}
export {AutoResizeImage};