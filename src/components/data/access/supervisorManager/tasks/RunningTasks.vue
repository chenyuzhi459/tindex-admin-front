<template>
    <div class="main">
        <div style=" margin-left:20px;">
            <span style="color: #242f42;font-size:20px;">
                <b>{{$t('message.tasks.runningTasksTitle')}}</b>
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
        <template v-if="hasData">
            <div class="table" style=" margin-left:20px;">
                <el-table :data="showTableData" border stripe style="width: 100%" :row-key="getRowKey" :expand-row-keys="expandRowKeys" @sort-change="sortChange" @expand="expand">
                    <el-table-column type="expand">
                        <template scope="props">
                            <el-form label-position="left" inline class="demo-table-expand">
                                <el-button size="small" @click="updateExpandData(props.row)">{{$t('message.common.update')}}</el-button>
                                <br>
                                <el-form-item :label="$t('message.tasks.datasource')">
                                    <span>{{ props.row.datasource }}</span>
                                </el-form-item>
                                <el-form-item :label="$t('message.tasks.topic')">
                                    <a class="click-a" @click="getTopicOffsets(props.row)">{{ props.row.topic }}</a>
                                </el-form-item>
                                <el-form-item :label="$t('message.tasks.startOffset')">
                                    <span>{{ props.row.startOffset }}</span>
                                </el-form-item>
                                <el-form-item :label="$t('message.tasks.period')">
                                    <span>{{ props.row.status }}</span>
                                </el-form-item>
                                <el-form-item :label="$t('message.tasks.currOffset')">
                                    <span>{{ props.row.currOffset }}</span>
                                </el-form-item>
                                <el-form-item :label="$t('message.tasks.metrics')">
                                    <span>{{ props.row.metrics }}</span>
                                </el-form-item>
                                <!-- <el-form-item :label="$t('message.tasks.updateExpandData')">
                                                                <el-button size="small" @click="onSearch">{{$t('message.tasks.updateExpandData')}}</el-button>
                                                            </el-form-item> -->

                            </el-form>
                        </template>
                    </el-table-column>
                    <el-table-column label="id" min-width="150">
                        <template scope="scope">
                            <a class="click-a" @click="showExpand(scope.row)">{{scope.row.id}}</a>
                        </template>
                    </el-table-column>
                    <el-table-column sortable="custom" prop="createdTime" :label="$t('message.tasks.createdTime')" width="207"></el-table-column>
                    <el-table-column prop="queueInsertionTime" :label="$t('message.tasks.queueInsertTime')" width="210"></el-table-column>
                    <el-table-column prop="location" :label="$t('message.tasks.location')" width="180"></el-table-column>
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
    props: [
        'supervisorId'
    ],
    data() {
        return {
            runningTasks: [],
            showTableData: [],
            hasData: false,
            expandRowKeys: [],
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
            },
            expandRequestTimeout: 5000,
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
            this.formInline.searchValue1 = ''
            this.getRunningTasks()
        },
        async getRunningTasks() {
            const url = `${this.$common.apis.overlordUrl}/${this.supervisorId}/runningTasks`
            let { data } = await this.$http.get(url)
            if (data.length === 0) {
                this.hasData = false
                return
            }
            this.hasData = true
            data.map(s => {
                s.currOffset = ''
                s.status = ''
                s.metrics = ''
                s.topic = ''
                s.datasource = ''
                s.startOffset = ''
                if (undefined !== s.location) {
                    s.location = s.location.host + ":" + s.location.port
                    return s
                }
            })
            this.runningTasks = []
            this.$common.methods.pushData(data, this.runningTasks)
            this.totalNum = this.runningTasks.length
            const resultData = this.$common.methods.fillShowTableData(this.runningTasks, this.currentPage, this.pageSize)
            this.showTableData = []
            this.$common.methods.pushData(resultData, this.showTableData)
        },
        getRowKey(row) {
            return row.id
        },
        findInExpandRowKeys(target) {
            return _.findIndex(this.expandRowKeys, s => {
                return s === target
            })
        },
        async updateExpandData(row) {
            this.expand(row, true)
        },
        showExpand(row) {
            const index = this.findInExpandRowKeys(row.id)
            index < 0 ? this.expand(row, true) : this.expand(row, false)

        },
        async expand(row, expanded) {
            if (expanded) {
                const index = _.findIndex(this.expandRowKeys, s => { return s === row.id })
                if (index < 0) {
                    this.expandRowKeys.push(row.id)
                }

                if (row.datasource === '') {
                    const specInfo = await this.getSpecInfo(row)
                    row.datasource = specInfo.datasource
                    row.topic = specInfo.topic
                    row.startOffset = specInfo.startOffset
                }
                const { data } = await this.$http.get(
                    `${this.$common.apis.taskChatUrl}/chat/${row.id}/summary`,
                    {
                        params: {
                            location: row.location
                        },
                        _timeout: this.expandRequestTimeout
                    }
                ).catch(err => {
                    this.$message({
                        message: err.statusText,
                        type: 'error',
                        showClose: true,
                        duration:2000
                    })
                    return {data:{}}
                })
                row.status = data.status
                row.currOffset = data.currOffset
                row.metrics = data.metrics
            } else {
                const index = _.findIndex(this.expandRowKeys, s => { return s === row.id })
                if (index >= 0) {
                    this.expandRowKeys.splice(index, 1)
                }
            }
        },
        async getSpecInfo(row) {
            const url = `${this.$common.apis.baseTaskUrl}/${row.id}`
            const { data } = await this.$http.get(url, {
                _timeout: this.expandRequestTimeout
            }).catch(err => {
                const errMsg = err.status === 408 ? 'get specInfo timeout' : 'err'
                console.log(errMsg)
                return errMsg
            })
            let info = {
                datasource: '',
                topic: '',
                startOffset: ''
            }
            info.datasource = data.payload.dataSchema.dataSource
            info.topic = data.payload.ioConfig.startPartitions.topic
            info.startOffset = data.payload.ioConfig.startPartitions.partitionOffsetMap
            return info
        },
        async getTaskInfo(taskId) {
            const url = `${this.$common.apis.baseTaskUrl}/${taskId}`
            const { data } = await this.$http.get(url)
            const message = this.$common.methods.JSONUtils.toString(data, null, 2)
            this.configDialog(this.$t('message.tasks.taskPayloadTitle'), message, true, "small", { minRows: 15, maxRows: 25 })
        },
        async getTaskStatus(taskId) {
            const url = `${this.$common.apis.baseTaskUrl}/${taskId}/status`
            const { data } = await this.$http.get(url, { _timeout: this.expandRequestTimeout })
            const message = this.$common.methods.JSONUtils.toString(data, null, 2)
            this.configDialog(this.$t('message.tasks.taskStatusTitle'), message, true, "small", { minRows: 15, maxRows: 25 })

        },
        async getTopicOffsets(row) {
            const url = `${this.$common.apis.kafka}/${row.topic}/offsets`
            let postData = []
            for (let key in row.startOffset) {
                postData.push(parseInt(key))
            }

            const { data } = await this.$http.post(url, postData, {
                header: {
                    ContentType: "application/json"
                }
            })
            const message = this.$common.methods.JSONUtils.toString(data, null, 2)
            this.configDialog(this.$t('message.tasks.topicOffsets'), message, true, "small", { minRows: 15, maxRows: 25 })
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
                        this.$common.eventBus.$emit('updateSupervisorCompleteTasks')
                        this.$common.eventBus.$emit('updateSupervisorPendingTasks')
                        this.$common.eventBus.$emit('updateSupervisorWaitingTasks')
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
            const resultData = this.$common.methods.fillShowTableData(this.runningTasks, this.currentPage, this.pageSize)
            this.showTableData = []
            this.$common.methods.pushData(resultData, this.showTableData)


        },
        handleSizeChange(newValue) {
            this.pageSize = newValue
            const resultData = this.$common.methods.fillShowTableData(this.runningTasks, this.currentPage, this.pageSize)
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
            const sortedData = this.$common.methods.sortArray(this.runningTasks, this.sortDimension, direction)
            this.runningTasks = []
            this.$common.methods.pushData(sortedData, this.runningTasks)
            const resultData = this.$common.methods.fillShowTableData(this.runningTasks, this.currentPage, this.pageSize)
            this.showTableData = []
            this.$common.methods.pushData(resultData, this.showTableData)
        },
        onSearch() {
            if (_.isEqual(this.formInline.searchValue1, '')) {
                return
            }
            if (!this.isSearching) {
                this.sourceData = this.runningTasks
            }
            this.isSearching = true
            this.currentPage = 1
            this.runningTasks = this.$common.methods.searchArray(this.sourceData, 'id', this.formInline.searchValue1)
            this.totalNum = this.runningTasks.length
            this.showTableData = this.$common.methods.fillShowTableData(this.runningTasks, this.currentPage, this.pageSize)
        }
    },
    mounted() {
        let self = this
        this.$common.eventBus.$on('updateSupervisorAllTasks', () => {
            self.init()
        })
        this.$common.eventBus.$on('updateSupervisorRunningTasks', () => {
            self.init()
        })
    }
}
</script>

<style>
.click-a {
    color: #20a0ff;
    cursor: pointer;
}

.click-a:hover {
    text-decoration: none
}

.demo-table-expand {
    font-size: 0;
}

.demo-table-expand label {
    width: 72px;
    color: #99a9bf;
}

.demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 32%;
}
</style>