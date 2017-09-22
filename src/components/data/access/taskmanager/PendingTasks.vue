<template>
    <div class="main">

        <div style=" margin-left:20px;">
            <span style="color: #242f42;font-size:20px;">
                <b>Pending Tasks - Tasks waiting to be assigned to a worker</b>
            </span>
            <br></br>
        </div>

        <el-form :inline="true" :model="formInline" class="demo-form-inline" style=" margin-left:20px;">
            <el-form-item label="id">
                <el-input size="small" v-model="formInline.searchValue1" placeholder="请输入id"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button size="small" type="primary" @click="onSearch">搜索</el-button>
                <el-button type="primary" size="small" @click="init">刷新</el-button>
            </el-form-item>
        </el-form>

        <div class="table" style=" margin-left:20px;">
            <el-table :data="showTableData" border stripe style="width: 100%" @sort-change="sortChange">
                <el-table-column prop="id" label="id" min-width="150"></el-table-column>
                <el-table-column sortable="custom" prop="createdTime" label="createdTime" width="207"></el-table-column>
                <el-table-column prop="queueInsertionTime" label="queueInsertionTime" width="207"></el-table-column>
                <el-table-column prop="location" label="location" width="175"></el-table-column>
                <el-table-column label="操作" width="320">
                    <template scope="scope">
                        <el-button size="mini" @click="getTaskInfo(scope.row.id)">payload</el-button>
                        <el-button size="mini" @click="getTaskStatus(scope.row.id)">status</el-button>
                        <el-button size="mini" @click="getTasklog(scope.row.id,0)">log(all)</el-button>
                        <el-button size="mini" @click="getTasklog(scope.row.id,8192)">log(8kb)</el-button>
                        <el-button size="mini" type="danger" @click="killTask(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[1,2,5,10, 25, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalNum">
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
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
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
            formInline:{
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
            this.getPendingTasks()
        },
        async getPendingTasks() {
            const { data } = await this.$http.get(this.$common.apis.pendingTasks)
           
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
            this.configDialog("Task Payload", message, true, "small", { minRows: 15, maxRows: 25 })
        },
        async getTaskStatus(taskId) {
            const url = `${this.$common.apis.baseTaskUrl}/${taskId}/status`
            const { data } = await this.$http.get(url)
            const message = this.$common.methods.JSONUtils.toString(data, null, 2)
            this.configDialog("Task Status", message, true, "small", {})

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
            const remindMessage = `Do you really want to kill:\n${taskId.substring(0, 45)}\n${taskId.substring(45)}`
            try {
                const res = await this.$confirm(remindMessage, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnClickModal: false,
                    type: 'warning'
                })
                if (res === 'confirm') {
                    const url = `${this.$common.apis.baseTaskUrl}/${taskId}/shutdown`
                    const postResponse = await this.$http.post(url)
                    if (postResponse.status === 200) {
                        window.setTimeout(this.init, 500)
                        this.$common.eventBus.$emit('updataCompleteTasks')
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
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
            this.$common.methods.pushData(sortedData,this.pendingTasks)
            const resultData = this.$common.methods.fillShowTableData(this.pendingTasks, this.currentPage, this.pageSize)
            this.showTableData = []
            this.$common.methods.pushData(resultData, this.showTableData)
        },
        onSearch(){
            if(_.isEqual(this.formInline.searchValue1,'')){
                return
            } 
            this.currentPage = 1
            const searchedData = this.$common.methods.searchArray(this.pendingTasks,'id',this.formInline.searchValue1)
            this.pendingTasks = []
            this.$common.methods.pushData(searchedData,this.pendingTasks)
            this.totalNum = this.pendingTasks.length
            const resultData = this.$common.methods.fillShowTableData(this.pendingTasks, this.currentPage, this.pageSize)
            this.showTableData = []
            this.$common.methods.pushData(resultData, this.showTableData)
        }
    },
    mounted() {
        let self = this
        this.$common.eventBus.$on('updataAllTasks', () => {
            self.init()
        })
        this.$common.eventBus.$on('updataPendingTasks', () => {
            self.init()
        })
    }
}
</script>