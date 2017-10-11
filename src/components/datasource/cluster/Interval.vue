<template>
  <div class="main">
    <div style=" margin-left:20px;">
      Path: &nbsp&nbsp
      <el-button type="text" @click="getDataSource">{{this.dataSourceName}}</el-button>
      <br></br>
      <el-button type="primary" size="small" @click="init">{{$t('message.interval.refresh')}}</el-button>
      <br></br>
    </div>

    <div class="table" style=" margin-left:20px;">

      <el-table :data="showTableData" border style="width: 100%" ref="multipleTable">
        <el-table-column prop="name" :label="$t('message.interval.name')" sortable width="800"></el-table-column>
        <el-table-column prop="segmentCount" :label="$t('message.interval.segmentCount')"></el-table-column>
        <el-table-column prop="intervalSize" :label="$t('message.common.size')"></el-table-column>
        <el-table-column :label="$t('message.interval.more')">
          <template scope="scope">
            <el-button size="mini" type="info" @click="getSegments(scope.row.name)">{{$t('message.interval.segments')}}</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[5, 10, 15, 25, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="intervals.length">
        </el-pagination>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      intervals: [],
      showTableData: [],
      pageSize: 15,
      currentPage: 1,
      segment: '',
      preLocation: '',
      intervalName: '',
      dataSourceName: ''
    }
  },
  methods: {
    init() {
      this.getIntervals()
    },
    getIntervals() {
      let url
      if (this.preLocation === 'segment') {
        this.getInterval()
      } else {
        this.getIntervalsByDataSourceName()
      }
    },
    async getInterval() {
      const intervalNameHandle = this.intervalName.replace("/", "_")
      const url = `${this.$common.apis.dataSource}/${this.dataSourceName}/intervals/${intervalNameHandle}?simple`
      const response = await this.$http.get(url)
      const data = this.getDataFromResponse(response)
      this.intervals = []
      this.$common.methods.pushData(data, this.intervals)
      this.showTableData = this.$common.methods.fillShowTableData(this.intervals, this.currentPage, this.pageSize)
    },
    async getIntervalsByDataSourceName() {
      const url = `${this.$common.apis.dataSource}/${this.dataSourceName}/intervals?simple`
      const response = await this.$http.get(url)
      const data = this.getDataFromResponse(response)
      this.intervals = []
      this.$common.methods.pushData(data, this.intervals)
      this.showTableData = this.$common.methods.fillShowTableData(this.intervals, this.currentPage, this.pageSize)
    },
    getDataFromResponse(response) {
      const convertData = new Array()
      for (let key in response.data) {
        let itemMap = new Map()
        itemMap["name"] = key
        itemMap["segmentCount"] = response.data[key]["count"]
        itemMap["intervalSize"] = response.data[key]["size"]
        convertData.push(itemMap)
      }
      return convertData
    },
    getSegments(intervalName) {
      const preLocation = 'interval'
      this.$common.eventBus.$emit('activeNameSegment', preLocation, this.dataSourceName, intervalName)
    },
    getDataSource() {
      const preLocation = 'interval'
      this.$common.eventBus.$emit('activeNameDataSource', preLocation, this.dataSourceName)
    },
    handleCurrentChange(newValue) {
      this.currentPage = newValue
      this.showTableData = this.$common.methods.fillShowTableData(this.intervals, this.currentPage, this.pageSize)
    },
    handleSizeChange(newValue) {
      this.pageSize = newValue
      this.showTableData = this.$common.methods.fillShowTableData(this.intervals, this.currentPage, this.pageSize)
    }
  },
  mounted() {
    let self = this
    this.$common.eventBus.$on("activeNameInterval", (preLocation, dataSourceName, intervalName) => {
      this.preLocation = preLocation
      this.dataSourceName = dataSourceName
      this.intervalName = intervalName
      self.init()
    })
    this.$common.eventBus.$on("getAllIntervals", (preLocation) => {
      this.preLocation = preLocation
      this.getIntervalsByDataSourceName()
    })
  }
}
</script>
