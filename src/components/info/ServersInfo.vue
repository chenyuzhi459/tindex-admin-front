<template>
  <div class="main">

    <div class="table" style=" margin-left:20px;">
      <el-table :data="servers" border stripe style="width: 100%">
        <el-table-column prop="server" label="usedMemory"></el-table-column>
      </el-table>
    </div>

  </div>
</template>


<script>
export default {
  name: 'serversInfo',
  data() {
    return {
      servers: []
    }
  },
  created: function() {
    this.getServersInfo();
  },
  methods: {
    getServersInfo: function() {
      this.$http.get(this.$common.apis.serversInfo).then(response => {
        this.servers = response.data.map(s => {
          return { server: s }
        })
        //console.log('data:',this.servers)
      }, function(response) {
        console.log('error')
      })
    }
  }
}
</script>