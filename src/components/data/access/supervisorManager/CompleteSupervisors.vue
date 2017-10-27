<template>
    <div class="table">
        <div style=" margin-left:20px;">
            <span style="color: #242f42;font-size:20px;">
                <b>{{$t('message.supervisors.completeSupervisorsTitle')}}</b>
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
                <el-table :data="completeSupervisors" border stripe style="width: 100%" @sort-change="sortChange">
                    <el-table-column label="id" min-width="350">
                        <template scope="scope">
                            
                            <a class="click-link" @click="getTasks(scope.row.id)">{{scope.row.id}}</a>
                        </template>
                    </el-table-column>
                    <el-table-column sortable="custom" prop="version" :label="$t('message.supervisors.version')" width="207">
                    </el-table-column>
                    <el-table-column prop="type" :label="$t('message.supervisors.type')" width="200"></el-table-column>

                    <el-table-column prop="taskDuration" :label="$t('message.supervisors.taskDuration')" width="150"></el-table-column>
                    <el-table-column prop="topic" :label="$t('message.supervisors.topic')" width="200"></el-table-column>

                    <el-table-column :label="$t('message.tasks.operation')" width="140">
                        <template scope="scope">
                            <el-button size="mini" @click="getStatus(scope.row.id)">{{$t('message.supervisors.status')}}</el-button>
                            <el-button size="mini" @click="getSpec(scope.row.id,scope.row.version)">{{$t('message.supervisors.reuse')}}</el-button>
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
                <div style=" line-height: 1;
                                font-size: 16px;
                                font-weight: 700;
                                color: #1f2d3d;">
                    {{dialogTitle}}
                </div>
            </template>
            <el-input type="textarea" :autosize="dialogInputAutosize" v-model="dialogMessage">
            </el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">{{$t('message.common.close')}}</el-button>
            </span>
        </el-dialog>

        <el-dialog :visible.sync="createDialogVisible" size="small" :title="$t('message.supervisors.supervisorSpec')" :close-on-click-modal="false">
            <span style="color: red" v-if="jsonSyntaxError">{{$t('message.supervisors.jsonSyntaxError')}}</span>
            <el-input type="textarea" :rows="25" v-model="supervisorSpecJson">
            </el-input>
            <span slot="footer" class="dialog-footer">
                <el-button style="float:left" type="primary" @click="format">{{$t('message.supervisors.format')}}</el-button>
                <el-button @click="createDialogVisible = false">{{$t('message.supervisors.dialogCancel')}}</el-button>
                <el-button type="primary" @click="createSupervisor()">{{$t('message.supervisors.createDialogConfirm')}}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

