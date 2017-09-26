<template>
  <div class="main">
    <div style=" margin-left:20px;">
      <span style="color: #242f42;font-size:20px;">
        <b>{{$t('message.segment.segmentTitle')}}</b>
      </span>
      <br></br>
    </div>

    <div style=" margin-left:20px;">
      <el-button type="text" @click="getDataSource">{{this.dataSourceName}}</el-button>
      <el-button type="text" @click="getInterval">{{this.intervalName}}</el-button>
      <br></br>
      <el-button type="primary" size="small" @click="init">{{$t('message.segment.refresh')}}</el-button>
      <br></br>
    </div>

    <div class="table" style=" margin-left:20px;">

      <el-table :data="showTableData" border style="width: 100%" ref="multipleTable">
        <el-table-column prop="name" :label="$t('message.segment.name')"></el-table-column>
        <el-table-column :label="$t('message.segment.more')" width="200">
          <template scope="scope">
            <el-button size="mini" @click="getSegmentInfo(scope.row.name)">{{$t('message.segment.info')}}</el-button>
            <el-button size="mini" @click="deleteSegment(scope.row.name)" type="danger">{{$t('message.segment.delete')}}</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[5, 10, 15, 25, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="segments.length">
        </el-pagination>
      </div>
      <el-dialog :visible.sync="dialogVisible" :size="dialogSize" @close="dialogMessage = ''">
        <template slot="title">
          <div style=" line-height: 1;
                           font-size: 16px;
                           font-weight: 700;
                           color: #1f2d3d;">
            {{dialogTitle}}
          </div>
        </template>
        <el-input type="textarea" :autosize="dialogInputAutosize" v-model="dialogMessage">
        </el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">{{$t('message.segment.confirm')}}</el-button>
          <el-button type="primary" @click="dialogVisible = false">{{$t('message.segment.cancle')}}</el-button>
        </span>
      </el-dialog>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      segments: [],
      showTableData: [],
      dialogMessage: '',
      dialogTitle: '',
      dialogSize: 'full',
      dialogInputAutosize: {},
      dialogVisible: false,
      pageSize: 15,
      currentPage: 1,
      dataSourceName: '',
      intervalName: ''
    }
  },
  created: function() {
    this.dataSourceName = this.$route.query.dataSourceName
    this.intervalName = this.$route.query.intervalName
    this.init()
  },
  methods: {
    init() {
      const preLocation = this.$route.query.preLocation
      
      if (preLocation === "dataSource") {
        this.getSegments()
      } else if (preLocation === "interval") {
        this.getSegmentsFromInterval()
      }
    },
    getSegments() {
      const url = `${this.$common.apis.dataSource}/${this.$route.query.dataSourceName}/segments`
      console.log(url)
      this.$http.get(url).then(response => {
        var convertData = new Array()
        for (var i = 0, len = response.data.length; i < len; i++) {
          var map = new Map()
          map['name'] = response.data[i]
          convertData[i] = map
        }
        this.segments = []
        this.$common.methods.pushData(convertData, this.segments)
        this.fillShowTableData()
      })
    },
    getSegmentsFromInterval() {

      const intervalNameDeal = this.$route.query.intervalName.replace("/", "_")
      const url = `${this.$common.apis.dataSource}/${this.$route.query.dataSourceName}/intervals/${intervalNameDeal}`
      console.log(url)
      this.$http.get(url).then(response => {
        var convertData = new Array()
        for (var i = 0, len = response.data.length; i < len; i++) {
          var map = new Map()
          map['name'] = response.data[i]
          convertData[i] = map
        }
        this.segments = []
        this.$common.methods.pushData(convertData, this.segments)
        this.fillShowTableData()
      })
    },
    getSegmentInfo(segmentName) {
      const url = `${this.$common.apis.dataSource}/${this.$route.query.dataSourceName}/segments?full`
      console.log(url)
      this.$http.get(url).then(response => {
        this.segmentInfo = response.data
        console.log(this.segmentInfo)
        var message = JSON.stringify(this.segmentInfo, null, 2)
        this.configDialog(this.$t('message.segment.segmentInfo'), message, true, "small", { minRows: 15, maxRows: 40 })
      })
    },
    getDataSource() {
      console.log(this.dataSourceName)
      this.$router.push(
        { path: '/dataSource', query: { preLocation: "segment", dataSourceName: this.dataSourceName } }
      )
    },
    getInterval() {
      console.log(this.dataSourceName + "==== dataSourceName")
      this.$router.push(
        { path: '/interval', query: { preLocation: "segment", intervalName: this.intervalName, dataSourceName: this.dataSourceName } }
      )
    },
    deleteSegment(segmentName) {
      var remindMessage = "Do you really want to delete:" + "\n\r" + segmentName
      this.$confirm(remindMessage, this.$t('message.common.warning'), {
        confirmButtonText: this.$t('message.common.confirm'),
        cancelButtonText: this.$t('message.common.cancle'),
        closeOnClickModal: false,
        type: 'warning'
      }).then(() => {
        const url = `${this.$common.apis.dataSource}/${this.$route.query.dataSourceName}/segments/${segmentName}`
        console.log(url)
        this.$http.delete(url).then(
          response => {
            window.setTimeout(this.init, 200)
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }, response => {
            this.$message({
              type: 'warning',
              message: '删除失败!'
            })
          })
      }).catch(() => {

      })
    },
    configDialog(dialogTitle, dialogMessage, dialogVisible, dialogSize, dialogInputAutosize) {
      this.dialogTitle = dialogTitle
      this.dialogMessage = dialogMessage
      this.dialogVisible = dialogVisible
      this.dialogSize = dialogSize
      this.dialogInputAutosize = dialogInputAutosize
    },
    fillShowTableData() {
      this.showTableData = []
      var position = (this.currentPage - 1) * this.pageSize
      var limit = (position + this.pageSize) >= 　this.segments.length ? this.segments.length - position : this.pageSize;
      for (var i = 0; i < limit; i++) {
        this.showTableData.push(this.segments[position + i])
      }
    },
    handleCurrentChange(newValue) {
      this.currentPage = newValue
      this.fillShowTableData()
    },
    handleSizeChange(newValue) {
      this.pageSize = newValue
      this.fillShowTableData()
    }
  }
}
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}
</style>