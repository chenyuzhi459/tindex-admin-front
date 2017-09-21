<template>
  <div class="main">
    <div style=" margin-left:20px;">
        <span style="color: #242f42;font-size:20px;" ><b>Intervals</b></span>
        <br></br>
    </div>

    <div style=" margin-left:20px;"> <el-button type="primary" size="small" @click="init">刷新</el-button>
        <br></br>
    </div> 

    <div class="table" style=" margin-left:20px;">

        <el-table :data="showTableData" border style="width: 100%" ref="multipleTable">
            <el-table-column prop="name" label="name" sortable ></el-table-column>
            <el-table-column label="操作" width="200">
                <template scope="scope" >
                    <el-button size="mini" @click="getIntervalInfo(scope.row.name)">info</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div class="pagination">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[5, 10, 15, 25, 50, 100]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="intervals.length">
            </el-pagination>
        </div>
    </div>

  </div>  
</template>

<script>
    export default {
        data() {
            return {
                intervals: [],
                showTableData: [],
                pageSize:15,
                currentPage:1
            }
        },
        created:function(){
          this.init()
        },
        methods: {
          init(){
            this.getIntervals()
          },

          // getSegments(dataSourceName){
          //   this.$router.push(
          //     {path: '/interval', query: {dataSourceName: dataSourceName}}
          //   )
          // },
          getIntervals(){
            var url = this.$common.apis.dataSource + "/" + this.$route.query.dataSourceName + "/intervals"
            console.log(url)
            this.$http.get(url).then(response => {
                var convertData = new Array()
                for(var i=0,len=response.data.length; i<len; i++){
                  var map = new Map()
                  map['name'] = response.data[i]
                  convertData[i] = map
                }
                this.intervals = []
                this.$common.methods.pushData(convertData,this.intervals)
                this.fillShowTableData()
            })
          },

          fillShowTableData(){ 
            this.showTableData = []
            var position = (this.currentPage -1) * this.pageSize 
            var limit = (position + this.pageSize) >=　this.intervals.length ? this.intervals.length - position : this.pageSize;
            for(var i=0;i<limit;i++){
                this.showTableData.push(this.intervals[position + i ])
            }
          },

          handleCurrentChange(newValue){
            this.currentPage = newValue
            this.fillShowTableData()
          },
          handleSizeChange(newValue){
            this.pageSize = newValue
            this.fillShowTableData()
          }
        }
    }
</script>

<style scoped>
.handle-box{
    margin-bottom: 20px;
}
.handle-select{
    width: 120px;
}
.handle-input{
    width: 300px;
    display: inline-block;
}
</style>