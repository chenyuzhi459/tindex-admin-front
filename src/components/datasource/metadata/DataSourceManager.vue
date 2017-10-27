<style>
@import "../../../../static/css/link.css";
@import "../../../../static/css/popover.css";

.el-progress-circle svg path:first-child {
  stroke: #c6c6c6;
}
.ruleTypeDiv {
  color: #20a0ff;
  font-size: 18px;
  line-height: 22px;
  font-weight: 700;
}
</style>

<template>
  <div class="main">
    <div style=" margin-left:20px;">
      <span style="color: #242f42;font-size:20px;">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/dataSource', query: { showEnable: this.showEnable} }">{{$t('message.dataSource.dataSourceTitle')}}</el-breadcrumb-item>
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
        <el-table-column :label="$t('message.common.name')" sortable="custom" :width="330">
          <template scope="scope">
            <el-progress v-if="showEnable" type="circle" :percentage="scope.row.loadstatus" :width="10" :show-text="false" :stroke-width="2" :status="scope.row.statusType"></el-progress>
            <a class="click-link" @click="getIntervals(scope.row.name)">{{scope.row.name}}</a>
          </template>
        </el-table-column>
        <!-- <el-table-column :label="$t('message.dataSource.segments')" align="center"> -->
        <el-table-column v-if="showEnable" prop="properties.segments.count" :label="$t('message.interval.segmentCount')" width="140"></el-table-column>
        <el-table-column v-if="showEnable" prop="properties.segments.size" :label="$t('message.common.size')" width="105"></el-table-column>
        <el-table-column v-if="showEnable" prop="properties.segments.maxTime" :label="$t('message.dataSource.maxTime')" width="210"></el-table-column>
        <el-table-column v-if="showEnable" prop="properties.segments.minTime" :label="$t('message.dataSource.minTime')" width="210"></el-table-column>
        <!-- </el-table-column> -->
        <el-table-column :label="$t('message.dataSource.rules')" width="100">
          <template scope="scope">
            <el-button size="mini" @click="editRule(scope.row.name)" icon="edit" type="info">
              <!-- {{$t('message.dataSource.add')}} -->
            </el-button>
            <el-button size="mini" @click="getRuleHistory(scope.row.name)" icon="time" type="info">
              <!-- {{$t('message.dataSource.history')}} -->
            </el-button>
          </template>
        </el-table-column>

        <el-table-column :label="$t('message.common.more')">
          <template scope="scope">
            <el-button size="mini" type="info" @click="getSegments(scope.row.name)">{{$t('message.dataSource.segments')}}</el-button>

            <template v-if="showEnable">
              <el-popover ref="popoverServer" placement="right" width="150" trigger="click">
                <div class="popoverDiv" v-for="server in servers" :key="server">{{server}}</div>
              </el-popover>&nbsp
              <el-button v-popover:popoverServer size="mini" @click="getServers(scope.row.name)">{{$t('message.dataSource.servers')}}</el-button>
              <el-popover ref="popoverDimension" placement="right" width="150" trigger="click">
                <div class="popoverDiv" v-for="dimension in dimensions" :key="dimension">{{dimension}}</div>
              </el-popover>&nbsp
              <el-button v-popover:popoverDimension size="mini" @click="getDimensions(scope.row.name)">{{$t('message.dataSource.dimensions')}}</el-button>
              <el-popover ref="popoverMetric" placement="right" width="150" trigger="click">
                <div class="popoverDiv" v-for="metric in metrics" :key="metric">{{metric}}</div>
              </el-popover>&nbsp
              <el-button v-popover:popoverMetric size="mini" @click="getMetrics(scope.row.name)">{{$t('message.dataSource.metrics')}}</el-button>
            </template>

            <el-button v-if="showEnable" size="mini" @click="disableDataSource(scope.row.name)" type="warning">{{$t('message.common.disable')}}</el-button>
            <el-button v-if="!showEnable" size="mini" @click="enableDataSource(scope.row.name)" type="success">{{$t('message.common.enable')}}</el-button>
            <el-button v-if="!showEnable" size="mini" @click="deleteDataSource(scope.row.name)" type="danger">{{$t('message.common.delete')}}</el-button>
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
      <el-form v-if="!dialogForInfo" v-for="ruleItem in addRuleForm" :key="ruleItem.id" :inline="true" :model="ruleItem" class="demo-form-inline">
        <div class="ruleTypeDiv">
          {{ruleItem.type}}
          <el-button type="primary" icon="delete" @click="removeRule(ruleItem.id)" style="float: right"></el-button><br></br>
        </div>
        <el-form-item :label="$t('message.dataSource.operate')">
          <el-select v-model="ruleItem.actionValue" :placeholder="$t('message.dataSource.operateInfo')" size="20" @change="changeActionSelect(ruleItem.id)">
            <el-option v-for="item in ruleItem.actionOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('message.dataSource.granularity')">
          <el-select v-model="ruleItem.granularityValue" :placeholder="$t('message.dataSource.granularityInfo')" @change="changeGranularitySelect(ruleItem.id)" size="20">
            <el-option v-for="item in ruleItem.granularityOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <div>
          <el-form-item v-if="ruleItem.showInput" :label="ruleItem.granularityValue">
            <el-input v-model="ruleItem.inputMessage" :placeholder="ruleItem.inputPrompt" size="45"></el-input>
          </el-form-item>
          <el-form-item v-if="ruleItem.actionValue === 'load'" label="_default_tier">
            <el-input-number v-model="ruleItem.number" :min="1" :max="100"></el-input-number>
            <!-- <el-input v-if="showInput" v-model="form.inputMessage" :placeholder="form.inputPrompt" size="40"></el-input> -->
          </el-form-item>
        </div>
        <el-form-item>
          <div style="color: red">{{ruleItem.errorMessage}}</div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="isAddRule()" type="warning" icon="plus" @click="addARule">
          <!-- {{$t('message.dataSource.addRule')}} -->
        </el-button>
        <el-button v-if="showCancle" @click="dialogVisible = false">{{$t('message.common.cancle')}}</el-button>
        <el-button type="primary" @click="clickConfirm()">{{$t('message.common.confirm')}}</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import moment from "moment-interval";
