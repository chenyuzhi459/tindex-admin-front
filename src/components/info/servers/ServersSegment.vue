<template>
    <div class="main">
        <div style="text-align:right; margin-right:20px;">
            <el-button size="small" icon="arrow-left" type="primary" @click="getBack">
                {{$t('message.common.return')}}
            </el-button>
        </div>

        <div style=" margin-left:20px;">
            <span style="color: #242f42;font-size:20px;">
                <b>{{$t('message.serversInfo.servers')}}:&nbsp;{{serverName}}</b>
            </span>
            <br></br>

        </div>

        <el-form :inline="true" :model="formInline" class="demo-form-inline" style=" margin-left:20px;">
            <el-form-item :label="$t('message.segment.name')">
                <el-input size="small" v-model="formInline.searchValue1" :placeholder="$t('message.serversInfo.searchTips')"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button size="small" type="primary" @click="onSearch">{{$t('message.common.search')}}</el-button>
                <el-button type="primary" size="small" @click="init">{{$t('message.segment.refresh')}}</el-button>
            </el-form-item>
            <br></br>
        </el-form>

        <div class="table" style=" margin-left:20px;">
            <el-table :data="showTableData" border style="width: 100%" @sort-change="sortChange">
                <el-table-column sortable="custom" prop="segment" :label="$t('message.segment.name')"></el-table-column>
                <el-table-column :label="$t('message.segment.more')" width="100">
                    <template scope="scope">
                        <el-button size="mini" @click="getSegmentInfo(scope.row.segment)">{{$t('message.common.detail')}}</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div class="pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[5, 10, 15, 25, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="segments.length">
                </el-pagination>
            </div>
            <el-dialog :visible.sync="dialogVisible" :size="dialogSize" @close="dialogMessage = ''">
                <template slot="title">
                    <div style=" line-height: 1;font-size: 16px;font-weight: 700;color: #1f2d3d;">
                        {{dialogTitle}}
                    </div>
                </template>
                <el-input type="textarea" :autosize="dialogInputAutosize" v-model="dialogMessage">
                </el-input>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">{{$t('message.segment.cancle')}}</el-button>
                    <el-button type="primary" @click="dialogVisible = false">{{$t('message.segment.confirm')}}</el-button>
                </span>
            </el-dialog>
        </div>

    </div>
</template>

<script>
import _ from 'lodash'
export default {
    data() {
        return {
            serverName: this.$route.params.serverName,
            segments: [],
            showTableData: [],
            dialogMessage: '',
            dialogTitle: '',
            dialogSize: 'full',
            dialogInputAutosize: {},
            dialogVisible: false,
            pageSize: 15,
            currentPage: 1,
            isSearching: false,
            formInline: {
                searchValue1: ''
            }
        }
    },
    created: function() {
        this.init()
    },
    methods: {
        init() {
            this.currentPage = 1
            this.isSearching = false
            this.getSegments()
        },
        async getSegments() {
            const url = `${this.$common.apis.serversInfo}/${this.serverName}/segments/sortAndSearch`
            const { data } = await this.$http.get(url)
            this.segments = data.map(s => {
                return { segment: s }
            })
            this.showTableData = this.$common.methods.fillShowTableData(this.segments, this.currentPage, this.pageSize)

        },
        async getSegmentInfo(segmentName) {
            const url = `${this.$common.apis.serversInfo}/${this.serverName}/segments/${segmentName}`
            const response = await this.$http.get(url)
            this.segmentInfo = response.data
            var message = this.$common.methods.JSONUtils.toString(this.segmentInfo)
            this.configDialog(this.$t('message.segment.segmentInfo'), message, true, "small", { minRows: 15, maxRows: 40 })

        },
        clickSelect(tab) {
            if (tab.name === "dataSourceSelect") {
                this.getDataSources()
            }
        },

        configDialog(dialogTitle, dialogMessage, dialogVisible, dialogSize, dialogInputAutosize) {
            this.dialogTitle = dialogTitle
            this.dialogMessage = dialogMessage
            this.dialogVisible = dialogVisible
            this.dialogSize = dialogSize
            this.dialogInputAutosize = dialogInputAutosize
        },

        async getShowSegments() {
            let paramsData = {
                isDescending: this.isDescending
            }
            if (this.isSearching) {
                if (!_.isEqual(this.formInline.searchValue1, '')) {
                    paramsData.searchValue = this.formInline.searchValue1
                }
            }

            const url = `${this.$common.apis.serversInfo}/${this.serverName}/segments/sortAndSearch`
            const { data } = await this.$http.get(url, {
                params: paramsData
            })
            this.segments = data.map(s => {
                return { segment: s }
            })
            this.showTableData = this.$common.methods.fillShowTableData(this.segments, this.currentPage, this.pageSize)


        },
        handleCurrentChange(newValue) {
            this.currentPage = newValue
            this.showTableData = this.$common.methods.fillShowTableData(this.segments, this.currentPage, this.pageSize)
        },
        handleSizeChange(newValue) {
            this.pageSize = newValue
            this.showTableData = this.$common.methods.fillShowTableData(this.segments, this.currentPage, this.pageSize)
        },
        sortChange(column) {
            if (null === column.order) {
                return
            }
            this.sortDimension = column.prop
            let direction = ''
            if (column.order === 'ascending') {
                this.isDescending = false
                direction = 'asc'
            } else {
                this.isDescending = true
                direction = 'desc'
            }
            this.getShowSegments()
        },
        onSearch() {
            if (_.isEqual(this.formInline.searchValue1, '')) {
                return
            }
            this.isSearching = true
            this.currentPage = 1
            this.getShowSegments(this.currentPage, this.pageSize, this.sortDimension, this.isDescending)
        },
        getBack() {
            this.$router.push({
                name: 'serversInfo'
            })
        }
    }
}
</script>
