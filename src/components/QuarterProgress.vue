<template>
    <div class="progress-wrapper">
        <div class="head-container">
            <h2>Q{{ quarter }}季度</h2>
            <p v-if="dayOfQuarter < (daysOfQuarter * 2/3)">
                本季共{{ daysOfQuarter }}天，已经过了<strong>{{ dayOfQuarter }}</strong>天
            </p>
            <p v-else>
                本季共{{ daysOfQuarter }}天，还剩<strong>{{ daysOfQuarter - dayOfQuarter }}</strong>天
            </p>
        </div>

        <div class="progress-container">
            <div class="progress-bar" :style="{ width: progressPercentage_quarter + '%' }">
                <span :class="{ 'inside-text': progressPercentage_quarter >= 10, 'outside-text': progressPercentage_quarter < 10 }">
                    {{ progressPercentage_quarter.toFixed(1) }}%
                </span>
            </div>
        </div>
    </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
// 定义响应式的 now
const now = ref(new Date())
const quarter = ref(0) // 定义响应式的 quarter，当前季度
const dayOfQuarter = ref(0) // 定义响应式的 dayOfQuarter，当前季度的第几天 
const daysOfQuarter = ref(0) // 定义响应式的 daysOfQuarter，当前季度的天数
const progressPercentage_quarter = ref(0) // 定义响应式的 progressPercentage_quarter，当前季度的进度


// 计算季度进度
const calculateProgressOfQuarter = () => {
    function getQuarter() {
        const month = now.value.getMonth() + 1
        return Math.floor((month - 1) / 3) + 1
    }
    quarter.value = getQuarter()
    // 计算当前季度，并赋值给quarter，要注意的是，季度是从1开始，月份是从0开始
    // 因为我们定义了响应式的quarter，所以这里需要使用 .value 赋值

    function getQuarterLength() {
        const quarterStart = new Date(now.value.getFullYear(), (quarter.value - 1) * 3, 0)
        const quarterEnd = new Date(now.value.getFullYear(), quarter.value * 3, 0)
        const diff = quarterEnd - quarterStart
        const oneDay = 1000 * 60 * 60 * 24
        return Math.floor(diff / oneDay)
    }

    daysOfQuarter.value = getQuarterLength()

    const start = new Date(now.value.getFullYear(), (quarter.value - 1) * 3, 0)
    const diff = now.value - start
    const oneDay = 1000 * 60 * 60 * 24
    dayOfQuarter.value = Math.floor(diff / oneDay)
    progressPercentage_quarter.value = (dayOfQuarter.value / daysOfQuarter.value) * 100

}

onMounted(() => {
    calculateProgressOfQuarter()
})

</script>

<style scoped>
@import '../styles/progress-vue.scss';


</style>
