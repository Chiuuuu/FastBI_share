<template>
  <div id="listMain">
    <!-- 头部title(PC) -->
    <header v-if="isPC">
      <span>BI大屏列表</span>
      <!-- <a-button id="back" class="pc" type="primary">返回</a-button> -->
    </header>

    <!-- 头部title(H5) -->
    <header v-else>
      <span>BI大屏列表</span>
      <!-- <a-icon id="back" class="h5" type="left" /> -->
    </header>

    <!-- 搜索栏 -->
    <div class="search-area" :class="isPC ? 'pc' : 'h5'">
      <div class="search-box">
        <a-input
          id="keyword"
          type="text"
          style="height:100%"
          placeholder="请输入大屏名称关键词搜索"
          autocomplete="off"
          v-model="screenName"
          @pressEnter="handleSearch"
        ><a-icon slot="prefix" type="search" /></a-input>
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
          <template v-if="isPC">
            <div class="item-line">
              <div class="item-line-self">
                <div class="item-break">
                  <span :title="item.screenName" class="item-name screen over-text">{{ item.screenName }}</span>
                  <span class="item-is-top" v-if="item.no > 0">置顶</span>
                </div>
                <div class="item-break">
                  <span :title="item.projectName" class="item-name over-text">{{ item.projectName }}</span>
                </div>
              </div>
              <div>{{ item.gmtCreate }}</div>
            </div>
          </template>
          <template v-else>
            <div class="item-line">
              <span :title="item.screenName" class="item-name screen over-text">{{ item.screenName }}</span>
              <span class="item-is-top" v-if="item.no > 0">置顶</span>
            </div>
            <div class="item-line small-size over-text">
              <span :title="item.projectName" class="item-name over-text">{{ item.projectName }}</span>
              <span>{{ item.gmtCreate }}</span>
            </div>
          </template>
        </div>
      </ScrollPage>
      <div v-else class="screen-list-empty">暂无数据</div>
    </a-spin>
  </div>
</template>

<script>
import ScrollPage from "@/components/scroll"
export default {
  name: 'OaList',
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
        pageSize: 30,
        pageNo: 1,
        total: 1000,
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
      this.pagination = this.$options.data().pagination;
      this.handleGetData();
    },
    async handleGetData(pageNo) {
      this.pagination.current = pageNo || 1
      this.spinning = true;
      const result = await this.$api.oa.getList({
        screenName: this.screenName,
        current: this.pagination.current,
        pageSize: this.pagination.pageSize,
      })
      .finally(() => {
        this.spinning = false;
      });
      if (result && result.code === 200) {
        this.dataRowsResult = result.rows
        this.pagination.total = result.total
      } else {
        // this.$message.error(result.msg || '请求失败')
        this.$router.replace('/403')
      }
    },
    /**
     * 跳转到分享界面
     */
    toShare(item) {
      this.$router.push({
        path: '/screen/' + item.url
      })
    },
  },
};
</script>
<style src="../assets/style-list.css"></style>
