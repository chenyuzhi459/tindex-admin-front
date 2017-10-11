<template>
  <div class="main">

    <div class="table" style=" margin-left:20px;">
      <el-table :data="servers" border stripe style="width: 100%" @expand="expand">
        <el-table-column type="expand">
          <template scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item :label="$t('message.common.type')">
                <span>{{ props.row.type }}</span>
              </el-form-item>
              <el-form-item :label="$t('message.serversInfo.tier')">
                <span>{{ props.row.tier }}</span>
              </el-form-item>
              <el-form-item :label="$t('message.serversInfo.priority')">
                <span>{{ props.row.priority }}</span>
              </el-form-item>
              <el-form-item :label="$t('message.serversInfo.currSize')">
                <span>{{ props.row.currSize }}</span>
              </el-form-item>
              <el-form-item :label="$t('message.serversInfo.maxSize')">
                <span>{{ props.row.maxSize }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="server" :label="$t('message.serversInfo.servers')"></el-table-column>
        <el-table-column :label="$t('message.common.operation')"  width="100">
          <template scope="scope">
            <el-button size="mini" @click="getSegments(scope.row.server)">{{$t('message.serversInfo.segments')}}</el-button>
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
      const { data } = await this.$http.get(this.$common.apis.serversInfo)

      this.servers = data.map(s => {
        let data = {
          host: '',
          tier: '',
          type: '',
          priority: '',
          currSize: '',
          maxSize: '',
          server: s
        }
        return data
      })
      //console.log("data:", this.servers);
    },
    async expand(row, expanded) {
      if (expanded) {
        const url = `${this.$common.apis.serversInfo}/${row.server}`
        const { data } = await this.$http.get(url, {
          params: {
            simple: true
          }
        })
        this.$common.methods.fillObject(data, row)
      }
    },
    getSegments(serverName){
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

<style>
.demo-table-expand {
  font-size: 0;
}

.demo-table-expand label {
  width: 70px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 30%;
}
</style>
