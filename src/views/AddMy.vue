<template>
    <div class="add-task">
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
</style>
