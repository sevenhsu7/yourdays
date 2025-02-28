<template>
    <div class="yours-plan">
        <h1>Your Big Days</h1>

        <!-- 确认删除对话框 -->
        <div v-if="showConfirmDialog" class="confirm-dialog">
            <div class="dialog-content">
                <p>确定要删除这个任务吗？</p>
                <div class="dialog-buttons">
                    <button @click="confirmDelete">确定</button>
                    <button @click="cancelDelete">取消</button>
                </div>
            </div>
        </div>

        <!-- 任务列表 -->
        <div class="goals-list">
            <div v-if="goals.length === 0" class="empty-state">
                👏🏻 快来添加你的大日子
            </div>
            <progress-wrapper
                v-else
                v-for="goal in goals"
                :key="goal.id"
                :item="{ ...goal, addedFromYours: isAddedToMyDays(goal), fromYoursPlan: true }"
                :is-active="selectedGoalId === goal.id"
                @toggle="toggleGoal(goal.id)"
            >
                <template #actions>
                    <button 
                        class="action-btn"
                        :class="isAddedToMyDays(goal) ? 'remove-from-mydays-btn' : 'add-to-mydays-btn'"
                        @click.stop="toggleMyDays(goal)"
                    >
                        {{ isAddedToMyDays(goal) ? '取消添加' : '添加好日子' }}
                    </button>
                    <button 
                        class="action-btn edit-btn" 
                        @click.stop="editGoal(goal)"
                    >
                        编辑
                    </button>
                    <button 
                        class="action-btn delete-btn" 
                        @click.stop="deleteGoal(goal.id)"
                    >
                        删除
                    </button>
                </template>
            </progress-wrapper>
        </div>

        <!-- 添加按钮 -->
        <div class="add-button" @click="navigateToAdd" :class="{ 'loading': isNavigating }">
            <span class="plus-icon">+</span>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import ProgressWrapper from '../components/ProgressWrapper.vue'

const router = useRouter()
const isNavigating = ref(false)
const goals = ref([])
const selectedGoalId = ref(null)
const showConfirmDialog = ref(false)
const goalToDelete = ref(null)
// 添加一个响应式的状态来追踪MyDays项目
const myDaysItemIds = ref(new Set())

// 保存到本地存储
const saveGoals = () => {
    localStorage.setItem('goals', JSON.stringify(goals.value))
}

// 从本地存储加载
const loadGoals = () => {
    const savedGoals = localStorage.getItem('goals')
    if (savedGoals) {
        // 解析后按 id 降序排序（因为新任务的 id 会更大）
        goals.value = JSON.parse(savedGoals).sort((a, b) => b.id - a.id)
    }
}

// 切换选中状态
const toggleGoal = (goalId) => {
    selectedGoalId.value = selectedGoalId.value === goalId ? null : goalId
}

// 删除功能
const deleteGoal = (id) => {
    goalToDelete.value = id
    showConfirmDialog.value = true
}

const confirmDelete = () => {
    if (goalToDelete.value !== null) {
        goals.value = goals.value.filter(goal => goal.id !== goalToDelete.value)
        saveGoals()
        showConfirmDialog.value = false
        goalToDelete.value = null
    }
}

const cancelDelete = () => {
    showConfirmDialog.value = false
    goalToDelete.value = null
}

// 编辑功能
const editGoal = (goal) => {
    // 将要编辑的目标数据存储到 localStorage
    localStorage.setItem('editingGoal', JSON.stringify(goal))
    // 导航到编辑页面
    router.push({
        path: '/addmy',
        query: {
            mode: 'edit',
            id: goal.id
        }
    })
}

// 导航到添加页面
const navigateToAdd = async () => {
    console.log('Attempting to navigate...')
    isNavigating.value = true
    try {
        await router.push('/addmy')
    } catch (error) {
        console.error('Navigation error:', error)
    } finally {
        isNavigating.value = false
    }
}

// 处理点击空白处
const handleClickOutside = (event) => {
    const goalCards = document.querySelectorAll('.progress-wrapper')
    let clickedOnCard = false
    
    goalCards.forEach(card => {
        if (card.contains(event.target)) {
            clickedOnCard = true
        }
    })
    
    if (!clickedOnCard) {
        selectedGoalId.value = null
    }
}

// 初始化MyDays项目ID集合
const initMyDaysItems = () => {
    const myDaysItems = localStorage.getItem('myDaysItems') || '[]'
    const items = JSON.parse(myDaysItems)
    myDaysItemIds.value = new Set(items.map(item => item.id))
}

// 检查是否已添加到MyDays
const isAddedToMyDays = (goal) => {
    return myDaysItemIds.value.has(goal.id)
}

// 切换MyDays状态
const toggleMyDays = (goal) => {
    const myDaysItems = localStorage.getItem('myDaysItems') || '[]'
    let items = JSON.parse(myDaysItems)
    
    if (isAddedToMyDays(goal)) {
        // 如果已添加，则移除
        items = items.filter(item => item.id !== goal.id)
        myDaysItemIds.value.delete(goal.id)
    } else {
        // 如果未添加，则添加
        items.push({...goal, addedFromYours: true})
        myDaysItemIds.value.add(goal.id)
    }
    
    localStorage.setItem('myDaysItems', JSON.stringify(items))
}

onMounted(() => {
    loadGoals()
    initMyDaysItems()
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.yours-plan {
    padding: 20px;
    padding-bottom: calc(80px + env(safe-area-inset-bottom));
}

.empty-state {
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100vh - 200px);  /* 减去头部和底部的空间 */
    font-size: 18px;
    color: #666;
}

.goals-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-top: 20px;
}

.add-button {
    position: fixed;
    bottom: 80px;
    right: 30px;
    width: 60px;
    height: 60px;
    background-color: #4CAF50;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    transition: transform 0.2s;
}

.add-button:hover {
    transform: scale(1.1);
}

.add-button.loading {
    opacity: 0.7;
    cursor: wait;
}

.plus-icon {
    color: white;
    font-size: 36px;
    font-weight: bold;
}

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
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.dialog-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
}

.dialog-buttons button {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.dialog-buttons button:first-child {
    background-color: #ff4444;
    color: white;
}

.dialog-buttons button:last-child {
    background-color: #f5f5f5;
    color: #333;
}

.action-btn {
    padding: 5px 15px;
    border: 1px solid #42b983;
    border-radius: 4px;
    cursor: pointer;
    background-color: transparent;
    color: #42b983;
    transition: all 0.3s ease;
    font-size: 14px;
    margin: 0 5px;
}

.action-btn:hover {
    background-color: rgba(66, 185, 131, 0.1);
}

.edit-btn {
    border-color: #42b983;
    color: #42b983;
}

.delete-btn {
    border-color: #ff4444;
    color: #ff4444;
}

.delete-btn:hover {
    background-color: rgba(255, 68, 68, 0.1);
}

.add-to-mydays-btn {
    border-color: #1e88e5;
    color: #1e88e5;
}

.add-to-mydays-btn:hover {
    background-color: rgba(30, 136, 229, 0.1);
}

.remove-from-mydays-btn {
    border-color: #ff4444;
    color: #ff4444;
}

.remove-from-mydays-btn:hover {
    background-color: rgba(255, 68, 68, 0.1);
}


.progress-wrapper.active {
    background-color: rgba(0, 0, 0, 0.05);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>