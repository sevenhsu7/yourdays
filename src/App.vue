<template>
  <div class="content">
    <component :is="currentTab === 'MyDays' ? MyDays : Yours" />
  </div>
  
  <div class="tab-bar">
    <div 
      class="tab-item" 
      :class="{ active: currentTab === 'MyDays' }"
      @click="currentTab = 'MyDays'"
    >
      MyDays
    </div>
    <div 
      class="tab-item" 
      :class="{ active: currentTab === 'Yours' }"
      @click="currentTab = 'Yours'"
    >
      Yours
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import MyDays from './views/MyDays.vue'
import Yours from './views/YoursPlan.vue'  // 注意文件名是否正确

// 修改为字符串形式的组件名
const currentTab = ref('MyDays')

onMounted(() => {
    const viewportMeta = document.createElement('meta')
    viewportMeta.name = 'viewport'
    viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
    document.head.appendChild(viewportMeta)
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  padding-bottom: 60px; /* 为底部导航留出空间 */
}

.content {
  margin-bottom: 50px;
}

.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  display: flex;
  background-color: #fff;
  border-top: 1px solid #eee;
}

.tab-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.tab-item.active {
  color: #42b983;
  font-weight: bold;
}
</style>
