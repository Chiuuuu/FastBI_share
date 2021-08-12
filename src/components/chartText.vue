<template>
    <div class="text-box" :style="backgroundStyle">
    <div
      class="dv-text"
      ref="text"
      v-html="textData.config.title.text || textData.config.text || textData.config.title.htmlText"
      :style="contentStyle"
    ></div>
  </div>
</template>
<script>
export default {
  props: ["textData"],
  computed: {
    backgroundStyle() {
      return {
            background:
              this.textData.background.backgroundType === '1'
                ? this.textData.background.backgroundColor
                : `url(${this.textData.background.backgroundSrc})`,
            borderColor: this.textData.background.borderColor,
            borderWidth: this.textData.background.borderWidth + 'px',
            borderStyle: this.textData.background.borderStyle,
            borderRadius: this.textData.background.borderRadius + 'px'
          }
    },
        contentStyle() {
      return {
        padding: '0 10px',
        color: this.textData.config.title.textStyle.color,
        fontSize: this.textData.config.title.textStyle.fontSize + 'px',
        textAlign: this.textData.config.title.textAlign,
        fontFamily: this.textData.config.title.textStyle.fontFamily,
        fontWeight: this.textData.config.title.textStyle.fontWeight
      }
    }
  }
}
</script>
<style scoped>
.text-box {
  height: 100%;
  pointer-events: auto !important;
  overflow: hidden;
  word-wrap: break-word;
  word-break: break-all;
}
.dv-text {
  resize: none;
  padding: 2px 5px 10px 5px;
  min-height: 30%;
  cursor: default;
}
</style>
