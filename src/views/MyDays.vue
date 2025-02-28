<template>
    <img alt="Vue logo" src="../assets/logo.png" class="logo">
    <h1>{{ nowDate }}</h1>
    <div class="progress-items">
        <div 
            v-for="item in timeProgressItems" 
            :key="item.id" 
            class="progress-wrapper-container"
            :class="{ 'has-scratch': canScratch(item.id) }"
            :data-item-id="item.id"
        >
            <progress-wrapper
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
            
            <!-- 刮刮乐层 -->
            <canvas
                v-if="selectedItemId === item.id && canScratch(item.id)"
                :ref="el => setScratchCanvas(el, item.id)"
                class="scratch-layer"
                @mousedown.stop="startScratching"
                @mousemove.stop="scratching"
                @mouseup.stop="stopScratching"
                @touchstart.stop.prevent="startScratching"
                @touchmove.stop.prevent="scratching"
                @touchend.stop="stopScratching"
            ></canvas>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import ProgressWrapper from '../components/ProgressWrapper.vue'
import ProgressItem from '../utils/ProgressItem'
import undermarkImage from '../assets/undermark.png'
import confetti from 'canvas-confetti'
console.log('Imported image path:', undermarkImage)

// 状态声明要放在最前面
const now = ref(new Date())
const timeProgressItems = ref([])
const selectedItemId = ref(null)
const isScratchMode = ref(false)
const scratchCanvases = ref(new Map())
const isScratching = ref(false)

const nowDate = computed(() => {
    const year = now.value.getFullYear()
    const month = now.value.getMonth() + 1
    const day = now.value.getDate()
    return `${year}年${month}月${day}日`
})

const toggleItem = (itemId) => {
    console.log('Toggle item:', itemId, 'Current selected:', selectedItemId.value)
    if (selectedItemId.value === itemId) {
        // 如果点击已选中的项目，取消选中
        selectedItemId.value = null
        isScratchMode.value = false
    } else {
        // 选中新项目，直接进入刮刮乐模式
        selectedItemId.value = itemId
        isScratchMode.value = true
    }
}

// 处理点击空白处
const handleClickOutside = (event) => {
    const clickedElement = event.target
    const isClickInsideWrapper = clickedElement.closest('.progress-wrapper-container')
    
    if (!isClickInsideWrapper) {
        selectedItemId.value = null
        isScratchMode.value = false
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

// 检查今天是否可以刮
const canScratch = (itemId) => {
    console.log('Checking if can scratch:', itemId)
    const lastScratch = localStorage.getItem(`lastScratch_${itemId}`)
    const canScratch = lastScratch !== new Date().toDateString()
    console.log('Can scratch:', canScratch, 'Last scratch:', lastScratch)
    return canScratch
}

// 设置canvas引用
const setScratchCanvas = (el, itemId) => {
    console.log('Setting up canvas for item:', itemId)
    if (el) {
        const ctx = el.getContext('2d', { willReadFrequently: true })
        console.log('Canvas context created:', ctx)
        scratchCanvases.value.set(itemId, {
            canvas: el,
            ctx: ctx
        })
        initScratchCanvas(itemId)
    }
}

// 初始化刮刮乐画布
const initScratchCanvas = (itemId) => {
    const canvasData = scratchCanvases.value.get(itemId)
    if (!canvasData) {
        console.error('No canvas data found for item:', itemId)
        return
    }
    
    const { canvas, ctx } = canvasData
    const wrapper = canvas.closest('.progress-wrapper-container')
    
    canvas.width = wrapper.offsetWidth - 30
    canvas.height = wrapper.offsetHeight - 35
    
    const img = new Image()
    img.src = undermarkImage
    
    img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        // 添加 show 类来触发淡入效果
        setTimeout(() => {
            canvas.classList.add('show')
        }, 50)
    }
    
    img.onerror = (error) => {
        console.error('Error loading image:', error)
    }
}

// 开始刮
const startScratching = (e) => {
    if (!isScratchMode.value) return
    e.preventDefault()
    isScratching.value = true
    
    const canvas = e.target
    const ctx = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()
    
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top
    
    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    ctx.arc(x, y, 20, 0, Math.PI * 2)
    ctx.fill()
}

// 刮的过程
const scratching = (e) => {
    if (!isScratching.value) return
    e.preventDefault()
    
    const canvas = e.target
    const ctx = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()
    
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top
    
    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    ctx.arc(x, y, 20, 0, Math.PI * 2)
    ctx.fill()
    
    checkScratchProgress(canvas)
}

// 停止刮
const stopScratching = () => {
    isScratching.value = false
}

// 检查刮的进度
const checkScratchProgress = (canvas) => {
    const ctx = canvas.getContext('2d')
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const pixels = imageData.data
    let transparentPixels = 0
    
    for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] < 128) transparentPixels++
    }
    
    const progress = transparentPixels / (pixels.length / 4)
    if (progress > 0.55) {
        canvas.style.transition = 'opacity 0.3s ease'
        canvas.style.opacity = '0'
        
        setTimeout(() => {
            canvas.style.display = 'none'
            
            // 获取卡片在视口中的位置
            const wrapper = canvas.closest('.progress-wrapper-container')
            const rect = wrapper.getBoundingClientRect()
            
            // 计算发射位置（相对于视口）
            const origin = {
                x: (rect.left + rect.width / 2) / window.innerWidth,  // 卡片水平中心点
                y: (rect.top + rect.height / 2) / window.innerHeight  // 卡片垂直中心点
            }
            
            // 触发彩带效果
            confetti({
                particleCount: 20, // 增加彩带数量
                spread: 150,        // 增加散布范围
                origin: origin,  // 使用计算出的位置
                colors: ['#FF69B4', '#87CEEB', '#98FB98', '#DDA0DD', '#F0E68C'],
                startVelocity: 45,  // 增加初始速度
                gravity: 0.6,       // 调整重力效果
                ticks: 300,         // 增加动画持续时间
                shapes: ['circle', 'square'],
                scalar: 1.5        // 增大彩带尺寸
            })
        }, 300)

        const container = canvas.closest('.progress-wrapper-container')
        const itemId = container.getAttribute('data-item-id')
        localStorage.setItem(`lastScratch_${itemId}`, new Date().toDateString())
        isScratchMode.value = false
    }
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
    scratchCanvases.value.clear()
})
</script>

<style>
.logo {
    width: 100px;
    margin: 5px auto;
    display: block;
}

h1 {
    margin-top: 5px;
    margin-bottom: 5px;
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

.progress-wrapper-container {
    position: relative;
    width: 100%;
    overflow: hidden;
}

.scratch-layer {
    position: absolute;
    top: 10px;
    left: 10px;
    width: calc(100% - 20px);
    height: calc(100% - 55px);
    pointer-events: auto;
    touch-action: none;
    z-index: 10;
    border-radius: 8px;
    opacity: 0;  /* 初始透明 */
    transition: opacity 0.2s ease;  /* 添加过渡效果 */
}


/* 预设卡片（月度、季度、年度进度）的刮刮乐层 */
.progress-wrapper[data-preset="true"] + .scratch-layer {
    height: calc(100% - 20px);  /* 预设卡片不需要留出按钮空间 */
}

.scratch-layer.show {
    opacity: 0.85;  /* 显示时完全不透明 */
}
</style>
