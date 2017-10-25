<style>
  .titleSpan {
    color: #242f42;
    font-size: 15px;
  }
</style>


<template>
  <div class="main">
    <div>
      <div style=" margin-left:20px;">
        <span class="titleSpan">
          <b>{{$t('message.systemConfig.druidConfig')}}</b>
        </span>
        <br></br>
      </div>

      <div class="form-box">
        <el-form ref="form" :model="form" label-width="150px">
          <el-form-item label="broker ip">
            <el-input v-model="form.druid_properties.broker_ip"></el-input>
          </el-form-item>
          <el-form-item label="coordinator ip">
            <el-input v-model="form.druid_properties.coordinator_ip"></el-input>
          </el-form-item>
          <el-form-item label="historicals ip">
            <el-input v-model="form.druid_properties.historicals_ip"></el-input>
          </el-form-item>
          <el-form-item label="middleManager ip">
            <el-input v-model="form.druid_properties.middleManager_ip"></el-input>
          </el-form-item>
          <el-form-item label="overlord ip">
            <el-input v-model="form.druid_properties.overlord_ip"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div>
      <div style=" margin-left:20px;">
        <span class="titleSpan">
          <b>{{$t('message.systemConfig.kafkaConfig')}}</b>
        </span>
        <br></br>
      </div>
      <div class="form-box">
        <el-form ref="form" :model="form" label-width="150px">
          <el-form-item label="kafka.cluster.id">
            <el-input v-model="form.kafka_properties.kafka_cluster_id"></el-input>
          </el-form-item>
          <el-form-item label="bootstrap.servers">
            <el-input v-model="form.kafka_properties.bootstrap_servers"></el-input>
          </el-form-item>
          <el-form-item label="auto.offset.reset">
            <el-input v-model="form.kafka_properties.auto_offset_reset"></el-input>
          </el-form-item>
          <el-form-item label="enable.auto.commit">
            <el-input v-model="form.kafka_properties.enable_auto_commit"></el-input>
          </el-form-item>
          <el-form-item label="key.deserializer">
            <el-input v-model="form.kafka_properties.key_deserializer"></el-input>
          </el-form-item>
          <el-form-item label="value.deserializer">
            <el-input v-model="form.kafka_properties.value_deserializer"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div>
      <div style=" margin-left:20px;">
        <span class="titleSpan">
          <b>{{$t('message.systemConfig.zkConfig')}}</b>
        </span>
        <br></br>
      </div>
      <div class="form-box">
        <el-form ref="form" :model="form" label-width="150px">
          <el-form-item label="zk.servers">
            <el-input v-model="form.zk_properties.zk_servers"></el-input>
          </el-form-item>
          <el-form-item label="connect.timeout">
            <el-input v-model="form.zk_properties.connect_timeout"></el-input>
          </el-form-item>
          <el-form-item label="retry.time">
            <el-input v-model="form.zk_properties.retry_time"></el-input>
          </el-form-item>
          <el-form-item label="retry.interval">
            <el-input v-model="form.zk_properties.retry_interval"></el-input>
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
        druid_properties: {
          broker_ip: "",
          coordinator_ip: "",
          historicals_ip: "",
          middleManager_ip: "",
          overlord_ip: ""
        },
        kafka_properties: {
          kafka_cluster_id: "",
          bootstrap_servers: "",
          auto_offset_reset: "",
          enable_auto_commit: "",
          key_deserializer: "",
          value_deserializer: ""
        },
        zk_properties: {
          zk_servers: "",
          connect_timeout: "",
          retry_time: "",
          retry_interval: "",
        },
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
      const response = await this.$http.get(url);
      const druidProperties = await response.data["druid.properties"];
      this.form.druid_properties.broker_ip = druidProperties["broker.ip"];
      this.form.druid_properties.coordinator_ip = druidProperties["coordinator.ip"];
      this.form.druid_properties.historicals_ip = druidProperties["historicals.ip"];
      this.form.druid_properties.middleManager_ip = druidProperties["middleManager.ip"];
      this.form.druid_properties.overlord_ip = druidProperties["overlord.ip"];

      const kafkaProperties = await response.data["kafka.properties"];
      this.form.kafka_properties.kafka_cluster_id = kafkaProperties["kafka.cluster.id"];
      this.form.kafka_properties.bootstrap_servers = kafkaProperties["bootstrap.servers"];
      this.form.kafka_properties.auto_offset_reset = kafkaProperties["auto.offset.reset"];
      this.form.kafka_properties.enable_auto_commit = kafkaProperties["enable.auto.commit"];
      this.form.kafka_properties.key_deserializer = kafkaProperties["key.deserializer"];
      this.form.kafka_properties.value_deserializer = kafkaProperties["value.deserializer"];

      const zkProperties = await response.data["zk.properties"];
      this.form.zk_properties.zk_servers = zkProperties["zk.servers"];
      this.form.zk_properties.connect_timeout = zkProperties["connect.timeout"]
      this.form.zk_properties.retry_time = zkProperties["retry.time"]
      this.form.zk_properties.retry_interval = zkProperties["retry.interval"]
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
          console.log(this.form,"form1")
          const updateResponse = await this.$http.post(url, this.form);
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