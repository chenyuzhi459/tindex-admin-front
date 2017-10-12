<template>
  <div class="main">
    <div class="table" style=" margin-left:20px;">
      <span style="color: #242f42;font-size:20px;">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/ChildDataSource'}">{{$t('message.dataSource.dataSourceTitle')}}</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/ChildInterval'}">{{$t('message.interval.intervalTitle')}}</el-breadcrumb-item>
        </el-breadcrumb>
      </span>
      <br/>
      <el-tag type="primary">{{$t('message.dataSource.dataSourceTitle')}} : {{this.dataSourceName}}</el-tag>
      <br></br>
      <el-button type="primary" size="small" @click="init">{{$t('message.interval.refresh')}}</el-button>
      <br></br>

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
  created: function() {
    this.init()
  },
  methods: {
    init() {
      this.preLocation = this.$route.query.preLocation
      this.dataSourceName = this.$route.query.dataSourceName
      this.getIntervals()
    },
    getIntervals() {
      this.getIntervalsByDataSourceName()
    },
    async getIntervalsByDataSourceName() {
      const url = `${this.$common.apis.mDataSource}/${this.dataSourceName}/intervals?simple`
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
        itemMap["intervalSize"] = this.$common.methods.conver(response.data[key]["size"])
        convertData.push(itemMap)
      }
      return convertData
    },
    getSegments(intervalName) {
      this.$router.push({path: '/ChildSegment', query: {preLocation: 'interval', dataSourceName: this.dataSourceName, intervalName: intervalName}})
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
    this.$common.eventBus.$on("activeNameIntervalLater", (preLocation, dataSourceName, intervalName) => {
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
