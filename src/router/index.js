import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/readme',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            children: [
                {
                    path: '/',
                    component: resolve => require(['../components/page/Readme.vue'], resolve)
                },
                {
                    path: '/status',
                    component: resolve => require(['../components/info/SystemStatus.vue'], resolve)
                },
                {
                    path: '/serversInfo',
                    component: resolve => require(['../components/info/ServersInfo.vue'], resolve)
                },
                {
                    path: '/supervisorManager',
                    component: resolve => require(['../components/data/access/SupervisorManager.vue'], resolve)
                },
                {
                    path: '/taskManager',
                    component: resolve => require(['../components/data/access/TaskManager.vue'], resolve)
                },

                {
                    path: '/basetable',
                    component: resolve => require(['../components/page/BaseTable.vue'], resolve)
                },
                {
                    path: '/vuetable',
                    component: resolve => require(['../components/page/VueTable.vue'], resolve)     // vue-datasource组件
                },
                {
                    path: '/baseform',
                    component: resolve => require(['../components/page/BaseForm.vue'], resolve)
                },
                {
                    path: '/vueeditor',
                    component: resolve => require(['../components/page/VueEditor.vue'], resolve)    // Vue-Quill-Editor组件
                },
                {
                    path: '/markdown',
                    component: resolve => require(['../components/page/Markdown.vue'], resolve)     // Vue-Quill-Editor组件
                },
                {
                    path: '/upload',
                    component: resolve => require(['../components/page/Upload.vue'], resolve)       // Vue-Core-Image-Upload组件
                },
                {
                    path: '/basecharts',
                    component: resolve => require(['../components/page/BaseCharts.vue'], resolve)   // vue-schart组件
                },
                {
                    path: '/drag',
                    component: resolve => require(['../components/page/DragList.vue'], resolve)    // 拖拽列表组件
                },




                {
                  path: '/dataSource',
                  component: resolve => require(['../components/datasource/cluster/DataSource.vue'], resolve)    // 拖拽列表组件
                },
                {
                  path: '/interval',
                  component: resolve => require(['../components/datasource/cluster/Interval.vue'], resolve)    // 拖拽列表组件
                },
                {
                  path: '/segment',
                  component: resolve => require(['../components/datasource/cluster/Segment.vue'], resolve)    // 拖拽列表组件
                },
                {
                  path: '/mDataSource',
                  component: resolve => require(['../components/datasource/metadata/DataSource.vue'], resolve)    // 拖拽列表组件
                },
                {
                  path: '/mSegment',
                  component: resolve => require(['../components/datasource/metadata/Segment.vue'], resolve)    // 拖拽列表组件
                },
                {
                  path: '/lookupCoordinator',
                  component: resolve => require(['../components/lookup/lookupCoordinator/Lookup.vue'], resolve)    // 拖拽列表组件
                },
                {
                  path: '/lookupHistorical',
                  component: resolve => require(['../components/lookup/lookupHistorical/Lookup.vue'], resolve)    // 拖拽列表组件
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/login/Login.vue'], resolve)
        },
    ]
})
