<template>
    <div class="main">

        <div style=" margin-left:20px;">
            <span style="color: #242f42;font-size:20px;">
                <b>{{$t('message.tasks.pendingTasksTitle')}}</b>
            </span>
            <br></br>
        </div>

        <el-form :inline="true" :model="formInline" class="demo-form-inline" style=" margin-left:20px;">
            <el-form-item label="id">
                <el-input size="small" v-model="formInline.searchValue1" :placeholder="$t('message.tasks.searchTips')"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button size="small" type="primary" @click="onSearch">{{$t('message.tasks.search')}}</el-button>
                <el-button type="primary" size="small" @click="init">{{$t('message.tasks.refresh')}}</el-button>
            </el-form-item>
        </el-form>

        <div class="table" style=" margin-left:20px;">
            <el-table :data="showTableData" border stripe style="width: 100%" @sort-change="sortChange">
                <el-table-column prop="id" label="id" min-width="150"></el-table-column>
                <el-table-column sortable="custom" prop="createdTime" :label="$t('message.tasks.createdTime')" width="207"></el-table-column>
                <el-table-column prop="queueInsertionTime" :label="$t('message.tasks.queueInsertTime')" width="207"></el-table-column>
                <el-table-column prop="location" :label="$t('message.tasks.location')" width="175"></el-table-column>
                <el-table-column :label="$t('message.tasks.operation')" width="320">
                    <template scope="scope">
                        <el-button size="mini" @click="getTaskInfo(scope.row.id)">{{$t('message.tasks.payload')}}</el-button>
                        <el-button size="mini" @click="getTaskStatus(scope.row.id)">{{$t('message.tasks.status')}}</el-button>
                        <el-button size="mini" @click="getTasklog(scope.row.id,0)">{{$t('message.tasks.allLog')}}</el-button>
                        <el-button size="mini" @click="getTasklog(scope.row.id,8192)">{{$t('message.tasks.partLog')}}</el-button>
                        <el-button size="mini" style="width:35px" type="danger" @click="killTask(scope.row.id)">{{$t('message.tasks.delete')}}</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[5,10, 25, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalNum">
                </el-pagination>
            </div>
            <br>
        </div>

        <el-dialog :visible.sync="dialogVisible" :size="dialogSize" @close="dialogMessage = ''">
            <template slot="title">
                <div style=" line-height: 1;font-size: 16px; font-weight: 700;color: #1f2d3d;">
                    {{dialogTitle}}
                </div>
            </template>
            <el-input type="textarea" :autosize="dialogInputAutosize" v-model="dialogMessage">
            </el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">{{$t('message.tasks.dialogCancel')}}</el-button>
                <el-button type="primary" @click="dialogVisible = false">{{$t('message.tasks.dialogConfirm')}}</el-button>
            </span>
        </el-dialog>

    </div>
</template>


<script>
import _ from 'lodash'
export default {
    data() {
        return {
            pendingTasks: [],
            showTableData: [],
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
            isSearching: false,
            sourceData: [],
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
            this.sortDimension = 'createdTime'
            this.isDescending = true
            this.isSearching = false
            this.currentPage = 1
            this.getPendingTasks()
        },
        async getPendingTasks() {
            const { data } = await this.$http.get(this.$common.apis.pendingTasks)
            data.map(s => {
                if (undefined !== s.location) {
                    s.location = _.isNull(s.location.host) ? 'null' : s.location.host + ":" + s.location.port
                    return s
                }
            })
            this.pendingTasks = []
            this.$common.methods.pushData(data, this.pendingTasks)
            this.totalNum = this.pendingTasks.length
            const resultData = this.$common.methods.fillShowTableData(this.pendingTasks, this.currentPage, this.pageSize)
            this.showTableData = []
            this.$common.methods.pushData(resultData, this.showTableData)
        },
        async getTaskInfo(taskId) {
            const url = `${this.$common.apis.baseTaskUrl}/${taskId}`
            const { data } = await this.$http.get(url)
            const message = this.$common.methods.JSONUtils.toString(data, null, 2)
            this.configDialog(this.$t('message.tasks.taskPayloadTitle'), message, true, "small", { minRows: 15, maxRows: 25 })
        },
        async getTaskStatus(taskId) {
            const url = `${this.$common.apis.baseTaskUrl}/${taskId}/status`
            const { data } = await this.$http.get(url)
            const message = this.$common.methods.JSONUtils.toString(data, null, 2)
            this.configDialog(this.$t('message.tasks.taskStatusTitle'), message, true, "small", {})

        },
        getTasklog(taskId, offset) {
            const url = `${this.$common.apis.baseTaskUrl}/${taskId}/log?offset=${offset}`
            window.open(url)
        },
        configDialog(dialogTitle, dialogMessage, dialogVisible, dialogSize, dialogInputAutosize) {
            this.dialogTitle = dialogTitle
            this.dialogMessage = dialogMessage
            this.dialogVisible = dialogVisible
            this.dialogSize = dialogSize
            this.dialogInputAutosize = dialogInputAutosize
        },

        async killTask(taskId) {
            const killTips = this.$t('message.tasks.killTips')
            const remindMessage = `${killTips}:\n${taskId.substring(0, 45)}\n${taskId.substring(45)}`
            try {
                const res = await this.$confirm(remindMessage, this.$t('message.tasks.killConfirmTitle'), {
                    confirmButtonText: this.$t('message.tasks.dialogConfirm'),
                    cancelButtonText: this.$t('message.tasks.dialogCancel'),
                    closeOnClickModal: false,
                    type: 'warning'
                })
                if (res === 'confirm') {
                    const url = `${this.$common.apis.baseTaskUrl}/${taskId}/shutdown`
                    const postResponse = await this.$http.post(url)
                    if (postResponse.status === 200) {
                        window.setTimeout(this.init, 500)
                        this.$common.eventBus.$emit('updateCompleteTasks')
                        this.$message({
                            type: 'success',
                            message: this.$t('message.tasks.killSuccess')
                        })
                    }
                }
            } catch (e) {

            }
        },
        handleCurrentChange(newValue) {
            this.currentPage = newValue
            const resultData = this.$common.methods.fillShowTableData(this.pendingTasks, this.currentPage, this.pageSize)
            this.showTableData = []
            this.$common.methods.pushData(resultData, this.showTableData)
        },
        handleSizeChange(newValue) {
            this.pageSize = newValue
            const resultData = this.$common.methods.fillShowTableData(this.pendingTasks, this.currentPage, this.pageSize)
            this.showTableData = []
            this.$common.methods.pushData(resultData, this.showTableData)
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
            const sortedData = this.$common.methods.sortArray(this.pendingTasks, this.sortDimension, direction)
            this.pendingTasks = []
            this.$common.methods.pushData(sortedData, this.pendingTasks)
            const resultData = this.$common.methods.fillShowTableData(this.pendingTasks, this.currentPage, this.pageSize)
            this.showTableData = []
            this.$common.methods.pushData(resultData, this.showTableData)
        },
        onSearch() {
            if (_.isEqual(this.formInline.searchValue1, '')) {
                return
            }
            if(!this.isSearching){
                this.sourceData = this.pendingTasks
            }
            this.isSearching = true
            this.currentPage = 1
            this.pendingTasks = this.$common.methods.searchArray(this.sourceData, 'id', this.formInline.searchValue1)
            this.totalNum = this.pendingTasks.length
            this.showTableData = this.$common.methods.fillShowTableData(this.pendingTasks, this.currentPage, this.pageSize)
        }
    },
    mounted() {
        let self = this
        this.$common.eventBus.$on('updateAllTasks', () => {
            self.init()
        })
        this.$common.eventBus.$on('updatePendingTasks', () => {
            self.init()
        })
    }
}
</script>