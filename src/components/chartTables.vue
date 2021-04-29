<template>
  <div
    class="dv-tables"
    style="width: 100%;height:100%;"
    :style="backgroundStyle"
    ref="wrap"
  >
    <div
      class="titles"
      ref="titles"
      v-if="tableData.config.title && tableData.config.title.show"
      :style="tableTitleStyle"
    >
      <span>{{ tableData.config.title.content }}</span>
    </div>
    <div class="tables">
      <div
        :class="['chart-table', isMobile ? 'touch' : 'pc']"
        ref="charttable"
        @scroll="getScrollLeft"
        :style="{
          width: showTableSize.tableX + 'px',
          height: showTableSize.tableY + 'px'
        }"
      >
        <table
          v-show="tableData.config.header.show"
          class="table-content table-header"
          ref="tableheader"
          :style="{ width: tableWidth + 'px' }"
        >
          <thead>
            <tr>
              <th
                :style="HeaderStyle"
                class="data"
                v-for="(column, index) in columns"
                :key="index"
              >
                {{ column.title }}
              </th>
            </tr>
          </thead>
        </table>
        <div
          :class="['tbody', isMobile ? 'touch' : 'pc']"
          :style="{ width: bodyWidth + 'px', height: bodyHeight + 'px' }"
        >
          <table
            class="table-content table-body scrollbar"
            ref="tablebody"
            :style="{ width: tableWidth + 'px' }"
          >
            <tr v-for="(row, index) in rows" :key="index">
              <td
                :style="customRow(index)"
                class="data data-body"
                v-for="(value, key) in row"
                :key="key"
              >
                {{ value }}
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["tableData", "isMobile"],
  data() {
    return {
      columns: [],
      rows: [],
      chartSize: {},
      backgroundStyle: {},
      showTableSize: {},
      tableWidth: "",
      bodyHeight: "",
      bodyWidth: ""
    }
  },
  mounted() {
    this.chartSize = this.tableData.view
    this.getTableData()
  },
  methods: {
    getScrollLeft(e) {
      this.bodyWidth = e.target.scrollLeft + this.showTableSize.tableX
    },
    getSize() {
      // 控制每一列最小长度200
      // 计算表格宽度(表头表格宽度一致)
      this.tableWidth = this.columns.length * 200
      // 计算显示尺寸-charttable(比较表的尺寸和缩放框的大小)
      this.showTableSize = {
        tableX: Math.min(this.tableWidth, this.chartSize.width),
        tableY: Math.min(
          this.$refs.charttable.clientHeight,
          this.chartSize.height - this.$refs.titles.offsetHeight
        )
      }
      // 计算表格（不含表头）高度
      this.bodyHeight =
        this.showTableSize.tableY - this.$refs.tableheader.clientHeight
    },
    getTableData() {
      let apidata = this.tableData.api_data
      if (
        apidata.tableList.length > 0 &&
        apidata.source &&
        apidata.source.columns
      ) {
        this.columns = apidata.source.columns
        let rows = apidata.source.rows
        let newRows = []
        // 给列数据key重新排序
        for (let row of rows) {
          let newObj = {}
          for (let col of this.columns) {
            newObj[col.title] = row[col.title]
          }
          newRows.push(newObj)
        }
        this.rows = newRows
        this.$nextTick(() => {
          this.getSize()
        })
        return
      }
      this.columns = apidata.columns
      this.rows = apidata.rows
      this.$nextTick(() => {
        this.getSize()
      })
    },
    customRow(index) {
      if (index % 2 === 1) {
        // 奇行
        return {
          color: this.tableData.config.table.textStyle.color,
          "text-align": this.tableData.config.table.textStyle.textAlign,
          "font-size": this.tableData.config.table.textStyle.fontSize + "px",
          "font-weight": this.tableData.config.table.textStyle.fontWeight,
          background: this.tableData.config.table.oddBackgroundColor,
          "white-space": this.tableData.config.table.ellipsis
            ? "normal"
            : "nowrap"
        }
      } else {
        return {
          color: this.tableData.config.table.textStyle.color,
          "text-align": this.tableData.config.table.textStyle.textAlign,
          "font-size": this.tableData.config.table.textStyle.fontSize + "px",
          "font-weight": this.tableData.config.table.textStyle.fontWeight,
          background: this.tableData.config.table.evenBackgroundColor,
          "white-space": this.tableData.config.table.ellipsis
            ? "normal"
            : "nowrap"
        }
      }
    }
  },
  computed: {
    imageBackgroundStyle() {
      return {
        backgroundColor: this.imageData.background.backgroundColor,
        borderColor: this.imageData.background.borderColor,
        borderWidth: this.imageData.background.borderWidth + "px",
        borderStyle: this.imageData.background.borderStyle,
        borderRadius: this.imageData.background.borderRadius + "px"
      }
    },
    tableTitleStyle() {
      return {
        padding: "20px 10px",
        color: this.tableData.config.title.textStyle.color,
        fontSize: this.tableData.config.title.textStyle.fontSize + "px",
        textAlign: this.tableData.config.title.textAlign,
        fontFamily: this.tableData.config.title.textStyle.fontFamily,
        fontWeight: this.tableData.config.title.textStyle.fontWeight
      }
    },
    HeaderStyle() {
      return {
        color: this.tableData.config.header.textStyle.color,
        "text-align": this.tableData.config.header.textStyle.textAlign,
        "background-color": this.tableData.config.header.backgroundColor,
        "font-size": this.tableData.config.header.textStyle.fontSize + "px",
        "font-weight": this.tableData.config.header.textStyle.fontWeight
      }
    }
  }
}
</script>
