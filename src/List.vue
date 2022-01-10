<template>
  <div id="list">
    <!-- 头部title(PC) -->
    <header v-if="isPC">
      <span>BI大屏列表</span>
      <a-button id="back" class="pc" type="primary">返回</a-button>
    </header>

    <!-- 头部title(H5) -->
    <header v-else>
      <span>BI大屏列表</span>
      <a-icon id="back" class="h5" type="left" />
    </header>

    <!-- 搜索栏 -->
    <div class="search-area">
      <div class="search-box" :class="isPC ? 'pc' : 'h5'">
        <a-input-search
          id="keyword"
          type="text"
          style="height:100%"
          placeholder="请输入大屏名称关键词搜索"
          autocomplete="off"
          v-model="screenName"
          @search="handleSearch"
        ></a-input-search>
      </div>
    </div>

    <!-- 大屏列表 -->
    <a-spin :spinning="spinning" class="screen-list" :class="isPC ? 'pc' : 'h5'">
      <ScrollPage
        v-if="dataRowsResult.length > 0"
        :rows="dataRowsResult"
        :row-height="$REAL_SIZE(150)"
        :pagination="pagination"
        :fetch="handleGetData"
        :limit="0"
        @change="v => (pageDataRows = v)"
      >
        <div class="screen-list-item js-item-height" v-for="item in pageDataRows" :key="item.id" @click="toShare(item)">
          <div class="item-line">
            <span class="item-name over-text">{{ item.name }}</span>
            <span class="item-is-top" v-if="item.isTop">置顶</span>
          </div>
          <div class="item-line over-text">
            <span class="item-name over-text">{{ item.project }}</span>
            <span>{{ item.createTime }}</span>
          </div>
        </div>
      </ScrollPage>
      <div v-else class="screen-list-empty">暂无数据</div>
    </a-spin>
  </div>
</template>

<script>
import axios from "axios"
import ScrollPage from "@/components/scroll"
const list = [
  {
    name: '2021年9月政企大屏',
    createTime: '2021-10-15 14:00:21',
    project: '项目1',
    isTop: true,
    url: '47.115.14.69:8081/share/ieE7fe',
    password: 'z11111',
  },
  {
    name: '2021年8月政企大屏',
    createTime: '2021-10-15 14:00:21',
    project: '项目1',
    isTop: true,
    url: '47.115.14.69:8081/share/ieE7fe',
    password: 'z11111',
  },
  {
    name: '2021年7月政企大屏',
    createTime: '2021-10-15 14:00:21',
    project: '项目1',
    isTop: true,
    url: '47.115.14.69:8081/share/ieE7fe',
    password: 'z11111',
  },
  {
    name: '2021年6月政企大屏',
    createTime: '2021-10-15 14:00:21',
    project: '项目1',
    isTop: false,
    url: '47.115.14.69:8081/share/ieE7fe',
    password: '',
  },
  {
    name: '2021年5月政企大屏',
    createTime: '2021-10-15 14:00:21',
    project: '项目1',
    isTop: false,
    url: '47.115.14.69:8081/share/ieE7fe',
    password: '',
  },
  {
    name: '2021年4月政企大屏',
    createTime: '2021-10-15 14:00:21',
    project: '项目1',
    isTop: false,
    url: '47.115.14.69:8081/share/ieE7fe',
    password: '',
  },
  {
    name: '2021年4月政企大屏',
    createTime: '2021-10-15 14:00:21',
    project: '项目1',
    isTop: false,
    url: '47.115.14.69:8081/share/ieE7fe',
    password: '',
  },
  {
    name: '2021年4月政企大屏',
    createTime: '2021-10-15 14:00:21',
    project: '项目1',
    isTop: false,
    url: '47.115.14.69:8081/share/ieE7fe',
    password: '',
  },
  {
    name: '2021年4月政企大屏',
    createTime: '2021-10-15 14:00:21',
    project: '项目1',
    isTop: false,
    url: '47.115.14.69:8081/share/ieE7fe',
    password: '',
  },
  {
    name: '2021年4月政企大屏',
    createTime: '2021-10-15 14:00:21',
    project: '项目1',
    isTop: false,
    url: '47.115.14.69:8081/share/ieE7fe',
    password: '',
  },
  {
    name: '2021年4月政企大屏',
    createTime: '2021-10-15 14:00:21',
    project: '项目1',
    isTop: false,
    url: '47.115.14.69:8081/share/ieE7fe',
    password: '',
  },
  {
    name: '2021年4月政企大屏',
    createTime: '2021-10-15 14:00:21',
    project: '项目1',
    isTop: false,
    url: '47.115.14.69:8081/share/ieE7fe',
    password: '',
  },
];
export default {
  name: 'List',
  components: {
    ScrollPage,
  },
  data() {
    return {
      spinning: false,
      screenName: '',
      isPC: true,
      dataRowsResult: [], // 搜索筛选的数据
      pageDataRows: [], // 当前分页展示的数据
      pagination: {
        // 分页参数
        pageSize: 10,
        pageNo: 1,
        rowsNum: 1000,
      },
    };
  },
  created() {
    this.handleAgent();
    this.handleGetData();
  },
  methods: {
    handleAgent() {
      this.isPC = !window.navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i,
      );
    },
    handleSearch() {
      // 搜索时重置当前页数
      this.initScrollData();
    },
    async handleGetData(pageNo) {
      this.pagination.pageNo = pageNo || 1
      this.dataRowsResult = list;
      return
      this.spinning = true;
      const result = await axios.post('/screen/share/share2oaList', {
        screenName: this.screenName,
        pageNo: this.pagination.pageNo,
        pageSize: this.pagination.pageSize,
      })
      .finally(() => {
        this.spinning = false;
      });
      if (result.code === 200) {
        this.rowsNum = result.rows;
      }
    },
    /**
     * 跳转到分享界面
     */
    toShare(item) {
      window.location.href = 'http://' + item.url;
    },
  },
};
</script>
<style src="./assets/style-list.css"></style>
