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
      :geo="geo"
      :tooltip="mapToolTip"
    ></component>
  </div>
</template>

<script>
import omit from "lodash/omit"
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
      mapToolTip: {}
    }
  },
  mounted() {
    this.width = this.$refs.wrap.clientWidth + "px"
    let height = this.$refs.wrap.clientHeight
    if (this.chartData.config.title && this.chartData.config.title.show) {
      height -= this.$refs.titles.clientHeight
    }
    this.height = height + "px"
    if (this.chartData.name === "ve-map") {
      this.chartExtend = { ...omit(this.chartData.config, ["series"]) }
      this.chartSeries = this.chartData.config.series
      // 添加标签格式回调
      this.chartSeries[0].label.formatter = function(params) {
        return params.data.value[2].toFixed(2)
      }
      this.geo = this.chartData.config.geo
      this.mapToolTip = this.chartData.config.tooltip
      // 添加格式回调函数
      this.mapToolTip.formatter = function(params) {
        let data = params.data
        return `${params.seriesName}<br />${data.name}：${data.value[2]}`
      }
    } else {
      this.chartExtend = this.chartData.config
      // 保留两位小数
      if (
        this.chartData.name !== "ve-gauge" &&
        this.chartData.name !== "ve-ring"
      ) {
        let type = this.chartData.name
        let chartType = this.chartData.chartType
        if (chartType == "high-pie" || chartType == "high-column") {
          return
        }
        
        // 矩形树图
        if (this.chartData.chartType === 'v-treemap') {
          const series = this.chartData.config.series[0] ? this.chartData.config.series[0] : this.chartData.config.series
          this.handleTreemapFormatter(series, 'tooltip')
          this.handleTreemapFormatter(series, 'label')
          return
        }
        let list = this.chartData.config.series.label.formatterSelect
        this.chartExtend.series.label.formatter = function(params) {
          if (type === "ve-line") {
            return params.data[1].toFixed(2)
          } else if (type === "ve-pie") {
            // 嵌套饼图不需要拼接显示内容
            if (chartType === "v-multiPie") {
              return params.data.value.toFixed(2)
            }
            let str = []
            list.forEach(item => {
              let val = params[item]
              if (typeof val === "number") {
                val = +parseFloat(val).toFixed(2)
              }
              if (item === "percent") {
                val += "%"
              }
              str.push(val)
            })
            return str.join(" ")
          } else if (type === "ve-radar") {
            return params.value.toFixed(2)
          } else {
            return params.data.toFixed(2)
          }
        }
      }
    }
    this.getChartData()
  },
  methods: {
    // 处理矩形树图的formatter
    handleTreemapFormatter(series, type) {
      let flag = false
      const apiData = this.chartData.api_data
      if (apiData.measures[0]) {
        const measureAlias = apiData.measures[0].alias
        flag = series[type + 'ShowList'].includes(measureAlias)
      }
      series[type].formatter = params => {
        let result = []
        let target = params.data
        while (target.parent) {
          if (series[type + 'ShowList'].includes(target.column)) {
            result.push(target.name)
          }
          target = target.parent
        }
        result = result.reverse()
        if (flag) {
          result.push(params.value[1])
        }
        return result.toString()
      }
    },
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
          this.dataItem = this.chartData.api_data.source
          return
        }
      }
      this.dataItem.columns = this.chartData.api_data.columns
      this.dataItem.rows = this.chartData.api_data.rows
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
