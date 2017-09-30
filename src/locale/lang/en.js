export default {
    message: {
        login: {
            buttonContent: 'login',
            username: 'username',
            password: 'password',
            ruleMessage1: 'please input username',
            ruleMessage2: 'please input password',
            errorTips: 'username or password is wrong'
        },
        header: {
            title: 'Tindex Backstage Manager System',
            logout: 'Logout',
            changeLanuage: 'Change Lanuage',
            lanuage1: 'Chinese',
            lanuage2: 'English',
        },
        sideBar: {
            dataAccess: {
                title: 'Data Access',
                supervisor: 'Supervisor Manager',
                task: 'Task Manager',
            },
            info: {
                title: 'System Info',
                status: 'System Status',
                serversInfo: 'Servers Info'
            },
            dataSource: {
                title: 'DataSource Manage',
                dataSource: 'DataSources(cluster)',
                metadata: 'DataSources(Metadata)'
                
            },
            lookup: {
              title: 'Lookup Manage',
              lookupCoordinator: 'Lookup Coordinator',
              lookupHistorical: 'Lookup Historical'
            }
        },
        tasks: {
            runningTasksTitle: 'Running Tasks',
            pendingTasksTitle: 'Pending Tasks - Tasks waiting to be assigned to a worker',
            waitingTasksTitle: 'Waiting Tasks - Tasks waiting on locks ',
            completeTasksTitle: 'Complete Tasks - Tasks recently completed',
            createTask: 'Create Task',
            taskSpec: 'Task Spec',
            format: 'format',
            jsonSyntaxError: 'wrong json syntax',
            createDialogConfirm: 'Create',
            creatSuccess: 'create successfully, taskId',
            createFailedFront: 'request failed with status',
            createFailedLast: 'please check overlord logs',
            searchTips: 'please input id',
            search: 'Search',
            refresh: 'Refresh',
            createdTime: 'createdTime',
            queueInsertTime: 'queueInsertionTime',
            location: 'location',
            operation: 'more',
            taskPayloadTitle: 'Task Payload',
            payload: 'payload',
            taskStatusTitle: 'Task Status',
            status: 'status',
            allLog: 'log(all)',
            partLog: 'log(8kb)',
            delete: 'kill',
            dialogConfirm: 'Confirm',
            dialogCancel: 'Cancel',
            killTips: 'Do you really want to kill',
            killConfirmTitle: 'Warning',
            killSuccess: 'Kill Successfully!',
            locationHost: 'location host',
            locationPort: 'location port',
            selectStatus: 'please select status',
            statusItem1: 'ALL',
            statusItem2: 'SUCCESS',
            statusItem3: 'FAILED',
            duration: 'duration',
            topic: 'topic',
            offsets: 'offsets'
        },
        supervisors: {
            supervisorManager: 'Supervisor Manager',
            supervisorTasks: 'Supervisor Tasks',
            runningSuperviorTitle: 'Running Supervisors',
            completeSupervisorsTitle: 'Complete Supervisors',
            searchTips: 'please input id',
            search: 'Search',
            refresh: 'Refresh',
            operation: 'more',
            tasks: 'tasks',
            spec: 'spec',
            status: 'status',
            reset: 'reset',
            delete: 'kill',
            dialogConfirm: 'Confirm',
            dialogCancel: 'Cancel',
            specTitle: 'Supervisor Spec',
            statusTitle: 'Supervisor Status',
            resetTips: 'Do you really want to reset',
            resetSuccessMsg: 'reset successfully, id',
            resetErrMsg: 'reset failed,please check overlord logs',
            dialogWarningTitle: 'Warning',
            killTips: 'Do you really want to kill',
            killSuccess: 'Kill Successfully!',
            killFailed: 'Kill failed,please check overlord logs',
            version: 'version',
            taskDuration: 'taskDuration',
            type: 'type',
            topic: 'topic',
            reuse: 'reuse',
            supervisorStatusTitle: 'Supervisor Status',
            supervisorSpec: 'Supervisor Spec',
            createSupervisor: 'createSupervisor',
            format: 'format',
            createDialogConfirm: 'Create',
            jsonSyntaxError: 'wrong json syntax',
            creatSuccess: 'create successfully, id',
            createFailedFront: 'request failed with status',
            createFailedLast: 'please check overlord logs'
        },
        dataSource: {
            dataSourceTitle: "DataSources",
            segments: "segments",
            maxTime: "maxTime",
            minTime: "minTime",
            tiers: "tiers",
            intervals: "intervals",
            tiersInfo: "Tiers Info",
            warning: "Warning",
            createTime: 'createTime',
            dimensions: 'dimensions',
            metrics: 'metrics',
            candidates: 'candidates',
            dimensionsInfo: 'Dimensions Info',
            metricsInfo: 'Metrics Info',
            candidatesInfo: 'Candidates Info',
            rules: 'rules',
            history: 'history',
            add: 'add',
            rulesInfo: 'Rules Info',
            rulesHistory: 'Rules History',
            addRulesSuccess: 'Add Rules Success!',
            addRulesFail: 'Add Rules Fail!',
            addRuleWarning: 'Do you really add rule?',
            
        },
        interval: {
            intervalTitle: "Intervals",
            refresh: "Refresh",
            name: "name",
            segments: "segments",
            more: "more",
            segmentCount: "segment count"
        },
        segment: {
            segmentTitle: "Segments",
            refresh: "Refresh",
            name: "name",
            info: "info",
            more: "more",
            delete: "delete",
            segmentInfo: "Segment Info",
            confirm: "Cofirm",
            cancle: "Cancle",
            confirmButtonText: "Confirm",
            cancleButtonTextL: "Cancle"
        },
        lookup: {
          lookupCoordinator: {
            lookupTitle: "Lookup"
          },
          lookupHistorical: {

          },
          lookups: "Lookup Tier",
          userGroupLookup: "Lookup",
          type: "type",
          version: "version",
          lookupInfo: "Lookup Info",
          addLookup: "Create Lookup",
          lookupName: "Lookup Name",
          lookupNameIndex: "Please input the lookup name",
          addLookupWarning: "Do you really want to add lookup:",
          inputLookupName: "Please input lookup name"
        },
        common: {
          more: "more",
          info: "info",
          delete: "delete",
          size: "size",
          confirm: "Cofirm",
          cancle: "Cancle",
          refresh: "Refresh",
          name: "name",
          count: "count",
          search: 'Search',
          warning: 'Warning',
          deleteWarning: 'Do you really want to delete:',
          deleteSuccess: 'Delete Success!',
          deleteFail: 'Delete Fail!',
          addSuccess: "Add Success!",
          addFail: "Add Fail!",
          items: 'items',
          disable: 'disable',
          inputName: "Please input name",
          update: "update"
        }

    }

}