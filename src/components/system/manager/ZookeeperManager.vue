<template>
    <el-row :gutter="20">
        <el-col :span="12">
            <el-form label-position="top" label-width="80px" >
               
                <el-form-item :label="$t('message.zkManager.treeSubTitile')">
                      <el-tree :data="treeData" :props="props" node-key="path" @node-click="handleNodeClick"
                        :render-content="renderContent" >
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
            currData: '',
            currPath:'',
            maxShowNum:100
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
            this.treeData = await this.getChildren("/")
        },

        async getSummaryInfo(path) {
            const url = `${this.$common.apis.zk}/summary/info`
            const { data } = await this.$http.get(url, {
                params: {
                    path: path
                }
            })
            return data
        },

        async getChildren(path,currNode) {

            const url = `${this.$common.apis.zk}/children`
            const { data } = await this.$http.get(url, {
                params: {
                    path: path
                }
            })
            let retVal = []
            path = path.lastIndexOf("/") === path.length - 1 ? path.substring(0, path.length - 1) : path
            const len = currNode!==undefined && data.length > this.maxShowNum ? this.maxShowNum : data.length
            for (let i = 0; i < len; i++) {
                let obj = {}
                obj.path = `${path}/${data[i]}`
                obj.name = data[i]
                obj.nodeType = ''
                obj.children = [{}]
                retVal.push(obj)

            }
            if( currNode!==undefined && data.length > len ){
                currNode.data.allChildrenList = data
                currNode.data.allChildrenSize = data.length
    
                let checkMoreNode = {}
                checkMoreNode.nodeType = 'checkMoreNode'
                checkMoreNode.offset = len
                checkMoreNode.path = `${path}/checkMoreNode`
                checkMoreNode.name = this.$t('message.zkManager.checkMore')
                retVal.push(checkMoreNode)
            }
            return retVal
        },

        async handleNodeClick(data, node, ref){
            if(data.nodeType === 'checkMoreNode'){
                this.addMoreChildren(data,node,ref)
                return
            }
            if(node.expanded){
                await this.handleNodeExpand(data, node, ref)
            }else{
                await this.handleNodeCollapse(data, node, ref)
            }
            
        },

        async handleNodeExpand(data, node, ref) {
            this.currPath = data.path

            const summaryInfo = await this.getSummaryInfo(data.path)
            this.currData = summaryInfo.sourceData
            data.nodeType = summaryInfo.nodeType
            data.children = await this.getChildren(data.path,node)

        },

        handleNodeCollapse(data, node, ref){
            data.children=[{}]
        },

        addMoreChildren(data,node,ref){
            console.log("add more:",node);

            if((data.offset + this.maxShowNum)  <= node.parent.data.allChildrenSize){
                node.parent.data.children.splice(data.offset,1)
                const len = data.offset + this.maxShowNum
                for(let i = data.offset; i < len; i++){
                    let obj = {}
                    obj.path = `${node.parent.data.path}/${node.parent.data.allChildrenList[i]}`
                    obj.name = node.parent.data.allChildrenList[i]
                    obj.nodeType = ''
                    obj.children = [{}]
                    node.parent.data.children.push(obj)
                }
                data.offset = len
                node.parent.data.children.push(data)
            }else{
                node.parent.data.children.splice(data.offset,1)
                const len = node.parent.data.allChildrenSize
                for(let i = data.offset; i < len; i++){
                    let obj = {}
                    obj.path = `${node.parent.data.path}/${node.parent.data.allChildrenList[i]}`
                    obj.name = node.parent.data.allChildrenList[i]
                    obj.nodeType = ''
                    obj.children = [{}]
                    node.parent.data.children.push(obj)
                }
            }

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
            const template = ''
            return (
                <span>
                    <span>
                        <span>
                            {node.label === this.$t('message.zkManager.checkMore') ? <i  class="el-icon-plus"></i> : node.label}
                            {node.data.nodeType==='ephemeral' ? <el-badge  is-dot class="item"></el-badge> : null}
                            
                        </span>
                    </span>
                </span>
                )
        }
    }
}
</script>
<style>
.item {
  margin-top: 2px;
  margin-right: 40px;
}
.page {
    margin-left: 10px;
}
</style>
