<template>
  <div class="main">
    <div style=" margin-left:20px;">
      <span style="color: #242f42;font-size:20px;">
        <b @click="getDataSources">{{$t('message.dataSource.dataSourceTitle')}}</b>
      </span>
      <br></br>
    </div>
    <div style=" margin-left:20px;">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item :label="$t('message.common.name')">
          <el-input v-model="formInline.name" :placeholder="$t('message.common.name')" size="small"></el-input>
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
        <el-table-column prop="tiers" :label="$t('message.dataSource.tiers')" width="115"></el-table-column>
        <el-table-column :label="$t('message.dataSource.segments')" align="center">
          <el-table-column prop="properties.segments.count" :label="$t('message.common.count')" width="80"></el-table-column>
          <el-table-column prop="properties.segments.size" :label="$t('message.common.size')" width="120"></el-table-column>
          <el-table-column prop="properties.segments.maxTime" :label="$t('message.dataSource.maxTime')" width="210"></el-table-column>
          <el-table-column prop="properties.segments.minTime" :label="$t('message.dataSource.minTime')" width="210"></el-table-column>
        </el-table-column>
        <el-table-column :label="$t('message.common.more')" width="480">
          <template scope="scope">
            <!-- <el-button size="mini" @click="getTiers(scope.row.name)">{{$t('message.dataSource.tiers')}}</el-button> -->
            <el-button size="mini" @click="getIntervals(scope.row.name)">{{$t('message.dataSource.intervals')}}</el-button>
            <el-button size="mini" @click="getSegments(scope.row.name)">{{$t('message.dataSource.segments')}}</el-button>
            <el-button size="mini" @click="getDimensions(scope.row.name)">{{$t('message.dataSource.dimensions')}}</el-button>
            <el-button size="mini" @click="getMetrics(scope.row.name)">{{$t('message.dataSource.metrics')}}</el-button>
            <el-button size="mini" @click="getCandidates(scope.row.name)">{{$t('message.dataSource.candidates')}}</el-button>
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
    }
  },
  created: function() {
    this.dataSourceName = this.$route.query.dataSourceName
    this.init()
  },
  methods: {
    init() {
      if (this.$route.query.preLocation === 'interval') {
        this.getDataSourceByName(this.$route.query.dataSourceName)
      } else if (this.$route.query.preLocation === 'segment') {
        this.getDataSourceByName(this.$route.query.dataSourceName)
      } else {
        this.getDataSources("true")
      }
    },
    async getDataSources(isAscending) {
      const url = `${this.$common.apis.dataSource}?full`
      console.log(url)
      const response = await this.$http.get(url, {
        params: {
          isAscending: isAscending
        }
      })
      let dataSourceMap = new Map()
      for(let i=0; i<response.data.length;i++) {
        dataSourceMap = response.data[i]["properties"]["tiers"]
        let tierName
        for(var key in dataSourceMap) {
          tierName = key
        }
        response.data[i]["tiers"] = tierName
      }
      this.dataSources = []
      this.$common.methods.pushData(response.data, this.dataSources)
      this.showTableData = this.$common.methods.fillShowTableData(this.dataSources, this.currentPage, this.pageSize)

    },
    async getTiers(dataSourceName) {
      const url = `${this.$common.apis.dataSource}/${dataSourceName}`
      this.getInfoFromUrl(url, this.$t('message.dataSource.tiersInfo'))
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
    async getInfoFromUrl(url, title) {
      console.log(url)
      const response = await this.$http.get(url)
      const info = response.data
      console.log(info)
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
    configDialog(dialogTitle, dialogMessage, dialogVisible, dialogSize, dialogInputAutosize) {
      this.dialogTitle = dialogTitle
      this.dialogMessage = dialogMessage
      this.dialogVisible = dialogVisible
      this.dialogSize = dialogSize
      this.dialogInputAutosize = dialogInputAutosize
    },
    getIntervals(dataSourceName) {
      this.$router.push(
        { path: '/interval', query: { preLocation: "dataSource", dataSourceName: dataSourceName } }
      )
    },
    getSegments(dataSourceName) {
      this.$router.push(
        { path: '/segment', query: { preLocation: "dataSource", dataSourceName: dataSourceName } }
      )
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
      const url = `${this.$common.apis.dataSource}?full`
      const response = await this.$http.get(url, {
        params: {
          isAscending: this.isAscending,
          searchString: this.formInline.name
        }
      })
      this.dataSources = []
      this.$common.methods.pushData(response.data, this.dataSources)
      this.showTableData = this.$common.methods.fillShowTableData(this.dataSources, this.currentPage, this.pageSize)

    },
    async getDataSourceByName(dataSourceName) {
      const url = `${this.$common.apis.dataSource}?full`
      const response = await this.$http.get(url, {
        params: {
          isAscending: this.isAscending,
          searchString: dataSourceName
        }
      })
      this.dataSources = []
      this.$common.methods.pushData(response.data, this.dataSources)
      this.showTableData = this.$common.methods.fillShowTableData(this.dataSources, this.currentPage, this.pageSize)

    }
  }
}
</script>
