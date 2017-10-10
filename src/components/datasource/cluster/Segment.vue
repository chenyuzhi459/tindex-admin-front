<template>
  <div class="main">
    <div style=" margin-left:20px;">
      <span style="color: #242f42;font-size:20px;">
        <!-- <b>{{$t('message.segment.segmentTitle')}}</b> -->
        <el-tabs v-model="activeName" @tab-click="clickSelect">
          <el-tab-pane :label=" $t('message.dataSource.dataSourceTitle') " name="dataSourceSelect"></el-tab-pane>
          <el-tab-pane :label=" $t('message.interval.intervalTitle') " name="intervalSelect"></el-tab-pane>
          <el-tab-pane :label=" $t('message.segment.segmentTitle') " name="segmentSelect"></el-tab-pane>
        </el-tabs>
      </span>
    </div>

    <div style=" margin-left:20px;">
      Path: &nbsp&nbsp<el-button type="text" @click="getDataSource">{{this.dataSourceName}}</el-button>
      <el-button type="text" @click="getInterval">{{this.intervalName}}</el-button>
      <br></br>
      <el-button type="primary" size="small" @click="init">{{$t('message.segment.refresh')}}</el-button>
      <br></br>
    </div>

    <div class="table" style=" margin-left:20px;">

      <el-table :data="showTableData" border style="width: 100%" ref="multipleTable">
        <el-table-column prop="name" :label="$t('message.segment.name')" width="700"></el-table-column>
        <el-table-column prop="segmentSize" :label="$t('message.common.size')"></el-table-column>
        <el-table-column :label="$t('message.segment.more')" width="200">
          <template scope="scope">
            <el-button size="mini" @click="getSegmentInfoOnPage(scope.row.name)">{{$t('message.segment.info')}}</el-button>
            <el-button size="mini" @click="deleteSegment(scope.row.name)" type="danger">{{$t('message.common.disable')}}</el-button>
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
          <el-button @click="dialogVisible = false">{{$t('message.segment.cancle')}}</el-button>
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
      activeName: 'segmentSelect'
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
    async handleSegmentData(url) {
      const response = await this.$http.get(url)
      var convertData = new Array()
      for (var i = 0, len = response.data.length; i < len; i++) {
        let map = new Map()
        map['name'] = response.data[i]
        let segmentInfo  = await this.getSegmentInfo(map['name'])
        map['segmentSize'] = segmentInfo['metadata']['size']
        convertData[i] = map
      }
      this.segments = []
      this.$common.methods.pushData(convertData, this.segments)
      this.showTableData = this.$common.methods.fillShowTableData(this.segments, this.currentPage, this.pageSize)
    },
    async getSegments() {
      const url = `${this.$common.apis.dataSource}/${this.$route.query.dataSourceName}/segments`
      this.handleSegmentData(url)
    },
    async getSegmentsFromInterval() {
      const intervalNameDeal = this.$route.query.intervalName.replace("/", "_")
      const url = `${this.$common.apis.dataSource}/${this.$route.query.dataSourceName}/intervals/${intervalNameDeal}`
      this.handleSegmentData(url)
    },  
    async getSegmentInfo(segmentName) {
      const url = `${this.$common.apis.dataSource}/${this.$route.query.dataSourceName}/segments/${segmentName}?full`
      const response = await this.$http.get(url)
      return response.data
    },
    async getSegmentInfoOnPage(segmentName) {
      this.segmentInfo = await this.getSegmentInfo(segmentName)
      var message = this.$common.methods.JSONUtils.toString(this.segmentInfo)
      this.configDialog(this.$t('message.segment.segmentInfo'), message, true, "full", { minRows: 15, maxRows: 40 })
    },
    getDataSource() {
      this.$router.push(
        { path: '/dataSource', query: { preLocation: "segment", dataSourceName: this.dataSourceName } }
      )
    },
    getInterval() {
      this.$router.push(
        { path: '/interval', query: { preLocation: "segment", intervalName: this.intervalName, dataSourceName: this.dataSourceName } }
      )
    },
    async deleteSegment(segmentName) {
      const remindMessage = `${this.$t('message.common.deleteWarning')}\n${segmentName}`
      try {
        const response = await this.$confirm(remindMessage, this.$t('message.common.warning'), {
          confirmButtonText: this.$t('message.common.confirm'),
          cancelButtonText: this.$t('message.common.cancle'),
          closeOnClickModal: false,
          type: 'warning'
        })
        try {
          const url = `${this.$common.apis.dataSource}/${this.$route.query.dataSourceName}/segments/${segmentName}`
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
    getDataSources() {
      this.$router.push(
        { path: '/dataSource' }
      )
    },
    getIntervals() {
      this.$router.push(
        { path: '/interval', query: { dataSourceName: this.dataSourceName } }
      )
    },
    clickSelect(tab) {
      if (tab.name === "dataSourceSelect") {
        this.getDataSources()
      } else if (tab.name === "intervalSelect") {
        this.getIntervals()
      }
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
