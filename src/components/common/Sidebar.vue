<template>
  <div class="sidebar">
    <el-menu :default-active="onRoutes" class="el-menu-vertical-demo" theme="dark" unique-opened router @open="openSub">
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-submenu :index="item.index">
            <template slot="title">
              <i :class="item.icon"></i>{{ item.title }}</template>
            <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index" :route="subItem.route">{{ subItem.title }}
            </el-menu-item>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :route="item.route">
            <i :class="item.icon"></i>{{ item.title }}
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // defaultSelect: 'supervisorManager',
      items: [
        {
          index: 'dataAccess',
          title: this.$t('message.sideBar.dataAccess.title'),
          subs: [
            {
              index: 'supervisorManager',
              route: { path: '/supervisorManager' },
              title: this.$t('message.sideBar.dataAccess.supervisor')
            },
            {
              index: 'taskManager',
              route: { path: '/taskManager' },
              title: this.$t('message.sideBar.dataAccess.task')
            }
          ]
        },

        {
          index: 'dataSource',
          title: this.$t('message.sideBar.dataSource.title'),
          route: { path: '/mDataSource' },
          // subs: [
          //   {
          //     index: 'mDataSource',
          //     route: { path: '/mDataSource' },
          //     title: this.$t('message.sideBar.dataSource.metadata')
          //   }
          // ]
        },
        {
          index: 'lookup',
          title: this.$t('message.sideBar.lookup.title'),
          route: { path: '/mDataSource' },
          subs: [
            {
              index: 'lookupCoordinator',
              route: { path: '/lookupCoordinator' },
              title: this.$t('message.sideBar.lookup.lookupCoordinator')
            },
            {
              index: 'lookupHistorical',
              route: { path: '/lookupHistorical' },
              title: this.$t('message.sideBar.lookup.lookupHistorical')
            }
          ]
        },

        {
          index: 'info',
          title: this.$t('message.sideBar.info.title'),
          subs: [
            {
              index: 'status',
              route: { path: '/status' },
              title: this.$t('message.sideBar.info.status')
            },
            {
              index: 'serversInfo',
              route: { path: '/serversInfo' },
              title: this.$t('message.sideBar.info.serversInfo')
            },
            {
              index: '/systemConfig',
              route: { path: '/systemConfig' },
              title: this.$t('message.sideBar.info.systemConfig')
            },
            {
              index: 'basetable',
              route: { path: '/basetable' },
              title: '基础表格'
            },
            {
              index: 'vuetable',
              route: { path: '/vuetable' },
              title: 'Vue表格组件'
            },
            {
              index: 'baseform',
              route: { path: '/baseform' },
              title: '基本表单'
            },
            {
              index: 'upload',
              route: { path: '/upload' },
              title: '文件上传'
            }
          ]
        },
        // {
        //   icon: 'el-icon-menu',
        //   index: '2',
        //   title: '表格',
        //   subs: [
        //     {
        //       index: 'basetable',
        //       title: '基础表格'
        //     },
        //     {
        //       index: 'vuetable',
        //       title: 'Vue表格组件'
        //     }
        //   ]
        // },
        // {
        //   icon: 'el-icon-date',
        //   index: '3',
        //   title: '表单',
        //   subs: [
        //     {
        //       index: 'baseform',
        //       title: '基本表单'
        //     },
        //     {
        //       index: 'upload',
        //       title: '文件上传'
        //     }
        //   ]
        // }
      ]
    }
  },
  computed: {
    onRoutes() {
      return this.$route.path.replace('/', '');
    }
  },
  methods: {
    openSub(index) {
      for (let i = 0; i < this.items.length; i++) {
        if (index === this.items[i]['index']) {
          this.$router.push(this.items[i]['subs'][0]['index'])
          break
        }
      }
    }
  }
}
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  width: 250px;
  left: 0;
  top: 70px;
  bottom: 0;
  background: #2E363F;
}

.sidebar>ul {
  height: 100%;
}
</style>
