<template>
  <div class="main">
    <div style=" margin-left:20px;">
      <span style="color: #242f42;font-size:20px;">
        <b @click="getIntervalsByDataSourceName">{{$t('message.interval.intervalTitle')}}</b>
      </span>
      <br></br>
    </div>

    <div style=" margin-left:20px;">
      <el-button type="text" @click="getDataSource">{{this.dataSourceName}}</el-button>
      <br></br>

      <el-button type="primary" size="small" @click="init">{{$t('message.interval.refresh')}}</el-button>
      <br></br>
    </div>

    <div class="table" style=" margin-left:20px;">

      <el-table :data="showTableData" border style="width: 100%" ref="multipleTable">
        <el-table-column prop="name" :label="$t('message.interval.name')" sortable></el-table-column>
        <el-table-column :label="$t('message.interval.more')">
          <template scope="scope">
            <el-button size="mini" @click="getSegments(scope.row.name)">{{$t('message.interval.segments')}}</el-button>
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
        const interval = new Map()
        interval['name'] = this.$route.query.intervalName
        console.log(interval)
        const intervalArr = []
        intervalArr[0] = interval
        this.$common.methods.pushData(intervalArr, this.intervals)
        this.showTableData = this.$common.methods.fillShowTableData(this.intervals, this.currentPage, this.pageSize)
      } else {
        this.getIntervalsByDataSourceName()
      }
    },
    async getIntervalsByDataSourceName() {
      const url = `${this.$common.apis.dataSource}/${this.dataSourceName}/intervals`
      console.log(url)
      const response = await this.$http.get(url)
      const convertData = new Array()
      for (var i = 0, len = response.data.length; i < len; i++) {
        var map = new Map()
        map['name'] = response.data[i]
        convertData[i] = map
      }
      this.intervals = []
      this.$common.methods.pushData(convertData, this.intervals)
      this.showTableData = this.$common.methods.fillShowTableData(this.intervals, this.currentPage, this.pageSize)

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