export default {
  data() {
    return {
      dataSources: [],
      showTableData: [],
      dialogMessage: "",
      dialogTitle: "",
      dialogSize: "large",
      dialogInputAutosize: {},
      dialogVisible: false,
      formInline: {
        name: ""
      },
      pageSize: 15,
      currentPage: 1,
      isDescending: false,
      isSearching: false,
      confirmType: "",
      ruleDataSource: "",
      dataSourceName: "",
      preLocation: "",
      showCancle: false,
      showEnable: true,
      dialogForInfo: true,
      addRuleForm: [],
      ruleItemNextId: 1,
      servers: [],
      dimensions: [],
      metrics: []
    };
  },
  created: function() {
    // console.log(moment.interval('1000000/100').toString(), '====');
    if (this.$route.query.showEnable !== undefined) {
      this.showEnable = this.$route.query.showEnable;
    }
    this.init();
  },
  methods: {
    init() {
      if (this.showEnable) {
        this.getDataSources(this.isDescending, "name", this.formInline.name);
      } else {
        this.getDataSourcesDisable(
          this.isDescending,
          "name",
          this.formInline.name
        );
      }
    },
    removeRule(id) {
      for (let i = 0; i < this.addRuleForm.length; i++) {
        if (this.addRuleForm[i]["id"] === id) {
          this.addRuleForm.splice(i, 1);
          break;
        }
      }
    },
    clickSelect(tab) {
      if (tab.name === "dataSourceSelect") {
        this.getDataSources();
      }
    },
    addARule() {
      const newRuleItem = {
        id: this.ruleItemNextId++,
        inputPrompt: "",

        actionOptions: [
          {
            value: "drop",
            label: "Drop"
          },
          {
            value: "load",
            label: "Load"
          }
          // , {
          //   value: 'broadcast',
          //   label: 'Broadcast'
          // }
        ],
        actionValue: "",
        granularityOptions: [
          {
            value: "period",
            label: "Period"
          },
          {
            value: "interval",
            label: "Interval"
          },
          {
            value: "forever",
            label: "Forever"
          }
        ],
        granularityValue: "",
        inputMessage: "",
        number: 1,
        showInput: false,
        errorMessage: "",
        type: "rule"
      };
      this.addRuleForm.push(newRuleItem);
    },
    refresh() {
      this.formInline.name = "";
      this.init();
    },
    switchChange() {
      this.init();
    },
    changeGranularitySelect(id) {
      for (let i = 0; i < this.addRuleForm.length; i++) {
        const item = this.addRuleForm[i];


        if (item["id"] === id) {
          item.inputMessage = "";
          if (item.granularityValue === "period") {
            item.inputMessage = "P1M"
            item.showInput = true;
            item.inputPrompt = this.$t("message.dataSource.periodInputInfo");
          } else if (item.granularityValue === "interval") {
            item.inputMessage = moment().subtract(1,'months').format() + "/" + moment().format()
            item.showInput = true;
            item.inputPrompt = this.$t("message.dataSource.intervalInputInfo");
          } else {
            item.showInput = false;
          }
          
          item.type = this.getRuleTypeBySelect(
            item.actionValue,
            item.granularityValue
          );
          break;
        }
      }
    },
    changeActionSelect(id) {
      for (let i = 0; i < this.addRuleForm.length; i++) {
        const item = this.addRuleForm[i];
        if (item["id"] === id) {
          item.type = this.getRuleTypeBySelect(
            item.actionValue,
            item.granularityValue
          );
        }
      }
    },
    async getDataSources(isDescending, sortName, searchValue) {
      const loadstatus = await this.getDataSourcesState();
      const url = `${this.$common.apis.dataSource}/sortAndSearch`;
      const response = await this.$http.get(url, {
        params: {
          simple: true,
          isDescending: isDescending,
          searchValue: this.$common.methods.trim(searchValue)
        }
      });
      for (let i = 0; i < response.data.length; i++) {
        const size = response.data[i]["properties"]["segments"]["size"];
        const name = response.data[i]["name"];
        response.data[i]["properties"]["segments"][
          "size"
        ] = this.$common.methods.conver(size);
        if (loadstatus[name] == 100) {
          response.data[i].statusType = "success";
        } else {
          response.data[i].statusType = "exception";
        }
        response.data[i]["loadstatus"] = loadstatus[name];
      }
      this.dataSources = [];
      this.$common.methods.pushData(response.data, this.dataSources);
      this.showTableData = this.$common.methods.fillShowTableData(
        this.dataSources,
        this.currentPage,
        this.pageSize
      );
    },
    async getDataSourcesState() {
      const url = this.$common.apis.loadstatus;
      const response = await this.$http.get(url);
      return response.data;
    },

    async getDataSourcesDisable(isDescending, sortName, searchValue) {
      const url = `${this.$common.apis.disableDataSource}`;
      const response = await this.$http.get(url, {
        params: {
          isDescending: isDescending,
          searchValue: this.$common.methods.trim(searchValue)
        }
      });
      this.dataSources = [];
      this.$common.methods.pushData(response.data, this.dataSources);
      this.showTableData = this.$common.methods.fillShowTableData(
        this.dataSources,
        this.currentPage,
        this.pageSize
      );
    },
    async disableDataSource(dataSourceName) {
      const remindMessage = `${this.$t(
        "message.common.disableWarning"
      )}\n${dataSourceName}`;
      const url = `${this.$common.apis.dataSource}/${dataSourceName}/disable`;
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
    async enableDataSource(dataSourceName) {
      const remindMessage = `${this.$t(
        "message.common.enableWarning"
      )}\n${dataSourceName}`;
      const url = `${this.$common.apis.dataSource}/${dataSourceName}/enable`;
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
    async deleteDataSource(dataSourceName) {
      const remindMessage = `${this.$t(
        "message.common.deleteWarning"
      )}\n${dataSourceName}`;
      const url = `${this.$common.apis.dataSource}/${dataSourceName}/delete`;
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
    async onSearch() {
      if (this.showEnable) {
        this.getDataSources(this.isDescending, "name", this.formInline.name);
      } else {
        this.getDataSourcesDisable(
          this.isDescending,
          "name",
          this.formInline.name
        );
      }
    },
    async getDimensions(dataSourceName) {
      const url = `${this.$common.apis
        .clientInfo}/${dataSourceName}/dimensions`;
      this.dimensions = await this.putArrayDataFromUrl(url);
    },
    async getMetrics(dataSourceName) {
      const url = `${this.$common.apis.clientInfo}/${dataSourceName}/metrics`;
      this.metrics = await this.putArrayDataFromUrl(url);
    },
    async getServers(dataSourceName) {
      const url = `${this.$common.apis
        .serversInfo}/datasources/${dataSourceName}`;
      this.servers = await this.putArrayDataFromUrl(url);
    },
    async putArrayDataFromUrl(url) {
      const response = await this.$http.get(url);
      if (response.data.length === 0) {
        response.data[0] = this.$t("message.common.none");
      }
      return response.data;
    },
    getRuleHistory(dataSourceName) {
      const url = `${this.$common.apis.rules}/${dataSourceName}/history`;
      this.getInfoFromUrl(url, this.$t("message.dataSource.rulesHistory"));
    },
    async getInfoFromUrl(url, title) {
      const response = await this.$http.get(url);
      const message = this.$common.methods.JSONUtils.toString(response.data);
      this.showCancle = false;
      this.confirmType = "confirmInfo";
      this.dialogForInfo = true;
      this.configDialog(title, message, true, "small", {
        minRows: 15,
        maxRows: 25
      });
    },
    async getRuleInfo(dataSourceName) {
      const url = `${this.$common.apis.rules}/${dataSourceName}`;
      const response = await this.$http.get(url);
      for (let i = 0; i < response.data.length; i++) {
        const newRuleItem = this.getRuleItemFromInfo(response.data[i]);
        this.addRuleForm.push(newRuleItem);
      }
    },
    getRuleItemFromInfo(data) {
      let actionValue,
        showInput,
        granularityValue,
        number = 1,
        inputMessage;
      const type = data["type"];
      if (type.indexOf("drop") > -1) {
        actionValue = "drop";
      } else if (type.indexOf("load") > -1) {
        actionValue = "load";
        number = data["tieredReplicants"]["_default_tier"];
      } else {
        actionValue = "broadcast";
      }
      if (type.indexOf("Period") > -1) {
        granularityValue = "period";
        showInput = true;
        inputMessage = data["period"];
      } else if (type.indexOf("Interval") > -1) {
        granularityValue = "interval";
        showInput = true;
        inputMessage = data["interval"];
      } else {
        granularityValue = "forever";
        showInput = false;
      }
      const newRuleItem = {
        id: this.ruleItemNextId++,
        type: type,
        actionValue: actionValue,
        granularityValue: granularityValue,
        inputMessage: inputMessage,
        number: number,
        showInput: showInput,
        inputPrompt: "",
        errorMessage: "",
        actionOptions: [
          {
            value: "drop",
            label: "Drop"
          },
          {
            value: "load",
            label: "Load"
          }
          // , {
          //   value: 'broadcast',
          //   label: 'Broadcast'
          // }
        ],
        granularityOptions: [
          {
            value: "period",
            label: "Period"
          },
          {
            value: "interval",
            label: "Interval"
          },
          {
            value: "forever",
            label: "Forever"
          }
        ]
      };
      return newRuleItem;
    },
    editRule(dataSourceName) {
      this.addRuleForm = [];
      this.ruleItemNextId = 1;

      this.getRuleInfo(dataSourceName);

      this.ruleDataSource = dataSourceName;
      this.showCancle = true;
      this.dialogForInfo = false;
      this.confirmType = "addRule";
      this.configDialog(
        this.$t("message.dataSource.rulesInfo"),
        "",
        true,
        "small",
        { minRows: 15, maxRows: 25 }
      );
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
    getSegments(dataSourceName) {
      this.$router.push({
        path: "/segment",
        query: {
          preLocation: "dataSource",
          dataSourceName: dataSourceName,
          showEnable: this.showEnable
        }
      });
    },
    getIntervals(dataSourceName) {
      this.$router.push({
        path: "/interval",
        query: {
          showEnable: this.showEnable,
          preLocation: "dataSource",
          dataSourceName: dataSourceName
        }
      });
    },
    handleCurrentChange(newValue) {
      this.currentPage = newValue;
      this.showTableData = this.$common.methods.fillShowTableData(
        this.dataSources,
        this.currentPage,
        this.pageSize
      );
    },
    handleSizeChange(newValue) {
      this.pageSize = newValue;
      this.showTableData = this.$common.methods.fillShowTableData(
        this.dataSources,
        this.currentPage,
        this.pageSize
      );
    },
    handleSort(column) {
      this.isDescending = column.order === "descending" ? true : false;
      if (this.showEnable) {
        this.getDataSources(
          this.isDescending,
          column.prop,
          this.formInline.name
        );
      } else {
        this.getDataSourcesDisable(
          this.isDescending,
          column.prop,
          this.formInline.name
        );
      }
    },

    clickConfirm() {
      if (this.confirmType === "addRule") {
        if (this.checkRuleInfo()) {
          this.addRule();
          this.dialogVisible = false;
        }
      } else {
        this.dialogVisible = false;
      }
    },
    checkRuleInfo() {
      for (let i = 0; i < this.addRuleForm.length; i++) {
        const item = this.addRuleForm[i];
        if (item.actionValue === "") {
          item.errorMessage = this.$t("message.error.chooseAction");
          return false;
        }
        if (item.granularityValue === "") {
          item.errorMessage = this.$t("message.error.chooseGranularity");
          return false;
        }
        if (item.showInput && item.inputMessage.length === 0) {
          item.errorMessage =
            item.granularityValue + this.$t("message.error.canNotBeNull");
          return false;
        }
      }
      return true;
    },
    async addRule() {
      const remindMessage = this.$t("message.dataSource.addRuleWarning");
      const postData = this.getInputRule();
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
        const url = `${this.$common.apis.rules}/${this.ruleDataSource}`;
        const editResponse = await this.$http.post(url, postData, {
          header: { ContentType: "application/json" }
        });
        window.setTimeout(this.init, 500);
        this.$message({
          type: "success",
          message: this.$t("message.dataSource.addRulesSuccess")
        });
      } catch (err) {
        this.$message({
          type: "warning",
          message: this.$t("message.dataSource.addRulesFail")
        });
      }
    },
    getInputRule() {
      const rules = new Array();
      for (let i = 0; i < this.addRuleForm.length; i++) {
        const item = this.addRuleForm[i];
        const rule = {};
        if (item.actionValue === "load") {
          const defaultTier = {};
          defaultTier["_default_tier"] = item.number;
          rule["tieredReplicants"] = defaultTier;
        }
        if (item.granularityValue === "interval") {
          rule["type"] = item.actionValue + "ByInterval";
          rule["interval"] = item.inputMessage;
        } else if (item.granularityValue === "period") {
          rule["type"] = item.actionValue + "ByPeriod";
          rule["period"] = item.inputMessage;
        } else {
          rule["type"] = item.actionValue + "Forever";
        }
        rules.push(rule);
      }
      return rules;
    },
    getRuleTypeBySelect(actionValue, granularityValue) {
      let type;
      if (
        actionValue !== "" &&
        granularityValue !== "" &&
        granularityValue !== undefined
      ) {
        if (granularityValue === "interval") {
          type = actionValue + "ByInterval";
        } else if (granularityValue === "period") {
          type = actionValue + "ByPeriod";
        } else {
          type = actionValue + "Forever";
        }
      } else {
        type = "rule";
      }
      return type;
    },
    async getDataSourceByName(dataSourceName) {
      const url = `${this.$common.apis.dataSource}/${dataSourceName}?full`;
      const response = await this.$http.get(url);
      this.dataSources = [];
      let message = new Array();
      message[0] = response.data;
      this.$common.methods.pushData(message, this.dataSources);
      this.showTableData = this.$common.methods.fillShowTableData(
        this.dataSources,
        this.currentPage,
        this.pageSize
      );
    },
    isAddRule() {
      if (this.confirmType === "addRule") {
        return true;
      }
      return false;
    }
  }
};
</script>