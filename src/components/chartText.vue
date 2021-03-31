<template>
  <a-textarea
    class="dv-text"
    v-model="textData.config.title.total"
    ref="text"
    :style="textTitleStyle"
    :disabled="true"
    :autoSize="{ minRows: 2, maxRows: 50 }"
  />
</template>
<script>
import Input from "ant-design-vue/lib/input"
import "ant-design-vue/lib/input/style/css"
export default {
  props: ["textData"],
  components: { aTextarea: Input.TextArea },
  computed: {
    textTitleStyle() {
      return {
        padding: "0 10px",
        color: this.textData.config.title.textStyle.color,
        fontSize: this.textData.config.title.textStyle.fontSize + "px",
        textAlign: this.textData.config.title.textAlign,
        fontFamily: this.textData.config.title.textStyle.fontFamily,
        fontWeight: this.textData.config.title.textStyle.fontWeight,
        background: "none",
        border: "none",
        ...this.textData.background
      }
    }
  }
}
</script>
<style scoped>
.dv-text{
    resize:none;
}
</style>
