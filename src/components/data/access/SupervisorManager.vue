<template>

    <div>
        
        <div style="float:right;  margin-left:20px;">
            <el-button type="primary" size="small" @click="createDialogVisible = true">{{$t('message.supervisors.createSupervisor')}}</el-button>
            <br>
            <br>
        </div>
        <running-supervisors></running-supervisors>
        <complete-supervisors></complete-supervisors>

        <el-dialog :visible.sync="createDialogVisible" size="small" :title="$t('message.supervisors.supervisorSpec')" :close-on-click-modal="false">
            <el-button type="primary" @click="format">{{$t('message.supervisors.format')}}</el-button>
            <span style="color: red" v-if="jsonSyntaxError">{{$t('message.supervisors.jsonSyntaxError')}}</span>
            <br></br>
            <el-input type="textarea" :rows="25" v-model="supervisorSpecJson">
            </el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="createDialogVisible = false">{{$t('message.supervisors.dialogCancel')}}</el-button>
                <el-button type="primary" @click="createSupervisor()">{{$t('message.supervisors.createDialogConfirm')}}</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>

import RunningSupervisors from './supervisorManager/RunningSupervisors'
import CompleteSupervisors from './supervisorManager/CompleteSupervisors'
export default {
    data() {
        return {
            jsonSyntaxError: false,
            createDialogVisible: false,
            supervisorSpecJson: ''
        }
    },
    components: {
        'running-supervisors': RunningSupervisors,
        'complete-supervisors': CompleteSupervisors
    },
    methods: {
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
                this.$common.eventBus.$emit('updateRunningSupervisors')
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
        }
    }
}
</script>
