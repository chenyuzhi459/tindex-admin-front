<template>
  <div class="main">

    <div style=" margin-left:20px;">
      <span style="color: #242f42;font-size:20px;">
        <template>
          <el-tabs v-model="historicalIp" @tab-click="clickIp">
            <el-tab-pane v-for="ip in historicalIps" :key="ip" :label="ip" :name="ip"></el-tab-pane>
          </el-tabs>
        </template>
      </span>
    </div>

    <div style=" margin-left:20px;">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item :label="$t('message.lookup.userGroupLookup')">
          <el-input v-model="formInline.name" :placeholder="$t('message.lookup.inputLookupName')" size="small"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="onSearch" icon="search">{{$t('message.common.search')}}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="refresh">{{$t('message.common.refresh')}}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" size="small" @click="addLookup">{{$t('message.lookup.addLookup')}}</el-button>
        </el-form-item>

      </el-form>
    </div>

    <div class="table" style=" margin-left:20px;">

      <el-table :data="showTableData" border style="width: 100%" ref="multipleTable" @sort-change="handleSort" stripe>
        <el-table-column :label="$t('message.lookup.userGroupLookup')" sortable="custom">
          <template scope="scope">
            <a class="click-link" @click="getInfo(scope.row.lookup)">{{scope.row.lookup}}</a>
          </template>
        </el-table-column>
        <el-table-column prop="dataLoader.groupId" :label="$t('message.lookup.groupId')"></el-table-column>
        <el-table-column prop="version" :label="$t('message.lookup.version')"></el-table-column>
        <el-table-column :label="$t('message.common.more')">
          <template scope="scope">
            <el-button size="mini" @click="updataLookup(scope.row.lookup)">{{$t('message.common.update')}}</el-button>
            <el-button size="mini" type="danger" @click="deleteLookup(scope.row.lookup)">{{$t('message.common.delete')}}</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[5, 10, 15, 25, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="lookups.length">
        </el-pagination>
      </div>

      <el-dialog :visible.sync="dialogVisible" :size="dialogSize">
        <template slot="title">
          <div style="line-height: 1;font-size: 16px; font-weight: 700; color: #1f2d3d;">
            {{dialogTitle}}
          </div>
        </template>
      <el-form :inline="true" class="demo-form-inline"> 
        <el-form-item :label="$t('message.lookup.lookupName')">
          <el-input v-model="lookupNameInput" :placeholder="$t('message.lookup.lookupNameIndex')" size="small"></el-input>
        </el-form-item>
      </el-form>
        <el-input type="textarea" :autosize="dialogInputAutosize" v-model="dialogMessage">
        </el-input>
        <span slot="footer" class="dialog-footer">
          <el-button v-if="showCancle" @click="dialogVisible = false">{{$t('message.common.cancle')}}</el-button>
          <el-button type="primary" @click="clickConfirm()">{{$t('message.common.confirm')}}</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      historicalIps: [],
      historicalIp: "",
      lookups: [],
      pageSize: 15,
      currentPage: 1,
      formInline: {
        name: ""
      },
      showTableData: [],
      confirmType: "",
      lookupNameInput: "",
      dialogMessage: "",
      dialogTitle: "",
      dialogSize: "large",
      dialogInputAutosize: {},
      dialogVisible: false,
      showCancle: false
    };
  },
  created: function() {
    this.init();
  },
  methods: {
    async init() {
      await this.getHistoricalIps();
      this.getLookups(this.isDescending, this.formInline.name);
    },
    refresh() {
      this.formInline.name = "";
      this.getLookups(this.isDescending, this.formInline.name);
    },
    async getLookups(isDescending, searchValue) {
      const url = `${this.$common.apis.lookupsHis}/sortAndSearch`;
      const response = await this.$http.get(url, {
        params: {
          isDescending: isDescending,
          searchValue: this.$common.methods.trim(searchValue),
          ip: this.historicalIp
        }
      });
      this.lookups = [];
      for (let i = 0; i < response.data.length; i++) {
        for (var key in response.data[i]) {
          response.data[i]["lookup"] = key;
          response.data[i]["dataLoader"] = response.data[i][key]["dataLoader"];
          response.data[i]["version"] = response.data[i][key]["version"];
        }
      }
      this.$common.methods.pushData(response.data, this.lookups);
      this.showTableData = this.$common.methods.fillShowTableData(
        this.lookups,
        this.currentPage,
        this.pageSize
      );
    },
    async getLookupByName(lookupName) {
      const url = `${this.$common.apis.lookupsHis}/${lookupName}`;
      const response = await this.$http.get(url, {
        params: {
          ip: this.historicalIp
        }
      });
      return response.data;
    },
    async updataLookup(lookupName) {
      const info = await this.getLookupByName(lookupName);
      const title = this.$t("message.lookup.lookupInfo");
      const infoJSON = this.$common.methods.JSONUtils.toString(info);
      this.showCancle = true;
      this.configDialog(
        title,
        infoJSON,
        true,
        "small",
        { minRows: 15, maxRows: 25 },
        "updateLookup",
        lookupName
      );
    },
    async deleteLookup(lookupName) {
      const remindMessage = `${this.$t(
        "message.common.deleteWarning"
      )}\n${lookupName}`;
      try {
        const response = await this.$confirm(
          remindMessage,
          this.$t("message.common.warning"),
          {
            cancelButtonText: this.$t("message.common.cancle"),
            confirmButtonText: this.$t("message.common.confirm"),
            closeOnClickModal: false,
            type: "warning"
          }
        );
        try {
          const url = `${this.$common.apis.lookupsHis}/${lookupName}`;
          const addResponse = await this.$http.delete(url, {
            params: {
              ip: this.historicalIp
            }
          });
          window.setTimeout(
            this.getLookups(this.isDescending, this.formInline.name),
            500
          );
          this.$message({
            type: "success",
            message: this.$t("message.common.deleteSuccess")
          });
        } catch (err) {
          this.$message({
            type: "warning",
            message: this.$t("message.common.deleteFail")
          });
        }
      } catch (e) {}
    },
    onSearch() {
      this.getLookups(this.isDescending, this.formInline.name);
    },
    async getHistoricalIps() {
      const url = `${this.$common.apis.historicalIps}`;
      const response = await this.$http.get(url);
      this.historicalIps = response.data;
      this.historicalIp = this.historicalIps[0];
    },
    configDialog(
      dialogTitle,
      dialogMessage,
      dialogVisible,
      dialogSize,
      dialogInputAutosize,
      confirmType,
      lookupNameInput
    ) {
      this.dialogTitle = dialogTitle;
      this.dialogMessage = dialogMessage;
      this.dialogVisible = dialogVisible;
      this.dialogSize = dialogSize;
      this.dialogInputAutosize = dialogInputAutosize;
      this.confirmType = confirmType;
      this.lookupNameInput = lookupNameInput;
    },
    handleSort(column) {
      this.isDescending = column.order === "descending" ? true : false;
      this.getLookups(this.isDescending, "");
    },
    clickIp(tab, event) {
      this.historicalIp = tab.name;
      this.getLookups(this.isDescending, "");
    },
    addLookup() {
      this.confirmType = "addLookup";
      const title = this.$t("message.lookup.addLookup");
      this.showCancle = true;
      this.configDialog(
        title,
        "",
        true,
        "small",
        { minRows: 15, maxRows: 25 },
        "addLookup",
        ""
      );
    },
    async getInfo(lookupName) {
      const info = await this.getLookupByName(lookupName);
      const title = this.$t("message.lookup.lookupInfo");
      const infoJSON = this.$common.methods.JSONUtils.toString(info);
      this.showCancle = false;
      this.configDialog(
        title,
        infoJSON,
        true,
        "small",
        { minRows: 15, maxRows: 25 },
        "confirm",
        lookupName
      );
    },
    handleCurrentChange(newValue) {
      this.currentPage = newValue;
      this.showTableData = this.$common.methods.fillShowTableData(
        this.lookups,
        this.currentPage,
        this.pageSize
      );
    },
    handleSizeChange(newValue) {
      this.pageSize = newValue;
      this.showTableData = this.$common.methods.fillShowTableData(
        this.lookups,
        this.currentPage,
        this.pageSize
      );
    },
    clickConfirm() {
      if (this.confirmType === "addLookup") {
        this.postLookup(
          this.$t("message.lookup.addLookupWarning"),
          this.$t("message.common.addSuccess"),
          this.$t("message.common.addFail")
        );
      } else if (this.confirmType === "updateLookup") {
        this.postLookup(
          this.$t("message.lookup.updateLookupWarning"),
          this.$t("message.common.updateSuccess"),
          this.$t("message.common.updateFail")
        );
      }
      this.dialogVisible = false;
    },
    async postLookup(warningMessage, successMessage, failMessage) {
      const remindMessage = `${warningMessage}\n${this.lookupNameInput}`;
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
        const url = `${this.$common.apis.lookupsHis}/${this.lookupNameInput}`;
        const addResponse = await this.$http.post(url, this.dialogMessage, {
          params: {
            ip: this.historicalIp
          }
        });
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
    }
  }
};
</script>

<style>
@import "../../../../static/css/link.css";
</style>