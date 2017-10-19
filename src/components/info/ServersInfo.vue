<template>
  <div class="main">
    <span style=" margin-left:20px; color: #242f42;font-size:25px;">{{$t('message.serversInfo.title')}}
      
    </span>
    <br></br>
    <div class="table" style=" margin-left:20px;">
      <el-table :data="servers" border stripe style="width: 100%">
        <el-table-column prop="host" :label="$t('message.serversInfo.host')"></el-table-column>
        <el-table-column prop="type" :label="$t('message.common.type')"></el-table-column>
        <el-table-column prop="currSize" :label="$t('message.serversInfo.currSize')"></el-table-column>
        <el-table-column prop="maxSize" :label="$t('message.serversInfo.maxSize')"></el-table-column>
        <el-table-column prop="priority" :label="$t('message.serversInfo.priority')"></el-table-column>
        <el-table-column prop="tier" :label="$t('message.serversInfo.tier')"></el-table-column>
        <el-table-column :label="$t('message.common.operation')" width="100">
          <template scope="scope">
            <el-button size="mini" @click="getSegments(scope.row.host)">{{$t('message.serversInfo.segments')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

  </div>
</template>


<script>
export default {
  name: 'serversInfo',
  data() {
    return {
      servers: [],
    }
  },
  created: function() {
    this.getServersInfo();
  },
  methods: {
    async getServersInfo() {
      const { data } = await this.$http.get(this.$common.apis.serversInfo, {
        params: {
          simple: ''
        }
      })

      this.servers = data.map(s => {
        s.currSize = this.$common.methods.conver(s.currSize)
        s.maxSize = this.$common.methods.conver(s.maxSize)
        return s
      })
    },
    getSegments(serverName) {
      this.$router.push({
        name: 'serversSegment',
        params: {
          serverName: serverName
        }
      })
    }
  }

}
</script>

