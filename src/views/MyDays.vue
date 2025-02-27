<template>
    <img alt="Vue logo" src="../assets/logo.png" class="logo">
    <h1>{{ nowDate }}</h1>
    <div class="progress-items">
        <progress-wrapper
            v-for="item in timeProgressItems"
            :key="item.id"
            :item="item"
            :is-active="selectedItemId === item.id"
            @click.stop="toggleItem(item.id)"
        >
            <template #actions>
                <button 
                    v-if="item.addedFromYours"
                    class="action-btn remove-btn"
                    @click.stop="removeFromMyDays(item)"
                >
                    移除
                </button>
            </template>
        </progress-wrapper>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import ProgressWrapper from '../components/ProgressWrapper.vue'
import ProgressItem from '../utils/ProgressItem'

const now = ref(new Date())
const timeProgressItems = ref([])
const selectedItemId = ref(null)

const nowDate = computed(() => {
    const year = now.value.getFullYear()
    const month = now.value.getMonth() + 1
    const day = now.value.getDate()
    return `${year}年${month}月${day}日`
})

const toggleItem = (itemId) => {
    selectedItemId.value = selectedItemId.value === itemId ? null : itemId
}

// 处理点击空白处
const handleClickOutside = (event) => {
    // 获取点击的元素
    const clickedElement = event.target
    
    // 检查点击的元素是否在任何 progress-wrapper 内
    const isClickInsideWrapper = clickedElement.closest('.progress-wrapper')
    
    // 如果点击的不是任何 progress-wrapper，则清除选中状态
    if (!isClickInsideWrapper) {
        selectedItemId.value = null
    }
}

// 添加移除功能
const removeFromMyDays = (item) => {
    const myDaysItems = localStorage.getItem('myDaysItems') || '[]'
    let items = JSON.parse(myDaysItems)
    items = items.filter(i => i.id !== item.id)
    localStorage.setItem('myDaysItems', JSON.stringify(items))
    
    // 更新显示的列表
    timeProgressItems.value = timeProgressItems.value.filter(i => i.id !== item.id)
}

onMounted(() => {
    // 加载固定的时间进度项，使用负数ID以确保排在最后
    const timeProgress = [
        { ...ProgressItem.createTimeProgress('month'), id: -1 },
        { ...ProgressItem.createTimeProgress('quarter'), id: -2 },
        { ...ProgressItem.createTimeProgress('year'), id: -3 }
    ]
    
    // 加载从 YoursPlan 添加的项目
    const myDaysItems = localStorage.getItem('myDaysItems')
    const addedItems = myDaysItems ? JSON.parse(myDaysItems) : []
    
    // 直接使用添加的项目，不做任何修改
    timeProgressItems.value = [...timeProgress, ...addedItems].sort((a, b) => b.id - a.id)
    
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>

<style>
.logo {
    width: 100px;
    margin: 20px auto;
    display: block;
}

h1 {
    margin-top: 10px;
    margin-bottom: 20px;
}

.progress-items {
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 20px;
}

.action-btn {
    padding: 5px 15px;
    border: 1px solid #ff4444;
    border-radius: 4px;
    cursor: pointer;
    background-color: transparent;
    color: #ff4444;
    transition: all 0.3s ease;
    font-size: 14px;
}

.action-btn:hover {
    background-color: rgba(255, 68, 68, 0.1);
}

.remove-btn {
    border-color: #ff4444;
    color: #ff4444;
}

.progress-wrapper.active {
    background-color: rgba(0, 0, 0, 0.05) !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
}

.progress-wrapper.active.has-actions {
    padding-bottom: 20px !important;
}
</style>
