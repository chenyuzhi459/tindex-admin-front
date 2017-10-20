<<template>
<div>
    <div style="float:right; margin-left:20px;">
        <el-button type="primary" size="small" @click="showCreateTaskDialog">{{$t('message.tasks.createTask')}}</el-button>
    </div>
    <running-tasks></running-tasks>
    <complete-tasks></complete-tasks>
    <pending-tasks></pending-tasks>
    <waiting-tasks></waiting-tasks>


    <el-dialog  :visible.sync="createTaskDialogVisible" size="small" :title="$t('message.tasks.taskSpec')" :close-on-click-modal="false">
        <span style="color: red" v-if="jsonSyntaxError">{{$t('message.tasks.jsonSyntaxError')}}</span>            
        <el-input type="textarea" :rows="25" v-model="taskJson">
        </el-input>
        <span slot="footer" class="dialog-footer">
            <el-button style="float:left" type="primary" @click="format">{{$t('message.tasks.format')}}</el-button> 
            <el-button @click="createTaskDialogVisible = false">{{$t('message.tasks.dialogCancel')}}</el-button> 
            <el-button type="primary" @click="creatTask()">{{$t('message.tasks.createDialogConfirm')}}</el-button>
        </span>
    </el-dialog>
</div>
</template>
<script>

import RunningTasks from './taskmanager/RunningTasks'
import CompleteTasks from './taskmanager/CompleteTasks'
import PendingTasks from './taskmanager/PendingTasks'
import WaitingTasks from './taskmanager/WaitingTasks'
export default {
    data() {
        return {
            jsonSyntaxError: false,
            createTaskDialogVisible: false,
            taskJson: ''
        }
    },
    components: {
        'running-tasks': RunningTasks,
        'complete-tasks': CompleteTasks,
        'pending-tasks': PendingTasks,
        'waiting-tasks': WaitingTasks
    },
    methods: {
        format() {
            let jsonObject
            try {
                jsonObject = this.$common.methods.JSONUtils.toJsonObject(this.taskJson);
            } catch (e) {
                if (e.name === "SyntaxError") {
                    this.jsonSyntaxError = true
                }
                return
            }
            if (typeof jsonObject === "object") {
                this.taskJson = this.$common.methods.JSONUtils.toString(jsonObject, null, 2)
                this.jsonSyntaxError = false
            }
        },
        showCreateTaskDialog() {
            this.createTaskDialogVisible = true
        },
        async creatTask() {
            let postData = this.$common.methods.JSONUtils.toJsonObject(this.taskJson)
            try {
                const response = await this.$http.post(this.$common.apis.baseTaskUrl, postData, {
                    header: { ContentType: "application/json" }
                })
                this.createTaskDialogVisible = false
                this.$common.eventBus.$emit('updateRunningTasks')
                this.$common.eventBus.$emit('updatePendingTasks')
                this.$common.eventBus.$emit('updateWaitingTasks')
                const successMessage = `${this.$t('message.tasks.creatSuccess')}:${response.data.task}`
                this.$message({
                    showClose: true,
                    message: successMessage,
                    duration: 0,
                    type: 'success'
                })
                this.taskJson = ''
            } catch (err) {
                const errorMessage = `${this.$t('message.tasks.createFailedFront')}: ${err.status}, ${this.$t('message.tasks.createFailedLast')}`
                this.$message({
                    showClose: true,
                    message: errorMessage,
                    duration: 0,
                    type: 'error'
                })
            }
        },
    }
}
</script>
