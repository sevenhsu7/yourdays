<template>
    <div class="add-task">
        <!-- 确认弹窗 -->
        <div v-if="showErrorDialog" class="confirm-dialog">
            <div class="dialog-content">
                <p>开始时间不能晚于截止时间</p>
                <div class="dialog-buttons">
                    <button @click="closeErrorDialog" class="btn-confirm">确定</button>
                </div>
            </div>
        </div>

        <h2>{{ route.query.mode === 'edit' ? '编辑任务' : '新建任务' }}</h2>
        <form @submit.prevent="submitTask">
        <div class="form-group">
            <label for="taskTitle">任务名称</label>
            <input 
            type="text" 
            id="taskTitle" 
            v-model="taskForm.title"
            required
            placeholder="请输入任务名称"
        >
    </div>

    <div class="form-group">
        <label for="taskDesc">任务描述</label>
        <textarea 
            id="taskDesc" 
            v-model="taskForm.description"
            placeholder="请输入任务描述（选填）"
            rows="3"
        ></textarea>
    </div>

    <div class="form-group">
        <label for="taskDeadline">截止日期</label>
        <input 
            type="date" 
            id="taskDeadline" 
            v-model="taskForm.deadline"
            required
        >
    </div>

    <div class="form-group">
        <label for="taskStartDate">开始日期</label>
        <input 
            type="date" 
            id="taskStartDate" 
            v-model="taskForm.startDate"
            required
        >
    </div>

    <div class="form-actions">
        <button type="button" class="btn-cancel" @click="cancel">取消</button>
        <button type="submit" class="btn-submit">保存</button>
    </div>
    </form>
</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const taskForm = ref({
    title: '',
    description: '',
    deadline: '',
    startDate: new Date().toISOString().split('T')[0],
    id: Date.now(),
    type: 'task'
})

// 添加新的响应式变量
const showErrorDialog = ref(false)

// 检查是否是编辑模式
onMounted(() => {
    if (route.query.mode === 'edit') {
        const storedGoal = localStorage.getItem('editingGoal')
        if (storedGoal) {
            const editingGoal = JSON.parse(storedGoal)
            taskForm.value = {
                ...editingGoal,
                startDate: editingGoal.startDate.split('T')[0],
                deadline: editingGoal.deadline.split('T')[0]
            }
        }
    }
})

// 组件卸载时清理数据
onUnmounted(() => {
    localStorage.removeItem('editingGoal')
})

// 使用现有的方法
const loadGoals = () => {
    const savedGoals = localStorage.getItem('goals')
    return savedGoals ? JSON.parse(savedGoals) : []
}

const saveGoals = (goals) => {
    localStorage.setItem('goals', JSON.stringify(goals))
}

const submitTask = () => {
    const startDate = new Date(taskForm.value.startDate)
    const deadline = new Date(taskForm.value.deadline)
    
    if (startDate > deadline) {
        showErrorDialog.value = true
        return
    }
    
    const goals = loadGoals()
    
    if (route.query.mode === 'edit') {
        // 编辑模式：更新现有任务
        const index = goals.findIndex(g => g.id === taskForm.value.id)
        if (index !== -1) {
            goals[index] = {
                ...goals[index],
                ...taskForm.value,
                updatedAt: new Date().toISOString()
            }
            
            // 同步更新 MyDays 中的数据
            const myDaysItems = localStorage.getItem('myDaysItems') || '[]'
            let items = JSON.parse(myDaysItems)
            const myDaysIndex = items.findIndex(i => i.id === taskForm.value.id)
            
            if (myDaysIndex !== -1) {
                items[myDaysIndex] = {
                    ...items[myDaysIndex],
                    ...taskForm.value,
                    updatedAt: new Date().toISOString()
                }
                localStorage.setItem('myDaysItems', JSON.stringify(items))
            }
        }
    } else {
        // 新建模式：添加新任务
        const newTask = {
            ...taskForm.value,
            id: Date.now(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            progress: 0
        }
        goals.push(newTask)
    }
    
    saveGoals(goals)
    router.back()
}

const cancel = () => {
    router.back()
}

// 添加关闭弹窗的方法
const closeErrorDialog = () => {
    showErrorDialog.value = false
}
</script>

<style scoped>
.add-task {
    padding: 20px;
}

.form-group {
    margin-bottom: 20px;
}

label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
}

input, textarea {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
}

.form-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 30px;
}

button {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.btn-cancel {
    background-color: #f5f5f5;
    color: #666;
}

.btn-submit {
    background-color: #42b983;
    color: white;
}

/* 添加弹窗样式 */
.confirm-dialog {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.dialog-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    width: 80%;
    max-width: 300px;
}

.dialog-buttons {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}

.btn-confirm {
    padding: 8px 20px;
    border: none;
    border-radius: 4px;
    background-color: #42b983;
    color: white;
    cursor: pointer;
    font-size: 14px;
}

.btn-confirm:hover {
    background-color: #3aa876;
}
</style>
