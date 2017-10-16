<template>
  <div class="main">
    <div style=" margin-left:20px;">

      <span style="color: #242f42;font-size:20px;">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/ChildDataSource', query: { showEnable: this.showEnable} }">{{$t('message.dataSource.dataSourceTitle')}}</el-breadcrumb-item>
        </el-breadcrumb>
      </span>
      <br/>

      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item :label="$t('message.common.name')">
          <el-input v-model="formInline.name" :placeholder="$t('message.common.inputName')" size="small"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="onSearch" icon="search">{{$t('message.common.search')}}</el-button>
          <el-button type="primary" size="small" @click="refresh">{{$t('message.common.refresh')}}</el-button>
          <el-switch v-model="showEnable" on-color="#13ce66" off-color="#ff4949" on-text="Enable" off-text="Disable" :width="80" style="position:absolute; left:1100px; top:18px;" @change="switchChange">>
          </el-switch>
        </el-form-item>
      </el-form>
    </div>
    <div class="table" style=" margin-left:20px;">

      <el-table :data="showTableData" border style="width: 100%" ref="multipleTable" @sort-change="handleSort">
        <el-table-column :label="$t('message.common.name')" sortable="custom" width="310">
          <template scope="scope">
            <a class="click-link" @click="getIntervals(scope.row.name)">{{scope.row.name}}</a>
          </template>
        </el-table-column>

        <!-- <el-table-column :label="$t('message.dataSource.segments')" align="center"> -->
          <el-table-column v-if="showEnable" prop="properties.segments.count" :label="$t('message.interval.segmentCount')" width="120"></el-table-column>
          <el-table-column v-if="showEnable" prop="properties.segments.size" :label="$t('message.common.size')" width="95"></el-table-column>
          <el-table-column v-if="showEnable" prop="properties.segments.maxTime" :label="$t('message.dataSource.maxTime')" width="210"></el-table-column>
          <el-table-column v-if="showEnable" prop="properties.segments.minTime" :label="$t('message.dataSource.minTime')" width="210"></el-table-column>
        <!-- </el-table-column> -->
        <el-table-column v-if="showEnable" :label="$t('message.dataSource.rules')" width="170">
          <template scope="scope">
            <el-button size="mini" @click="getRuleInfo(scope.row.name)">{{$t('message.common.info')}}</el-button>
            <el-button size="mini" @click="editRule(scope.row.name)">{{$t('message.dataSource.add')}}</el-button>
            <el-button size="mini" @click="getRuleHistory(scope.row.name)">{{$t('message.dataSource.history')}}</el-button>
          </template>
        </el-table-column>

        <el-table-column :label="$t('message.common.more')">
          <template scope="scope">
            <!-- <el-button size="mini" type="info" @click="getIntervals(scope.row.name)">{{$t('message.dataSource.intervals')}}</el-button> -->
            <el-button size="mini" type="info" @click="getSegments(scope.row.name)">{{$t('message.dataSource.segments')}}</el-button>
            <el-button v-if="showEnable" size="mini" @click="getDimensions(scope.row.name)">{{$t('message.dataSource.dimensions')}}</el-button>
            <el-button v-if="showEnable" size="mini" @click="getMetrics(scope.row.name)">{{$t('message.dataSource.metrics')}}</el-button>
            <el-button v-if="showEnable" size="mini" @click="disableDataSource(scope.row.identifier)" type="warning">{{$t('message.common.disable')}}</el-button>
            <el-button v-if="!showEnable" size="mini" @click="enableDataSource(scope.row.identifier)" type="success">{{$t('message.common.enable')}}</el-button>
            <el-button v-if="!showEnable" size="mini" @click="deleteDataSource(scope.row.identifier)" type="danger">{{$t('message.common.delete')}}</el-button>
            <!-- <el-button size="mini" @click="getCandidates(scope.row.name)">{{$t('message.dataSource.candidates')}}</el-button> -->
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

      <el-input v-if="dialogForInfo" type="textarea" :autosize="dialogInputAutosize" v-model="dialogMessage"></el-input>

      <el-form v-if="!dialogForInfo" :inline="true" :model="form" class="demo-form-inline">
        <el-form-item :label="$t('message.dataSource.operate')">
          <el-select v-model="form.actionValue" :placeholder="$t('message.dataSource.operateInfo')" size="12">
            <el-option v-for="item in form.actionOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('message.dataSource.granularity')">
          <el-select v-model="form.granularityValue" :placeholder="$t('message.dataSource.granularityInfo')" @change="changeGranularitySelect" size="12">
            <el-option v-for="item in form.granularityOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <br></br>
        <el-form-item>
          <el-input v-if="showInput" v-model="form.inputMessage" :placeholder="form.inputPrompt" size="30"></el-input>
        </el-form-item>

      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button v-if="showCancle" @click="dialogVisible = false">{{$t('message.common.cancle')}}</el-button>
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
      isDescending: false,
      isSearching: false,
      confirmType: '',
      ruleDataSource: '',
      dataSourceName: '',
      preLocation: '',
      showCancle: false,
      showEnable: true,
      showInput: false,
      dialogForInfo: true,
      form: {
        actionOptions: [{
          value: 'drop',
          label: 'drop'
        }, {
          value: 'load',
          label: 'load'
        }, {
          value: 'broadcast',
          label: 'broadcast'
        }],
        actionValue: '',
        granularityOptions: [{
          value: 'period',
          label: 'period'
        }, {
          value: 'interval',
          label: 'interval'
        }, {
          value: 'forever',
          label: 'forever'
        }],
        granularityValue: ''
      }

    }
  },
  created: function() {
    if(this.$route.query.showEnable !== undefined) {
      this.showEnable = this.$route.query.showEnable
    }
    this.init()
  },
  methods: {
    init() {
      if (this.showEnable) {
        this.getDataSources(this.isDescending, "name", this.formInline.name)
      } else {
        this.getDataSourcesDisable(this.isDescending, "name", this.formInline.name)
      }
    },
    clickSelect(tab) {
      if (tab.name === "dataSourceSelect") {
        this.getDataSources()
      }
    },
    refresh() {
      this.init()
    },
    switchChange() {
      this.init()
    },
    changeGranularitySelect() {
      if (this.form.granularityValue === 'period') {
        this.showInput = true
        this.form.inputPrompt = this.$t('message.dataSource.periodInputInfo')
      } else if (this.form.granularityValue === 'interval') {
        this.showInput = true
        this.form.inputPrompt = this.$t('message.dataSource.intervalInputInfo')
      } else {
        this.showInput = false
      }
    },
    async getDataSources(isDescending, sortName, searchValue) {
      const url = `${this.$common.apis.dataSource}?simple`
      const response = await this.$http.get(url, {
        params: {
          isDescending: isDescending,
          searchValue: searchValue
        }
      })
      console.log(url)
      for (let i = 0; i < response.data.length; i++) {
        const size = response.data[i]['properties']['segments']['size']
        response.data[i]['properties']['segments']['size'] = this.$common.methods.conver(size)
      }
      this.dataSources = []
      this.$common.methods.pushData(response.data, this.dataSources)
      this.showTableData = this.$common.methods.fillShowTableData(this.dataSources, this.currentPage, this.pageSize)
    },
    async getDataSourcesDisable(isDescending, sortName, searchValue) {
      const url = `${this.$common.apis.disableDataSource}`
      const response = await this.$http.get(url, {
        params: {
          isDescending: isDescending,
          searchValue: searchValue
        }
      })
      this.dataSources = []
      this.$common.methods.pushData(response.data, this.dataSources)
      this.showTableData = this.$common.methods.fillShowTableData(this.dataSources, this.currentPage, this.pageSize)
    },
    async disableDataSource(dataSourceName) {

    },
    async enableDataSource(dataSourceName) {

    },
    async deleteDataSource(dataSourceName) {

    },
    async onSearch() {
      if(this.showEnable) {
        this.getDataSources(this.isDescending, "name", this.formInline.name)
      } else {
        this.getDataSourcesDisable(this.isDescending, "name", this.formInline.name)
      }
    },
    // getDataSourceInfo(dataSourceName) {
    //   const url = `${this.$common.apis.mDataSource}/${dataSourceName}`
    //   this.getInfoFromUrl(url, this.$t('message.dataSource.dataSourceInfo'))
    // },
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
      this.showCancle = false
      this.confirmType = 'confirmInfo'
      this.dialogForInfo = true
      this.configDialog(title, message, true, 'small', { minRows: 15, maxRows: 25 })

    },
    editRule(dataSourceName) {
      this.ruleDataSource = dataSourceName
      this.showCancle = true
      this.confirmType = 'addRule'
      this.dialogForInfo = false
      this.configDialog(this.$t('message.dataSource.rulesInfo'), '', true, 'small', { minRows: 15, maxRows: 25 })
    },
    configDialog(dialogTitle, dialogMessage, dialogVisible, dialogSize, dialogInputAutosize) {
      this.dialogTitle = dialogTitle
      this.dialogMessage = dialogMessage
      this.dialogVisible = dialogVisible
      this.dialogSize = dialogSize
      this.dialogInputAutosize = dialogInputAutosize
    },
    getSegments(dataSourceName) {
      this.$router.push({ path: '/ChildSegment', query: { preLocation: 'dataSource', dataSourceName: dataSourceName, showEnable: this.showEnable } })
    },
    getIntervals(dataSourceName) {
      this.$router.push({ path: '/ChildInterval', query: { showEnable: this.showEnable, preLocation: 'dataSource', dataSourceName: dataSourceName } })
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
      this.isDescending = column.order === 'descending' ? true : false
      if(this.showEnable) {
        this.getDataSources(this.isDescending, column.prop,this.formInline.name)
      } else {
        this.getDataSourcesDisable(this.isDescending, column.prop,this.formInline.name)
      }
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
        // if(this.dialogMessage ==='') {
        //   alert("cant be null")
        // } 
        const postData = await this.$common.methods.JSONUtils.toJsonObject(this.dialogMessage)
        const response = await this.$confirm(remindMessage, this.$t('message.common.warning'), {
          confirmButtonText: this.$t('message.common.confirm'),
          cancelButtonText: this.$t('message.common.cancle'),
          closeOnClickModal: false,
          type: 'warning'
        })
        try {
          const url = `${this.$common.apis.rules}/${this.ruleDataSource}`
          console.log(url)

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
    }
  }
}
</script>

<style>
@import "../../../../static/css/link.css";
</style>