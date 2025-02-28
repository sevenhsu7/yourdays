<template>
  <div class="content">
    <router-view></router-view>
  </div>
  
  <div class="tab-bar">
    <div 
      class="tab-item" 
      :class="{ active: currentRoute === 'MyDays' }"
      @click="navigateTo('mydays')"
    >
      MyDays
    </div>
    <div 
      class="tab-item" 
      :class="{ active: currentRoute === 'Yours' }"
      @click="navigateTo('yours')"
    >
      Yours
    </div>
  </div>
</template>

<script setup>
import {  computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 使用计算属性来确定当前路由
const currentRoute = computed(() => {
  if (route.path === '/mydays') return 'MyDays'
  if (route.path === '/yours') return 'Yours'
  return ''
})

// 导航函数
const navigateTo = (path) => {
  console.log('Navigating to:', path)  // 添加日志
  router.push(`/${path}`)
}

// 检测微信浏览器函数
const isWechat = () => {
  return /MicroMessenger/i.test(navigator.userAgent)
}

// 添加路由变化监听
onMounted(() => {
  router.beforeEach((to, from) => {
    console.log('Route change:', { from: from.path, to: to.path })
  })

    // 设置 viewport
    const viewportMeta = document.createElement('meta')
    viewportMeta.name = 'viewport'
    viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
    document.head.appendChild(viewportMeta)

    // 检测并添加微信浏览器类名
    if (isWechat()) {
      document.body.classList.add('is-wechat')
    }
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 10px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.content {
  margin-bottom: 60px;  /* 默认边距 */
}

.tab-bar {
  position: fixed;
  bottom: 0;  /* 默认位置 */
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

/* 1. 首先检查浏览器是否支持安全区域特性 */
@supports (padding: env(safe-area-inset-bottom)) {
  
  /* 2. 然后检查是否是触摸屏设备 */
  @media (hover: none) and (pointer: coarse) {
    
    /* 3. 调整内容区域的底部边距 */
    .content {
      margin-bottom: calc(60px + env(safe-area-inset-bottom));
      /* 60px 是基础间距
         env(safe-area-inset-bottom) 是设备底部安全区域的高度
         在 iPhone X 及以上机型约为 34px */
    }

    /* 4. 调整标签栏的底部内边距 */
    .tab-bar {
      padding-bottom: env(safe-area-inset-bottom);
      /* 给标签栏添加底部内边距，避免与 iPhone 的 Home Indicator 重叠 */
    }
  }
}


/* 只针对微信浏览器 */
.is-wechat .content {
  margin-bottom: calc(60px + 20px) !important;  /* 使用 !important 确保覆盖其他样式 */
}

.is-wechat .tab-bar {
  padding-bottom: 20px !important;
}
</style>
