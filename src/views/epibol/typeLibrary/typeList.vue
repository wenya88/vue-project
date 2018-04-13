<template>
    <div>
        <ul id="treeDemo" class="ztree"></ul>
    </div>
</template>
<script>
    import "../../project/style/js/jquery.ztree.core.js";
    import "../../project/style/js/jquery.ztree.excheck.js";
    import "../../project/style/js/jquery.ztree.exedit.js";

    let setting = {
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

    let kNodes = [
        {id: 1, pId: 0, name: "系統默认(12)", open: true},
        {id: 101, pId: 1, name: "原画"},
        {id: 102, pId: 1, name: "特效"},
        {id: 103, pId: 1, name: "动作"},
        {id: 104, pId: 1, name: "次世代"},
        {id: 108, pId: 1, name: "图标"},
        {id: 2, pId: 0, name: "自定义类型", open: false},
        {id: 201, pId: 2, name: "节点1"},
        {id: 202, pId: 2, name: "节点2"},
        {id: 203, pId: 2, name: "节点3"}
    ];

    $(document).ready(function () {
        $.fn.zTree.init($("#treeDemo"), setting, kNodes);
    });
    let newCount = 1;
    function addHoverDom(treeId, treeNode) {
        let sObj = $("#" + treeNode.tId + "_span");
        if (treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0) return;
        let addStr = "<span class='button add' id='addBtn_" + treeNode.tId
            + "' title='新增类型' onfocus='this.blur();'></span>";
        sObj.after(addStr);
        let btn = $("#addBtn_" + treeNode.tId);
        if (btn) btn.bind("click", function () {
            let zTree = $.fn.zTree.getZTreeObj("treeDemo");
            zTree.addNodes(treeNode, {id: (100 + newCount), pId: treeNode.id, name: "自定义类型" + (newCount++)});
            return false;
        });
    };
    function removeHoverDom(treeId, treeNode) {
        $("#addBtn_" + treeNode.tId).unbind().remove();
    };
</script>
<style>
    @import "../../project/style/taskCss/bootstrapStyle.css";
</style>
