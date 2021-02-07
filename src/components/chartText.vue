<template>
  <a-textarea
    class="dv-text"
    v-model="textData.config.title.content"
    ref="text"
    :style="textTitleStyle"
    :disabled="true"
    :autoSize="{ minRows: 2, maxRows: 6 }"
  />
</template>
<script>
import aTextarea from "ant-design-vue/lib/input";
import "ant-design-vue/lib/input/style/css";
export default {
  props: ["textData"],
  components: { aTextarea },
  computed: {
    textTitleStyle() {
      return {
        padding: "0 10px",
        color: this.textData.config.title.textStyle.color,
        fontSize: this.textData.config.title.textStyle.fontSize + "px",
        textAlign: this.textData.config.title.textAlign,
        background: "none",
        border: "none",
        ...this.textData.background
      };
    }
  }
};
</script>
