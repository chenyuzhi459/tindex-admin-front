<template>
  <div class="main">
    <div class="table" style=" margin-left:20px;">
      <span style="color: #242f42;font-size:20px;">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/mDataSource', query: { showEnable: this.showEnable} }">{{$t('message.dataSource.dataSourceTitle')}}</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/ChildInterval', query: { showEnable: this.showEnable} }">{{$t('message.interval.intervalTitle')}}</el-breadcrumb-item>
        </el-breadcrumb>
      </span>
      <br/>
      <el-tag type="primary">{{$t('message.dataSource.dataSource')}} : {{this.dataSourceName}}</el-tag>
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

      <el-table :data="showTableData" border style="width: 100%" ref="multipleTable" @sort-change="handleSort">
        <el-table-column prop="interval" :label="$t('message.interval.name')" sortable="custom" width="800">
          <template scope="scope">
            <a class="click-link" @click="getSegments(scope.row.name)">{{scope.row.name}}</a>
          </template>
        </el-table-column>
        <el-table-column v-if="showEnable" prop="segmentCount" :label="$t('message.interval.segmentCount')"></el-table-column>
        <el-table-column v-if="showEnable" prop="intervalSize" :label="$t('message.common.size')"></el-table-column>
        <el-table-column :label="$t('message.interval.more')">
          <template scope="scope">
            <el-button size="mini" type="info" @click="getSegments(scope.row.name)">{{$t('message.interval.segments')}}</el-button>
            <el-button v-if="showEnable" size="mini" @click="disableInterval(scope.row.name)" type="warning">{{$t('message.common.disable')}}</el-button>
            <el-button v-if="!showEnable" size="mini" @click="enableInterval(scope.row.name)" type="success">{{$t('message.common.enable')}}</el-button>
            <el-button v-if="!showEnable" size="mini" @click="deleteInterval(scope.row.name)" type="danger">{{$t('message.common.delete')}}</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[5, 10, 15, 25, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="intervals.length">
        </el-pagination>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      intervals: [],
      showTableData: [],
      pageSize: 15,
      currentPage: 1,
      segment: '',
      preLocation: '',
      intervalName: '',
      dataSourceName: '',
      isDescending: true,
      formInline: {
        name: ''
      },
      showEnable: false,
      createdShowEnable: false
    }
  },
  created: function() {
    if (this.$route.query.showEnable !== undefined) {
      this.showEnable = eval(this.$route.query.showEnable)
      this.createdShowEnable = this.showEnable
    }
    this.init()
  },
  methods: {
    init() {
      this.preLocation = this.$route.query.preLocation
      this.dataSourceName = this.$route.query.dataSourceName
      this.getIntervals()
    },
    refresh() {
      this.init()
    },
    async disableInterval(intervalName) {
      const intervalNameProcessed = intervalName.replace('/', '_')
      const remindMessage = `${this.$t('message.common.disableWarning')}\n${intervalName}`
      const url = `${this.$common.apis.mDataSource}/${this.dataSourceName}/intervals/${intervalNameProcessed}/disable`
      const successMessage = this.$t('message.common.disableSuccess')
      const failMessage = this.$t('message.common.disableFail')
      let data = new Array()
      data[0] = intervalName
      console.log(data)
      this.confirmAndGetResult(url, remindMessage, successMessage, failMessage, 'delete', data)
    },
    async enableInterval(intervalName) {
      const intervalNameProcessed = intervalName.replace('/', '_')
      const remindMessage = `${this.$t('message.common.enableWarning')}\n${intervalName}`
      const url = `${this.$common.apis.mDataSource}/${this.dataSourceName}/intervals/${intervalNameProcessed}/enable`
      const successMessage = this.$t('message.common.enableSuccess')
      const failMessage = this.$t('message.common.enableFail')
      let data = new Array()
      data[0] = intervalName
      this.confirmAndGetResult(url, remindMessage, successMessage, failMessage, 'post', data)
    },
    async deleteInterval(intervalName) {
      const intervalNameProcessed = intervalName.replace('/', '_')
      const remindMessage = `${this.$t('message.common.deleteWarning')}\n${intervalName}`
      const url = `${this.$common.apis.mDataSource}/${this.dataSourceName}/intervals/${intervalNameProcessed}/delete`
      const successMessage = this.$t('message.common.deleteSuccess')
      const failMessage = this.$t('message.common.deleteFail')
      let data = new Array()
      data[0] = intervalName
      this.confirmAndGetResult(url, remindMessage, successMessage, failMessage, 'delete', data)
    },
    async confirmAndGetResult(url, remindMessage, successMessage, failMessage, methodType) {
      const response = await this.$confirm(remindMessage, this.$t('message.common.warning'), {
        confirmButtonText: this.$t('message.common.confirm'),
        cancelButtonText: this.$t('message.common.cancle'),
        closeOnClickModal: false,
        type: 'warning'
      })
      try {
        let handleResponse
        if (methodType === 'delete') {
          console.log(url)
          handleResponse = await this.$http.delete(url)
        } else {
          handleResponse = await this.$http.post(url)
        }
        window.setTimeout(this.init, 500)
        this.$message({
          type: 'success',
          message: successMessage
        })
      } catch (err) {
        this.$message({
          type: 'warning',
          message: failMessage
        })
      }
    },
    getIntervals() {
      this.getIntervalsByDataSourceName('interval', this.formInline.name, 'interval', this.isDescending)
    },
    handleSort(column) {
      this.isDescending = column.order === 'descending' ? true : false
      if (column.prop === null) {
        column.prop = 'interval'
      }
      this.getIntervalsByDataSourceName('interval', this.formInline.name, column.prop, this.isDescending)
    },
    onSearch() {
      this.getIntervalsByDataSourceName('interval', this.formInline.name, 'interval', this.isDescending)
    },
    async getIntervalsByDataSourceName(searchDimension, searchValue, sortDimension, isDescending) {
      let url
      let data
      if (!this.createdShowEnable && this.showEnable) {
        data = ''
      } else {
        if (this.showEnable === true) {
          url = `${this.$common.apis.mDataSource}/${this.dataSourceName}/intervals?simple`
        } else {
          url = `${this.$common.apis.mDataSource}/${this.dataSourceName}/disableIntervals`
        }
        const response = await this.$http.get(url, {
          params: {
            searchDimension: searchDimension,
            searchValue: searchValue,
            sortDimension: sortDimension,
            isDescending: isDescending
          }
        })
        data = this.getDataFromResponse(response)
      }

      this.intervals = []
      this.$common.methods.pushData(data, this.intervals)

      this.showTableData = this.$common.methods.fillShowTableData(this.intervals, this.currentPage, this.pageSize)
    },
    switchChange() {
      this.init()
    },
    getDataFromResponse(response) {
      const convertData = new Array()
      if (this.showEnable === true) {
        for (let key in response.data) {
          let itemMap = new Map()
          itemMap["name"] = key
          itemMap["segmentCount"] = response.data[key]["count"]
          itemMap["intervalSize"] = this.$common.methods.conver(response.data[key]["size"])
          convertData.push(itemMap)
        }
      } else {
        for (let i = 0; i < response.data.length; i++) {
          let itemMap = new Map()
          itemMap["name"] = response.data[i]
          convertData.push(itemMap)
        }
      }
      return convertData
    },
    getSegments(intervalName) {
      this.$router.push({ path: '/ChildSegment', query: { showEnable: this.showEnable, preLocation: 'interval', dataSourceName: this.dataSourceName, intervalName: intervalName } })
    },
    handleCurrentChange(newValue) {
      this.currentPage = newValue
      this.showTableData = this.$common.methods.fillShowTableData(this.intervals, this.currentPage, this.pageSize)
    },
    handleSizeChange(newValue) {
      this.pageSize = newValue
      this.showTableData = this.$common.methods.fillShowTableData(this.intervals, this.currentPage, this.pageSize)
    }
  }
}
</script>

<style>
@import "../../../../static/css/link.css";
</style>
