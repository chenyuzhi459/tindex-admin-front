<template>
    <div class="main">

        <div style=" margin-left:20px;">
            <span style="color: #242f42;font-size:20px;">
                <b>Running Tasks</b>
            </span>
            <br></br>
        </div>
        <div class="table" style=" margin-left:20px;">
            <el-table :data="runnigTasks" border stripe style="width: 100%">
                <el-table-column prop="id" label="id" min-width="150"></el-table-column>
                <el-table-column prop="createdTime" label="createdTime" width="207"></el-table-column>
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
            <br>
        </div>

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
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>


<script>
export default {
    data() {
        return {
            runnigTasks: [],
            taskInfo: {},
            taskStatus: {},
            dialogMessage: '',
            dialogTitle: '',
            dialogSize: 'full',
            dialogInputAutosize: {},
            dialogVisible: false
        }
    },
    created: function() {
        this.init()
    },
    methods: {
        init() {
            this.getRunningTasks()
        },
        getRunningTasks() {
            this.$http.get(this.$common.apis.runnigTasks).then(response => {
                var convertData = (response.data.map(s => {
                    if (undefined != s.location) {
                        s.location = s.location.host + ":" + s.location.port
                        return s
                    }
                }))
                this.runnigTasks = []
                this.$common.methods.pushData(convertData, this.runnigTasks)
            })
        },
        getTaskInfo(taskId) {
            var url = this.$common.apis.baseTaskUrl + "/" + taskId
            this.$http.get(url).then(response => {
                this.taskInfo = response.data
                var message = JSON.stringify(this.taskInfo, null, 2)
                // alert(message)
                this.configDialog("Task Payload", message, true, "small", { minRows: 15, maxRows: 25 })
            })
        },
        getTaskStatus(taskId) {
            var url = this.$common.apis.baseTaskUrl + "/" + taskId + "/status"
            this.$http.get(url).then(response => {
                alert(response.data)
                this.taskStatus = response.data
                var message = JSON.stringify(this.taskStatus, null, 2)
                this.configDialog("Task Status", message, true, "small", {})
            })
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

        killTask(taskId) {
            var remindMessage = "Do you really want to kill:" + "\n" + taskId.substring(0, 45)
                + "\n" + taskId.substring(45)
            this.$confirm(remindMessage, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                closeOnClickModal: false,
                type: 'warning'
            }).then(() => {
                var url = this.$common.apis.baseTaskUrl + "/" + taskId + "/shutdown"
                this.$http.post(url).then(
                    response => {
                        window.setTimeout(this.init, 200)
                        //this.init()
                        this.$common.eventBus.$emit('updataCompleteTasks')
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        })
                    }, response => {
                        console.log('fail to kill')
                    })
            }).catch(() => {

            })
        },
    },
    mounted() {
        var self = this
        this.$common.eventBus.$on("updataAllTasks", () => {
            self.init()
        })
        this.$common.eventBus.$on("updataRunningTasks", () => {
            self.init()
        })
    }
}
</script>