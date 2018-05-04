<template>
  <div>
    <ul id="treeDemo" class="ztree"></ul>
  </div>
</template>
<script>
import { cateList } from "../../../config/env.js";
import "../../project/style/js/jquery.ztree.core.js";
import "../../project/style/js/jquery.ztree.excheck.js";
import "../../project/style/js/jquery.ztree.exedit.js";
export default {
  data() {
    return {
      kNodes: []
    };
  },
  mounted() {
    this.ListEach();
  },
  methods: {
    get(url, params, call) {
      this.$http.get(url, { params: params }).then(
        function(res) {
          call(res);
        },
        function(error) {
          this.$Message.error("数据加载出错了！请刷新浏览器");
        }
      );
    },
    //遍历列表分类数据
    ListEach() {
      let fiC = this;
      this.get(
        cateList,
        {
          company_id: 1
        },
        res => {
          let getData = res.data.data,
            item = [];
          getData.forEach(req => {
            let obj = {};
            obj.name = req.name;
            obj.pId = req.cate_id;
            obj.id = req.id;
            if (req.tasktype.length > 0) {
              obj.id = req.id;
              obj.children = fiC.eachLxinfo(req.tasktype);
            }
            item.push(obj);
          });
          fiC.kNodes = item;
          fiC.kNodes[0].open = true;
          fiC.lxInfo();
        }
      );
    },
    //类型列表遍历
    lxInfo() {
      let _this = this;
      $(document).ready(function() {
        var setting = {
          callback: {
            onClick: zTreeOnClick,
            beforeEditName: zTreeBeforeEditName
          },
          view: {
            addHoverDom: addHoverDom,
            removeHoverDom: removeHoverDom,
            selectedMulti: false
          },
          //是否启动checkbox按钮
          check: {
            enable: false
          },
          data: {
            simpleData: {
              enable: true
            }
          },
          //是否启动编辑，删除按钮
          edit: {
            enable: true
          }
        };
        //点击列表
        function zTreeOnClick(event, treeId, treeNode) {
          let id = treeNode.id;
          let liName = treeNode.name;
          if ((id, liName)) {
            _this.$emit("getListId", id, liName);
          }
        }
        let newCount = 1;
        //鼠标移动到节点上时，显示用户自定义控件
        function addHoverDom(treeId, treeNode) {
          //增加按钮的样式
          let sObj = $("#" + treeNode.tId + "_span");
          if (treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0)
            return;
          let addStr =
            "<span class='button add' id='addBtn_" +
            treeNode.tId +
            "' title='新增类型' onfocus='this.blur();'></span>";
          sObj.after(addStr);
          //增加方法
          let btn = $("#addBtn_" + treeNode.tId);
          if (btn)
            btn.bind("click", function() {
              console.log("新增列表");
              let zTree = $.fn.zTree.getZTreeObj("treeDemo");
              zTree.addNodes(treeNode, {
                id: 100 + newCount,
                pId: treeNode.id,
                name: "自定义类型" + newCount++
              });
              var nodes = treeNode.children;
              console.log(nodes.length - 1);
              if (nodes.length > 0) {
                zTree.selectNode(nodes[nodes.length - 1]);
              }
              return false;
            });
        }
        // 禁止修改父节点名称
        function zTreeBeforeEditName(treeId, treeNode) {
          return !treeNode.isParent;
        }
        // 鼠标移出节点时，隐藏用户自定义控件
        function removeHoverDom(treeId, treeNode) {
          $("#addBtn_" + treeNode.tId)
            .unbind()
            .remove();
        }
        $.fn.zTree.init($("#treeDemo"), setting, _this.kNodes);
      });
    },
    //循环子数据
    eachLxinfo(data) {
      let im = [];
      data.forEach(req => {
        let obj = {};
        obj.name = req.tasktype_name;
        obj.id = req.id;
        obj.pId = req.category_id;
        im.push(obj);
      });
      return im;
    }
  }
};
</script>
<style>
@import "../../project/style/taskCss/bootstrapStyle.css";
</style>
