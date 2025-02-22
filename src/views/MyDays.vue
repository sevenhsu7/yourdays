<template>
    <img alt="Vue logo" src="../assets/logo.png" class="logo">
    <h1>
        {{ nowDate }}
    </h1>
    <MonthProgress />
    <QuarterProgress />
    <YearProgress />
</template>

<script setup>
import { ref, computed } from 'vue'
import MonthProgress from '../components/MonthProgress.vue';
import QuarterProgress from '../components/QuarterProgress.vue';
import YearProgress from '../components/YearProgress.vue';

const now = ref(new Date())
const nowDate = computed(() => {
    const year = now.value.getFullYear()
    const month = now.value.getMonth() + 1
    const day = now.value.getDate()
    return `${year}年${month}月${day}日`
})
</script>

<style>
.logo {
    width: 100px;
    height: 100px;
    margin-top: 20px;
    margin-bottom: 10px;
}

h1 {
    margin-top: 10px;
    margin-bottom: 20px;
}
</style>
