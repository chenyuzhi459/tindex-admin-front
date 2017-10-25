<template>
    <el-tree :data="treeData" :props="props"  
    node-key="path"    @node-click="handleNodeClick" :render-content="renderContent">
    </el-tree>
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
            rootData:''
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
           
            this.rootData = await this.getData("/")

            const children = await this.getChildren("/")
            const len = children.length
            for(let i=0; i<len; i++){
                // children[i].children = await this.getChildren(children[i].path)
                children[i].children = [{}]
                this.treeData.push(children[i])
            }
            // console.log("first data:",data);
            console.log("first list:",children);
        },

        async getData(path){
            const url = `${this.$common.apis.zk}/data`
            const {data} = await this.$http.get(url, {
                params: {
                    path: path
                }
            })
            console.log("getData:",data.sourceData);
            return data.sourceData
        },

        async getChildren(path){
            const url = `${this.$common.apis.zk}/children`
            const { data } = await this.$http.get(url, {
                params: {
                    path: path
                }
            })
            let retVal  = []
            path = path.lastIndexOf("/") == path.length -1 ? path.substring(0,path.length -1) : path
            const len = data.length
            for(let i=0; i<len; i++){
                let obj = {}
                obj.path = `${path}/${data[i]}`
                obj.name = data[i]
                obj.zkData = ''
                obj.children = []
                retVal.push(obj)

            }
            return retVal
        },

        async handleNodeClick(data){
            
            data.zkData = await this.getData(data.path)
            console.log("name:",data.name);
            console.log("data.zkData:",data.zkData);
            console.log("treeData:",this.treeData);
            // const childrenUrl = `${this.$common.apis.zk}/children`
            // const childrenResponse = await this.$http.get(childrenUrl, {
            //     params: {
            //         path: data.path
            //     }
            // })
            data.children = await this.getChildren(data.path)
            if(data.children.length === 0){
                data.children = ''
            }
            // const children = data.children
            // const len = children.length
            // for(let i=0; i<len; i++){
            //     children[i].children = await this.getChildren(children[i].path)
            //     let obj = {}
            //     obj.path = `${data.path}/${children[i]}`
            //     obj.name = children[i]
            //     obj.zkData = ''
            //     obj.children = [
                    
            //     ]
            //     node.data.children.push(obj)
            //      console.log("item:",obj);
            // }
        },

        async loadNode(node, resolve) {


            console.log("11111111111");
            node.data.zkData = await this.getData(node.data.path)
            console.log("path:",node.data.path);
            console.log("node:",node.data);
            console.log("treeData:",this.treeData);
            node.data.children = await this.getChildren(node.data.path)
            // const childrenUrl = `${this.$common.apis.zk}/children`
            // const childrenResponse = await this.$http.get(childrenUrl, {
            //     params: {
            //         path: node.data.path
            //     }
            // })
            // const children = childrenResponse.data
            // const len = children.length
            // for(let i=0; i<len; i++){
            //     let obj = {}
            //     obj.path = `${node.data.path}/${children[i]}`
            //     obj.name = children[i]
            //     obj.data = ''
            //     obj.children = []
            //     node.data.children.push(obj)
            //     //  console.log("item:",obj);
            // }
            resolve(node.data.children)
            // if (node.level === 0) {
            //     return resolve([{ name: 'region1' }, { name: 'region2' }]);
            // }
            // if (node.level > 3) return resolve([]);

            // var hasChild;
            // if (node.data.name === 'region1') {
            //     hasChild = true
            // } else if (node.data.name === 'region2') {
            //     hasChild = false
            // } else {
            //     hasChild = Math.random() > 0.5
            // }

            // setTimeout(() => {
            //     var data;
            //     if (hasChild) {
            //         data = [{
            //             name: 'zone' + this.count++
            //         }, {
            //             name: 'zone' + this.count++
            //         }]
            //     } else {
            //         data = []
            //     }

            //     resolve(data)
            //     console.log("treeData", this.treeData);
            // }, 500)
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
                        <span>{node.label}</span>
                    </span>
                    <span style="float: right; margin-right: 20px">
                        <el-button size="mini" on-click={() => this.append(store, data)}>Append</el-button>
                        <el-button size="mini" on-click={() => this.remove(store, data)}>Delete</el-button>
                    </span>
                </span>)
        }
    }
}
</script>