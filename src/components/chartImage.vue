<template>
  <div
    class="dv-images"
    style="width: 100%;height:100%;"
    :style="imageBackgroundStyle"
    ref="wrap"
  >
    <img
      v-if="imageData.config.imageUrl || imageData.background.backgroundSrc"
      :src="imageData.config.imageUrl || imageData.background.backgroundSrc"
      alt=""
    /><a-icon v-else type="file-image" style="font-size:40px;" />
  </div>
</template>

<script>
import aIcon from "ant-design-vue/lib/icon";
import "ant-design-vue/lib/icon/style/css";
export default {
  props: ["imageData"],
  components: { aIcon },
  computed: {
    imageBackgroundStyle() {
      return {
        backgroundColor: this.imageData.background.backgroundColor,
        borderColor: this.imageData.background.borderColor,
        borderWidth: this.imageData.background.borderWidth + "px",
        borderStyle: this.imageData.background.borderStyle,
        borderRadius: this.imageData.background.borderRadius + "px"
      };
    }
  }
};
</script>

<style></style>
