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
      path: '/index',
      component: resolve => require(['../components/common/Home.vue'], resolve),
      children: [
        {
          path: '/',
          component: resolve => require(['../components/data/access/SupervisorManager.vue'], resolve)
        },
        {
          path: '/status',
          component: resolve => require(['../components/system/manager/SystemStatus.vue'], resolve)
        },
        {
          name: 'serversInfo',
          path: '/serversInfo',
          component: resolve => require(['../components/system/manager/servers/ServersInfo.vue'], resolve)
        },
        {
          name: 'serversSegment',
          path: '/serversSegment/:serverName',
          component: resolve => require(['../components/system/manager/servers/ServersSegment.vue'], resolve)
        },
        {
          name: 'zkManager',
          path: '/zkManager',
          component: resolve => require(['../components/system/manager/ZookeeperManager.vue'], resolve)
        },
        {
          name: 'supervisorManager',
          path: '/supervisorManager',
          component: resolve => require(['../components/data/access/SupervisorManager.vue'], resolve)
        },
        {
          name: 'supervisorTasks',
          path: '/:supervisorId/supervisorTasks',
          component: resolve => require(['../components/data/access/supervisorManager/SupervisorTasks.vue'], resolve)
        },
        {
          name: 'taskManager',
          path: '/taskManager',
          component: resolve => require(['../components/data/access/TaskManager.vue'], resolve)
        },

        {
          path: '/dataSource',
          component: resolve => require(['../components/datasource/metadata/DataSourceManager.vue'], resolve)    // 拖拽列表组件
        },
        {
          path: '/interval',
          component: resolve => require(['../components/datasource/metadata/Interval.vue'], resolve)    // 拖拽列表组件
        },
        {
          path: '/segment',
          component: resolve => require(['../components/datasource/metadata/Segment.vue'], resolve)    // 拖拽列表组件
        },
        {
          path: '/lookupCoordinator',
          component: resolve => require(['../components/lookup/lookupCoordinator/Lookup.vue'], resolve)    // 拖拽列表组件
        },
        {
          path: '/lookupHistorical',
          component: resolve => require(['../components/lookup/lookupHistorical/Lookup.vue'], resolve)    // 拖拽列表组件
        },
        {
          path: '/systemConfig',
          component: resolve => require(['../components/system/SystemConfig.vue'], resolve)    // 拖拽列表组件
        }
      ]
    },
    {
      path: '/login',
      component: resolve => require(['../components/login/Login.vue'], resolve)
    },
  ]
})
