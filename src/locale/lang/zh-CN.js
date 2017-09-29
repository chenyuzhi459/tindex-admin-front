export default {
  message: {
    login: {
      buttonContent: '登录',
      username: '用户名',
      password: '密码',
      ruleMessage1: '请输入用户名',
      ruleMessage2: '请输入密码',
      errorTips: '用户名或密码错误'
    },
    header: {
      title: 'Tindex后台管理系统',
      logout: '退出',
      changeLanuage: '切换语言',
      lanuage1: '中文',
      lanuage2: '英文'
    },
    tasks: {
      runningTasksTitle: '运行任务',
      pendingTasksTitle: '队列任务 - 等待分配资源的任务',
      waitingTasksTitle: '阻塞任务 - 等待获取锁的任务 ',
      completeTasksTitle: '已完成任务',
      createTask: '创建新任务',
      taskSpec: '任务说明',
      format: '格式化',
      jsonSyntaxError: 'json格式错误',
      createDialogConfirm: '创建',
      creatSuccess: '任务创建成功, 任务Id',
      createFailedFront: '任务创建失败,状态码',
      createFailedLast: '请查看overlord日志',
      searchTips: '请输入id',
      search: '搜索',
      refresh: '刷新',
      createdTime: '创建时间',
      queueInsertTime: '入队时间',
      location: '位置',
      operation: '操作',
      taskPayloadTitle: '任务说明',
      payload: '说明',
      taskStatusTitle: '任务状态',
      status: '状态',
      allLog: '日志',
      partLog: '日志(8kb)',
      delete: '删除',
      dialogConfirm: '确定',
      dialogCancel: '取消',
      killTips: '你确定要删除',
      killConfirmTitle: '警告',
      killSuccess: '删除成功!',
      locationHost: '主机',
      locationPort: '端口',
      selectStatus: '请选择状态',
      statusItem1: '全部',
      statusItem2: '成功',
      statusItem3: '失败',
      duration: '运行时长',
      topic: 'topic',
      offsets: 'offsets'
    },
    supervisors: {
      supervisorManager: 'Supervisor管理',
      supervisorTasks: 'Supervisor任务',
      runningSuperviorTitle: '运行supervisors',
      completeSupervisorsTitle: '已完成Supervisors',
      searchTips: '请输入id',
      search: '搜索',
      refresh: '刷新',
      operation: '操作',
      tasks: '任务',
      spec: '说明',
      status: '状态',
      reset: '重置',
      delete: '删除',
      dialogConfirm: '确定',
      dialogCancel: '取消',
      specTitle: 'Supervisor 说明',
      statusTitle: 'Supervisor 状态',
      resetTips: '你确定要重置',
      resetSuccessMsg: '重置成功, id',
      resetErrMsg: '重置失败,请查看overlord日志',
      dialogWarningTitle: '警告',
      killTips: '你确定要删除',
      killSuccess: '删除成功!',
      killFailed: '删除失败,请查看overlord日志',
      version: '版本',
      taskDuration: '运行时间',
      type: '类型',
      topic: 'topic',
      reuse: '重用',
      supervisorStatusTitle: 'Supervisor状态',
      supervisorSpec: 'Supervisor说明',
      createSupervisor: '创建Supervisor',
      format: '格式化',
      createDialogConfirm: '创建',
      jsonSyntaxError: 'json格式错误',
      creatSuccess: '创建成功, id',
      createFailedFront: '创建失败,状态码',
      createFailedLast: 'please check overlord logs'
    },
    sideBar: {
      dataAccess: {
        title: '数据接入',
        supervisor: 'supervisor管理',
        task: 'task管理'
      },
      info: {
        title: '系统信息',
        status: '系统状态',
        serversInfo: '节点信息'
      },
      dataSource: {
        title: '数据源管理',
        dataSource: '数据源',
        metadata: '元数据',

      }
    },
    dataSource: {
      dataSourceTitle: "数据源",
      search: "搜索",
      refresh: "刷新",
      name: "名称",
      segments: "数据段",
      count: "数量",
      size: "大小",
      maxTime: "最大时间",
      minTime: "最小时间",
      more: "更多",
      tiers: "等级",
      intervals: "区间",
      delete: "删除",
      tiersInfo: "等级信息",
      createTime: "创建时间",
      dimensions: '维度',
      metrics: '度量',
      candidates: 'candidates',
      dimensionsInfo: '维度信息',
      metricsInfo: '度量信息',
      candidatesInfo: 'Candidates信息',
      rules: '规则',
      history: '历史',
      add: '添加',
      rulesInfo: '规则信息',
      rulesHistory: '规则（历史信息）',
      addRulesSuccess: '添加规则成功！',
      addRulesFail: '添加规则失败！'
    },
    interval: {
      intervalTitle: "区间",
      refresh: "刷新",
      name: "名称",
      segments: "数据段",
      more: "更多"
    },
    segment: {
      segmentTitle: "数据段",
      refresh: "刷新",
      name: "名称",
      info: "信息",
      more: "更多",
      delete: "删除",
      segmentInfo: "数据段信息",
      confirm: "确 定",
      cancle: "取 消",
      confirmButtonText: "确定",
      cancleButtonTextL: "取消"
    },
    common: {
      more: "更多",
      info: "信息",
      delete: "删除",
      size: "大小",
      confirm: "确 认",
      cancle: "取 消",
      refresh: "更新",
      name: "名字",
      count: "数量",
      search: '搜索',
      warning: '提醒',
      deleteWarning: '你确定要删除：',
      deleteSuccess: '删除成功!',
      deleteFail: '删除失败!'
    }
  }
}