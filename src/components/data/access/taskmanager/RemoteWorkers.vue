<template>
    <div class="main">

        <div style=" margin-left:20px;">
            <span style="color: #242f42;font-size:20px;">
                <b>{{$t('message.tasks.workersTitile')}}</b>
            </span>
            <br></br>
        </div>

        <el-form :inline="true" :model="formInline" class="demo-form-inline" style=" margin-left:20px;">
            <el-form-item>
                <el-button type="primary" size="small" @click="init">{{$t('message.tasks.refresh')}}</el-button>
            </el-form-item>
        </el-form>
        <template v-if="hasData">
            <div class="table" style=" margin-left:20px;">
                <el-table :data="showTableData" border stripe style="width: 100%" >
                    <el-table-column prop="worker.host" :label="$t('message.tasks.wokerHost')"  min-width="150"></el-table-column>
                    <el-table-column  prop="worker.ip" :label="$t('message.tasks.wokerIp')" width="207"></el-table-column>
                    <el-table-column prop="worker.capacity" :label="$t('message.tasks.workerCapacity')"></el-table-column>
                    <el-table-column prop="worker.version" :label="$t('message.tasks.workerVersion')" ></el-table-column>
                    <el-table-column prop="currCapacityUsed" :label="$t('message.tasks.currCapacityUsed')" width="175"></el-table-column>
                    <el-table-column prop="lastCompletedTaskTime" :label="$t('message.tasks.lastCompletedTaskTime')" width="210"></el-table-column>
                    <el-table-column prop="blacklistedUntil" :label="$t('message.tasks.blacklistedUntil')" width="175"></el-table-column>
                    <el-table-column :label="$t('message.tasks.operation')" width="200">
                        <template scope="scope">
                            <el-button size="mini" @click="getAvailabilityGroups(scope.row)">{{$t('message.tasks.availabilityGroups')}}</el-button>
                            <el-button size="mini" @click="getWorkerRunningTasks(scope.row)">{{$t('message.tasks.workerRunningTaks')}}</el-button>
            
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination">
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[5,10, 25, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalNum">
                    </el-pagination>
                </div>
            </div>
        </template>

        <el-dialog :visible.sync="dialogVisible" :size="dialogSize" @close="dialogMessage = ''">
            <template slot="title">
                <div style=" line-height: 1;font-size: 16px; font-weight: 700;color: #1f2d3d;">
                    {{dialogTitle}}
                </div>
            </template>
            <el-input type="textarea" :autosize="dialogInputAutosize" v-model="dialogMessage">
            </el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">{{$t('message.common.close')}}</el-button>
            </span>
        </el-dialog>

    </div>
</template>


<script>
import _ from 'lodash'
export default {
    data() {
        return {
            workers: [],
            showTableData: [],
            hasData: false,
            dialogMessage: '',
            dialogTitle: '',
            dialogSize: 'full',
            dialogInputAutosize: {},
            dialogVisible: false,
            currentPage: 1,
            pageSize: 10,
            totalNum: 0,
            sortDimension: 'createdTime',
            isDescending: true,
            formInline: {}
        }
    },
    created: function() {
        this.init()
    },
    methods: {
        init() {
            this.sortDimension = 'createdTime'
            this.isDescending = true
            this.currentPage = 1
            this.getWorkers()
        },
        async getWorkers() {
            const { data } = await this.$http.get(`${this.$common.apis.overlordUrl}/workers`)
            if (data.length === 0) {
                this.hasData = false
            }
            this.hasData = true
            data.map(s => {
                if(null === s.blacklistedUntil){
                    s.blacklistedUntil = 'null'
                }
                return s
            })
            this.workers = []
            this.$common.methods.pushData(data, this.workers)
            this.totalNum = this.workers.length
            const resultData = this.$common.methods.fillShowTableData(this.workers, this.currentPage, this.pageSize)
            this.showTableData = []
            this.$common.methods.pushData(resultData, this.showTableData)
        },
        async getAvailabilityGroups(row) {

            const message = this.$common.methods.JSONUtils.toString(row.availabilityGroups, null, 2)
            this.configDialog(this.$t('message.tasks.availabilityGroups'), message, true, "small", { minRows: 15, maxRows: 25 })
        },
        async getWorkerRunningTasks(row) {

            const message = this.$common.methods.JSONUtils.toString(row.runningTasks, null, 2)
            this.configDialog(this.$t('message.tasks.workerRunningTaks'), message, true, "small",{ minRows: 15, maxRows: 25 })

        },

        configDialog(dialogTitle, dialogMessage, dialogVisible, dialogSize, dialogInputAutosize) {
            this.dialogTitle = dialogTitle
            this.dialogMessage = dialogMessage
            this.dialogVisible = dialogVisible
            this.dialogSize = dialogSize
            this.dialogInputAutosize = dialogInputAutosize
        },

        handleCurrentChange(newValue) {
            this.currentPage = newValue
            const resultData = this.$common.methods.fillShowTableData(this.workers, this.currentPage, this.pageSize)
            this.showTableData = []
            this.$common.methods.pushData(resultData, this.showTableData)
        },
        handleSizeChange(newValue) {
            this.pageSize = newValue
            const resultData = this.$common.methods.fillShowTableData(this.workers, this.currentPage, this.pageSize)
            this.showTableData = []
            this.$common.methods.pushData(resultData, this.showTableData)
        }
    }
}
</script>