export default {
    props: [
        'supervisorId'
    ],
    data() {
        return {
            completeSupervisors: [],
            hasData: false,
            dialogMessage: '',
            dialogTitle: '',
            dialogSize: 'full',
            dialogInputAutosize: {},
            dialogVisible: false,
            sortDimension: 'version',
            isDescending: true,
            currentPage: 1,
            pageSize: 10,
            totalNum: 0,
            formInline: {
                searchValue1: ''
            },
            isSearching: false,
            jsonSyntaxError: false,
            createDialogVisible: false,
            supervisorSpecJson: ''
        }
    },

    created: function() {
        this.init()
    },
    methods: {
        init() {
            this.currentPage = 1
            this.isSearching = false
            this.sortDimension = 'version'
            this.isDescending = true
            this.getCompleteSupervisors()
        },
        getTasks(id) {
            this.$router.push({
                name: 'supervisorTasks',
                params: {
                    supervisorId: id
                }
            })
        },
        async getStatus(id) {
            try {
                const url = `${this.$common.apis.supervisor}/${id}/status`
                const response = await this.$http.get(url)
                const { data } = response
                const message = this.$common.methods.JSONUtils.toString(data, null, 2)
                this.configDialog(this.$t('message.supervisors.supervisorStatusTitle'), message, true, "small", { minRows: 15, maxRows: 25 })

            } catch (e) {
                const message = this.$common.methods.JSONUtils.toString(e.data, null, 2)
                this.configDialog(this.$t('message.supervisors.supervisorStatusTitle'), message, true, "small", { minRows: 15, maxRows: 25 })
            }

        },
        configDialog(dialogTitle, dialogMessage, dialogVisible, dialogSize, dialogInputAutosize) {
            this.dialogTitle = dialogTitle
            this.dialogMessage = dialogMessage
            this.dialogVisible = dialogVisible
            this.dialogSize = dialogSize
            this.dialogInputAutosize = dialogInputAutosize
        },
        async getSpec(id, version) {
            const url = `${this.$common.apis.supervisor}/${id}/history`
            const response = await this.$http.get(url)
            const { data } = response

            let tmpSpec = {}
            for (let index = 0, len = data.length; index < len; index++) {
                if (_.isEqual(data[index].version, version)) {
                    tmpSpec = data[index].spec
                    break
                }
            }

            this.supervisorSpecJson = this.$common.methods.JSONUtils.toString(tmpSpec, null, 2)
            this.createDialogVisible = true
        },
        format() {
            let jsonObject
            try {
                jsonObject = this.$common.methods.JSONUtils.toJsonObject(this.supervisorSpecJson);
            } catch (e) {
                if (e.name === "SyntaxError") {
                    this.jsonSyntaxError = true
                }
                return
            }
            if (typeof jsonObject === "object") {
                this.supervisorSpecJson = this.$common.methods.JSONUtils.toString(jsonObject, null, 2)
                this.jsonSyntaxError = false
            }
        },
        async createSupervisor() {
            let postData = this.$common.methods.JSONUtils.toJsonObject(this.supervisorSpecJson)
            try {
                const response = await this.$http.post(this.$common.apis.supervisor, postData, {
                    header: { ContentType: "application/json" }
                })
                this.createDialogVisible = false
                const successMessage = `${this.$t('message.supervisors.creatSuccess')}:${response.data.id}`
                this.$common.eventBus.$emit('updateAllSupervisors')
                this.$message({
                    showClose: true,
                    message: successMessage,
                    duration: 0,
                    type: 'success'
                })
                this.supervisorSpecJson = ''
            } catch (err) {
                const errorMessage = `${this.$t('message.supervisors.createFailedFront')}: ${err.status}, ${this.$t('message.supervisors.createFailedLast')}`
                this.$message({
                    showClose: true,
                    message: errorMessage,
                    duration: 0,
                    type: 'error'
                })
            }
        },
        async getCompleteSupervisors() {
            const countUrl = `${this.$common.apis.supervisor}/history/count`
            const countResponse = await this.$http.get(countUrl)
            this.totalNum = countResponse.data.total
            if (this.totalNum === 0) {
                this.hasData = false
                return
            }
            this.hasData = true
            const url = `${this.$common.apis.supervisor}/history/part`
            const { data } = await this.$http.get(url, {
                params: {
                    offset: (this.currentPage - 1) * this.pageSize,
                    size: this.pageSize
                }
            })
            let _data = data.map(s => {
                let supervisor = {
                    id: s.id,
                    version: s.detail.version,
                    type: s.detail.spec.type,
                    topic: s.detail.spec.ioConfig.topic,
                    taskDuration: s.detail.spec.ioConfig.taskDuration
                }
                return supervisor
            })

            this.completeSupervisors = []
            this.$common.methods.pushData(_data, this.completeSupervisors)
        },
        async getShowSupervisors(currentPage, pageSize, sortDimension, isDescending) {
            let paramsData = {
                offset: (currentPage - 1) * pageSize,
                size: pageSize
            }
            if (_.isEqual(this.sortDimension, 'version')) {
                paramsData.sortDimension = 'created_date'
                paramsData.isDescending = this.isDescending
            }
            if (this.isSearching) {
                if (!_.isEqual(this.formInline.searchValue1, '')) {
                    paramsData.searchDimension1 = 'spec_id'
                    paramsData.searchValue1 = this.formInline.searchValue1
                }
            }

            const url = `${this.$common.apis.supervisor}/history/part`
            const { data } = await this.$http.get(url, {
                params: paramsData
            })
            let _data = data.map(s => {
                let supervisor = {
                    id: s.id,
                    version: s.detail.version,
                    type: s.detail.spec.type,
                    topic: s.detail.spec.ioConfig.topic,
                    taskDuration: s.detail.spec.ioConfig.taskDuration
                }
                return supervisor
            })

            this.completeSupervisors = []
            this.$common.methods.pushData(_data, this.completeSupervisors)

        },
        async onSearch() {
            let paramsData = {}
            if (!_.isEqual(this.formInline.searchValue1, '')) {
                paramsData.searchDimension1 = 'spec_id'
                paramsData.searchValue1 = this.formInline.searchValue1
            }

            const countUrl = `${this.$common.apis.supervisor}/history/count`
            const countResponse = await this.$http.get(countUrl, { params: paramsData })
            this.totalNum = countResponse.data.total

            this.isSearching = true
            this.currentPage = 1
            this.getShowSupervisors(this.currentPage, this.pageSize, this.sortDimension, this.isDescending)

        },
        sortChange(column, prop, order) {
            if (null === column.order) {
                return
            }
            this.sortDimension = column.prop
            this.isDescending = column.order === "ascending" ? false : true
            this.getShowSupervisors(this.currentPage, this.pageSize, this.sortDimension, this.isDescending)
        },
        handleCurrentChange(newValue) {
            this.currentPage = newValue
            this.getShowSupervisors(this.currentPage, this.pageSize, this.sortDimension, this.isDescending)
        },
        handleSizeChange(newValue) {
            this.pageSize = newValue
            this.getShowSupervisors(this.currentPage, this.pageSize, this.sortDimension, this.isDescending)
        }
    },
    mounted() {
        let self = this
        this.$common.eventBus.$on("updateAllSupervisors", () => {
            self.init()
        })
        this.$common.eventBus.$on("updateCompleteSupervisors", () => {
            self.init()
        })
    }
}
</script>