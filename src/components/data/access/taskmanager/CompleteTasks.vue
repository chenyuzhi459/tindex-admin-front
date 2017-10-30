<template>
    <div class="table">
        <div style=" margin-left:20px;">
            <span style="color: #242f42;font-size:20px;">
                <b>{{$t('message.tasks.completeTasksTitle')}}</b>
            </span>
            <br></br>
        </div>
        <el-form :inline="true" :model="formInline" class="demo-form-inline" style=" margin-left:20px;">
            <el-form-item label="id">
                <el-input size="small" v-model="formInline.searchValue1" :placeholder="$t('message.tasks.searchTips')"></el-input>
            </el-form-item>
            <el-form-item label="topic">
                <el-input size="small" v-model="formInline.searchValue2" :placeholder="$t('message.tasks.searchTopicTips')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('message.tasks.status')">
                <el-select size="small" v-model="formInline.searchValue3" :placeholder="$t('message.tasks.selectStatus')">
                    <el-option :label="$t('message.tasks.statusItem1')" value="ALL"></el-option>
                    <el-option :label="$t('message.tasks.statusItem2')" value="SUCCESS"></el-option>
                    <el-option :label="$t('message.tasks.statusItem3')" value="FAILED"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button size="small" type="primary" @click="onSearch">{{$t('message.tasks.search')}}</el-button>
                <el-button type="primary" size="small" @click="init">{{$t('message.tasks.refresh')}}</el-button>
            </el-form-item>
        </el-form>
        <template v-if="hasData">
            <div class="table" style=" margin-left:20px;">
                <el-table :data="completeTasks" border stripe style="width: 100%" @sort-change="sortChange">
                    <el-table-column prop="id" label="id" min-width="472"></el-table-column>
                    <el-table-column prop="status" :label="$t('message.tasks.status')" width="108"></el-table-column>
                    <el-table-column sortable="custom" prop="createdTime" :label="$t('message.tasks.createdTime')" width="207">
                    </el-table-column>
                    <el-table-column prop="duration" :label="$t('message.tasks.duration')" width="110"></el-table-column>
                    <el-table-column prop="topic" :label="$t('message.tasks.topic')" width="150"></el-table-column>
                    <el-table-column prop="offsets" :label="$t('message.tasks.offsets')" width="150"></el-table-column>

                    <el-table-column :label="$t('message.tasks.operation')" width="275">
                        <template scope="scope">
                            <el-button size="mini" @click="getTaskInfo(scope.row.id)">{{$t('message.tasks.payload')}}</el-button>
                            <el-button size="mini" @click="getTaskStatus(scope.row.id)">{{$t('message.tasks.status')}}</el-button>
                            <el-button size="mini" @click="getTasklog(scope.row.id,0)">{{$t('message.tasks.allLog')}}</el-button>
                            <el-button size="mini" @click="getTasklog(scope.row.id,8192)">{{$t('message.tasks.partLog')}}</el-button>
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
                <div style=" line-height: 1;font-size: 16px;font-weight: 700;color: #1f2d3d;">
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

