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
      searchTopicTips: '请输入topic名称',
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
      offsets:'offsets',
      currOffset: 'currOffset',
      taskOffsetTitle: 'Offset',
      metrics: '指标',
      period: '阶段',
      datasource: '数据源',
      startOffset:'startOffset',
      topicOffsets: 'Topic Offsets',
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
      taskDuration: '任务持续时间',
      type: '类型',
      topic: 'topic',
      reuse: '重用',
      supervisorStatusTitle: 'Supervisor 状态',
      supervisorSpec: 'Supervisor 说明',
      createSupervisor: '创建Supervisor',
      format: '格式化',
      createDialogConfirm: '创建',
      jsonSyntaxError: 'json格式错误',
      creatSuccess: '创建成功, id',
      createFailedFront: '创建失败,状态码',
      createFailedLast: '请查看overlord日志'
    },
    sideBar: {
      dataAccess: {
        title: '数据接入',
        supervisor: 'supervisor管理',
        task: 'task管理'
      },
      info: {
        title: '系统管理',
        status: '系统状态',
        serversInfo: '节点信息',
        systemConfig: '系统配置'
      },
      dataSource: {
        title: '数据源管理',
        dataSource: '数据源（集群）',
        metadata: '数据源（元数据）',
      },
      lookup: {
        title: '用户分群管理',
        lookupCoordinator: '用户分群（Coordinator）',
        lookupHistorical: '用户分群（Historical）'
      },
      // systemConfig: {
      //   title: '系统配置'
      // }
    },
    status: {
      version: '版本:',
      module: '系统模块',
      name: '名称',
      artifact: '模块',
      _version: '版本',
      memory: '内存',
      usedMemory: '已用内存',
      freeMemory: '可用内存',
      totalMemory: '总内存',
      maxMemory: '最大内存'
    },
    serversInfo: {
      host: 'host',
      title: '节点信息',
      server: '节点',
      tier: 'tier',
      priority: '优先级',
      currSize: '当前大小',
      maxSize: '最大大小',
      segments: '数据段',
      searchTips: '请输入名称'
    },
    dataSource: {
      dataSourceTitle: "数据源",
      dataSource: "数据源",
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
      metrics: '指标',
      candidates: 'candidates',
      dimensionsInfo: '维度信息',
      metricsInfo: '指标信息',
      candidatesInfo: 'Candidates信息',
      rules: '规则',
      history: '历史',
      add: '添加',
      rulesInfo: '规则信息',
      serversInfo: '节点信息',
      rulesHistory: '规则（历史信息）',
      addRulesSuccess: '添加规则成功！',
      addRulesFail: '添加规则失败！',
      addRuleWarning: '你确定要添加规则？',
      dataSourceInfo: '数据源信息',
      granularity: '操作粒度',
      operate: '操作',
      granularityInfo: '请选择操作粒度',
      operateInfo: '请选择操作',
      periodInputInfo: '请输入一个有效的 ISO 8601 period',
      intervalInputInfo: '请输入一个有效的 ISO 8601 interval',
      addRule: '添加规则',
      servers: '节点'
    },
    interval: {
      intervalTitle: "区间",
      interval: "区间",
      refresh: "刷新",
      name: "名称",
      segments: "数据段",
      more: "更多",
      segmentCount: "数据段数量"
    },
    segment: {
      segmentTitle: "数据段",
      segment: "数据段",
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
    lookup: {
      lookupCoordinator: {
        lookupTitle: "用户分群"
      },
      lookupHistorical: {

      },
      lookups: "分群组",
      userGroupLookup: "分群",
      type: "类型",
      version: "版本",
      lookupInfo: "分群信息",
      addLookup: "创建分群",
      lookupName: "分群名称",
      lookupNameIndex: "请输入分群名称",
      addLookupWarning: "你确定要添加分群：",
      updateLookupWarning: "你确定要更新分群：",
      inputLookupName: "请输入分群名称",
      groupId: "分组Id"
    },
    common: {
      more: "操作",
      info: "详情",
      delete: "删除",
      size: "大小",
      confirm: "确 认",
      cancle: "取 消",
      refresh: "刷新",
      name: "名称",
      count: "数量",
      search: "搜索",
      warning: "提醒",
      deleteWarning: "你确定要删除：",
      disableWarning: '你确定要失效:',
      enableWarning: '你确定要恢复:',
      enableSuccess: '恢复成功!',
      enableFail: '恢复失败!',
      deleteSuccess: "删除成功!",
      deleteFail: "删除失败!",
      addSuccess: "添加成功！",
      updateSuccess: "更新成功！",
      updateFail: "更新失败！",
      disableSuccess: "失效成功!",
      disableFail: "失效失败!",
      addFail: "添加失败！",
      items: "条目明细",
      disable: "失效",
      return: '返回',
      inputName: "请输入名称",
      update: "更新",
      return: '返回',
      type: '类型',
      operation: '操作',
      detail: '详情',
      close: '关闭',
      enable: '恢复',
      state: '状态',
      requestTimeout: '请求超时'
    },
    error: {
      chooseAction: '操作不能为空! 请选择一种操作',
      chooseGranularity: '操作粒度不能为空! 请选择一种操作粒度',
      canNotBeNull: ' 不能为空!'
    },
    systemConfig: {
      systemConfigTitle: "系统配置",
      updateConfig: "你确认要更新配置吗？"
    }
  }
}