<template>
  <Modal 
  v-model="showAddNew" 
  title="编辑团队成员" 
  width=720
  :closable="false">
    <table border=0 style="table-layout:fixed;border-collapse:separate;border-spacing:0px 20px;" key="list">
      <!-- <tr>
        <td width=300px>登录用户名</td>
        <td width=120px colspan='2'>登录密码</td>
      </tr>
      <tr>
        <td width=320>
          <Input v-model="param.userName" placeholder="登录用户名" style="width: 300px" :disabled="editStatus"/>
        </td>
        <td width=320 colspan='2'>
          <Input v-model="param.password" placeholder="登录密码" style="width: 300px" :disabled="editStatus"/>
        </td>
      </tr> -->
      <tr>
        <td width=300px>备注名</td>
        <td width=120px>所属部门</td>
        <td width=120px>职位</td>
      </tr>
      <tr>
        <td width=320><Input v-model="param.remark_name" placeholder="备注名" style="width: 300px"/></td>
        <td width=160>
          <Select v-model.number="param.department_id" style="width:140px">
            <Option v-for="item in deptList" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </td>
        <td width=160>
          <Select v-model.number="param.post_id" style="width:140px">
            <Option v-for="item in dutyList" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </td>
      </tr>
      <!-- <tr>
        <td width=300px>手机</td>
        <td width=120px colspan='2'>邮箱</td>
      </tr>
      <tr>
        <td width=320>
          <Input v-model="param.phone" placeholder="手机" style="width: 300px" :disabled="editStatus"/>
        </td>
        <td width=320 colspan='2'>
          <Input v-model="param.email" placeholder="邮箱" style="width: 300px" :disabled="editStatus"/>
        </td>
      </tr> -->
    </table>
    <div slot="footer">
      <Button type="error" style="float:left;" @click="remove(param.id)">移除</Button>
      <Button type="ghost" @click="cancel">取消</Button>
      <Button type="primary" @click="revise(param.id,param.remark_name,param.department_id,param.post_id)">修改</Button>
    </div>
  </Modal>
</template>

<script>
var qs = require('querystring');
import { mapGetters } from 'vuex'
export default {
  props: {
    param: {
      type: Object,
      default: ''
    },
    editStatus: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showAddNew: false
    }
  },
  mounted() {
      this.deptListData();
      this.dutyListData();
  },
  computed: {
    ...mapGetters({
      deptList: 'getDeptList',
      dutyList: 'getDutyList'
    })
  },
  methods: {
    /**
     * 外部显示弹窗接口
     */
    isShowPage(isShow) {
      if(isShow.constructor==Boolean) {
        // console.log(isShow);
        this.showAddNew = isShow;
        // this.$Modal.confirm({
        //   onOk: () => {
        //       this.$Message.info('Clicked ok');
        //   },
        //   onCancel: () => {
        //       this.$Message.info('Clicked cancel');
        //   }
        // });
      } else {
        // console.log(false);
        this.showAddNew = false;
      }     
    },
    /**
     * 部门列表
     */
    deptListData() {
      let data = {
        company_id: 1
      }
      this.$store.dispatch('fetchDeptList', qs.stringify(data));
    },
    /**
     * 职位列表
     */
    dutyListData() {
      let data = {
        company_id: 1
      }
      this.$store.dispatch('fetchDutyList', qs.stringify(data));
    },
    remove(id) {
      this.$emit('removed', id)
    },
    cancel() {
      this.$emit('cancel');
      this.showAddNew = false;
    },
    revise(id,rname,did,pid) {
      this.$emit('revised', id, rname, did, pid)
    }
  }
}
</script>

<style>

</style>