export default {
    data() {
        return {
            completeTasks: [],
            hasData: false,
            dialogMessage: '',
            dialogTitle: '',
            dialogSize: 'full',
            dialogInputAutosize: {},
            dialogVisible: false,
            sortDimension: 'createdTime',
            isDescending: true,
            currentPage: 1,
            pageSize: 10,
            totalNum: 0,
            formInline: {
                searchValue1: '',
                searchValue2: '',
                searchValue3: 'ALL'
            },
            isSearching: false
        }
    },

    created: function() {
        this.init()
    },
    methods: {
        init() {
            this.currentPage = 1
            this.isSearching = false
            this.sortDimension = 'createdTime'
            this.isDescending = true
            this.formInline.searchValue1 = ''
            this.formInline.searchValue2 = ''
            this.formInline.searchValue3 = 'ALL'
            this.getCompleteTasks()
        },
        async getTaskInfo(taskId) {
            const url = `${this.$common.apis.baseTaskUrl}/${taskId}`
            const response = await this.$http.get(url)
            const { data } = response
            const message = this.$common.methods.JSONUtils.toString(data, null, 2)
            this.configDialog(this.$t('message.tasks.taskPayloadTitle'), message, true, "small", { minRows: 15, maxRows: 25 })
        },
        async getTaskStatus(taskId) {
            const url = `${this.$common.apis.baseTaskUrl}/${taskId}/status`
            const response = await this.$http.get(url)
            const { data } = response
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
        async getCompleteTasks() {
            const countUrl = `${this.$common.apis.completeTasks}/custom/count`
            const countResponse = await this.$http.get(countUrl)
            this.totalNum = countResponse.data.total
            if (this.totalNum === 0) {
                this.hasData = false
                return
            }
            this.hasData = true
            const url = `${this.$common.apis.completeTasks}/custom/list`
            const { data } = await this.$http.get(url,
                {
                    params: {
                        offset: (this.currentPage - 1) * this.pageSize,
                        size: this.pageSize
                    }
                }
            )
            this.completeTasks = []
            this.$common.methods.pushData(data, this.completeTasks)
        },
        async getShowTasks(currentPage, pageSize, sortDimension, isDescending) {
            let paramsData = {
                offset: (currentPage - 1) * pageSize,
                size: pageSize,
                sortDimension: this.sortDimension === 'createdTime' ? 'created_date' : this.sortDimension,
                isDescending: this.isDescending
            }
            if (this.isSearching) {
                if (!_.isEqual(this.formInline.searchValue1, '')) {
                    paramsData.searchDimension1 = 'id'
                    paramsData.searchValue1 = this.formInline.searchValue1
                }
                if (!_.isEqual(this.formInline.searchValue2, '')) {
                    paramsData.searchDimension2 = 'payload'
                    paramsData.searchValue2 = this.formInline.searchValue2
                }
                if (!_.isEqual(this.formInline.searchValue3, 'ALL')) {
                    paramsData.searchDimension3 = 'status_payload'
                    paramsData.searchValue3 = this.formInline.searchValue3
                }
            }

            const url = `${this.$common.apis.completeTasks}/custom/list`
            const response = await this.$http.get(url, {
                params: paramsData
            })
            this.completeTasks = []
            this.$common.methods.pushData(response.data, this.completeTasks)

        },
        async onSearch() {
            let paramsData = {}
            if (!_.isEqual(this.formInline.searchValue1, '')) {
                paramsData.searchDimension1 = 'id'
                paramsData.searchValue1 = this.formInline.searchValue1
            }
            if (!_.isEqual(this.formInline.searchValue2, '')) {
                paramsData.searchDimension2 = 'payload'
                paramsData.searchValue2 = this.formInline.searchValue2
            }
            if (!_.isEqual(this.formInline.searchValue3, 'ALL')) {
                paramsData.searchDimension3 = 'status_payload'
                paramsData.searchValue3 = this.formInline.searchValue3
            }
            const countUrl = `${this.$common.apis.completeTasks}/custom/count`
            const countResponse = await this.$http.get(countUrl, { params: paramsData })
            this.totalNum = countResponse.data.total

            this.isSearching = true
            this.currentPage = 1
            this.getShowTasks(this.currentPage, this.pageSize, this.sortDimension, this.isDescending)

        },
        sortChange(column, prop, order) {
            if (null === column.order) {
                return
            }
            this.sortDimension = column.prop
            this.isDescending = column.order === "ascending" ? false : true
            this.getShowTasks(this.currentPage, this.pageSize, this.sortDimension, this.isDescending)
        },
        handleCurrentChange(newValue) {
            this.currentPage = newValue
            this.getShowTasks(this.currentPage, this.pageSize, this.sortDimension, this.isDescending)
        },
        handleSizeChange(newValue) {
            this.pageSize = newValue
            this.getShowTasks(this.currentPage, this.pageSize, this.sortDimension, this.isDescending)
        }
    },
    mounted() {
        let self = this
        this.$common.eventBus.$on("updateAllTasks", () => {
            self.init()
        })
        this.$common.eventBus.$on("updateCompleteTasks", () => {
            self.init()
        })
    }
}
</script>