<template>
  <div id="list">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {

    }
  },
  created() {
    // this.getToken();
  },
  methods: {
    getToken() {
      const { oaNum } = this.getQuery()
      if (!oaNum) return
      this.$api.oa.getToken({ oaNum }).then(res => {
        if (res && res.code === 200) {
          window.localStorage.setItem('token', res.data)
          this.$router.replace('/list')
        } else {
          this.$router.replace('/401')
          console.log(res.msg || 'token获取失败')
        }
      })
    },
    // 提取query参数
    getQuery() {
      const res = {}
      const href = window.location.href
      const index = href.indexOf('?')
      href.slice(index + 1).split('&').forEach(item => {
        const [key, value] = item.split('=')
        res[key] = value
      })
      return res
    }
  }
}
</script>

<style scoped>
#list {
  width: 100vw;
  height: 100vh;
}
</style>
