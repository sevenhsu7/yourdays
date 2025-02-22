<template>
  <div class="progress-wrapper">
    <div class="head-container">
      <h2>{{ currentYear }}年</h2>
      <p v-if="dayOfYear < (daysOfYear * 2/3)">
        今年共{{ daysOfYear }}天，已经过了<strong>{{ dayOfYear }}</strong>天
      </p>
      <p v-else>
        今年共{{ daysOfYear }}天，还剩<strong>{{ daysOfYear - dayOfYear }}</strong>天
      </p>
    </div>

    <div class="progress-container">
      <div class="progress-bar" :style="{ width: progressPercentage_year + '%' }">
        <span :class="{ 'inside-text': progressPercentage_year >= 10, 'outside-text': progressPercentage_year < 10 }">
          {{ progressPercentage_year.toFixed(1) }}%
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
// 定义响应式的 now
const now = ref(new Date())
//const now = ref(new Date("2024-01-02"))
const currentYear = ref(now.value.getFullYear())
const dayOfYear = ref(0) // 定义响应式的 dayOfYear，今年的第几天
const daysOfYear = ref(0) // 定义响应式的 daysOfYear，今年的天数

const progressPercentage_year = ref(0) // 定义响应式的 progressPercentage_year，今年的进度

// 计算年进度
const calculateProgressOfYear = () => {
  const start = new Date(now.value.getFullYear(), 0, 0)
  const diff = now.value - start
  const oneDay = 1000 * 60 * 60 * 24
  dayOfYear.value = Math.floor(diff / oneDay)
  daysOfYear.value = now.value.getFullYear() % 4 === 0 ? 366 : 365
  progressPercentage_year.value = (dayOfYear.value / daysOfYear.value) * 100
}


onMounted(() => {
  calculateProgressOfYear() // 在组件挂载后执行这个函数
})

</script>  

<style scoped>
@import '../styles/progress-vue.scss';


</style> 
