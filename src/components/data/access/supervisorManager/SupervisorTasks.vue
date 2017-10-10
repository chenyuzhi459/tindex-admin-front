<<template>
<div>
    <div style="text-align:right; margin-right:20px;">
         <el-button size="small" icon="arrow-left"  type="primary" @click="getBack">
             {{$t('message.common.return')}}
        </el-button> 
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
    },
    methods: {
        getBack() {
            this.$router.push({
                name: 'supervisorManager'
            })
        }
    }
}
</script>
