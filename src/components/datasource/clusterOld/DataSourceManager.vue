<template>
  <div class="main">
    <div style=" margin-left:20px;">
      <span style="color: #242f42;font-size:20px;">
        <!-- <el-tabs v-model="activeName" @tab-click="clickSelect">
            <el-tab-pane :label=" $t('message.dataSource.dataSourceTitle') " name="dataSourceSelect">
              <my-datasource :active-name.sync="activeName"></my-datasource>
            </el-tab-pane>
            <el-tab-pane :label="intervalTitle" name="intervalSelect">
              <my-interval :active-name="activeName"></my-interval>
            </el-tab-pane>
            <el-tab-pane :label="segmentTitle" name="segmentSelect">
              <my-segment :active-name.sync="activeName"></my-segment>
            </el-tab-pane>
          </el-tabs> -->
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/ChildDataSource' }">{{$t('message.dataSource.dataSourceTitle')}}</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/ChildInterval' }">{{$t('message.interval.intervalTitle')}}</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/ChildSegment' }">{{$t('message.segment.segmentTitle')}}</el-breadcrumb-item>
        </el-breadcrumb>
      </span>
    </div>
  </div>
</template>

<script>

import DataSource from './DataSource'
import Interval from './Interval'
import Segment from './Segment'
export default {
  data() {
    return {
      activeName: "dataSourceSelect",
      // intervalDisabled: true,
      // segmentDisabled: true,
      intervalTitle: '',
      segmentTitle: ''
    }
  },
  components: {
    'my-datasource': DataSource,
    'my-interval': Interval,
    'my-segment': Segment
  },
  methods: {
    clickSelect(tab) {

      if (tab.name === "dataSourceSelect") {
        this.$common.eventBus.$emit('getAllDataSources', 'dataSource')
        this.intervalTitle = ''
        this.segmentTitle = ''
      } else if (tab.name === "intervalSelect") {
        this.$common.eventBus.$emit('getAllIntervals', 'dataSource')
        this.segmentTitle = ''
      }
    },
  },
  mounted() {
    let self = this
    this.$common.eventBus.$on("activeNameDataSource", () => {
      self.activeName = "dataSourceSelect"
    })
    this.$common.eventBus.$on("activeNameInterval", () => {
      this.intervalTitle = this.$t('message.interval.intervalTitle')
      self.activeName = "intervalSelect"
    })
    this.$common.eventBus.$on("activeNameSegment", () => {
      this.segmentTitle = this.$t('message.segment.segmentTitle')
      self.activeName = "segmentSelect"
    })
  }
}
</script>
