<template>
<div class="table">
  <div style=" margin-left:20px;">
        <span style="color: #242f42;font-size:20px;" ><b>Complete Tasks - Tasks recently completed</b>
        </span>
        <br></br>
    </div>
     <!-- <div class="handle-box" style=" margin-left:20px;">
        <el-select v-model="select_cate" placeholder="筛选省份" class="handle-select mr10">
                <el-option key="1" label="id" value="id"></el-option>
                <el-option key="2" label="status" value="status"></el-option>
        </el-select>
        <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10" width="100px"></el-input>
        <el-button type="primary" icon="search" @click="search">搜索</el-button>
    </div>  -->
     <div style=" margin-left:20px;"> <el-button type="primary" size="small" @click="init">刷新</el-button>
            <br></br>
        </div>  
     <div class="table" style=" margin-left:20px;">
        <el-table :data="showTableData" border stripe style="width: 100%">
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
        <div class="pagination">
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[5,10, 25, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="completeTasks.length">
            </el-pagination>
        </div>
        
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
    <el-input type="textarea" :autosize="dialogInputAutosize" v-model="dialogMessage" >
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
  data () {
    return {
      completeTasks:[],
      showTableData:[],
      taskInfo:{},
      taskStatus:{},
      dialogMessage:'',
      dialogTitle:'',
      dialogSize:'full',
      dialogInputAutosize:{},
      dialogVisible:false,
      currentPage:1,
      pageSize:10
    }
  },

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
        var url = "{0}/{1}/log?offset={2}".format(this.$common.apis.baseTaskUrl,taskId,offset)
        window.open(url)
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
                var convertData = response.data.map(s=>{
                    if(null === s.topic){
                        s.topic = 'null'
                    }
                })
                this.completeTasks = []
                this.$common.methods.pushData(response.data,this.completeTasks)
                this.fillShowTableData(this.completeTasks)
        })
      },
      handleCurrentChange(newValue){
        this.currentPage = newValue
        this.fillShowTableData(this.completeTasks)
      },
      handleSizeChange(newValue){
        this.pageSize = newValue
        this.fillShowTableData(this.completeTasks)
      },
      fillShowTableData(originData){ 
        this.showTableData = []
        var position = (this.currentPage -1) * this.pageSize 
        var limit = (position + this.pageSize) >=　originData.length ? originData.length - position : this.pageSize;
        for(var i=0;i<limit;i++){
            this.showTableData.push(originData[position + i ])
        }
      }
  },
   mounted(){
      var self = this
      this.$common.eventBus.$on("updataAllTasks",()=>{
          self.init()
      })
      this.$common.eventBus.$on("updataCompleteTasks",()=>{
          self.init()
      })
  }
}
</script>