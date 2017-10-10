
let base = ''
console.log('NODE_ENV:',process.env.NODE_ENV)
if (process.env.NODE_ENV === 'development') {
    base = 'http://localhost:6660'
    // base = 'http://192.168.0.30:6660'
}
console.log('base:',base)
export default {
    status: `${base}/status`,
    serversInfo: `${base}/druid/coordinator/v1/servers`,
    login: `${base}/login`,
    runningTasks: `${base}/druid/indexer/v1/runningTasks`,
    completeTasks: `${base}/druid/indexer/v1/completeTasks`,
    pendingTasks: `${base}/druid/indexer/v1/pendingTasks`,
    waitingTasks: `${base}/druid/indexer/v1/waitingTasks`,
    searchCompleteTasks: `${base}/druid/indexer/v1/search/completeTasks`,
    taskChatUrl: `${base}/druid/worker/v1/task`,
    baseTaskUrl: `${base}/druid/indexer/v1/task`,
    overlordUrl: `${base}/druid/indexer/v1`,
    supervisor:`${base}/druid/indexer/v1/supervisor`,
    dataSource:`${base}/druid/coordinator/v1/datasources`,
    intervals: `${base}/druid/coordinator/v1/intervals`,
    mDataSource: `${base}/druid/coordinator/v1/metadata/datasources`,
    clientInfo: `${base}/druid/v2/datasources`,
    rules: `${base}/druid/coordinator/v1/rules`,
    lookups: `${base}/druid/coordinator/v1/lookups`,
    historicalIps: `${base}/system/ip/historical`,
    lookupsHis: `${base}/druid/listen/v1/lookups`,
    systemConfig: `${base}/druid/systemConfig`
    // lookupCoordinator:
    // lookupHistorical:
}
