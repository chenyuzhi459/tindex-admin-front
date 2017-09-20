
let base = ''
console.log('NODE_ENV:',process.env.NODE_ENV)
if (process.env.NODE_ENV === 'development') {
    base = 'http://localhost:6660'
    // base = 'http://192.168.0.30:6660'
}
console.log('base:',base)
export default {
    status: `${base}/status`,
    serversInfo:`${base}/druid/coordinator/v1/servers`,
    login:`${base}/login`,
    runnigTasks:`${base}/druid/indexer/v1/runningTasks`,
    completeTasks:`${base}/druid/indexer/v1/completeTasks`,
    baseTaskUrl:`${base}/druid/indexer/v1/task`,
    dataSource:`${base}/druid/coordinator/v1/datasources`,
}
