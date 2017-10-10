<template>
  <div class="main">
    <div style=" margin-left:20px;">
      <span style="color: #242f42;font-size:20px;">
        <b>{{$t('message.systemConfig.systemConfigTitle')}}</b>
      </span>
      <br></br>
    </div>

    <div class="form-box">
      <el-form ref="form" :model="form" label-width="150px">
        <el-form-item label="broker ip">
          <el-input v-model="form.brokerIp"></el-input>
        </el-form-item>
        <el-form-item label="coordinator ip">
          <el-input v-model="form.coordinatorIp"></el-input>
        </el-form-item>
        <el-form-item label="historicals ip">
          <el-input v-model="form.historicalsIp"></el-input>
        </el-form-item>
        <el-form-item label="middleManager ip">
          <el-input v-model="form.middleManagerIp"></el-input>
        </el-form-item>
        <el-form-item label="overlord ip">
          <el-input v-model="form.overlordIp"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onConfirm">{{$t('message.common.confirm')}}</el-button>
          <el-button @click="onCancle">{{$t('message.common.cancle')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
  </div>
</template>
  
<script>
export default {
  data: function() {
    return {
      form: {
        brokerIp: '',
        coordinatorIp: '',
        historicalsIp: '',
        middleManagerIp: '',
        overlordIp: ''
      },

    }
  },
  created: function() {
    this.init()
  },

  methods: {
    init() {
      this.getIps()
    },

    async getIps() {
      const url = `${this.$common.apis.systemConfig}`
      console.log(url)
      const response = await this.$http.get(url)
      this.form.brokerIp = response.data["broker_ip"]
      this.form.coordinatorIp = response.data["coordinator_ip"]
      this.form.historicalsIp = response.data["historicals_ip"]
      this.form.middleManagerIp = response.data["middleManager_ip"]
      this.form.overlordIp = response.data["overlord_ip"]
    },

    onCancle() {
      this.getIps()
    },
    async onConfirm() {
      const remindMessage = `${this.$t('message.systemConfig.updateConfig')}`
      try {
        const response = await this.$confirm(remindMessage, this.$t('message.common.warning'), {
          confirmButtonText: this.$t('message.common.confirm'),
          cancelButtonText: this.$t('message.common.cancle'),
          closeOnClickModal: false,
          type: 'warning'
        })
        try {
          const url = `${this.$common.apis.systemConfig}`
          var map = {
            broker_ip: this.form.brokerIp,
            coordinator_ip: this.form.coordinatorIp,
            historicals_ip: this.form.historicalsIp,
            middleManager_ip: this.form.middleManagerIp,
            overlord_ip: this.form.overlordIp
          }
          const updateResponse = await this.$http.post(url, JSON.stringify(map))
          window.setTimeout(this.init, 500)
          // this.init
          console.log(this.form.brokerIp)
          this.$message({
            type: 'success',
            message: this.$t('message.common.updateSuccess')
          })
        } catch (err) {
          this.$message({
            type: 'warning',
            message: this.$t('message.common.updateFail')
          })
        }
      } catch (e) {
      }
    },

    strMapToObj(strMap) {
      let obj = Object.create(null);
      for (let [k, v] of strMap) {
        obj[k] = v;
      }
      return obj;
    }



  }
}
</script>