<<template>
<div>
    <running-tasks></running-tasks>
    <pending-tasks></pending-tasks>
    <complete-tasks></complete-tasks>
    <div style=" margin-left:20px;">
        <el-button type="primary" size="small" @click="showCreateTaskDialog">Create Task</el-button>
    </div>

    <el-dialog  :visible.sync="createTaskDialogVisible" size="small" title="Task Json" :close-on-click-modal="false">
        <el-button type="primary" @click="format">format</el-button> 
        <span style="color: red" v-if="jsonSyntaxError">json格式错误</span>
        <br></br>             
        <el-input type="textarea" :rows="25" v-model="taskJson">
        </el-input>
        <span slot="footer" class="dialog-footer">
                <el-button @click="createTaskDialogVisible = false">取 消</el-button> 
            <el-button type="primary" @click="creatTask()">创 建</el-button>
        </span>
    </el-dialog>
</div>
</template>
<<script>

import RunningTasks from './taskmanager/RunningTasks'
import CompleteTasks from './taskmanager/CompleteTasks'
import PendingTasks from './taskmanager/PendingTasks'
export default {
  data () {
    return {
      jsonSyntaxError: false,
      createTaskDialogVisible:false,
      taskJson:''
    }
  },
  components:{
      'running-tasks': RunningTasks,
      'complete-tasks': CompleteTasks,
      'pending-tasks': PendingTasks
  },
  methods:{
    format(){
        var jsonObject
        try{
            jsonObject = JSON.parse(this.taskJson);
        }catch(e){
            if(e.name ==="SyntaxError"){
                this.jsonSyntaxError = true
            }
            return
        }
        if(typeof jsonObject === "object"){
            this.taskJson = JSON.stringify(jsonObject,null,2);
            this.jsonSyntaxError = false
        }
        //console.log('format:',this.dialogMessage)
    },
    showCreateTaskDialog(){
        this.createTaskDialogVisible = true
    },
    creatTask(){
        var postData = JSON.parse(this.taskJson)
        this.$http.post(this.$common.apis.baseTaskUrl,postData,{
                                                header:{ContentType:"application/json"}
                                            }
                        ).then(response =>{
                            this.createTaskDialogVisible = false
                            this.$common.eventBus.$emit('updataRunningTasks')
                            //this.init()
                            this.$message({
                                showClose: true,
                                message: successMessage,
                                type: 'success'
                            })
                            this.taskJson = ''
                        },
                        response =>{
                            var errorMessage = 'request failed with status: ' + response.status + ' please check overlord logs'
                            this.$message({
                                showClose: true,
                                message: errorMessage,
                                duration:0,
                                type: 'error'
                            })
                        }
                        )
    },
  }
}
</script>
