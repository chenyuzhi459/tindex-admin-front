<template>
  <div class="main">
    <div style=" margin-left:20px;">
      <span style="color: #242f42;font-size:20px;">
        <b>{{$t('message.lookup.lookupCoordinator.lookupTitle')}}</b>
      </span>
      <br></br>
    </div>
    <!-- <div style=" margin-left:20px;">
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item :label="$t('message.dataSource.name')">
              <el-input v-model="formInline.name" :placeholder="$t('message.dataSource.name')" size="small"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="onSearch">{{$t('message.dataSource.search')}}</el-button>
              <el-button type="primary" size="small" @click="init">{{$t('message.dataSource.refresh')}}</el-button>
            </el-form-item>
          </el-form>
        </div> -->
    <div class="table" style=" margin-left:20px;">

      <el-table :data="showTableDataTier" border style="width: 100%" ref="multipleTable">
        <el-table-column prop="lookups" :label="$t('message.lookup.lookups')"></el-table-column>

        <el-table-column :label="$t('message.common.more')">
          <template scope="scope">
            <el-button size="mini" @click="getItems(scope.row.name)">{{$t('message.common.items')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
 
      <div class="pagination">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[5, 10, 15, 25, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="tiers.length">
        </el-pagination>
      </div>
    </div>

    <br/><br/><br/><br/><br/><br/>

    <div class="table" style=" margin-left:20px;">

      <el-table :data="showTableDataLookup" border style="width: 100%" ref="multipleTable">
        <el-table-column prop="lookups" :label="$t('message.lookup.userGroupLookup')"></el-table-column>

        <el-table-column :label="$t('message.common.more')">
          <template scope="scope">
            <el-button size="mini" @click="getItems(scope.row.name)">{{$t('message.common.items')}}</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[5, 10, 15, 25, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="tiers.length">
        </el-pagination>
      </div>
    </div>

    <!-- <el-dialog :visible.sync="dialogVisible" :size="dialogSize" @close="dialogMessage = ''">
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
            <el-button @click="dialogVisible = false">{{$t('message.common.confirm')}}</el-button>
            <el-button type="primary" @click="dialogVisible = false">{{$t('message.common.cancle')}}</el-button>
          </span>
        </el-dialog> -->

  </div>
</template>

<script>
export default {
  data() {
    return {
      showTableDataLookup: [],
      showTableDataTier: [],
      dialogMessage: '',
      dialogTitle: '',
      dialogSize: 'large',
      dialogInputAutosize: {},
      dialogVisible: false,
      formInline: {
        name: '',
      },
      pageSize: 5,
      currentPage: 1,
      isAscending: "ascending",
      isSearching: false,
      tiers: []
    }
  },
  created: function() {
    this.init()
  },
  methods: {
    init() {
      this.getTiers()
      this.getLookups("__default")
    },
    async getTiers() {
      const url = `${this.$common.apis.lookups}`
      console.log(url)
      const response = await this.$http.get(url)

      for (let i = 0; i < response.data.length; i++) {
        let itemMap = new Map()
        itemMap["lookups"] = response.data[i]
        response.data[i] = itemMap
      }
      this.tiers = []
      this.$common.methods.pushData(response.data, this.tiers)
      this.showTableDataTier = this.$common.methods.fillShowTableData(this.tiers, this.currentPage, this.pageSize)

    },
    async getLookups(tierName) {
      const url = `${this.$common.apis.lookups}/${tier}`
      console.log(url)
      const response = await this.$http.get(url)

      for (let i = 0; i < response.data.length; i++) {
        let itemMap = new Map()
        itemMap["name"] = response.data[i]
        response.data[i] = itemMap
      }
      this.tiers = []
      this.$common.methods.pushData(response.data, this.tiers)
      this.showTableDataTier = this.$common.methods.fillShowTableData(this.tiers, this.currentPage, this.pageSize)
    },
    // async getTiers(dataSourceName) {
    //   const url = `${this.$common.apis.dataSource}/${dataSourceName}`
    //   this.getInfoFromUrl(url, this.$t('message.dataSource.tiersInfo'))
    // },
    // getDimensions(dataSourceName) {
    //   const url = `${this.$common.apis.clientInfo}/${dataSourceName}/dimensions`
    //   this.getInfoFromUrl(url, this.$t('message.dataSource.dimensionsInfo'))
    // },
    // getMetrics(dataSourceName) {
    //   const url = `${this.$common.apis.clientInfo}/${dataSourceName}/metrics`
    //   this.getInfoFromUrl(url, this.$t('message.dataSource.metricsInfo'))
    // },
    // getCandidates(dataSourceName) {
    //   const url = `${this.$common.apis.clientInfo}/${dataSourceName}/candidates`
    //   this.getInfoFromUrl(url, this.$t('message.dataSource.candidatesInfo'))
    // },
    // async getInfoFromUrl(url, title) {
    //   console.log(url)
    //   const response = await this.$http.get(url)
    //   const info = response.data
    //   console.log(info)
    //   const message = this.$common.methods.JSONUtils.toString(info)
    //   this.configDialog(title, message, true, "small", { minRows: 15, maxRows: 25 })
    // },

    // async deleteDataSource(dataSourceName) {
    //   const remindMessage = `${this.$t('message.common.deleteWarning')}\n${dataSourceName}`
    //   try {
    //     const response = await this.$confirm(remindMessage, this.$t('message.common.warning'), {
    //       confirmButtonText: this.$t('message.common.confirm'),
    //       cancelButtonText: this.$t('message.common.cancle'),
    //       closeOnClickModal: false,
    //       type: 'warning'
    //     })
    //     try {
    //       const url = `${this.$common.apis.dataSource}/${dataSourceName}`
    //       const deleteResponse = await this.$http.delete(url)
    //       window.setTimeout(this.init, 500)
    //       this.$message({
    //         type: 'success',
    //         message: this.$t('message.common.deleteSuccess')
    //       })
    //     } catch (err) {
    //       this.$message({
    //         type: 'warning',
    //         message: this.$t('message.common.deleteFail')
    //       })
    //     }
    //   } catch (e) {

    //   }
    // },
    // configDialog(dialogTitle, dialogMessage, dialogVisible, dialogSize, dialogInputAutosize) {
    //   this.dialogTitle = dialogTitle
    //   this.dialogMessage = dialogMessage
    //   this.dialogVisible = dialogVisible
    //   this.dialogSize = dialogSize
    //   this.dialogInputAutosize = dialogInputAutosize
    // },
    // getIntervals(dataSourceName) {
    //   this.$router.push(
    //     { path: '/interval', query: { preLocation: "dataSource", dataSourceName: dataSourceName } }
    //   )
    // },
    // getSegments(dataSourceName) {
    //   this.$router.push(
    //     { path: '/segment', query: { preLocation: "dataSource", dataSourceName: dataSourceName } }
    //   )
    // },
    handleCurrentChange(newValue) {
      this.currentPage = newValue
      this.showTableData = this.$common.methods.fillShowTableData(this.tiers, this.currentPage, this.pageSize)
    },
    handleSizeChange(newValue) {
      this.pageSize = newValue
      this.showTableData = this.$common.methods.fillShowTableData(this.tiers, this.currentPage, this.pageSize)
    },
    // handleSort(column) {
    //   this.isAscending = column.order === "ascending" ? true : false
    //   this.getDataSources(this.isAscending)
    // },
    // async onSearch() {
    //   const url = `${this.$common.apis.dataSource}?full`
    //   const response = await this.$http.get(url, {
    //     params: {
    //       isAscending: this.isAscending,
    //       searchString: this.formInline.name
    //     }
    //   })
    //   this.dataSources = []
    //   this.$common.methods.pushData(response.data, this.dataSources)
    //   this.fillShowTableData()

    // },
    // async getDataSourceByName(dataSourceName) {
    //   const url = `${this.$common.apis.dataSource}?full`
    //   const response = await this.$http.get(url, {
    //     params: {
    //       isAscending: this.isAscending,
    //       searchString: dataSourceName
    //     }
    //   })
    //   this.dataSources = []
    //   this.$common.methods.pushData(response.data, this.dataSources)
    //   this.fillShowTableData()

    // }
  }
}
</script>
