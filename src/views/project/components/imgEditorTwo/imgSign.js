const imgSign=function(AllowEdit){
    var Data=[];
    (function($){
        var cX,cY,indexId=0,removeId,DOM;
        var Rleft,Rtop,TVT,TnT;//需要删除的坐标
        jQuery.sign={
          bindSign:function(dom){
            DOM=dom;
            defined(dom);
          },
          loadingSign:function(data){
            loading(data);
            Data.concat(data);
          }
        };
        document.oncontextmenu = function(e){
          e.preventDefault();
        };//阻止鼠标右键默认事件
        $(document).on('click','.imgFocus img',function(e){
            $(".inputSignBox").hide();
            e.stopPropagation;
        });

        function defined(dom){
          //是否显示标记
          if(!AllowEdit){
              return
          }
          //鼠标右键
          $(document).on("mousedown",dom,function(e){
            e.preventDefault();
            if(e.which==3){
              $(".inputSignBox").remove();
              $(".editSginDiv").hide();
              var l=e.clientX-$(dom).offset().left;
              var t=e.clientY-$(dom).offset().top;
              cX=l;
              cY=t;
              $(dom).append("<div class='inputSignBox'></div>");
              $('.inputSignBox').append("<div class='outSignbox'>X</div>");
              $('.inputSignBox').append("<div class='signbox' contenteditable='true' id='inputText' tabindex='-1'><em id='deflutText'>输入标记</em></div>");
              $('.inputSignBox').append("<div class='sureSign'>标注</div>");
              $('.inputSignBox').css({"left":cX,"top":cY});
              e.stopPropagation();
            }
          });
          //添加编辑
          $(document).on('click','#inputText',function(){
            $(this).focus();
            $('.signbox em').remove();
          });//编辑框聚焦
          $(document).on('click','.outSignbox',function(){
            $('.inputSignBox').remove();
          });//退出编辑
          $(document).on('click','.sureSign',function(){
            if($('.signbox em').length>0){
              $('.inputSignBox').remove();
            }else if($('.signbox').text().length<=0){
              $('.inputSignBox').remove();
            }else{
              indexId++;
              var text=$.trim($('.signbox').text());
              $('.inputSignBox').remove();
              $(dom).append("<div class='signIndex' id='Ts"+indexId+"' theSign='"+text+"' data-index='"+indexId+"'>"+"<div class='hintBox'"+"title="+text+">"+text+"</div>"+"</div>");
              $('#Ts'+indexId).css({"left":cX-11,"top":cY-29});
              var mes={left:cX-11,top:cY-29,message:text,index:indexId};
              var ToT=sessionStorage.totalNum;
              var TuT=1.1;
              if(ToT>0){
                //放大
                 for(let k=0;k<ToT;k++){
                    mes.left=Math.round(mes.left/TuT);
                    mes.top=Math.round(mes.top/TuT);
                 }
                Data[Data.length]=mes;
              }else if(ToT==undefined||ToT==0){
                //原始尺寸
                Data[Data.length]=mes;
              }else if(ToT<0){
                //缩小
                for(let k=0;k<Math.abs(ToT);k++){
                    mes.left=Math.round(mes.left*TuT);
                    mes.top=Math.round(mes.top*TuT);
                }
                Data[Data.length]=mes;
             }
              sessionStorage.ImgData=JSON.stringify(Data)
            }
          });//确认编辑
          $(document).on('mouseenter','[id*=Ts]',function(e){
            var m=$(this).attr('id').replace(/[^0-9]/ig, "");
              e.stopPropagation();
              removeId=m;
              $('.chooseBox').remove();
              Rleft=$(this).css("left").replace(/[^0-9]/ig, "");
              Rtop=$(this).css("top").replace(/[^0-9]/ig, "");
              TVT=$(this).attr('data-index');
              TnT=$.trim($(this).text())
              $(this).append("<div class='chooseBox'><ul><li class='edit' id='editSign'></li><li id='deleteSign'></li></ul></div>");
              $('.chooseBox').css({"left":34,"top":-20});
          });//弹出取消标记
          $(document).on('click','#deleteSign',function(){
            deleteData(TVT);
            $('#Ts'+removeId).remove();
          });//删除标记
        
          //编辑标记
          $(document).on('click','#editSign',function(){
            $(".inputSignBox").remove();
            $(".sginCanvas .editSginDiv").show().css({"top":(Rtop-40)+"px","left":(Rleft-100)+"px"});
            $(".sginCanvas #sginText").focus().val(TnT);
          })

          // 关闭标记
          $(".sginCanvas .editSignbox").click(function(){
             $(".sginCanvas .editSginDiv").hide();
          })

          // 提交修改
          $(".sginCanvas .sginEditCommit").click(function(){
              let sgintxt=$(".sginCanvas #sginText").val();
              let signIndex=document.getElementsByClassName("signIndex");
              for(let k=0;k<Data.length;k++){
                 if(Data[k].index==TVT){
                     Data[k].message=sgintxt;
                 }
              }
              sessionStorage.ImgData=JSON.stringify(Data);

              // 修改显示的文本
              for(let j=0;j<signIndex.length;j++){
                  if(signIndex[j].getAttribute("data-index")==TVT){
                    signIndex[j].firstChild.title=sgintxt;
                    signIndex[j].firstChild.innerText=sgintxt;
                  }
              }

              $(".sginCanvas .editSginDiv").hide();
          })

          $(document).click(function(){
            $('.chooseBox').remove();
          });
          //点击消失
        }
        function deleteData(TVT){
          for(var i=0;i<Data.length;i++){
            if(Data[i].index==TVT){
              Data.splice(i,1);
              sessionStorage.ImgData=JSON.stringify(Data);
              break;
            }else{
              continue;
            }
           
          }
        }//删除数据
        function loading(data){
           $(".signIndex").remove();
             if(data!=null){
               var l=Data.length;
                for(var i=0;i<data.length;i++){
                  indexId++
                  $(DOM).append("<div class='signIndex' id='Ts"+l+"' theSign='"+data[i].message+"'>"+"<div class='hintBox'"+"title="+data[i].message+">"+data[i].message+"</div>"+"</div>");
                  $('#Ts'+l).css({"left":Number(data[i].left),"top":Number(data[i].top)});
                  l++;
                }
              indexId=l;
             }
         
        }//载入数据
      })(jQuery);
}
export {imgSign}