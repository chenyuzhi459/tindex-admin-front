<template>
  <div class="main">
    <div style=" margin-left:20px;">
      <span style="color: #242f42;font-size:20px;">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/dataSource', query: { showEnable: this.showEnable} }">{{$t('message.dataSource.dataSourceTitle')}}</el-breadcrumb-item>
          <el-breadcrumb-item v-if="showIntervalName" :to="{ path: '/interval', query: { showEnable: this.showEnable, dataSourceName: dataSourceMessage.dataSourceName,
            dataSourceSize: dataSourceMessage.dataSourceSize,segmentCount: dataSourceMessage.segmentCount, dataSourceSpan: dataSourceMessage.dataSourceSpan
          , showSwitch: this.showSwitch}}">{{$t('message.interval.intervalTitle')}}</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/segment', query: { showEnable: this.showEnable}}">{{$t('message.segment.segmentTitle')}}</el-breadcrumb-item>
        </el-breadcrumb>
      </span>
      <br/>

      <el-tag type="success">{{$t('message.dataSource.dataSource')}} : {{this.dataSourceMessage.dataSourceName}}</el-tag>
      <template v-if="showEnable">
        &nbsp;
        <el-tag type="primary">
          {{this.dataSourceMessage.dataSourceSize}}&emsp;&emsp;{{this.dataSourceMessage.dataSourceSpan}}
          &emsp;&emsp;{{this.dataSourceMessage.segmentCount}} segments
        </el-tag>
      </template>

      <div v-if="showIntervalName" style="position: relative; top: 5px">
        <el-tag type="success">{{$t('message.interval.interval')}} : {{this.intervalMessage.intervalName}}</el-tag>
        <template v-if="showEnable">
          &nbsp;
          <el-tag type="primary">
            {{this.intervalMessage.intervalSize}}&emsp;&emsp;{{this.intervalMessage.segmentCount}} segments
          </el-tag>
        </template>
      </div>

      <el-form :inline="true" :model="formInline" class="demo-form-inline" style="position: relative; top: 15px" >
        <el-form-item :label="$t('message.common.name')">
          <el-input v-model="formInline.name" :placeholder="$t('message.common.inputName')" size="small"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="onSearch" icon="search">{{$t('message.common.search')}}</el-button>
          <el-button type="primary" size="small" @click="refresh">{{$t('message.common.refresh')}}</el-button>
          <el-switch v-model="showEnable" v-if="showSwitch" on-color="#13ce66" off-color="#ff4949" on-text="Enable" off-text="Disable" :width="80" style="position:absolute; left:1100px; top:18px; " @change="switchChange">
          </el-switch>
        </el-form-item>
      </el-form>
    </div>

    <div class="table" style=" margin-left:20px;">
      <el-table :data="showTableData" border style="width: 100%" ref="multipleTable" @sort-change="handleSort">
        <el-table-column :label="$t('message.common.name')" width="900" sortable="custom">
          <template scope="scope">
            <a v-if="showEnable" class="click-link" @click="getSegmentInfo(scope.row.identifier)">{{scope.row.identifier}}</a>
            <a v-if="!showEnable">{{scope.row.identifier}}</a>
          </template>
        </el-table-column>
        <el-table-column v-if="showEnable" prop="segmentSize" :label="$t('message.common.size')"></el-table-column>
        <el-table-column :label="$t('message.common.more')">
            
              
          <template scope="scope">
            <template v-if="showEnable">
              <el-popover ref="popoverDimension" placement="right" width="150" trigger="click">
                  <div class="popoverDiv" v-for="dimension in dimensions" :key="dimension">{{dimension}}</div>
                </el-popover>&nbsp
                <el-button v-popover:popoverDimension size="mini" @click="getDimensions(scope.row.identifier)">{{$t('message.dataSource.dimensions')}}</el-button>
                <el-popover ref="popoverMetric" placement="right" width="150" trigger="click">
                  <div class="popoverDiv" v-for="metric in metrics" :key="metric">{{metric}}</div>
                </el-popover>&nbsp
              <el-button v-popover:popoverMetric size="mini" @click="getMetrics(scope.row.identifier)">{{$t('message.dataSource.metrics')}}</el-button>
            </template>
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
          <div style=" line-height: 1; font-size: 16px; font-weight: 700; color: #1f2d3d;">
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
      dialogMessage: "",
      dialogTitle: "",
      dialogSize: "full",
      dialogInputAutosize: {},
      dialogVisible: false,
      pageSize: 15,
      currentPage: 1,
      dataSourceMessage: {
        dataSourceName: "",
        dataSourceSize: "",
        dataSourceSpan: "",
        segmentCount: 0,
        intervalCount: 0
      },
      intervalMessage: {
        intervalName: "",
        intervalSize: "",
        segmentCount: 0
      },
      preLocation: "",
      showCancle: false,
      showIntervalName: false,
      formInline: {
        name: ""
      },
      showEnable: true,
      isDescending: true,
      showSwitch: true,
      dimensions: [],
      metrics: []
    };
  },
  created: function() {
    this.dataSourceMessage.dataSourceName = this.$route.query.dataSourceName;
    this.preLocation = this.$route.query.preLocation;
    if (this.$route.query.showEnable !== undefined) {
      this.showEnable = eval(this.$route.query.showEnable);
      this.showSwitch = this.showEnable;
    }
    if (this.showEnable) {
      this.dataSourceMessage.dataSourceSize = this.$route.query.dataSourceSize
      this.dataSourceMessage.segmentCount = this.$route.query.segmentCount
      this.dataSourceMessage.dataSourceSpan = this.$route.query.dataSourceSpan
    }
    if (this.preLocation === "interval") {
      this.intervalMessage.intervalName = this.$route.query.intervalName
      this.intervalMessage.segmentCount = this.$route.query.intervalSegmentCount
      this.intervalMessage.intervalSize = this.$route.query.intervalSize
      console.log(this.intervalMessage.segmentCount)
    }
    this.init();
  },
  methods: {
    init() {
      if (this.preLocation === "dataSource") {
        this.showIntervalName = false;
      } else if (this.preLocation === "interval") {
        this.showIntervalName = true;
      }
      this.getSegmentsForshow(
        this.preLocation,
        this.isDescending,
        this.$common.methods.trim(this.formInline.name)
      );
    },
    getSegmentsForshow(preLocation, isDescending, searchValue) {
      if (preLocation === "dataSource") {
        this.getSegmentsByDataSource(isDescending, searchValue);
      } else {
        this.getSegmentsByInterval(isDescending, searchValue);
      }
    },

    async getSegmentsByDataSource(isDescending, searchValue) {
      let url;
      if (this.showEnable) {
        url = `${this.$common.apis.dataSource}/${this.dataSourceMessage
          .dataSourceName}/segments?full`;
      } else {
        url = `${this.$common.apis.dataSource}/${this.dataSourceMessage
          .dataSourceName}/disableSegments`;
      }
      let data = [];
      try {
        const response = await this.$http.get(url, {
          params: {
            isDescending: isDescending,
            searchValue: this.$common.methods.trim(searchValue)
          }
        });
        data = response.data;
      } catch (err) {}

      if (this.showEnable) {
        for (let i = 0; i < data.length; i++) {
          data[i]["segmentSize"] = this.$common.methods.conver(data[i]["size"]);
        }
      }
      this.segments = [];
      this.$common.methods.pushData(data, this.segments);
      this.showTableData = this.$common.methods.fillShowTableData(
        this.segments,
        this.currentPage,
        this.pageSize
      );
    },
    handleSort(column) {
      this.isDescending = column.order === "descending" ? true : false;
      this.getSegmentsForshow(
        this.preLocation,
        this.isDescending,
        this.$common.methods.trim(this.formInline.name)
      );
    },
    switchChange() {
      this.init();
    },
    async getSegmentsByInterval(isDescending, searchValue) {
      let url;
      if (this.showEnable) {
        url = `${this.$common.apis.dataSource}/${this.dataSourceMessage
          .dataSourceName}/segments?full`;
      } else {
        url = `${this.$common.apis.dataSource}/${this.dataSourceMessage
          .dataSourceName}/disableSegments`;
      }
      let intervals = new Array();
      intervals.push(this.intervalMessage.intervalName);
      const response = await this.$http.post(url, intervals, {
        params: {
          isDescending: isDescending,
          searchValue: this.$common.methods.trim(searchValue)
        }
      });
      for (let i = 0; i < response.data.length; i++) {
        if (this.showEnable) {
          response.data[i]["segmentSize"] = this.$common.methods.conver(
            response.data[i]["size"]
          );
        } else {
          const item = {};
          item["identifier"] = response.data[i];
          response.data[i] = item;
        }
      }

      this.segments = [];
      this.$common.methods.pushData(response.data, this.segments);
      this.showTableData = this.$common.methods.fillShowTableData(
        this.segments,
        this.currentPage,
        this.pageSize
      );
    },
    refresh() {
      this.formInline.name = "";
      this.init();
    },
    onSearch() {
      this.getSegmentsForshow(
        this.preLocation,
        this.isDescending,
        this.$common.methods.trim(this.formInline.name)
      );
    },
    async getSegmentInfo(segmentName) {
      const url = `${this.$common.apis.dataSource}/${this.dataSourceMessage
        .dataSourceName}/segments/${segmentName}?full`;
      const response = await this.$http.get(url);
      this.segmentInfo = response.data;
      const message = this.$common.methods.JSONUtils.toString(this.segmentInfo);
      this.showCancle = false;
      this.configDialog(
        this.$t("message.segment.segmentInfo"),
        message,
        true,
        "small",
        { minRows: 15, maxRows: 40 }
      );
    },
    async getDimensions(segmentName) {
      const url = `${this.$common.apis.dataSource}/${this.dataSourceMessage
        .dataSourceName}/segments/${segmentName}?full`;
      const response = await this.$http.get(url);
      this.dimensions = this.stringToArray(response.data["dimensions"]);
    },
    async getMetrics(segmentName) {
      const url = `${this.$common.apis.dataSource}/${this.dataSourceMessage
        .dataSourceName}/segments/${segmentName}?full`;
      const response = await this.$http.get(url);
      this.metrics = this.stringToArray(response.data["metrics"]);
    },
    stringToArray(str) {
      let arr = new Array();
      if (str.length === 0) {
        arr[0] = this.$t("message.common.none");
      } else {
        arr = str.split(",");
      }
      return arr;
    },

    async enableSegment(segmentName) {
      const remindMessage = `${this.$t(
        "message.common.enableWarning"
      )}\n${segmentName}`;
      const url = `${this.$common.apis.dataSource}/${this.dataSourceMessage
        .dataSourceName}/segments/${segmentName}/enable`;
      const successMessage = this.$t("message.common.enableSuccess");
      const failMessage = this.$t("message.common.enableFail");
      this.confirmAndGetResult(
        url,
        remindMessage,
        successMessage,
        failMessage,
        "post"
      );
    },
    async disableSegment(segmentName) {
      const remindMessage = `${this.$t(
        "message.common.disableWarning"
      )}\n${segmentName}`;
      const url = `${this.$common.apis.dataSource}/${this.dataSourceMessage
        .dataSourceName}/segments/${segmentName}/disable`;
      const successMessage = this.$t("message.common.disableSuccess");
      const failMessage = this.$t("message.common.disableFail");
      this.confirmAndGetResult(
        url,
        remindMessage,
        successMessage,
        failMessage,
        "delete"
      );
    },
    async deleteSegment(segmentName) {
      const remindMessage = `${this.$t(
        "message.common.deleteWarning"
      )}\n${segmentName}`;
      const url = `${this.$common.apis.dataSource}/${this.dataSourceMessage
        .dataSourceName}/segments/${segmentName}/delete`;
      const successMessage = this.$t("message.common.deleteSuccess");
      const failMessage = this.$t("message.common.deleteFail");
      this.confirmAndGetResult(
        url,
        remindMessage,
        successMessage,
        failMessage,
        "delete"
      );
    },
    async confirmAndGetResult(
      url,
      remindMessage,
      successMessage,
      failMessage,
      methodType
    ) {
      const response = await this.$confirm(
        remindMessage,
        this.$t("message.common.warning"),
        {
          confirmButtonText: this.$t("message.common.confirm"),
          cancelButtonText: this.$t("message.common.cancle"),
          closeOnClickModal: false,
          type: "warning"
        }
      );
      try {
        let handleResponse;
        if (methodType === "delete") {
          handleResponse = await this.$http.delete(url);
        } else {
          handleResponse = await this.$http.post(url);
        }
        window.setTimeout(this.init, 500);
        this.$message({
          type: "success",
          message: successMessage
        });
      } catch (err) {
        this.$message({
          type: "warning",
          message: failMessage
        });
      }
    },

    configDialog(
      dialogTitle,
      dialogMessage,
      dialogVisible,
      dialogSize,
      dialogInputAutosize
    ) {
      this.dialogTitle = dialogTitle;
      this.dialogMessage = dialogMessage;
      this.dialogVisible = dialogVisible;
      this.dialogSize = dialogSize;
      this.dialogInputAutosize = dialogInputAutosize;
    },
    handleCurrentChange(newValue) {
      this.currentPage = newValue;
      this.showTableData = this.$common.methods.fillShowTableData(
        this.segments,
        this.currentPage,
        this.pageSize
      );
    },
    handleSizeChange(newValue) {
      this.pageSize = newValue;
      this.showTableData = this.$common.methods.fillShowTableData(
        this.segments,
        this.currentPage,
        this.pageSize
      );
    }
  }
};
</script>

<style>
@import "../../../../static/css/link.css";
@import "../../../../static/css/popover.css";
</style>