<template>
  <Content    :style="{minHeight: '280px', background: '#fff'}">
     <Row>
      <Col span="6">
          <type-list ref="tree" :listData="formLeft" ></type-list>
      </Col>
      <Col span="16">
        <Content :style="{padding: '0 0 70px', minHeight: '280px', background: '#fff'}">
            <standard-info></standard-info>
        </Content>
      </Col>
     </Row>
  </Content>
</template>
<script>
import qs from 'querystring'
import { typeInfo } from "../../../config/env.js";
import Icon from "iview/src/components/icon/icon";
import Caspanel from "iview/src/components/cascader/caspanel";
import typeList from "./typeList";
import standardInfo from "./standardInfo";

export default {
  components: {
    typeList,
    Caspanel,
    Icon,
      standardInfo
  },
  data() {
    return{
        formLeft: {},
    }
  },
  mounted() {},
  methods:{
  }
};
</script>
