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
        <el-table-column :label="$t('message.dataSource.rules')">
          <template scope="scope">
            <el-button size="mini" @click="getRuleInfo(scope.row.name)">{{$t('message.common.info')}}</el-button>
            <el-button size="mini" @click="editRule(scope.row.name)">{{$t('message.dataSource.add')}}</el-button>
            <el-button size="mini" @click="getRuleHistory(scope.row.name)">{{$t('message.dataSource.history')}}</el-button>
          </template>
        </el-table-column>

        <el-table-column :label="$t('message.common.more')">
          <template scope="scope">
            <el-button size="mini" type="info" @click="getSegments(scope.row.name)">{{$t('message.dataSource.segments')}}</el-button>
            <el-button size="mini" @click="getDataSourceInfo(scope.row.name)">{{$t('message.common.info')}}</el-button>
            <el-button size="mini" @click="getDimensions(scope.row.name)">{{$t('message.dataSource.dimensions')}}</el-button>
            <el-button size="mini" @click="getMetrics(scope.row.name)">{{$t('message.dataSource.metrics')}}</el-button>
            <el-button size="mini" @click="getCandidates(scope.row.name)">{{$t('message.dataSource.candidates')}}</el-button>
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
        <div style=" line-height: 1; font-size: 16px; font-weight: 700;color: #1f2d3d;">
          {{dialogTitle}}
        </div>
      </template>
      <el-input type="textarea" :autosize="dialogInputAutosize" v-model="dialogMessage">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{$t('message.common.cancle')}}</el-button>
        <el-button type="primary" @click="clickConfirm()">{{$t('message.common.confirm')}}</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
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
        name: ''
      },
      pageSize: 15,
      currentPage: 1,
      isDescending: "descending",
      isSearching: false,
      confirmType: '',
      ruleDataSource: '',
      dataSourceName: '',
      preLocation: ''
    }
  },
  created: function() {
    this.init()
  },
  methods: {
    init() {
      if (this.preLocation === 'segment') {
        this.getDataSourceByName(this.dataSourceName)
      } else {
        this.getDataSources("true", "name")
      }
    },
    clickSelect(tab) {
      if (tab.name === "dataSourceSelect") {
        this.getDataSources()
      }
    },
    async getDataSources(isDescending, sortName) {
      const url = `${this.$common.apis.mDataSource}/sortAndSearch?full`
      const response = await this.$http.get(url, {
        params: {
          isDescending: isDescending,
          sortDimension: sortName
        }
      })
      this.dataSources = []

      this.$common.methods.pushData(response.data, this.dataSources)
      this.showTableData = this.$common.methods.fillShowTableData(this.dataSources, this.currentPage, this.pageSize)

    },
    getDataSourceInfo(dataSourceName) {
      const url = `${this.$common.apis.mDataSource}/${dataSourceName}`
      this.getInfoFromUrl(url, this.$t('message.dataSource.dataSourceInfo'))
    },
    getDimensions(dataSourceName) {
      const url = `${this.$common.apis.clientInfo}/${dataSourceName}/dimensions`
      this.getInfoFromUrl(url, this.$t('message.dataSource.dimensionsInfo'))
    },
    getMetrics(dataSourceName) {
      const url = `${this.$common.apis.clientInfo}/${dataSourceName}/metrics`
      this.getInfoFromUrl(url, this.$t('message.dataSource.metricsInfo'))
    },
    getCandidates(dataSourceName) {
      const url = `${this.$common.apis.clientInfo}/${dataSourceName}/candidates`
      this.getInfoFromUrl(url, this.$t('message.dataSource.candidatesInfo'))
    },
    getRuleInfo(dataSourceName) {
      const url = `${this.$common.apis.rules}/${dataSourceName}`
      this.getInfoFromUrl(url, this.$t('message.dataSource.rulesInfo'))
    },
    getRuleHistory(dataSourceName) {
      const url = `${this.$common.apis.rules}/${dataSourceName}/history`
      this.getInfoFromUrl(url, this.$t('message.dataSource.rulesHistory'))
    },
    async getInfoFromUrl(url, title) {
      const response = await this.$http.get(url)
      this.dataSourceInfo = response.data
      const message = this.$common.methods.JSONUtils.toString(this.dataSourceInfo)
      let size = "small"
      if (title === this.$t('message.dataSource.dataSourceInfo')) {
        size = "full"
      }
      this.configDialog(title, message, true, size, { minRows: 15, maxRows: 37 }, "")

    },


    editRule(dataSourceName) {
      this.ruleDataSource = dataSourceName
      this.configDialog(this.$t('message.dataSource.rulesInfo'), '', true, "small", { minRows: 15, maxRows: 25 }, "addRule")
    },

    configDialog(dialogTitle, dialogMessage, dialogVisible, dialogSize, dialogInputAutosize, confirmType) {
      this.dialogTitle = dialogTitle
      this.dialogMessage = dialogMessage
      this.dialogVisible = dialogVisible
      this.dialogSize = dialogSize
      this.dialogInputAutosize = dialogInputAutosize
      this.confirmType = confirmType
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
      this.isDescending = column.order === "descending" ? true : false
      let name
      if (column.prop === "properties.created") {
        name = "created"
      } else {
        name = column.prop
      }
      this.getDataSources(this.isDescending, name)
    },

    clickConfirm() {
      if (this.confirmType === "addRule") {
        this.addRule()
      }
      this.dialogVisible = false
    },
    async addRule() {
      const remindMessage = `${this.$t('message.dataSource.addRuleWarning')}`
      try {
        const postData = await this.$common.methods.JSONUtils.toJsonObject(this.dialogMessage)
        const response = await this.$confirm(remindMessage, this.$t('message.common.warning'), {
          confirmButtonText: this.$t('message.common.confirm'),
          cancelButtonText: this.$t('message.common.cancle'),
          closeOnClickModal: false,
          type: 'warning'
        })
        try {
          const url = `${this.$common.apis.rules}/${this.ruleDataSource}`
          const editResponse = await this.$http.post(url, postData, {
            header: { ContentType: "application/json" }
          })
          window.setTimeout(this.init, 500)
          this.$message({
            type: 'success',
            message: this.$t('message.dataSource.addRulesSuccess')
          })
        } catch (err) {
          this.$message({
            type: 'warning',
            message: this.$t('message.dataSource.addRulesFail')
          })
        }
      } catch (e) {

      }
    },
    async getDataSourceByName(dataSourceName) {
      const url = `${this.$common.apis.mDataSource}/${dataSourceName}?full`
      const response = await this.$http.get(url)
      this.dataSources = []
      let message = new Array()
      message[0] = response.data
      this.$common.methods.pushData(message, this.dataSources)
      this.showTableData = this.$common.methods.fillShowTableData(this.dataSources, this.currentPage, this.pageSize)
    },
    async onSearch() {
      const url = `${this.$common.apis.mDataSource}/sortAndSearch?full`
      const response = await this.$http.get(url, {
        params: {
          isDescending: this.isDescending,
          searchValue: this.formInline.name
        }
      })
      this.dataSources = []
      this.$common.methods.pushData(response.data, this.dataSources)
      this.showTableData = this.$common.methods.fillShowTableData(this.dataSources, this.currentPage, this.pageSize)
    },
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
