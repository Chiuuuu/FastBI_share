<template>
  <div id="app">
    <div v-show="Object.keys(screenData).length > 0">
      <div class="dv-screen" ref="dvScreen">
        <div class="box" :style="boxStyle">
          <div class="canvas" :style="canvasPanelStyle" ref="canvas">
            <div class="canvas-panel">
              <template v-for="transform in canvasMap">
                <div
                  :key="transform.id"
                  class="preview-box"
                  :style="contentStyles(transform.setting.view)"
                >
                  <div
                    class="preview-wrap"
                    :style="dvWrapperStyles(transform.setting.view)"
                  >
                    <chart-nodata
                      v-if="transform.setting.isEmpty"
                      :config="transform.setting.config"
                    ></chart-nodata>
                    <!--素材库-->
                    <ChartMaterial
                      v-else-if="transform.setting.name === 'material'"
                      :url="transform.setting.url"
                    ></ChartMaterial>
                    <!--进度条-->
                    <SteepBar
                      v-else-if="transform.setting.name === 'steepBar'"
                      :config="transform.setting.config"
                      :background="transform.setting.background"
                      :api-data="transform.setting.api_data"
                    ></SteepBar>
                    <!-- 文本 -->
                    <chart-text
                      v-else-if="transform.setting.name === 've-text'"
                      :text-data="transform.setting"
                    ></chart-text>

                    <!-- 图片 -->
                    <chart-image
                      v-else-if="transform.setting.name === 've-image'"
                      :image-data="transform.setting"
                    ></chart-image>

                    <!-- 表格 -->
                    <chart-tables
                      ref="tables"
                      v-else-if="transform.setting.name === 've-tables'"
                      :table-data="transform.setting"
                      :is-mobile="isMobile"
                      @mouseenter.native="
                        hideBar(
                          transform.setting.view.y,
                          transform.setting.view.height
                        )
                      "
                      @mouseleave.native="existTab = true"
                    ></chart-tables>
                    <charts-factory
                      v-else
                      :chart-data="transform.setting"
                    ></charts-factory>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
      <div
        class="pagination"
        v-show="existTab"
        :style="{ opacity: showPageTab ? 1 : 0 }"
        @mouseover="handleTabShow"
        @mouseleave="handleTabShow"
      >
        <div
          v-for="page in tabList"
          :key="page.id"
          @click="toOtherPage(page.id)"
        >
          <div :class="['page', { 'current-select': tabSelect === page.id }]">
            {{ page.name }}
          </div>
        </div>
      </div>
    </div>
    <div class="pwdview" v-show="showBox === 'pwd'">
      <div class="title">
        <img class="img" src="./assets/images/矢量智能对象.png" alt="" />
        <span class="text">智能大数据分析平台</span>
      </div>
      <div class="pwdbox">
        <div class="header">
          <img class="img" src="./assets/images/head.png" alt="" />
          <span class="text">admin</span>
        </div>
        <div class="body">
          <div class="content">
            <input
              type="text"
              v-model="password"
              placeholder="请输入查看密码"
              class="input ant-input"
              @input="error = false"
              @keyup.enter="submit"
            />
            <button class="btn" @click="submit">确定</button>
            <br />
          </div>
          <span v-show="error" style="color:red;">密码错误</span>
        </div>
      </div>
    </div>
    <div v-show="showBox === 'empty'" class="noData">
      <div>
        <img
          v-if="code === 501"
          class="img"
          src="./assets/images/404.png"
          alt=""
        />
        <img
          v-if="code === 502"
          class="image"
          src="./assets/images/删除.png"
          alt=""
        />
        <div :class="['tip', { hasmargin: code === 502 }]">{{ msg }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import "ant-design-vue/lib/input/style/css"
import axios from "axios"
import chartImage from "./components/chartImage.vue"
import chartTables from "./components/chartTables.vue"
import chartText from "./components/chartText.vue"
import chartsFactory from "./components/chartsFactory.vue"
import ChartNodata from "./components/Nodata.vue"
import SteepBar from "./components/steepBar.vue"
import ChartMaterial from "./components/Material.vue"
const spacing = 20
export default {
  name: "App",
  data() {
    return {
      url: "",
      showBox: "", // 是密码弹窗
      password: "", // 密码
      range: 1, // 放大比例
      error: false,
      screenData: {},
      canvasMap: [],
      pageSettings: "",
      tabList: [],
      tabSelect: "", // 选中的tab
      headers: {}, // 请求头数据Password/TabId
      msg: "", // 获取已失效或者不存在提示信息
      code: "", // 状态码，判断显示图片
      boxStyle: {},
      showPageTab: true, //页签显示/隐藏
      existTab: true // 页签元素显示/隐藏
    }
  },
  mounted() {
    window.onresize = () => {
      if (Object.keys(this.screenData).length > 0) {
        this.canvasMap = []
        if (this.password) {
          this.submit()
        } else {
          this.getData()
        }
      }
    }
  },
  created() {
    let url = window.location.href
    let index = url.indexOf("share")
    this.url = url.slice(0, index) + "admin/dev-api/" + url.slice(index)
    // 政数局链接
    // this.url = "http://19.192.2.67:8085/admin/dev-api/" + url.slice(index)
    // 测试连接
    // this.url = "http://47.115.14.69:8090/share/FrQZZ3"

    console.log(this.url)
    this.getData()
  },
  computed: {
    // 画布面板的样式
    canvasPanelStyle() {
      return {
        width: `${this.pageSettings.width}px`,
        height: `${this.pageSettings.height}px`,
        transform: `scale(${this.range}) translate3d(0, 0, 0)`, // translate3d(0, 0, 0)
        background:
          this.pageSettings.backgroundType === "1"
            ? this.pageSettings.backgroundColor
            : `url(${this.pageSettings.backgroundSrc}) 0% 0% / 100% 100% no-repeat`
      }
    },
    isMobile() {
      return "ontouchend" in document.body
    }
  },
  methods: {
    getData() {
      axios.get(this.url).then(res => {
        // 大屏不存在或者已失效
        if (res.data.code === 501 || res.data.code === 502) {
          this.code = res.data.code
          this.showBox = "empty"
          this.msg = res.data.msg
          return
        }
        // 有设置密码
        if (res.data.data === "needPwd") {
          this.showBox = "pwd"
          return
        }
        this.setData(res.data.data)
      })
    },
    // 确认密码
    submit() {
      if (!this.password) {
        return
      }
      if (this.password.length > 6) {
        this.error = true
        return
      }
      this.headers.Password = this.password
      axios.get(this.url, { headers: this.headers }).then(res => {
        if (res.data.code === 500) {
          this.error = true
        } else {
          this.showBox = ""
          this.setData(res.data.data)
        }
      })
    },
    // 如果表格跟页签重叠，页签直接隐藏
    hideBar(transformY, transformHeight) {
      if (transformY + transformHeight >= this.pageSettings.height - 60) {
        this.existTab = false
      }
    },
    // 居中盒子样式
    getBoxStyle() {
      this.boxStyle = {
        width: `${this.$refs.canvas.clientWidth * this.range}px`,
        height: `${this.$refs.canvas.clientHeight * this.range}px`
      }
    },
    contentStyles(transformData) {
      return {
        width: transformData.width + "px",
        height: transformData.height + "px",
        transform: `translate3d(${transformData.x}px,${transformData.y}px,0)`
      }
    },
    dvWrapperStyles(transformData) {
      return {
        transform: "translateZ(0)",
        width: transformData.width + "px",
        height: transformData.height + "px",
        padding: "10px 0"
      }
    },
    // 切换页面
    toOtherPage(id) {
      if (this.tabSelect === id) {
        return
      }
      this.tabSelect = id
      this.headers.TabId = this.tabSelect
      axios
        .get(this.url, {
          headers: this.headers
        })
        .then(res => {
          this.setData(res.data.data)
        })
    },
    setData(data) {
      this.screenData = data
      this.pageSettings = this.screenData.setting
      this.pageSettings.height = this.pageSettings.height // 防止底部栏显示的时候盖住控件滚动轴
      if (this.tabList.length === 0) {
        this.tabList = this.screenData.screenTabList
        this.tabSelect = this.tabList[0].id // 默认显示第一页的内容
      }
      this.canvasMap = this.screenData.screenGraphs
      // 移动端(支持触摸事件)// 移动端按原本样式显示
      //   if (this.isMobile) {
      //     this.resetGraphsData()
      //   }
      this.$nextTick(() => {
        this.getRange()
        this.getBoxStyle()
        // pc端设置5s后隐藏页签栏
        if (!this.isMobile) {
          let timer = null
          timer = setTimeout(() => {
            this.showPageTab = false
            clearTimeout(timer)
            timer = null
          }, 5000)
        }
      })
    },
    resetGraphsData() {
      // 计算默认图表宽
      let chartWidth = window.screen.width - spacing * 2
      // 计算默认图表高度(宽高比5*4)
      let chartHeight = 400
      // 版面重新计算计算图表坐标
      this.canvasMap.reduce((pre, cur) => {
        let chartSize = cur.setting.view
        chartSize.width = chartWidth
        chartSize.height = chartHeight
        chartSize.x = spacing
        if (pre) {
          chartSize.y = pre.setting.view.y + chartHeight + spacing
        } else {
          chartSize.y = spacing
        }
        return cur
      }, null)

      // 画板宽度取屏幕宽度
      this.pageSettings.width = window.screen.width
      // 画板高度默认屏幕高度
      this.pageSettings.height = window.screen.height
      // 如果存在图表，画板高度取(图表默认高度+间距)*图表个数
      if (this.canvasMap.length > 0) {
        let height =
          this.canvasMap.length * (chartHeight + spacing) + spacing * 2
        if (height > this.pageSettings.height) {
          this.pageSettings.height = height
        }
      }
    },
    getRange() {
      let range = window.screen.width / this.pageSettings.width
      this.range = Math.round(range * 100) / 100
    },
    handleTabShow() {
      this.showPageTab = !this.showPageTab
    }
  },
  components: {
    chartImage,
    chartTables,
    chartText,
    chartsFactory,
    ChartNodata,
    SteepBar,
    ChartMaterial
  }
}
</script>
<style src="./assets/style.css"></style>
