<template>
  <div class="main">
    <div style=" margin-left:20px;">
      <span style="color: #242f42;font-size:20px;">
        <b>{{$t('message.lookup.lookupCoordinator.lookupTitle')}}</b>
      </span>
      <br></br>
    </div>

    <div style=" margin-left:20px;">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <tr>
          <el-form-item :label="$t('message.lookup.lookups')">
            <el-select v-model="form.region" placeholder="请选择" @change="clickSelect">
              <el-option v-for="item in tiers" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
        </tr>
        <el-form-item :label="$t('message.common.name')">
          <el-input v-model="formInline.name" :placeholder="$t('message.lookup.inputLookupName')" size="small"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="onSearch" icon="search">{{$t('message.common.search')}}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="addLookup">{{$t('message.lookup.addLookup')}}</el-button>
        </el-form-item>

      </el-form>
    </div>

    <div class="table" style=" margin-left:20px;">

      <el-table :data="showTableDataLookup" border style="width: 100%" ref="multipleTable" @sort-change="handleSort">
        <el-table-column prop="name" :label="$t('message.lookup.userGroupLookup')" sortable="custom"></el-table-column>
        <el-table-column prop="spec.type" :label="$t('message.lookup.type')"></el-table-column>
        <el-table-column prop="spec.dataFetcher.groupId" :label="$t('message.lookup.groupId')"></el-table-column>
        <el-table-column prop="spec.version" :label="$t('message.lookup.version')"></el-table-column>
        <el-table-column :label="$t('message.common.more')">
          <template scope="scope">
            <el-button size="mini" @click="getInfo(scope.row.lookup)">{{$t('message.common.info')}}</el-button>
            <el-button size="mini" @click="updataLookup(scope.row.lookup)">{{$t('message.common.update')}}</el-button>
            <el-button size="mini" type="danger" @click="deleteLookup(scope.row.lookup)">{{$t('message.common.delete')}}</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination @size-change="handleSizeChangeLookup" @current-change="handleCurrentChangeLookup" :current-page="currentPageLookup" :page-sizes="[5, 10, 15, 25, 50, 100]" :page-size="pageSizeLookup" layout="total, sizes, prev, pager, next, jumper" :total="lookups.length">
        </el-pagination>
      </div>
    </div>

    <el-dialog :visible.sync="dialogVisible" :size="dialogSize">
      <template slot="title">
        <div style=" line-height: 1;
                                                                                            font-size: 16px;
                                                                                            font-weight: 700;
                                                                                            color: #1f2d3d;">
          {{dialogTitle}}
        </div>
      </template>

      <el-input :placeholder="$t('message.lookup.lookupNameIndex')" v-model="lookupNameInput">
        <template slot="prepend">{{$t('message.lookup.lookupName')}}</template>
      </el-input>
      <br/><br/>
      <el-input type="textarea" :autosize="dialogInputAutosize" v-model="dialogMessage">
      </el-input>
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
      form: {
        region: '__default'
      },
      pageSizeTier: 5,
      pageSizeLookup: 10,
      currentPageTier: 1,
      currentPageLookup: 1,
      isDescending: false,
      isSearching: false,
      tiers: [],
      lookups: [],
      tierName: '__default',
      isDescending: false,
      confirmType: '',
      lookupNameInput: '',
      showCancle: false
    }
  },
  created: function() {
    this.init()
  },
  methods: {
    init() {
      this.getTiers()
      this.getLookups("__default", this.isDescending, this.formInline.name)
    },
    async getTiers() {
      const url = `${this.$common.apis.lookups}`
      const response = await this.$http.get(url)
      this.tiers = response.data
    },
    async getLookups(tierName, isDescending, searchValue) {
      const url = `${this.$common.apis.lookups}/${tierName}/details`
      this.tierName = tierName
      const response = await this.$http.get(url, {
        params: {
          isDescending: isDescending,
          searchValue: searchValue
        }
      })
      this.lookups = []
      this.$common.methods.pushData(response.data, this.lookups)
      this.showTableDataLookup = this.$common.methods.fillShowTableData(this.lookups, this.currentPageLookup, this.pageSizeLookup)
    },
    async getLookupByName(lookupName) {
      const url = `${this.$common.apis.lookups}/${this.tierName}/${lookupName}`
      const response = await this.$http.get(url)
      return response.data
    },
    async getInfo(lookupName) {
      const info = await this.getLookupByName(lookupName)
      const title = this.$t('message.lookup.lookupInfo')
      const infoJSON = this.$common.methods.JSONUtils.toString(info)
      this.showCancle = false
      this.configDialog(title, infoJSON, true, "small", { minRows: 15, maxRows: 25 }, "confirm", lookupName)
    },
    async updataLookup(lookupName) {
      const info = await this.getLookupByName(lookupName)
      const title = this.$t('message.lookup.lookupInfo')
      const infoJSON = this.$common.methods.JSONUtils.toString(info)
      this.showCancle =true
      this.configDialog(title, infoJSON, true, "small", { minRows: 15, maxRows: 25 }, "updateLookup", lookupName)
    },
    configDialog(dialogTitle, dialogMessage, dialogVisible, dialogSize, dialogInputAutosize, confirmType, lookupNameInput) {
      this.dialogTitle = dialogTitle
      this.dialogMessage = dialogMessage
      this.dialogVisible = dialogVisible
      this.dialogSize = dialogSize
      this.dialogInputAutosize = dialogInputAutosize
      this.confirmType = confirmType
      this.lookupNameInput = lookupNameInput
    },
    handleSort(column) {
      this.isDescending = column.order === "descending" ? true : false
      this.getLookups(this.tierName, this.isDescending, '')
    },
    getItems(tier) {
      this.tierName = tier
      this.getLookups(tier, this.isDescending, '')
    },
    onSearch() {
      this.getLookups(this.tierName, this.isDescending, this.formInline.name)
    },
    addLookup() {
      this.confirmType = "addLookup"
      const title = this.$t('message.lookup.addLookup')
      this.showCancle = true
      this.configDialog(title, '', true, "small", { minRows: 15, maxRows: 25 }, "addLookup", '')
    },
    async postLookup(warningMessage, successMessage, failMessage) {
      const remindMessage = `${warningMessage}\n${this.lookupNameInput}`
      try {
        const response = await this.$confirm(remindMessage, this.$t('message.common.warning'), {
          confirmButtonText: this.$t('message.common.confirm'),
          cancelButtonText: this.$t('message.common.cancle'),
          closeOnClickModal: false,
          type: 'warning'
        })
        try {
          const url = `${this.$common.apis.lookups}/${this.tierName}/${this.lookupNameInput}`
          const addResponse = await this.$http.post(url, this.dialogMessage)
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
      } catch (e) {

      }
    },
    clickConfirm() {
      if (this.confirmType === "addLookup") {
        this.postLookup(this.$t('message.lookup.addLookupWarning'), this.$t('message.common.addSuccess'), this.$t('message.common.addFail'))
      } else if (this.confirmType === "updateLookup") {
        this.postLookup(this.$t('message.lookup.updateLookupWarning'), this.$t('message.common.updateSuccess'), this.$t('message.common.updateFail'))
      }
      this.dialogVisible = false
    },
    async deleteLookup(lookupName) {
      const remindMessage = `${this.$t('message.common.deleteWarning')}\n${lookupName}`
      try {
        const response = await this.$confirm(remindMessage, this.$t('message.common.warning'), {
          cancelButtonText: this.$t('message.common.cancle'),
          confirmButtonText: this.$t('message.common.confirm'),
          closeOnClickModal: false,
          type: 'warning'
        })
        try {
          const url = `${this.$common.apis.lookups}/${this.tierName}/${lookupName}`
          const addResponse = await this.$http.delete(url)
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

    clickSelect() {
      this.tierName = this.form.region
      this.getLookups(this.tierName, this.isDescending, '')


    },

    handleCurrentChangeTier(newValue) {
      this.currentPageTier = newValue
      this.showTableDataTier = this.$common.methods.fillShowTableData(this.tiers, this.currentPageTier, this.pageSizeTier)
    },
    handleSizeChangeTier(newValue) {
      this.pageSizeTier = newValue
      this.showTableDataTier = this.$common.methods.fillShowTableData(this.tiers, this.currentPageTier, this.pageSizeTier)
    },
    handleCurrentChangeLookup(newValue) {
      this.currentPageLookup = newValue
      this.showTableDataLookup = this.$common.methods.fillShowTableData(this.lookups, this.currentPageLookup, this.pageSizeLookup)
    },
    handleSizeChangeLookup(newValue) {
      this.pageSizeLookup = newValue
      this.showTableDataLookup = this.$common.methods.fillShowTableData(this.lookups, this.currentPageLookup, this.pageSizeLookup)
    }
  }
}
</script>
