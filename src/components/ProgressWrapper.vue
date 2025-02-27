<template>
    <div 
        class="progress-wrapper"
        :class="{ active: isActive }"
        @click="$emit('toggle')"
    >
        <div class="head-container">
            <h2>{{ item.title }}</h2>
            <!-- 根据类型显示不同的描述 -->
            <p v-if="item.type === 'task'">
                截止日期: {{ formatDate(item.deadline) }}
            </p>
            <p v-else>
                <template v-if="progress < 66.7">
                    {{ periodText }}已经过了<strong>{{ passedDays }}</strong>天
                </template>
                <template v-else>
                    {{ periodText }}还剩<strong>{{ remainingDays }}</strong>天
                </template>
            </p>
        </div>

        <div v-if="item.description" class="description-container">
            <p class="description-text">{{ item.description }}</p>
        </div>

        <div class="progress-container">
            <div class="progress-bar" :style="{ width: progress + '%' }">
                <span :class="{ 
                    'inside-text': progress >= 10, 
                    'outside-text': progress < 10 
                }">
                    {{ progress.toFixed(1) }}%
                </span>
            </div>
        </div>

        <!-- 操作按钮容器 -->
        <div 
            class="action-buttons"
            :class="{ show: isActive }"
        >
            <slot name="actions"></slot>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        item: {
            type: Object,
            required: true
        },
        isActive: {
            type: Boolean,
            default: false
        }
    },
    setup(props) {
        const { computed } = require('vue')

        const progress = computed(() => {
            const start = new Date(props.item.startDate).getTime()
            const end = new Date(props.item.deadline).getTime()
            const now = new Date().getTime()

            if (now >= end) return 100
            if (now <= start) return 0

            const total = end - start
            const current = now - start
            return Math.round((current / total) * 100)
        })

        const formatDate = (dateString) => {
            const date = new Date(dateString)
            return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
        }

        const periodText = computed(() => {
            switch (props.item.type) {
                case 'month': return '本月共'
                case 'quarter': return '本季共'
                case 'year': return '今年共'
                default: return ''
            }
        })

        const totalDays = computed(() => {
            const start = new Date(props.item.startDate)
            const end = new Date(props.item.deadline)
            return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
        })

        const passedDays = computed(() => {
            const start = new Date(props.item.startDate)
            const now = new Date()
            return Math.ceil((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
        })

        const remainingDays = computed(() => totalDays.value - passedDays.value)

        return {
            progress,
            formatDate,
            periodText,
            totalDays,
            passedDays,
            remainingDays
        }
    }
}
</script>

<style scoped>
@import '../styles/progress-vue.scss';

/* 覆盖一些基础样式以保持卡片效果 */
.progress-wrapper {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    margin-bottom: 15px;
    overflow: visible; /* 改为 visible 以显示溢出的按钮 */
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative; /* 确保相对定位 */
    padding-bottom: 20px; /* 为按钮预留空间 */
}

.progress-wrapper.active {
    background-color: rgba(0, 0, 0, 0.05);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 45px; /* 激活时增加底部间距，为按钮腾出空间 */
}

/* 描述容器和分割线样式 */
.description-container {
    margin: 10px 0;
    padding: 10px 0;
    border-top: 1px solid #eee;
    text-align: left;
}

.description-text {
    margin: 0;
    color: #666;
    font-size: 14px;
    line-height: 1.4;
    text-align: left;
    padding-left: 0;
}

/* 操作按钮容器样式 */
.action-buttons {
    position: absolute;
    left: 0;
    right: 0;
    bottom: -35px; /* 调整按钮位置 */
    display: flex;
    justify-content: center;
    gap: 10px;
    opacity: 0;
    transform: translateY(-10px);
    transition: all 0.3s ease;
    pointer-events: none;
    z-index: 1; /* 确保按钮在上层 */
}

.action-buttons.show {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
}

/* 强调文本样式 */
strong {
    font-weight: bold;
}

/* 覆盖进度条文本样式以匹配 QuarterProgress */
.inside-text, .outside-text {
    font-size: 16px;
    font-weight: bold;
}
</style>