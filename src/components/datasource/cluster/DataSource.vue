<template>
  <div class="main">
    <div style=" margin-left:20px;">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item :label="$t('message.common.name')">
          <el-input v-model="formInline.name" :placeholder="$t('message.common.inputName')" size="small"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="onSearch" icon="search">{{$t('message.common.search')}}</el-button>
          <el-button type="primary" size="small" @click="init">{{$t('message.common.refresh')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table" style=" margin-left:20px;">

      <el-table :data="showTableData" border style="width: 100%" ref="multipleTable" @sort-change="handleSort">
        <el-table-column prop="name" :label="$t('message.common.name')" sortable="custom" width="310"></el-table-column>
        <el-table-column prop="tiers" :label="$t('message.dataSource.tiers')" width="130"></el-table-column>
        <el-table-column :label="$t('message.dataSource.segments')" align="center">
          <el-table-column prop="properties.segments.count" :label="$t('message.common.count')" width="80"></el-table-column>
          <el-table-column prop="properties.segments.size" :label="$t('message.common.size')" width="120"></el-table-column>
          <el-table-column prop="properties.segments.maxTime" :label="$t('message.dataSource.maxTime')" width="210"></el-table-column>
          <el-table-column prop="properties.segments.minTime" :label="$t('message.dataSource.minTime')" width="210"></el-table-column>
        </el-table-column>
        <el-table-column :label="$t('message.common.more')" width="400">
          <template scope="scope">
            <el-button size="mini" type="info" @click="getIntervals(scope.row.name)">{{$t('message.dataSource.intervals')}}</el-button>
            <el-button size="mini" type="info" @click="getSegments(scope.row.name)">{{$t('message.dataSource.segments')}}</el-button>
            <el-button size="mini" @click="getDimensions(scope.row.name)">{{$t('message.dataSource.dimensions')}}</el-button>
            <el-button size="mini" @click="getMetrics(scope.row.name)">{{$t('message.dataSource.metrics')}}</el-button>
            <!-- <el-button size="mini" @click="getCandidates(scope.row.name)">{{$t('message.dataSource.candidates')}}</el-button> -->
            <el-button size="mini" type="danger" @click="deleteDataSource(scope.row.name)">{{$t('message.common.disable')}}</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[5, 10, 15, 25, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="dataSources.length">
        </el-pagination>
      </div>
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
        <el-button @click="dialogVisible = false">{{$t('message.common.cancle')}}</el-button>
        <el-button type="primary" @click="dialogVisible = false">{{$t('message.common.confirm')}}</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  props: [
    'activeName'
  ],
  data() {
    return {
      dataSources: [],
      showTableData: [],
      dialogMessage: '',
      dialogTitle: '',
      dialogSize: 'large',
      dialogInputAutosize: {},
      dialogVisible: false,
      formInline: {
        name: '',
      },
      pageSize: 15,
      currentPage: 1,
      isAscending: "ascending",
      isSearching: false,
      preLocation: ''
    }
  },
  created: function() {
    this.dataSourceName = this.$route.query.dataSourceName
    this.init()
  },
  methods: {
    init() {
      if (this.preLocation === 'interval') {
        this.getDataSourceByName(this.dataSourceName)
      } else if (this.preLocation === 'segment') {
        this.getDataSourceByName(this.dataSourceName)
      } else {
        this.getDataSources("true")
      }
    },
    async getDataSources(isAscending) {
      const url = `${this.$common.apis.dataSource}?full`
      const response = await this.$http.get(url, {
        params: {
          isAscending: isAscending
        }
      })
      const data = this.getDataFromResponse(response)
      this.dataSources = []
      this.$common.methods.pushData(data, this.dataSources)
      this.showTableData = this.$common.methods.fillShowTableData(this.dataSources, this.currentPage, this.pageSize)

    },
    getDataFromResponse(response) {
      let dataSourceMap = new Map()
      for (let i = 0; i < response.data.length; i++) {
        dataSourceMap = response.data[i]["properties"]["tiers"]
        let tierName
        for (var key in dataSourceMap) {
          tierName = key
        }
        response.data[i]["tiers"] = tierName
      }
      return response.data
    },
    getDimensions(dataSourceName) {
      const url = `${this.$common.apis.clientInfo}/${dataSourceName}/dimensions`
      this.getInfoFromUrl(url, this.$t('message.dataSource.dimensionsInfo'))
    },
    getMetrics(dataSourceName) {
      const url = `${this.$common.apis.clientInfo}/${dataSourceName}/metrics`
      this.getInfoFromUrl(url, this.$t('message.dataSource.metricsInfo'))
    },
    // getCandidates(dataSourceName) {
    //   const url = `${this.$common.apis.clientInfo}/${dataSourceName}/candidates`
    //   this.getInfoFromUrl(url, this.$t('message.dataSource.candidatesInfo'))
    // },
    async getInfoFromUrl(url, title) {
      const response = await this.$http.get(url)
      const info = response.data
      const message = this.$common.methods.JSONUtils.toString(info)
      this.configDialog(title, message, true, "small", { minRows: 15, maxRows: 25 })
    },
    async deleteDataSource(dataSourceName) {
      const remindMessage = `${this.$t('message.common.deleteWarning')}\n${dataSourceName}`
      try {
        const response = await this.$confirm(remindMessage, this.$t('message.common.warning'), {
          confirmButtonText: this.$t('message.common.confirm'),
          cancelButtonText: this.$t('message.common.cancle'),
          closeOnClickModal: false,
          type: 'warning'
        })
        try {
          const url = `${this.$common.apis.dataSource}/${dataSourceName}`
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
    clickSelect(tab) {
      if (tab.name === "dataSourceSelect") {
        this.getDataSources()
      }
    },
    configDialog(dialogTitle, dialogMessage, dialogVisible, dialogSize, dialogInputAutosize) {
      this.dialogTitle = dialogTitle
      this.dialogMessage = dialogMessage
      this.dialogVisible = dialogVisible
      this.dialogSize = dialogSize
      this.dialogInputAutosize = dialogInputAutosize
    },
    getIntervals(dataSourceName) {
      const preLocation = 'dataSource'
      this.$common.eventBus.$emit('activeNameInterval', preLocation, dataSourceName)
    },
    getSegments(dataSourceName) {
      this.$common.eventBus.$emit('activeNameSegment', 'dataSource', dataSourceName)
    },
    handleCurrentChange(newValue) {
      this.currentPage = newValue
      this.showTableData = this.$common.methods.fillShowTableData(this.dataSources, this.currentPage, this.pageSize)
    },
    handleSizeChange(newValue) {
      this.pageSize = newValue
      this.showTableData = this.$common.methods.fillShowTableData(this.dataSources, this.currentPage, this.pageSize)
    },
    handleSort(column) {
      this.isAscending = column.order === "ascending" ? true : false
      this.getDataSources(this.isAscending)
    },
    async onSearch() {
      this.getDataSourceByName(this.formInline.name)
    },
    async getDataSourceByName(dataSourceName) {
      const url = `${this.$common.apis.dataSource}?full`
      const response = await this.$http.get(url, {
        params: {
          isAscending: this.isAscending,
          searchString: dataSourceName
        }
      })
      const data = this.getDataFromResponse(response)
      this.dataSources = []
      this.$common.methods.pushData(data, this.dataSources)
      this.showTableData = this.$common.methods.fillShowTableData(this.dataSources, this.currentPage, this.pageSize)
    }
  },
  mounted() {
    let self = this
    this.$common.eventBus.$on("activeNameDataSource", (preLocation, dataSourceName) => {
      this.dataSourceName = dataSourceName
      this.preLocation = preLocation
      self.init()
    })
    this.$common.eventBus.$on("getAllDataSources", (preLocation) => {
      this.preLocation = preLocation
      self.init()
    })
  }
}
</script>
