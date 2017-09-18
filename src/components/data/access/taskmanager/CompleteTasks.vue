<template>
    <div style=" margin-left:20px;">
        <span style="color: #242f42;font-size:20px;" ><b>Complete Tasks - Tasks recently completed</b></span>
        <br></br>
    </div>
     <div class="table" style=" margin-left:20px;">
        <el-table :data="completeTasks" border stripe style="width: 100%">
            <el-table-column prop="id" label="id" min-width="400"></el-table-column>
            <el-table-column prop="status" label="status" width="110"></el-table-column>
            <el-table-column sortable prop="createdTime" label="createdTime" width="207"></el-table-column>
            <el-table-column prop="duration" label="duration" width="110"></el-table-column>
            
            <el-table-column prop="topic" label="topic" width="207"></el-table-column>
            <el-table-column prop="offsets" label="offsets" width="150"></el-table-column>

            <el-table-column label="操作" width="275">
                <template scope="scope">
                    <el-button size="mini" @click="getTaskInfo(scope.row.id)">payload</el-button>
                    <el-button size="mini" @click="getTaskStatus(scope.row.id)">status</el-button>
                    <el-button size="mini" @click="getTasklog(scope.row.id,0)">log(all)</el-button>
                    <el-button size="mini" @click="getTasklog(scope.row.id,8192)">log(8kb)</el-button>
                </template>
            </el-table-column>
        </el-table>
        <br>
    </div> 

    <el-dialog  :visible.sync="dialogVisible" :size="dialogSize"  @close="dialogMessage = ''">
        <template slot="title">
            <div style=" line-height: 1;
                            font-size: 16px;
                            font-weight: 700;
                            color: #1f2d3d;">
                {{dialogTitle}}
            </div>       
        </template> 
    <el-input type="textarea" :autosize="dialogInputAutosize" v-model="dialogMessage" 
            v-loading="loading"
                element-loading-text="拼命加载中"  >
    </el-input>
    <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button> 
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
    </el-dialog>
</template>

<script>

export default {
  data () {
    return {
      runnigTasks:[],
      completeTasks:[],
      taskInfo:{},
      taskStatus:{},
      taskLog:'',
      dialogMessage:'',
      dialogTitle:'',
      dialogSize:'full',
      //autosize="{ minRows: 15, maxRows: 25}"
      dialogInputAutosize:{},
      dialogVisible:false,
      canFormatted:false,
      jsonSyntaxError: false,
      loading:false,
      createTaskDialogVisible:false,
      taskJson:''
    }
  },
//   computed:{
//      taskInfoJson(){
//          return JSON.stringify(this.taskInfo,null,2)
//      }
//   },
  created:function(){
    this.init()
  },
  methods: { 
      init(){
        this.getCompleteTasks()
      },
      getTaskInfo(taskId){
        var url = this.$common.apis.baseTaskUrl + "/" + taskId
        this.$http.get(url).then(response => {
            this.taskInfo = response.data
            var message = JSON.stringify(this.taskInfo,null,2)
            this.configDialog("Task Payload",message,true,"small",{minRows: 15, maxRows: 25})
        })
      },
      getTaskStatus(taskId){
        var url = this.$common.apis.baseTaskUrl + "/" + taskId + "/status"
        this.$http.get(url).then(response => {
            this.taskStatus = response.data
            var message = JSON.stringify(this.taskStatus,null,2)
            this.configDialog("Task Status",message,true,"small",{})
        })
      },
      getTasklog(taskId, offset){     
        this.dialogVisible = true
        this.loading = true
        var url = this.$common.apis.baseTaskUrl + "/" + taskId + "/log"
        this.$http.get(url,{params: {offset: offset}}).then(response => {
            this.taskLog = response.data
            var title = "Log(" + taskId  + ")"
            this.configDialog(title,this.taskLog,true,"full",{minRows: 15, maxRows: 37})
            this.loading = false
        },response => {
            this.loading = false
        })
      },
      configDialog(dialogTitle,dialogMessage,dialogVisible,dialogSize,dialogInputAutosize){
        this.dialogTitle = dialogTitle
        this.dialogMessage = dialogMessage
        this.dialogVisible = dialogVisible
        this.dialogSize = dialogSize
        this.dialogInputAutosize = dialogInputAutosize
      }, 
      getCompleteTasks(){
        this.$http.get(this.$common.apis.completeTasks).then(
            response => {
                this.completeTasks = []
                this.$common.methods.pushData(response.data,this.completeTasks)
                console.log('completeTasks:',this.completeTasks)
        })
      },
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
      }
   
  }
}
</script>