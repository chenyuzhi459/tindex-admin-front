<template>
  <div class="main">
    <div style=" margin-left:20px;">
      <span style="color: #242f42;font-size:20px;">
        <el-tabs v-model="activeName" @tab-click="clickSelect">
          <el-tab-pane :label=" $t('message.dataSource.dataSourceTitle') " name="dataSourceSelect">
            <my-datasource :active-name.sync="activeName"></my-datasource>
          </el-tab-pane>
          <el-tab-pane :label=" $t('message.segment.segmentTitle') " name="segmentSelect" :disabled="segmentDisabled">
            <my-segment :active-name.sync="activeName"></my-segment>
          </el-tab-pane>
        </el-tabs>
      </span>
    </div>
  </div>
</template>

<script>

import DataSource from './metadata/DataSource'
import Segment from './metadata/Segment'
export default {
  data() {
    return {
      activeName: "dataSourceSelect",
      segmentDisabled: true
    }
  },
  components: {
    'my-datasource': DataSource,
    'my-segment': Segment
  },
  methods: {
    clickSelect(tab) {
      if (tab.name === "dataSourceSelect") {
        this.$common.eventBus.$emit('getAllDataSources','dataSource')
      }
    },
  },
  mounted() {
    let self = this
    this.$common.eventBus.$on("activeNameDataSource", () => {
      self.activeName = "dataSourceSelect"
    })
    this.$common.eventBus.$on("activeNameSegment", () => {
      self.activeName = "segmentSelect"
      this.segmentDisabled = false
    })
  }
}
</script>
