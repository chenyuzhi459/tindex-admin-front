<template>
    <div class="main">

        <div style=" margin-left:20px;">
            <span style="color: #242f42;font-size:20px;">
                <b>{{$t('message.supervisors.runningSuperviorTitle')}}</b>
            </span>
            <br></br>
        </div>

        <el-form :inline="true" :model="formInline" class="demo-form-inline" style=" margin-left:20px;">
            <el-form-item label="id">
                <el-input size="small" v-model="formInline.searchValue1" :placeholder="$t('message.supervisors.searchTips')"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button size="small" type="primary" @click="onSearch">{{$t('message.supervisors.search')}}</el-button>
                <el-button type="primary" size="small" @click="init">{{$t('message.supervisors.refresh')}}</el-button>
            </el-form-item>
        </el-form>

        <div class="table" style=" margin-left:20px;">
            <el-table :data="showTableData" border stripe style="width: 100%" @sort-change="sortChange">
                <el-table-column  label="id" >
                     <template scope="scope">
                          <el-button type="text" style=" font-size: 14px;color: #1f2d3d;"  @click="getTasks(scope.row.id)">{{scope.row.id}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('message.supervisors.operation')" width="230">
                    <template scope="scope">
                        <el-button size="mini" @click="getSpec(scope.row.id)">{{$t('message.supervisors.spec')}}</el-button>
                        <el-button size="mini" @click="getStatus(scope.row.id)">{{$t('message.supervisors.status')}}</el-button>
                        <el-button size="mini" @click="doReset(scope.row.id,0)">{{$t('message.supervisors.reset')}}</el-button>
                        <el-button size="mini" style="width:35px" type="danger" @click="killSupervisor(scope.row.id)">{{$t('message.supervisors.delete')}}</el-button>
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
                <el-button @click="dialogVisible = false">{{$t('message.supervisors.dialogCancel')}}</el-button>
                <el-button type="primary" @click="dialogVisible = false">{{$t('message.supervisors.dialogConfirm')}}</el-button>
            </span>
        </el-dialog>

    </div>
</template>


<script>
import _ from 'lodash'
export default {
    data() {
        return {
            runningSupervisors: [],
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
            this.getRunningSupervisors()
        },
        async getRunningSupervisors() {
            let { data } = await this.$http.get(this.$common.apis.supervisor)
            data = data.map(s => {
                return { id: s }
            })
            this.runningSupervisors = []
            this.$common.methods.pushData(data, this.runningSupervisors)
            this.totalNum = this.runningSupervisors.length
            const resultData = this.$common.methods.fillShowTableData(this.runningSupervisors, this.currentPage, this.pageSize)
            this.showTableData = []
            this.$common.methods.pushData(resultData, this.showTableData)
        },
        async getSpec(id) {
            const url = `${this.$common.apis.supervisor}/${id}`
            const { data } = await this.$http.get(url)
            const message = this.$common.methods.JSONUtils.toString(data, null, 2)
            this.configDialog(this.$t('message.supervisors.specTitle'), message, true, "small", { minRows: 15, maxRows: 25 })
        },
        async getStatus(id) {
            const url = `${this.$common.apis.supervisor}/${id}/status`
            const { data } = await this.$http.get(url)
            const message = this.$common.methods.JSONUtils.toString(data, null, 2)
            this.configDialog(this.$t('message.supervisors.statusTitle'), message, true, "small", { minRows: 15, maxRows: 25 })

        },
        async doReset(id) {
            const remindMessage = `${this.$t('message.supervisors.resetTips')}: \n${id.substring(0, 45)}\n${id.substring(45)}?`
            try {
                const res = await this.$confirm(remindMessage, this.$t('message.supervisors.dialogWarningTitle'), {
                    confirmButtonText: this.$t('message.supervisors.dialogConfirm'),
                    cancelButtonText: this.$t('message.supervisors.dialogCancel'),
                    closeOnClickModal: false,
                    type: 'warning'
                })
                try {
                    const url = `${this.$common.apis.supervisor}/${id}/reset`
                    const { data } = await this.$http.post(url)
                    this.$message({
                        type: 'success',
                        message: `${this.$t('message.supervisors.resetSuccessMsg')}: ${data.id}`
                    })
                } catch (err) {
                    this.$message({
                        type: 'error',
                        message: this.$t('message.supervisors.resetErrMsg')
                    })
                }
            } catch (err) {

            }

        },
        getTasks(id){
            this.$router.replace({
                name: 'supervisorTasks',
                params: {
                    supervisorId: id
                }
            })
        },
        configDialog(dialogTitle, dialogMessage, dialogVisible, dialogSize, dialogInputAutosize) {
            this.dialogTitle = dialogTitle
            this.dialogMessage = dialogMessage
            this.dialogVisible = dialogVisible
            this.dialogSize = dialogSize
            this.dialogInputAutosize = dialogInputAutosize
        },

        async killSupervisor(id) {
            const killTips = this.$t('message.supervisors.killTips')
            const remindMessage = `${killTips}:\n${id.substring(0, 45)}\n${id.substring(45)}`
            try {
                const res = await this.$confirm(remindMessage, this.$t('message.supervisors.dialogWarningTitle'), {
                    confirmButtonText: this.$t('message.supervisors.dialogConfirm'),
                    cancelButtonText: this.$t('message.supervisors.dialogCancel'),
                    closeOnClickModal: false,
                    type: 'warning'
                })
                try {
                    const url = `${this.$common.apis.supervisor}/${id}/shutdown`
                    const postResponse = await this.$http.post(url)

                    window.setTimeout(this.init, 500)
                    this.$common.eventBus.$emit('updateCompleteSupervisors')
                    this.$message({
                        type: 'success',
                        message: this.$t('message.tasks.killSuccess')
                    })

                } catch (err) {
                     this.$message({
                        type: 'error',
                        message: this.$t('message.supervisors.killFailed')
                    })
                }
            } catch (e) {

            }
        },
        handleCurrentChange(newValue) {
            this.currentPage = newValue
            const resultData = this.$common.methods.fillShowTableData(this.runningSupervisors, this.currentPage, this.pageSize)
            this.showTableData = []
            this.$common.methods.pushData(resultData, this.showTableData)


        },
        handleSizeChange(newValue) {
            this.pageSize = newValue
            const resultData = this.$common.methods.fillShowTableData(this.runningSupervisors, this.currentPage, this.pageSize)
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
            const sortedData = this.$common.methods.sortArray(this.runningSupervisors, this.sortDimension, direction)
            this.runningSupervisors = []
            this.$common.methods.pushData(sortedData, this.runningSupervisors)
            const resultData = this.$common.methods.fillShowTableData(this.runningSupervisors, this.currentPage, this.pageSize)
            this.showTableData = []
            this.$common.methods.pushData(resultData, this.showTableData)
        },
        onSearch() {
            if (_.isEqual(this.formInline.searchValue1, '')) {
                return
            }
            this.currentPage = 1
            const searchedData = this.$common.methods.searchArray(this.runningSupervisors, 'id', this.formInline.searchValue1)
            this.runningSupervisors = []
            this.$common.methods.pushData(searchedData, this.runningSupervisors)
            this.totalNum = this.runningSupervisors.length
            const resultData = this.$common.methods.fillShowTableData(this.runningSupervisors, this.currentPage, this.pageSize)
            this.showTableData = []
            this.$common.methods.pushData(resultData, this.showTableData)
        }
    },
    mounted() {
        let self = this
        this.$common.eventBus.$on('updateAllSupervisors', () => {
            self.init()
        })
        this.$common.eventBus.$on('updateRunningSupervisors', () => {
            self.init()
        })
    }
}
</script>