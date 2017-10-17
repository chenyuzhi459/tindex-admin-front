<template>
  <div class="main">
    <div style=" margin-left:20px;">
      <span style="color: #242f42;font-size:20px;">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/ChildDataSource', query: { showEnable: this.showEnable} }">{{$t('message.dataSource.dataSourceTitle')}}</el-breadcrumb-item>
          <el-breadcrumb-item v-if="showIntervalName" :to="{ path: '/ChildInterval', query: { showEnable: this.showEnable, dataSourceName: dataSourceName}}">{{$t('message.interval.intervalTitle')}}</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/ChildSegment', query: { showEnable: this.showEnable}  }">{{$t('message.segment.segmentTitle')}}</el-breadcrumb-item>
        </el-breadcrumb>
      </span>
      <br/>

      <el-tag type="primary">{{$t('message.dataSource.dataSource')}} : {{this.dataSourceName}}</el-tag>
      <el-tag v-if="showIntervalName" type="primary">{{$t('message.interval.interval')}} : {{this.intervalName}}</el-tag>
      <br></br>

      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item :label="$t('message.common.name')">
          <el-input v-model="formInline.name" :placeholder="$t('message.common.inputName')" size="small"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="onSearch" icon="search">{{$t('message.common.search')}}</el-button>
          <el-button type="primary" size="small" @click="refresh">{{$t('message.common.refresh')}}</el-button>
          <el-switch v-model="showEnable" on-color="#13ce66" off-color="#ff4949" on-text="Enable" off-text="Disable" :width="80" style="position:absolute; left:1100px; top:18px; " @change="switchChange">
          </el-switch>
        </el-form-item>
      </el-form>
    </div>

    <div class="table" style=" margin-left:20px;">
      <el-table :data="showTableData" border style="width: 100%" ref="multipleTable" @sort-change="handleSort">
        <el-table-column :label="$t('message.common.name')" width="900" sortable="custom">
          <template scope="scope">
            <a class="click-link" @click="getSegmentInfo(scope.row.identifier)">{{scope.row.identifier}}</a>
          </template>
        </el-table-column>
        <el-table-column v-if="showEnable" prop="segmentSize" :label="$t('message.common.size')"></el-table-column>
        <el-table-column :label="$t('message.segment.more')">
          <template scope="scope">
            <!-- <el-button size="mini" @click="getSegmentInfo(scope.row.identifier)">{{$t('message.segment.info')}}</el-button> -->
            <el-button v-if="showEnable" size="mini" @click="disableSegment(scope.row.identifier)" type="warning">{{$t('message.common.disable')}}</el-button>
            <el-button v-if="!showEnable" size="mini" @click="enableSegment(scope.row.identifier)" type="success">{{$t('message.common.enable')}}</el-button>
            <el-button v-if="!showEnable" size="mini" @click="deleteSegment(scope.row.identifier)" type="danger">{{$t('message.common.delete')}}</el-button>
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
          <el-button v-if="showCancle" @click="dialogVisible = false">{{$t('message.segment.cancle')}}</el-button>
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
      showIntervalName: false,
      formInline: {
        name: ''
      },
      showEnable: true,
      isDescending: true,
      createdShowEnable: false
    }
  },
  created: function() {
    this.dataSourceName = this.$route.query.dataSourceName
    this.intervalName = this.$route.query.intervalName
    this.preLocation = this.$route.query.preLocation
    if(this.$route.query.showEnable !== undefined) {
      this.showEnable = eval(this.$route.query.showEnable)
      this.createdShowEnable = this.showEnable
    }
    this.init()
  },
  methods: {
    init() {
      if (this.preLocation === "dataSource") {
        this.showIntervalName = false
      } else if (this.preLocation === "interval") {
        this.showIntervalName = true
      }
      this.getSegmentsForshow(this.preLocation, this.isDescending, this.formInline.name)
    },
    getSegmentsForshow(preLocation,isDescending,searchValue) {
      if(preLocation === "dataSource") {
        this.getSegmentsByDataSource(isDescending,searchValue)
      } else {
        this.getSegmentsByInterval(isDescending,searchValue)
      }
    },

    async getSegmentsByDataSource(isDescending, searchValue) {
      let url
      if (this.showEnable) {
        url = `${this.$common.apis.mDataSource}/${this.dataSourceName}/segments?full`
      } else {
        url = `${this.$common.apis.mDataSource}/${this.dataSourceName}/disableSegments`
      }
      const response = await this.$http.get(url, {
        params: {
          isDescending: isDescending,
          searchValue: searchValue
        }
      })
      for (let i = 0; i < response.data.length; i++) {
        response.data[i]["segmentSize"] = this.$common.methods.conver(response.data[i]["size"])
      }
      this.segments = []
      this.$common.methods.pushData(response.data, this.segments)
      this.showTableData = this.$common.methods.fillShowTableData(this.segments, this.currentPage, this.pageSize)

    },
    handleSort(column) {
      this.isDescending = column.order === 'descending' ? true : false
      this.getSegmentsForshow(this.preLocation, this.isDescending, this.formInline.name)
    },
    switchChange() {
      this.init()
    },
    async getSegmentsByInterval(isDescending, searchValue) {
      let url
      if (this.showEnable) {
        url = `${this.$common.apis.mDataSource}/${this.dataSourceName}/segments?full`
      } else {
        url = `${this.$common.apis.mDataSource}/${this.dataSourceName}/disableSegments`
      }
      let intervals = new Array()
      intervals.push(this.intervalName)
      const response = await this.$http.post(url, intervals, {
        params: {
          isDescending: isDescending,
          searchValue: searchValue
        }
      })
      for (let i = 0; i < response.data.length; i++) {
        response.data[i]["segmentSize"] = this.$common.methods.conver(response.data[i]["size"])
      }
      this.segments = []
      this.$common.methods.pushData(response.data,this.segments)
      this.showTableData = this.$common.methods.fillShowTableData(this.segments, this.currentPage, this.pageSize)

    },
    refresh() {
      this.formInline.name = ''
      this.init()
    },
    onSearch() {
      this.getSegmentsForshow(this.preLocation, this.isDescending, this.formInline.name)
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
      const remindMessage = `${this.$t('message.common.disableWarning')}\n${segmentName}`
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
            message: this.$t('message.common.disableSuccess')
          })
        } catch (err) {
          this.$message({
            type: 'warning',
            message: this.$t('message.common.disableFail')
          })
        }
      } catch (e) {

      }
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
          const url = `${this.$common.apis.mDataSource}/${this.dataSourceName}/segments/${segmentName}/delete`
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
    async enableSegment(segmentName) {
      const remindMessage = `${this.$t('message.common.enableWarning')}\n${segmentName}`
      try {
        const response = await this.$confirm(remindMessage, this.$t('message.common.warning'), {
          confirmButtonText: this.$t('message.common.confirm'),
          cancelButtonText: this.$t('message.common.cancle'),
          closeOnClickModal: false,
          type: 'warning'
        })
        try {
          const url = `${this.$common.apis.mDataSource}/${this.dataSourceName}/segments/${segmentName}/enable`
          const deleteResponse = await this.$http.post(url)
          window.setTimeout(this.init, 500)
          this.$message({
            type: 'success',
            message: this.$t('message.common.enableSuccess')
          })
        } catch (err) {
          this.$message({
            type: 'warning',
            message: this.$t('message.common.enableFail')
          })
        }
      } catch (e) {

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

<style>
@import "../../../../static/css/link.css";
</style>