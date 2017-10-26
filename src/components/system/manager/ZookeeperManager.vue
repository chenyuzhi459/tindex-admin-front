<template>
    <el-row :gutter="20">
        <el-col :span="12">
            <el-form label-position="top" label-width="80px" >
               
                <el-form-item :label="$t('message.zkManager.treeSubTitile')">
                      <el-tree :data="treeData" :props="props" node-key="path" @node-expand="handleNodeExpand" 
                        :render-content="renderContent" @node-collapse="handleNodeCollapse">
                        </el-tree>
                </el-form-item>

            </el-form>
        </el-col>
        <el-col :span="12">
            <el-form label-position="top" label-width="80px" >
                <el-form-item :label="$t('message.zkManager.path')">
                    <el-input v-model="currPath"></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.zkManager.dataSubTitle')">
                     <el-input type="textarea" :autosize="{ minRows: 12.7, maxRows: 25 }" v-model="currData">
                    </el-input>
                </el-form-item>

            </el-form>

        </el-col>
    </el-row>
</template>

<script>
let id = 1000;
import _ from 'lodash'
export default {
    data() {
        return {
            treeData: [],

            props: {
                label: 'name',
                children: 'children'
            },
            count: 1,
            rootData: '',
            currData: '',
            currPath:''
        };
    },

    created: function() {
        this.init()
    },
    methods: {
        init() {
            this.getHeadChildrenAndData()
        },
        async getHeadChildrenAndData() {
            this.currData = (await this.getSummaryInfo("/")).sourceData
            this.currPath = "/"
            const children = await this.getChildren("/")
            const len = children.length
            for (let i = 0; i < len; i++) {
                children[i].children = [{}]
                this.treeData.push(children[i])
            }
        },

        async getSummaryInfo(path) {
            const url = `${this.$common.apis.zk}/summary/info`
            const { data } = await this.$http.get(url, {
                params: {
                    path: path
                }
            })
            console.log("data:", data);
            return data
        },

        async getChildren(path) {
            const url = `${this.$common.apis.zk}/children`
            const { data } = await this.$http.get(url, {
                params: {
                    path: path
                }
            })
            let retVal = []
            path = path.lastIndexOf("/") === path.length - 1 ? path.substring(0, path.length - 1) : path
            const len = data.length
            for (let i = 0; i < len; i++) {
                let obj = {}
                obj.path = `${path}/${data[i]}`
                obj.name = data[i]
                obj.nodeType = ''
                obj.children = [{}]
                retVal.push(obj)

            }
            return retVal
        },

        async handleNodeExpand(data) {
            this.currPath = data.path

            const summaryInfo = await this.getSummaryInfo(data.path)
            this.currData = summaryInfo.sourceData
            data.nodeType = summaryInfo.nodeType
            data.children = await this.getChildren(data.path)
            console.log("node:", data);

        },

        handleNodeCollapse(data, node, ref){
            data.children=[{}]
            console.log(node, 'node====', ref);
        },

        async loadNode(node, resolve) {
            node.data.zkData = await this.getSummaryInfo(node.data.path)
            node.data.children = await this.getChildren(node.data.path)
            resolve(node.data.children)
        },

        append(store, data) {
            store.append({ id: id++, label: 'testtest', children: [] }, data);
        },

        remove(store, data) {
            store.remove(data);
        },

        renderContent(h, { node, data, store }) {
            return (
                <span>
                    <span>
                        <span>{node.label}  
                        {node.data.nodeType==='ephemeral' ? <el-badge  is-dot class="item"></el-badge> : null}
                        </span>
                    </span>
                </span>)
        }
    }
}
</script>
<style>
.item {
  margin-top: 2px;
  margin-right: 40px;
}
</style>
