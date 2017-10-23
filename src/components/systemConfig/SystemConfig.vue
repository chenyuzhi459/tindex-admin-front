<template>
  <div class="main">
    <div>
      <div style=" margin-left:20px;">
        <span style="color: #242f42;font-size:20px;">
          <b>{{$t('message.systemConfig.druidConfig')}}</b>
        </span>
        <br></br>
      </div>

      <div class="form-box">
        <el-form ref="form" :model="form" label-width="150px">
          <el-form-item label="broker ip">
            <el-input v-model="form.druidProperties.brokerIp"></el-input>
          </el-form-item>
          <el-form-item label="coordinator ip">
            <el-input v-model="form.druidProperties.coordinatorIp"></el-input>
          </el-form-item>
          <el-form-item label="historicals ip">
            <el-input v-model="form.druidProperties.historicalsIp"></el-input>
          </el-form-item>
          <el-form-item label="middleManager ip">
            <el-input v-model="form.druidProperties.middleManagerIp"></el-input>
          </el-form-item>
          <el-form-item label="overlord ip">
            <el-input v-model="form.druidProperties.overlordIp"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div>
      <div style=" margin-left:20px;">
        <span style="color: #242f42;font-size:20px;">
          <b>{{$t('message.systemConfig.kafkaConfig')}}</b>
        </span>
        <br></br>
      </div>
      <div class="form-box">
        <el-form ref="form" :model="form" label-width="150px">
          <el-form-item label="kafka.cluster.id">
            <el-input v-model="form.kafkaProperties.kafkaClusterId"></el-input>
          </el-form-item>
          <el-form-item label="bootstrap.servers">
            <el-input v-model="form.kafkaProperties.bootstrapServers"></el-input>
          </el-form-item>
          <el-form-item label="auto.offset.reset">
            <el-input v-model="form.kafkaProperties.autoOffsetReset"></el-input>
          </el-form-item>
          <el-form-item label="enable.auto.commit">
            <el-input v-model="form.kafkaProperties.enableAutoCommit"></el-input>
          </el-form-item>
          <el-form-item label="key.deserializer">
            <el-input v-model="form.kafkaProperties.keyDeserializer"></el-input>
          </el-form-item>
          <el-form-item label="value.deserializer">
            <el-input v-model="form.kafkaProperties.valueDeserializer"></el-input>
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
        druidProperties: {
          brokerIp: "",
          coordinatorIp: "",
          historicalsIp: "",
          middleManagerIp: "",
          overlordIp: ""
        },
        kafkaProperties: {
          kafkaClusterId: "",
          bootstrapServers: "",
          autoOffsetReset: "",
          enableAutoCommit: "",
          keyDeserializer: "",
          valueDeserializer: ""
        }
      },
    };
  },
  created: function() {
    this.init();
  },

  methods: {
    init() {
      this.getIps();
    },

    async getIps() {
      const url = `${this.$common.apis.systemConfig}`;
      console.log(url);
      const response = await this.$http.get(url);
      const druidProperties = await response.data["druid.properties"];
      this.form.druidProperties.brokerIp = druidProperties["broker_ip"];
      this.form.druidProperties.coordinatorIp = druidProperties["coordinator_ip"];
      this.form.druidProperties.historicalsIp = druidProperties["historicals_ip"];
      this.form.druidProperties.middleManagerIp = druidProperties["middleManager_ip"];
      this.form.druidProperties.overlordIp = druidProperties["overlord_ip"];

      const kafkaProperties = await response.data["kafka.properties"];
      this.form.kafkaProperties.kafkaClusterId = kafkaProperties["kafka.cluster.id"];
      this.form.kafkaProperties.bootstrapServers = kafkaProperties["bootstrap.servers"];
      this.form.kafkaProperties.autoOffsetReset = kafkaProperties["auto.offset.reset"];
      this.form.kafkaProperties.enableAutoCommit = kafkaProperties["enable.auto.commit"];
      this.form.kafkaProperties.keyDeserializer = kafkaProperties["key.deserializer"];
      this.form.kafkaProperties.valueDeserializer = kafkaProperties["value.deserializer"];

      let allPropertiesMap = {}
      allPropertiesMap['druid.properties'] = druidProperties
      allPropertiesMap['kafka.properties'] = kafkaProperties
      this.allProperties = allPropertiesMap
      console.log(this.form,"form")
    },

    onCancle() {
      this.getIps();
    },
    async onConfirm() {
      const remindMessage = `${this.$t("message.systemConfig.updateConfig")}`;
      try {
        const response = await this.$confirm(
          remindMessage,
          this.$t("message.common.warning"),
          {
            confirmButtonText: this.$t("message.common.confirm"),
            cancelButtonText: this.$t("message.common.cancle"),
            closeOnClickModal: false,
            type: "warning"
          }
        );
        try {
          const url = `${this.$common.apis.systemConfig}`;

          let allProperties = {};
          let druidProperties = {};
          druidProperties["broker_ip"] = this.form.druidProperties.brokerIp;
          druidProperties["coordinator_ip"] = this.form.druidProperties.coordinatorIp;
          druidProperties["historicals_ip"] = this.form.druidProperties.historicalsIp;
          druidProperties["middleManager_ip"] = this.form.druidProperties.middleManagerIp;
          druidProperties["overlord_ip"] = this.form.druidProperties.overlordIp;
          allProperties["druid"] = druidProperties;

          // let kafkaProperties = {}
          // kafkaProperties[""] = this.form.


          console.log(allProperties,"post")
          const updateResponse = await this.$http.post(url, allProperties);
          window.setTimeout(this.init, 500);
          this.$message({
            type: "success",
            message: this.$t("message.common.updateSuccess")
          });
        } catch (err) {
          this.$message({
            type: "warning",
            message: this.$t("message.common.updateFail")
          });
        }
      } catch (e) {}
    }

    // strMapToObj(strMap) {
    //   let obj = Object.create(null);
    //   for (let [k, v] of strMap) {
    //     obj[k] = v;
    //   }
    //   return obj;
    // }
  }
};
</script>