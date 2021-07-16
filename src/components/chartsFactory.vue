<template>
  <div
    class="dv-charts"
    style="width: 100%;height:100%;"
    :style="chartBackgroundStyle"
    ref="wrap"
  >
    <div
      class="titles"
      ref="titles"
      v-if="chartData.config.title && chartData.config.title.show"
      :style="chartTitleStyle"
    >
      <span>{{ chartData.config.title.content }}</span>
    </div>
    <component
      v-if="
        dataItem.columns &&
          dataItem.columns.length > 0 &&
          chartData.name !== 've-map'
      "
      v-bind:is="chartData.name"
      :data="dataItem"
      :width="width"
      :height="height"
      ref="chart"
      :legend-visible="chartData.config.legend && chartData.config.legend.show"
      :title="
        chartData.chartType === 'v-ring' ? chartData.config.chartTitle : {}
      "
      :extend="chartExtend"
      :settings="chartData.apis"
    ></component>
    <component
      v-else
      v-bind:is="chartData.name"
      :data="dataItem"
      :width="width"
      :height="height"
      ref="chart"
      :legend-visible="chartData.config.legend && chartData.config.legend.show"
      :title="
        chartData.chartType === 'v-ring' ? chartData.config.chartTitle : {}
      "
      :extend="chartExtend"
      :settings="chartData.apis"
      :series="chartSeries"
      :legend="chartLegend"
      :geo="geo"
      :tooltip="mapToolTip"
    ></component>
  </div>
</template>

