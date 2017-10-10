<template>
  <div class="main">
    <div style=" margin-left:20px;">
      <span style="color: #242f42;font-size:20px;">
        <el-tabs v-model="activeName" @tab-click="clickSelect">
          <el-tab-pane :label=" $t('message.dataSource.dataSourceTitle') " name="dataSourceSelect"></el-tab-pane>
          <el-tab-pane :label=" $t('message.interval.intervalTitle') " name="intervalSelect"></el-tab-pane>
          <el-tab-pane :label=" $t('message.segment.segmentTitle') " name="segmentSelect" disabled></el-tab-pane>
        </el-tabs>
      </span>
    </div>

    <div style=" margin-left:20px;">
      Path: &nbsp&nbsp
      <el-button type="text" @click="getDataSource">{{this.dataSourceName}}</el-button>
      <br></br>
      <el-button type="primary" size="small" @click="init">{{$t('message.interval.refresh')}}</el-button>
      <br></br>
    </div>

    <div class="table" style=" margin-left:20px;">

      <el-table :data="showTableData" border style="width: 100%" ref="multipleTable">
        <el-table-column prop="name" :label="$t('message.interval.name')" sortable></el-table-column>
        <el-table-column prop="segmentCount" :label="$t('message.interval.segmentCount')"></el-table-column>
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
      dataSource: '',
      segment: '',
      activeName: 'intervalSelect'
    }
  },
  created: function() {
    this.init()
  },
  methods: {
    init() {
      this.dataSourceName = this.$route.query.dataSourceName
      this.segmentName = this.$route.query.segmentName
      this.getIntervals()
    },
    getIntervals() {
      let url
      if (this.$route.query.preLocation === 'segment') {
        // const interval = new Map()
        // interval['name'] = this.$route.query.intervalName
        // const intervalArr = []
        // intervalArr[0] = interval
        // this.$common.methods.pushData(intervalArr, this.intervals)
        // this.showTableData = this.$common.methods.fillShowTableData(this.intervals, this.currentPage, this.pageSize)
        this.getInterval()
      } else {
        this.getIntervalsByDataSourceName()
      }
    },
    async getInterval() {
      const intervalNameHandle = this.$route.query.intervalName.replace("/","_")
      const url = `${this.$common.apis.dataSource}/${this.dataSourceName}/intervals/${intervalNameHandle}`
      console.log(url,"url")
      const response = await this.$http.get(url)
      const data = this.getDataFromResponse(response)
      this.intervals = []
      this.$common.methods.pushData(data, this.intervals)
      this.showTableData = this.$common.methods.fillShowTableData(this.intervals, this.currentPage, this.pageSize)
    },
    async getIntervalsByDataSourceName() {
      const url = `${this.$common.apis.dataSource}/${this.dataSourceName}/intervals?full`
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
        itemMap["segmentCount"] = Object.getOwnPropertyNames(response.data[key]).length
        convertData.push(itemMap)
      }
      return convertData
    },
    getSegments(intervalName) {
      this.$router.push(
        { path: '/segment', query: { preLocation: "interval", intervalName: intervalName, dataSourceName: this.dataSourceName } }
      )

    },
    getDataSource() {
      this.$router.push(
        { path: '/dataSource', query: { preLocation: "interval", dataSourceName: this.dataSourceName } }
      )
    },
    getDataSources() {
      this.$router.push(
        { path: '/dataSource' }
      )
    },
    clickSelect(tab) {
      if (tab.name === "dataSourceSelect") {
        this.getDataSources()
      } else if (tab.name === "intervalSelect") {
        this.getIntervalsByDataSourceName()
      }
    },
    handleCurrentChange(newValue) {
      this.currentPage = newValue
      this.showTableData = this.$common.methods.fillShowTableData(this.intervals, this.currentPage, this.pageSize)
    },
    handleSizeChange(newValue) {
      this.pageSize = newValue
      this.showTableData = this.$common.methods.fillShowTableData(this.intervals, this.currentPage, this.pageSize)
    }
  }
}
</script>
