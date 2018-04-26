<style>
    .imgEditorCom{width:650px;height:500px;}
    .imgFocus{margin-bottom:5px;}
    .imgFocus img{width:100%;height:100%;}
    .chooseBox{height:auto;position:absolute;z-index:100;background:#fff;box-shadow:#000 0 0 2px;-webkit-box-shadow:#000 0 0 2px}
    .chooseBox ul{width:100%;height:auto;cursor:pointer;list-style:none}
    .chooseBox ul li{width:100%;height:20px;color:#000;font-size:12px;text-align:center;line-height:20px;padding:0px 4px;}
    .chooseBox ul li:hover{background:#3498db;color:#fff}
    .inputSignBox{width:250px;height:120px;position:absolute;z-index:200;background:#fff;box-shadow:#000 0 0 4px;-webkit-box-shadow:#000 0 0 4px;-webkit-border-radius:0px;overflow:hidden}
    .outSignbox{width:100%;height:29px;color:#1b1b1b;line-height:29px;text-align:center;font-size:16px;cursor:pointer;font-weight:bold;border-bottom:#d9d6d6 1px solid}
    .signbox{width:240px;height:62px;line-height:17px;outline:0;margin:0 auto;color:#000;font-size:14px;font-weight:400;overflow:hidden;text-align:left}
    .signbox em{width:auto;height:17px;line-height:17px;color:#a8a8a8;font-style:normal;}
    .sureSign{width:100%;height:29px;border-top:#d9d6d6 1px solid;line-height:29px;text-align:center;cursor:pointer;font-weight:bold;font-size:14px;color:#fff;background:#3498db}
    .signIndex{width:15px;height:15px;border:rgba(251,251,251,0.4) 3px solid;position:absolute;z-index:99;border-radius:100%;text-align:center;line-height:25px;}
    .hintBox{margin:0;position:absolute;min-width:50px;max-width:240px;max-height:100px;min-height:20px;z-index:101;background:rgba(0,0,0,0.5);color:#fff;line-height:20px;font-size:12px;text-align:center}
    .triangle-down{position:absolute;width:0;height:0;border-left:10px solid transparent;border-right:10px solid transparent;border-top:5px solid rgba(0,0,0,0.5);z-index:101}
    .signIndex .hintBox{top:-28px;left:-45px;width:100px;padding-left:5px;overflow:hidden;text-overflow:ellipsis;white-space: nowrap;border-radius:4px;}
    .signIndex .triangle-down{left:-5px;top:-8px;}
</style>
<template>
    <div class="imgEditorCom">
        <div class="imgFocus" id="signx"><img v-for="item in IMGdata" :src="item.file"/></div>
        <button class="actionPost">确认</button>
    </div>
</template>
<script>
  import {baseUrl} from '../../../config/env.js'
  export default {
    data () {
      return {
        data:[],
        mdata:[],
        IMGdata:[],
        fileID:11
      }
    },
    mounted(){
      this.get();
    },
    methods:{
      defue(fileID){
        (function($){
          var cX,cY,indexId=0,removeId,Data=[],DOM,changeSignColor=false,signColor;
          var changeBodyColor=false,bodyColor,changeFontColor=false,fontColor;
          var Rleft,Rtop;//需要删除的坐标
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

            //鼠标右键
            $(document).on("mousedown",dom,function(e){
              e.preventDefault();
              if(e.which==3){
                $(".inputSignBox").remove();
                var l=e.clientX-$(dom).offset().left;
                var t=e.clientY-$(dom).offset().top;
                cX=l;
                cY=t;
                $(dom).append("<div class='inputSignBox'></div>");
                $('.inputSignBox').append("<div class='outSignbox'>X</div>");
                $('.inputSignBox').append("<div class='signbox' contenteditable='true' id='inputText' tabindex='-1'><em id='deflutText'>输入标记</em></div>");
                $('.inputSignBox').append("<div class='sureSign'>确定</div>");
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
                $(dom).append("<div class='signIndex' id='Ts"+indexId+"' theSign='"+text+"'>"+"<div class='triangle-down'></div><div class='hintBox'"+"title="+text+">"+text+"</div>"+"</div>");
                $('#Ts'+indexId).css({"left":cX-15,"top":cY-15});
                if(changeSignColor){
                  $('#Ts'+indexId).css("border",signColor+" 3px solid");
                }//改变了颜色
                var mes={left:cX-15,top:cY-15,message:text};
                Data[Data.length]=mes;
              }
            });//确认编辑
            $(document).on('mousedown','[id*=Ts]',function(e){
              var m=$(this).attr('id').replace(/[^0-9]/ig, "");
              if(e.which==3){
                e.stopPropagation();
                removeId=m;
                $('.chooseBox').remove();
                Rleft=$(this).css("left").replace(/[^0-9]/ig, "");
                Rtop=$(this).css("top").replace(/[^0-9]/ig, "");
                var l=e.clientX-$(dom).offset().left,t=e.clientY-$(dom).offset().top;
                $(dom).append("<div class='chooseBox'><ul><li id='deleteSign'>删除</li></ul></div>");
                $('.chooseBox').css({"left":l,"top":t});
              }
            });//弹出取消标记
            $(document).on('click','#deleteSign',function(){
              deleteData(Rleft,Rtop);
              $('#Ts'+removeId).remove();
            });//删除标记
          
            $(document).click(function(){
              $('.chooseBox').remove();
            });
            //点击消失
          }
          function deleteData(left,top){
            for(var i=0;i<Data.length;i++){
              if(Data[i].left==left&&Data[i].top==top){
                Data.splice(i,1);
                break;
              }else{
                continue;
              }
            }
          }//删除数据
          function loading(data){
            var l=Data.length;
            for(var i=0;i<data.length;i++){
              indexId++
              $(DOM).append("<div class='signIndex' id='Ts"+l+"' theSign='"+data[i].message+"'>"+"<div class='triangle-down'></div><div class='hintBox'"+"title="+data[i].message+">"+data[i].message+"</div>"+"</div>");
              $('#Ts'+l).css({"left":Number(data[i].left),"top":Number(data[i].top)});
              if(changeSignColor){
                $('#Ts'+l).css("border",signColor+" 3px solid");
              }//改变了颜色
              l++;
            }
            indexId=l;
          }//载入数据

          $(".actionPost").click(function(){
            var url=baseUrl+'index.php?r=task/task/inside-audit';
            var ImgData={
                  "stage_id": 49,
                  "audit": 2,
                  "feedbac": "",
                  "file": [{
                    "file_id": fileID,
                    "tag": Data
                  }]
                }
            $.ajax({
              type:'post',
              url:url,
              data:ImgData,
              async:true,
              dataType:"json",
              success:function(msg){
               console.log(msg)
             },
             error:function(){
               alert('请求失败!')
             }
             
            })
              console.log(ImgData)
          })

        })(jQuery);
      },
      imgdef(){
        $.sign.bindSign('#signx');
        $.sign.loadingSign(this.data);
      },
      get(){
        let url=baseUrl+'index.php?r=task/task/stage-list';
        let params={
          'task_id':109
        };
        this.$http.get(url,{params:params}).then(function(msg){
            let Sdate=msg.data.data
            Sdate.forEach(function(element) {
             if(element.hasOwnProperty("file")){
                  this.mdata.push(element.file)
             }        
            },this);
            let Vdata,VIdata
            let fileID=this.fileID
            this.mdata.forEach(function(Melement,index){
              for(let i=0;i<Melement.length;i++){
                if(Melement[i].id==fileID){
                  Vdata=Melement[i].tag;
                  VIdata=Melement[i];
                }
              }
            })
            this.data=Vdata;
            this.IMGdata.push(VIdata);
            this.defue(this.fileID);
            this.imgdef();
        },()=>{
          alert('请求失败！')
        })
       
      }
    }

  }
</script>