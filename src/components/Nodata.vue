<template>
  <div class="dv-nodata" style="width:100%;height:100%">
    <div
      class="titles"
      ref="titles"
      v-if="config.title && config.title.show"
      :style="titleStyle"
    >
      <span>{{ config.title.content }}</span>
    </div>
    <div style="width:80px;margin:50px auto;color:white">
      <a-icon type="file-image" style="text-align:center;font-size:80px;" />
    </div>
    <span style="font-size:20px;color:white"
      >当前图表使用的数据已被删除，无法正常显示。请重新选择模型</span
    >
  </div>
</template>

<script>
import aIcon from "ant-design-vue/lib/icon";
import "ant-design-vue/lib/icon/style/css";
export default {
  name: "ChartNodata",
  props: {
    config: {
      type: Object,
      required: true
    }
  },
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {},
  components: { aIcon },
  computed: {
    titleStyle() {
      return {
        padding: "0 10px",
        color: this.config.title.textStyle.color,
        fontSize: this.config.title.textStyle.fontSize + "px",
        textAlign: this.config.title.textAlign,
        fontFamily: this.config.title.textStyle.fontFamily,
        fontWeight: this.config.title.textStyle.fontWeight,
        background: "none",
        border: "none",
        ...this.background
      };
    }
  }
};
</script>
