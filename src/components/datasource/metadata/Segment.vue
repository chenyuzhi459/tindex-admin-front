<template>
  <div class="main">
    <div style=" margin-left:20px;">
      <span style="color: #242f42;font-size:20px;">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/ChildDataSource' }">{{$t('message.dataSource.dataSourceTitle')}}</el-breadcrumb-item>
          <el-breadcrumb-item v-if="showIntervalName" :to="{ path: '/ChildInterval', query: { dataSourceName: dataSourceName}}">{{$t('message.interval.intervalTitle')}}</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/ChildSegment' }">{{$t('message.segment.segmentTitle')}}</el-breadcrumb-item>
        </el-breadcrumb>
      </span>
      <br/>

      <el-tag type="primary">{{$t('message.dataSource.dataSourceTitle')}} : {{this.dataSourceName}}</el-tag>
      <el-tag v-if="showIntervalName" type="primary">{{$t('message.interval.intervalTitle')}} : {{this.intervalName}}</el-tag>
      <br></br>
      <el-button type="primary" size="small" @click="init">{{$t('message.segment.refresh')}}</el-button>
      <br></br>
    </div>

    <div class="table" style=" margin-left:20px;">

      <el-table :data="showTableData" border style="width: 100%" ref="multipleTable">
        <el-table-column prop="identifier" :label="$t('message.segment.name')" width="900"></el-table-column>
        <el-table-column prop="segmentSize" :label="$t('message.common.size')"></el-table-column>
        <el-table-column :label="$t('message.segment.more')" width="200">
          <template scope="scope">
            <el-button size="mini" @click="getSegmentInfo(scope.row.identifier)">{{$t('message.segment.info')}}</el-button>
            <el-button size="mini" @click="disableSegment(scope.row.identifier)" type="danger">{{$t('message.common.disable')}}</el-button>
            <el-button size="mini" @click="deleteSegment(scope.row.identifier)" type="danger">{{$t('message.common.delete')}}</el-button>
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
          <el-button v-if=showCancle @click="dialogVisible = false">{{$t('message.segment.cancle')}}</el-button>
          <el-button type="primary" @click="dialogVisible = false">{{$t('message.segment.confirm')}}</el-button>
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
      intervalName: '',
      preLocation: '',
      showCancle: false,
      showIntervalName: false
    }
  },
  created: function() {
    this.dataSourceName = this.$route.query.dataSourceName
    this.intervalName = this.$route.query.intervalName
    this.preLocation = this.$route.query.preLocation
    this.init()
  },
  methods: {
    init() {
      const preLocation = this.preLocation
      if (preLocation === "dataSource") {
        this.showIntervalName = false
        this.getSegments()
      } else if (preLocation === "interval") {
        this.showIntervalName = true
        this.getSegmentsByInterval()
      }
    },
    async getSegments() {
      const url = `${this.$common.apis.mDataSource}/${this.dataSourceName}/segments?full`
      const response = await this.$http.get(url)
      for (let i = 0; i < response.data.length; i++) {
        response.data[i]["segmentSize"] = this.$common.methods.conver(response.data[i]["size"])
      }
      this.segments = []
      this.$common.methods.pushData(response.data, this.segments)
      this.showTableData = this.$common.methods.fillShowTableData(this.segments, this.currentPage, this.pageSize)

    },
    async getSegmentsByInterval() {
      const url = `${this.$common.apis.mDataSource}/${this.dataSourceName}/segments?full`
      console.log(url)
      let intervals = new Array()
      intervals.push(this.intervalName)
      console.log(intervals)
      const response = await this.$http.post(url,intervals)
      for (let i = 0; i < response.data.length; i++) {
        response.data[i]["segmentSize"] = this.$common.methods.conver(response.data[i]["size"])
      }
      this.segments = []
      this.$common.methods.pushData(response.data, this.segments)
      this.showTableData = this.$common.methods.fillShowTableData(this.segments, this.currentPage, this.pageSize)

    },
    async getSegmentInfo(segmentName) {
      const url = `${this.$common.apis.mDataSource}/${this.dataSourceName}/segments/${segmentName}?full`
      const response = await this.$http.get(url)
      this.segmentInfo = response.data
      const message = this.$common.methods.JSONUtils.toString(this.segmentInfo)
      this.showCancle = false
      this.configDialog(this.$t('message.segment.segmentInfo'), message, true, "small", { minRows: 15, maxRows: 40 })

    },
    async disableSegment(segmentName) {
      // this.showCancle = true
      const remindMessage = `${this.$t('message.common.deleteWarning')}\n${segmentName}`
      try {
        const response = await this.$confirm(remindMessage, this.$t('message.common.warning'), {
          confirmButtonText: this.$t('message.common.confirm'),
          cancelButtonText: this.$t('message.common.cancle'),
          closeOnClickModal: false,
          type: 'warning'
        })
        try {
          const url = `${this.$common.apis.mDataSource}/${this.dataSourceName}/segments/${segmentName}/disable`
          const deleteResponse = await this.$http.delete(url)
          window.setTimeout(this.init, 500)
          this.$message({
            type: 'success',
            message: this.$t('message.common.deleteSuccess')
          })
        } catch (err) {
          this.$message({
            type: 'warning',
            message: this.$t('message.common.deleteFail')
          })
        }
      } catch (e) {

      }
    },
    async deleteSegment(segmentName) {
      // this.showCancle = true
    },
    configDialog(dialogTitle, dialogMessage, dialogVisible, dialogSize, dialogInputAutosize) {
      this.dialogTitle = dialogTitle
      this.dialogMessage = dialogMessage
      this.dialogVisible = dialogVisible
      this.dialogSize = dialogSize
      this.dialogInputAutosize = dialogInputAutosize
    },
    handleCurrentChange(newValue) {
      this.currentPage = newValue
      this.showTableData = this.$common.methods.fillShowTableData(this.segments, this.currentPage, this.pageSize)
    },
    handleSizeChange(newValue) {
      this.pageSize = newValue
      this.showTableData = this.$common.methods.fillShowTableData(this.segments, this.currentPage, this.pageSize)
    }
  }
}
</script>