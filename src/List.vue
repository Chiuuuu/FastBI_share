<template>
  <div id="list">
    <!-- 头部title -->
    <header>
      <span>BI大屏列表</span>
      <a-button id="back" type="default" size="large">返回</a-button>
    </header>

    <!-- 搜索栏 -->
    <div class="search-area">
      <div class="search-box">
        <a-input-search
          id="keyword"
          type="text"
          placeholder="请输入大屏名称关键词搜索"
          autocomplete="off"
          @search="handleGetData"
          ></a-input-search>
      </div>
    </div>

    <!-- 大屏列表 -->
    <a-spin :spinning="spinning" class="screen-list">
      <div class="screen-list-item" v-for="item in list" @click="toShare(item)">
        <div class="item-left over-text">
          <span class="item-is-top" v-if="item.isTop">置顶</span>
          <span class="item-name">{{ item.name }}</span>
        </div>
        <div class="item-right over-text">
          <span>{{ item.createTime }}</span><br>
          <span>{{ item.project }}</span>
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script>
const list = [
  {
    name: '2021年9月政企大屏',
    createTime: '2021-10-15 14:00:21',
    project: '项目1',
    isTop: true,
    url: '47.115.14.69:8081/share/ieE7fe',
    password: 'z11111'
  },
  {
    name: '2021年8月政企大屏',
    createTime: '2021-10-15 14:00:21',
    project: '项目1',
    isTop: true,
    url: '47.115.14.69:8081/share/ieE7fe',
    password: 'z11111'
  },
  {
    name: '2021年7月政企大屏',
    createTime: '2021-10-15 14:00:21',
    project: '项目1',
    isTop: true,
    url: '47.115.14.69:8081/share/ieE7fe',
    password: 'z11111'
  },
  {
    name: '2021年6月政企大屏',
    createTime: '2021-10-15 14:00:21',
    project: '项目1',
    isTop: false,
    url: '47.115.14.69:8081/share/ieE7fe',
    password: ''
  },
  {
    name: '2021年5月政企大屏',
    createTime: '2021-10-15 14:00:21',
    project: '项目1',
    isTop: false,
    url: '47.115.14.69:8081/share/ieE7fe',
    password: ''
  },
  {
    name: '2021年4月政企大屏',
    createTime: '2021-10-15 14:00:21',
    project: '项目1',
    isTop: false,
    url: '47.115.14.69:8081/share/ieE7fe',
    password: ''
  },
]
export default {
  name: 'List',
  data() {
    return {
      spinning: false,
      list: []
    }
  },
  created () {
    this.handleGetData()
  },
  methods: {
    handleGetData() {
      this.spinning = true
      this.list = list
      this.spinning = false
    },
    /**
     * 跳转到分享界面
     */
    toShare(item) {
      window.location.href = 'http://' + item.url
    }
  }
}
</script>
<style src="./assets/style-list.css"></style>
