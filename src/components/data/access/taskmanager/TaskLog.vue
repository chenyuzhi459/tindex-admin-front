<template>
  <div class="main">
    {{taskLog}}
    
  </div>
</template>

<script>
export default {
  //name: 'serversInfo',
  data () {
    return {
      taskLog:''
    }
  },
  created:function(){
    this.getTaskLog();
  },
  methods: { 
      getTaskLog(){
          console.log("getTaskLog")
          var url = this.$common.apis.baseTaskUrl + "/" + this.$route.params.taskId + "/log"
          this.$http.get(url).then(response => {
                this.taskLog = response.data
                console.log('data:',this.taskLog)
            }, function(response){
                console.log('error')
            })
      }
  }
}
</script>