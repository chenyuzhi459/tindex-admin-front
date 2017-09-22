<template>
  <div class="main">
    <div style=" margin-left:20px;">
      <span style="color: #242f42;font-size:20px;">
        <b>DataSources</b>
      </span>
      <br></br>
    </div>

    <!-- <div style=" margin-left:20px;"> 
            <br></br>
        </div>  -->
    <div style=" margin-left:20px;">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="name">
          <el-input v-model="formInline.name" placeholder="name" size="small"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="onSearch">查询</el-button>
          <el-button type="primary" size="small" @click="init">刷新</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table" style=" margin-left:20px;">

      <el-table :data="showTableData" border style="width: 100%" ref="multipleTable" @sort-change="handleSort">
        <el-table-column prop="name" label="name" sortable="custom" width="310"></el-table-column>
        <el-table-column label="segments" align="center">
          <el-table-column prop="properties.segments.count" label="count" width="150"></el-table-column>
          <el-table-column prop="properties.segments.size" label="size" width="150"></el-table-column>
          <el-table-column prop="properties.segments.maxTime" label="maxTime" width="250"></el-table-column>
          <el-table-column prop="properties.segments.minTime" label="minTime" width="250"></el-table-column>
        </el-table-column>
        <!-- <el-table-column prop="tiers" label="tiers">
                  <el-table-column prop="size" label="size"></el-table-column>
                  <el-table-column prop="segmentCount" label="segmentCount" width="150"></el-table-column>
                </el-table-column> -->

        <el-table-column label="操作">
          <template scope="scope">
            <el-button size="mini" @click="getDataSourceInfo(scope.row.name)">info</el-button>
            <el-button size="mini" @click="getIntervals(scope.row.name)">intervals</el-button>
            <el-button size="mini" @click="getSegments(scope.row.name)">segments</el-button>
            <el-button size="mini" type="danger" @click="deleteDataSource(scope.row.name)">delete</el-button>
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
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
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
      isAscending:"ascending",
      isSearching: false
    }
  },
  created: function() {
    this.init()
  },
  methods: {
    init() {
      this.getDataSources("true")
    },
    getDataSources(isAscending) {
      const url = `${this.$common.apis.dataSource}?full`
      this.$http.get(url, {
        params: {
          isAscending: isAscending
        }
      }).then(response => {
        this.dataSources = []
        this.$common.methods.pushData(response.data, this.dataSources)
        this.fillShowTableData()
      })
    },
    getDataSourceInfo(dataSourceName) {
      const url = `${this.$common.apis.dataSource}/${dataSourceName}`
      console.log(url)
      this.$http.get(url).then(response => {
        this.dataSourceInfo = response.data
        console.log(this.dataSourceInfo)
        var message = JSON.stringify(this.dataSourceInfo, null, 2)
        this.configDialog("DataSource Info", message, true, "small", { minRows: 15, maxRows: 25 })
      })
    },

    deleteDataSource(dataSourceName) {
      var remindMessage = "Do you really want to delete:" + "\n" + dataSourceName
      this.$confirm(remindMessage, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type: 'warning'
      }).then(() => {
        const url = `${this.$common.apis.dataSource}/${dataSourceName}`
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
    getIntervals(dataSourceName) {
      this.$router.push(
        { path: '/interval', query: { dataSourceName: dataSourceName } }
      )
    },
    getSegments(dataSourceName) {
      this.$router.push(
        { path: '/segment', query: { dataSourceName: dataSourceName } }
      )
    },

    fillShowTableData() {
      this.showTableData = []
      var position = (this.currentPage - 1) * this.pageSize
      var limit = (position + this.pageSize) >= this.dataSources.length ? this.dataSources.length - position : this.pageSize;
      for (var i = 0; i < limit; i++) {
        this.showTableData.push(this.dataSources[position + i])
      }
    },
    handleCurrentChange(newValue) {
      this.currentPage = newValue
      this.fillShowTableData()
    },
    handleSizeChange(newValue) {
      this.pageSize = newValue
      this.fillShowTableData()
    },
    handleSort(column) {
      this.isAscending = column.order === "ascending" ? true : false
      this.getDataSources(this.isAscending)
    },
    onSearch() {
      const url = `${this.$common.apis.dataSource}?full`
      this.$http.get(url, {
        params: {
          isAscending: this.isAscending,
          searchString: this.formInline.name
        }
      }).then(response => {
        this.dataSources = []
        this.$common.methods.pushData(response.data, this.dataSources)
        this.fillShowTableData()
      })
    },
    
  }
}
</script>