<script>
import omit from "lodash/omit"
import guangzhou from "../json/guangdong.json"
export default {
  props: ["chartData"],
  data() {
    return {
      dataItem: {
        columns: ["x", "y"],
        rows: [{ x: "x", y: 100 }]
      },
      chartExtend: {},
      width: "500px",
      height: "400px",
      chartSeries: {},
      geo: {},
      mapToolTip: {},
      chartLegend:{},
      chartType:'',
    }
  },
  mounted() {
    this.width = this.$refs.wrap.clientWidth + "px"
    let height = this.$refs.wrap.clientHeight
    if (this.chartData.config.title && this.chartData.config.title.show) {
      height -= this.$refs.titles.clientHeight
    }
    this.height = height + "px"
    this.chartType = this.chartData.chartType;
    if (this.chartData.name === "ve-map") {
      this.chartExtend = { ...omit(this.chartData.config, ["series"]) }
      this.chartSeries = this.chartData.config.series
      this.setMapFormatter()
      if (!this.chartData.apis.mapOrigin) {
        this.chartData.apis.mapOrigin = guangzhou
      }
    } else if (this.chartData.name === 've-scatter') {
      //散点图
      let config = JSON.parse(JSON.stringify(this.chartData.config))
      // tooltip显示
      config.tooltip.formatter = function(params) {
        let val = params.value
        if (val.length < 6) {
          return ''
        }
        return `${params.marker}<br/>
                ${val[5]}：${val[2]}<br/>
                ${val[3]}：${val[0]}<br/>
                ${val[4]}：${val[1]}<br/>
                `
      }
      
      this.chartExtend = { ...omit(config, ['series', 'legend']) }
      this.chartLegend = config.legend //图例
      // series设置
      let series = JSON.parse(JSON.stringify(config.series))
      let data = series.data
      let list = []
      data.map(item => {
        list.push(JSON.parse(JSON.stringify(series)))
        list[list.length - 1].data = item.data
        list[list.length - 1].name = item.label
      })
      list.forEach(item => {
        // 图形属性 -- 散点颜色 -- 单色
        this.chartData.apis.scatterColor === '0'
          ? (item.color = '#68ABDA')
          : delete item.color

        // 散点图大小设置
        let scatterSize = this.chartData.apis.scatterSize
        if (scatterSize) {
          let max = scatterSize === '0' ? this.chartData.apis.xMax : this.chartData.apis.yMax
          item.symbolSize = function(val) {
            let num = val[scatterSize]
            return max === 0 ? 8 : (20 / max) * num + 8
          }
        }
      })
      console.log(list,'list------------')
      this.chartSeries = list
    }  else {
      this.chartExtend = this.chartData.config
      if (this.chartData.name === "ve-pie") {
        this.setPieFormatter()
      }
    }
    this.getChartData()
  },
  methods: {
    getChartData() {
      // 只有度量的情况
      if (this.chartData.type === "2") {
        if (
          this.chartData.api_data.measures &&
          this.chartData.api_data.measures.length > 0
        ) {
          this.dataItem = this.chartData.api_data.source
          if (this.chartType === "v-ring") {
            this.chartExtend.chartTitle.text = this.chartData.api_data.source
              .rows
              ? this.chartData.api_data.source.rows[0].value
              : ""
          }
          return
        }
      }
      if (
        this.chartData.api_data.dimensions &&
        this.chartData.api_data.measures
      ) {
        if (
          (this.chartData.api_data.dimensions.length === 0 &&
            this.chartData.api_data.measures.length > 0) ||
          (this.chartData.api_data.dimensions.length > 0 &&
            this.chartData.api_data.measures.length === 0)
        ) {
          return
        }
        if (
          this.chartData.api_data.dimensions.length > 0 &&
          this.chartData.api_data.measures.length > 0 &&
          this.chartData.api_data.source
        ) {
          if(this.chartType === "v-scatter"){
            //散点图的数据自定义显示
            this.dataItem.columns = []
            this.dataItem.rows = []
          }else{
            this.dataItem = this.chartData.api_data.source
          }
          return
        }
      }

      if (this.chartType === 'v-scatter') {
        //散点图的数据自定义显示
        this.dataItem.columns = []
        this.dataItem.rows = []
      } else {
        this.dataItem.columns = this.chartData.api_data.columns
        this.dataItem.rows = this.chartData.api_data.rows
      }
      
    },
    // 饼图显示内容格式拼接
    setPieFormatter() {
      let list = this.chartExtend.series.label.formatterSelect || []
      this.chartExtend.series.label.formatter = function(params) {
        let str = []
        list.forEach(item => {
          let val = params[item]
          if (!val) {
            return
          }
          if (typeof val === "number") {
            val = +parseFloat(val)
          }
          if (item === "percent") {
            val += "%"
          }
          str.push(val)
        })
        return str.join(" ")
      }
    },
    // 地图显示内容格式拼接
    setMapFormatter() {
      for (let series of this.chartSeries) {
        // 指标内容
        let isShowAreaName = series.pointShowList.some(
          str => str.search("地区名") > -1
        )
        let orient = series.label.normal.orient
        series.label.normal.formatter = function(params) {
          if (!params.data) {
            return isShowAreaName ? params.name : ""
          }
          let str = []
          series.pointShowList.forEach(item => {
            let val = params.data[item]
            if (!val) {
              return
            }
            if (typeof val === "number") {
              val = +parseFloat(val).toFixed(2)
            }
            str.push(val)
          })
          str = orient === "vertical" ? str.join("\n") : str.join(":")
          return str
        }
        series.tooltip.formatter = function(params) {
          if (!params.data) {
            return params.name
          }
          let str = []
          series.tooltipShowList.forEach(item => {
            let val = params.data[item]
            if (!val) {
              return
            }
            if (typeof val === "number") {
              val = +parseFloat(val).toFixed(2)
            }
            str.push(`${item}：${val}`)
          })
          return str.join("<br />")
        }
      }
    },
  },
  watch:{
    dataItem(){
      console.log(JSON.parse(JSON.stringify(this.dataItem)),JSON.parse(JSON.stringify(this.chartData)))
    }
  },
  computed: {
    chartBackgroundStyle() {
      let background = this.chartData.background
      return {
        background:
          background.backgroundType === "1"
            ? background.backgroundColor
            : `url(${background.backgroundSrc})`,
        borderColor: background.borderColor,
        borderWidth: background.borderWidth + "px",
        borderStyle: background.borderStyle,
        borderRadius: background.borderRadius + "px"
      }
    },
    chartTitleStyle() {
      return {
        padding: "20px 10px",
        color: this.chartData.config.title.textStyle.color,
        fontSize: this.chartData.config.title.textStyle.fontSize + "px",
        textAlign: this.chartData.config.title.textAlign,
        fontFamily: this.chartData.config.title.textStyle.fontFamily,
        fontWeight: this.chartData.config.title.textStyle.fontWeight,
        height: "auto"
      }
    }
  }
}
</script>
