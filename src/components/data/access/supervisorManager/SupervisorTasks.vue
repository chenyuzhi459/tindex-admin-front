<<template>
<div>
    <div >
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ name: 'supervisorManager' }">
                <span style="font-size:14px;">
                    {{$t('message.supervisors.supervisorManager')}}
                </span>
            </el-breadcrumb-item>
            <el-breadcrumb-item>
                <span style="font-size:14px;">
                    {{$t('message.supervisors.supervisorTasks')}}
                </span>
            </el-breadcrumb-item>
        </el-breadcrumb>
        <br>
    </div>

    <running-tasks :supervisor-id="$route.params.supervisorId"></running-tasks>
    <pending-tasks :supervisor-id="$route.params.supervisorId"></pending-tasks>
     <waiting-tasks :supervisor-id="$route.params.supervisorId"></waiting-tasks>
     <complete-tasks :supervisor-id="$route.params.supervisorId"></complete-tasks>  

</div>
</template>

<script>

import RunningTasks from './tasks/RunningTasks'
import CompleteTasks from './tasks/CompleteTasks'
import PendingTasks from './tasks/PendingTasks'
import WaitingTasks from './tasks/WaitingTasks'
export default {
    data() {
        return {
            jsonSyntaxError: false,
            createTaskDialogVisible: false,
            taskJson: ''
        }
    },
    components: {
        'running-tasks': RunningTasks,
        'complete-tasks': CompleteTasks,
        'pending-tasks': PendingTasks,
        'waiting-tasks': WaitingTasks
    }
}
</script>
