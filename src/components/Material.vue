<template>
  <div class="dv-material" style="width: 100%;height:100%;" ref="wrap">
    <img style="width: 100%;height:100%;" :src="url | imgUrlFilter" alt="" />
  </div>
</template>

<script>
export default {
  name: 'ChartsMaterial',
  props: {
    url: {
      type: String,
      required: true
    }
  },
  filters: {
    // thumbnail表示缩略图，控件内去掉thumbnail显示原图
    imgUrlFilter(url) {
      let imgUrl = url.replace(/\/thumbnail/g, '')
      return imgUrl
    }
  },
  data() {
    return {
      width: '500px',
      height: '400px'
    }
  }
}
</script>
