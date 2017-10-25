<template>
    <div class="main">
        <span style="color: #242f42;font-size:25px;">{{$t('message.status.version')}}
            <b> {{statusData.version}}</b>
        </span>
        <br></br>

        <div style=" margin-left:20px;">
            <span style="color: #242f42;font-size:20px;">{{$t('message.status.module')}}</span>
            <br></br>
        </div>
        <div class="module" style=" margin-left:20px;">
            <el-table :data="statusData.modules" border stripe style="width: 100%">
                <el-table-column prop="name" :label="$t('message.status.name')">
                </el-table-column>
                <el-table-column prop="artifact" :label="$t('message.status.artifact')">
                </el-table-column>
                <el-table-column prop="version" :label="$t('message.status._version')" width="180">
                </el-table-column>
            </el-table>
        </div>
        <br><br>
        <div style=" margin-left:20px;">
            <span style="color: #242f42;font-size:20px;">{{$t('message.status.memory')}}</span>
            <br></br>
        </div>

        <div class="memory" style=" margin-left:20px;">
            <el-table :data="memeoryList" border stripe style="width: 100%">
                <el-table-column prop="usedMemory" :label="$t('message.status.usedMemory')"></el-table-column>
                <el-table-column prop="freeMemory" :label="$t('message.status.freeMemory')"></el-table-column>
                <el-table-column prop="totalMemory" :label="$t('message.status.totalMemory')"></el-table-column>
                <el-table-column prop="maxMemory" :label="$t('message.status.maxMemory')"></el-table-column>
            </el-table>
        </div>

    </div>
</template>

<script>
export default {
    name: 'status',
    data() {
        return {
            statusData: {
                version: "",
                modules: [],
                memory: {}
            },
            memeoryList: []
        }
    },

    created() {
        this.getStatus()
    },
    methods: {
        async getStatus() {
            const { data } = await this.$http.get(this.$common.apis.status)
            this.statusData = data
            this.statusData.memory.usedMemory = this.$common.methods.conver(this.statusData.memory.usedMemory)
            this.statusData.memory.freeMemory = this.$common.methods.conver(this.statusData.memory.freeMemory)
            this.statusData.memory.totalMemory = this.$common.methods.conver(this.statusData.memory.totalMemory)
            this.statusData.memory.maxMemory = this.$common.methods.conver(this.statusData.memory.maxMemory)
            this.memeoryList.push(this.statusData.memory)
        }
    }
}
</script>