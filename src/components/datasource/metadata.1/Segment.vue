<template>
  <div class="main">
    <div style=" margin-left:20px;">
      Path: &nbsp&nbsp
      <el-button type="text" @click="getDataSource">{{this.dataSourceName}}</el-button>
      <br></br>
      <el-button type="primary" size="small" @click="init">{{$t('message.segment.refresh')}}</el-button>
      <br></br>
    </div>

    <div class="table" style=" margin-left:20px;">

      <el-table :data="showTableData" border style="width: 100%" ref="multipleTable">
        <el-table-column prop="identifier" :label="$t('message.segment.name')"  width="900"></el-table-column>
        <el-table-column prop="size" :label="$t('message.common.size')"></el-table-column>
        <el-table-column :label="$t('message.segment.more')" width="200">
          <template scope="scope">
            <el-button size="mini" @click="getSegmentInfo(scope.row.identifier)">{{$t('message.segment.info')}}</el-button>
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
      preLocation: ''
    }
  },
  created: function() {
    this.dataSourceName = this.dataSourceName
    this.init()
  },
  methods: {
    init() {
      const preLocation = this.preLocation
      if (preLocation === "dataSource") {
        this.getSegments()
      }
    },
    async getSegments() {
      const url = `${this.$common.apis.mDataSource}/${this.dataSourceName}/segments?full`
      const response = await this.$http.get(url)
      this.segments = []
      this.$common.methods.pushData(response.data, this.segments)
      this.showTableData = this.$common.methods.fillShowTableData(this.segments, this.currentPage, this.pageSize)

    },
    async getSegmentInfo(segmentName) {
      const url = `${this.$common.apis.mDataSource}/${this.dataSourceName}/segments/${segmentName}?full`
      const response = await this.$http.get(url)
      this.segmentInfo = response.data
      var message = this.$common.methods.JSONUtils.toString(this.segmentInfo)
      this.configDialog(this.$t('message.segment.segmentInfo'), message, true, "full", { minRows: 15, maxRows: 40 })

    },
    getDataSource() {
      const preLocation = 'segment'
      this.$common.eventBus.$emit('activeNameDataSource', preLocation, this.dataSourceName)
    },
    clickSelect(tab) {
      if (tab.name === "dataSourceSelect") {
        this.getDataSources()
      }
    },
    getDataSources() {
      this.$router.push(
        { path: '/mDataSource' }
      )
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
  },
  mounted() {
    let self = this
    this.$common.eventBus.$on("activeNameSegment", (preLocation, dataSource) => {
      this.dataSourceName = dataSource
      this.preLocation = preLocation
      self.init()
    })
  }
}
</script>