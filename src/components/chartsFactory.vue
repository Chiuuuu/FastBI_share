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
      v-if="dataItem.columns.length > 0"
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
  </div>
</template>

<script>
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
      height: "400px"
    };
  },
  mounted() {
    this.width = this.$refs.wrap.clientWidth + "px";
    let height = this.$refs.wrap.clientHeight;
    if (this.chartData.config.title && this.chartData.config.title.show) {
      height -= this.$refs.titles.clientHeight;
    }
    this.height = height + "px";
    this.chartExtend = this.chartData.config;
    this.getChartData();
  },
  methods: {
    getChartData() {
      // 只有度量的情况
      if (this.chartData.type === "2") {
        if (
          this.chartData.api_data.measures &&
          this.chartData.api_data.measures.length > 0
        ) {
          this.dataItem = this.chartData.api_data.source;
          if (this.chartType === "v-ring") {
            this.chartExtend.chartTitle.text = this.chartData.api_data.source
              .rows
              ? this.chartData.api_data.source.rows[0].value
              : "";
          }
          return;
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
          return;
        }
        if (
          this.chartData.api_data.dimensions.length > 0 &&
          this.chartData.api_data.measures.length > 0 &&
          this.chartData.api_data.source
        ) {
          this.dataItem = this.chartData.api_data.source;
          return;
        }
      }
      this.dataItem.columns = this.chartData.api_data.columns;
      this.dataItem.rows = this.chartData.api_data.rows;
    }
  },
  computed: {
    chartBackgroundStyle() {
      let background = this.chartData.background;
      return {
        background:
          background.backgroundType === "1"
            ? background.backgroundColor
            : `url(${background.backgroundSrc})`,
        borderColor: background.borderColor,
        borderWidth: background.borderWidth + "px",
        borderStyle: background.borderStyle,
        borderRadius: background.borderRadius + "px"
      };
    },
    chartTitleStyle() {
      return {
        padding: "20px 10px",
        color: this.chartData.config.title.textStyle.color,
        fontSize: this.chartData.config.title.textStyle.fontSize + "px",
        textAlign: this.chartData.config.title.textAlign,
        height: "auto"
      };
    }
  }
};
</script>
