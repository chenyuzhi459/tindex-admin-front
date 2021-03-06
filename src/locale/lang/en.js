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
            manager: {
                title: 'System Manager',
                status: 'System Status',
                serversInfo: 'Servers Info',
                systemConfig: 'System Config',
                zkManager: 'ZooKeeper Manager'
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
            },
        },
        status: {
            version: 'Version:',
            module: 'System Modules',
            name: 'name',
            artifact: 'artifact',
            _version: 'version',
            memory: 'Memory',
            usedMemory: 'usedMemory',
            freeMemory: 'freeMemory',
            totalMemory: 'totalMemory',
            maxMemory: 'maxMemory'
        },
        serversInfo: {
            host: 'host',
            title: 'Servers Info',
            server: 'Server',
            tier: 'tier',
            priority: 'priority',
            currSize: 'currSize',
            maxSize: 'maxSize',
            segments: 'segments',
            searchTips: 'please input name'
        },
        zkManager: {
            treeSubTitile: 'ZooKeeper Structure Tree',
            dataSubTitle: 'Data',
            path: 'Path',
            checkMore: 'check more'
        },
        tasks: {
            runningTasksTitle: 'Running Tasks',
            pendingTasksTitle: 'Pending Tasks - Tasks waiting to be assigned to a worker',
            waitingTasksTitle: 'Waiting Tasks - Tasks waiting on locks ',
            completeTasksTitle: 'Complete Tasks - Tasks recently completed',
            workersTitile: 'Remote Workers',
            createTask: 'Create Task',
            taskSpec: 'Task Spec',
            format: 'format',
            jsonSyntaxError: 'wrong json syntax',
            createDialogConfirm: 'Create',
            creatSuccess: 'create successfully, taskId',
            createFailedFront: 'request failed with status',
            createFailedLast: 'please check overlord logs',
            searchTips: 'please input id',
            searchTopicTips: 'please input topic name',
            search: 'Search',
            refresh: 'Refresh',
            createdTime: 'createdTime',
            queueInsertTime: 'queueInsertTime',
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
            offsets: 'offsets',
            currOffset: 'currOffset',
            taskOffsetTitle: 'Offset',
            metrics: 'metrics',
            period: 'period',
            datasource: 'datasource',
            startOffset: 'startOffset',
            topicOffsets: 'Topic Offsets',
            wokerHost: 'host',
            wokerIp: 'ip',
            workerCapacity: 'capacity',
            workerVersion: 'version',
            currCapacityUsed: 'currCapacityUsed',
            availabilityGroups: 'groups',
            workerRunningTaks: 'tasks',
            lastCompletedTaskTime: 'lastCompletedTaskTime',
            blacklistedUntil: 'blacklistedUntil'
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
            createFailedLast: 'please check overlord logs',
            activeTasksNum: 'activeTasksNum',
            selectType:{
                tips: 'please select type',
                item1: 'ALL',
                item2: 'lucene_supervisor',
                item3: 'default_supervisor'
            }
        },
        dataSource: {
            dataSourceTitle: "DataSources",
            dataSource: 'DataSource',
            segments: "segments",
            span: "time span",
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
            dataSourceInfo: 'DataSource Info',
            serversInfo: 'Server Info',
            granularity: 'granularity',
            operate: 'operate',
            granularityInfo: 'Please select a granularity',
            operateInfo: 'Please select an operation',
            periodInputInfo: 'Please input a valid ISO 8601 duration',
            intervalInputInfo: 'Please input a valid ISO 8601 interval',
            addRule: 'Add A Rule',
            servers: 'servers',
            segmentCount: "segment count",
            intervalCount: "interval count",
            clusterConfig: "Cluster Config",
            clusterConfigHistory: "Cluster Config History"
        },
        interval: {
            intervalTitle: "Intervals",
            interval: 'Interval',
            segments: "segments",
            
        },
        segment: {
            segmentTitle: "Segments",
            segment: 'Segment',
            refresh: "Refresh",
            delete: "delete",
            segmentInfo: "Segment Info",
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
            updateLookupWarning: "Do you really want to update lookup:",
            inputLookupName: "Please input lookup name",
            groupId: "groupId"
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
            disableWarning: 'Do you really want to disable:',
            enableWarning: 'Do you really want to enable:',
            enableSuccess: 'Enable Success!',
            enableFail: 'Enable Fail!',
            deleteSuccess: 'Delete Success!',
            deleteFail: 'Delete Fail!',
            addSuccess: "Add Success!",
            updateSuccess: "Update Success!",
            updateFail: "Update Fail!",
            disableSuccess: "Disable Success!",
            disableFail: "Disable Fail!",
            addFail: "Add Fail!",
            items: 'items',
            disable: 'disable',
            inputName: "Please input name",
            update: "update",
            return: 'Back',
            type: 'type',
            operation: 'operation',
            detail: 'detail',
            close: 'close',
            enable: 'enable',
            state: 'state',
            requestTimeout: 'request time out',
            none: 'none',
            reset: 'reset',
            
        },
        error: {
            chooseAction: 'Action can not be null! Please choose an action',
            chooseGranularity: 'Granularity can not be null! Please choose a granularity',
            canNotBeNull: ' can not be null!'
        },
        systemConfig: {
            systemConfigTitle: "System Config",
            druidConfig: "Druid Config",
            kafkaConfig: "Kafka Config",
            zkConfig: "Zookeeper Config",
            updateConfig: "Do you really want to update config?"
        }
    }

}