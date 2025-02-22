<template>
  <div class="progress-wrapper">
    <div class="head-container">
      <h2>{{ currentMonth }}月进度</h2>
      <p v-if="dayOfMonth < (daysOfMonth *2/3)"> 
        本月共{{ daysOfMonth }}天，已经过了<strong>{{ dayOfMonth }}</strong>天
      </p>
      <p v-else>
        本月共{{ daysOfMonth }}天，还剩<strong>{{ daysOfMonth - dayOfMonth }}</strong>天
      </p>
    </div>

    <div class="progress-container">
      <div class="progress-bar" :style="{ width: progressPercentage_month + '%' }">
        <span :class="{ 
          'inside-text': progressPercentage_month >= 10, 
          'outside-text': progressPercentage_month < 10 
        }">
          {{ progressPercentage_month.toFixed(1) }}%
        </span>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const now = ref(new Date())
const dayOfMonth = ref(0)      // 当前月份的第几天
const daysOfMonth = ref(0)     // 当前月份的总天数
const progressPercentage_month = ref(0)  // 月度进度百分比
const currentMonth = ref(0)    // 当前月份

// 计算月进度
const calculateProgressOfMonth = () => {
  currentMonth.value = now.value.getMonth() + 1
  dayOfMonth.value = now.value.getDate()
  daysOfMonth.value = new Date(
    now.value.getFullYear(),
    now.value.getMonth() + 1,
    0
  ).getDate()
  progressPercentage_month.value = (dayOfMonth.value / daysOfMonth.value) * 100
}

onMounted(() => {
  calculateProgressOfMonth()
})

</script>

<style scoped>
@import '../styles/progress-vue.scss';


</style> 