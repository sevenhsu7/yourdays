<template>
    <div 
        class="progress-wrapper"
        :class="{ 
            'active': isActive,
            'has-actions': hasActions
        }"
        :data-preset="item.id < 0"
        @click="$emit('toggle')"
    >
        <!-- 只在 YoursPlan 中显示皇冠标记 -->
        <span v-if="item.addedFromYours && !item.fromYoursPlan" class="crown-mark">👑</span>
        
        <div class="head-container">
            <h2>{{ item.title }}</h2>
            <!-- 根据类型显示不同的描述 -->
            <p v-if="item.type === 'task'">
                截止日期: {{ formatDate(item.deadline) }}
            </p>
            <p v-else>
                <template v-if="!isExpired && progress < 66.7">
                    <template v-if="isFirstDay">
                        {{ periodText }}的第<strong>1</strong>天
                    </template>
                    <template v-else>
                        {{ periodText }}已经过了<strong>{{ passedDays }}</strong>天
                    </template>
                </template>
                <template v-else>
                    <template v-if="isExpired">
                        {{ periodText }}已经到期咯
                    </template>
                    <template v-else-if="isLastDay">
                        {{ periodText }}的最后一天
                    </template>
                    <template v-else>
                        {{ periodText }}还剩<strong>{{ remainingDays }}</strong>天
                    </template>
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
            :class="{ show: isActive && hasActions }"
        >
            <slot name="actions"></slot>
        </div>
    </div>
</template>

<script>
import { computed } from 'vue'
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
    setup(props, { slots }) {
        console.log('ProgressWrapper props:', props)

        // 1. 基础工具函数
        const formatDate = (dateString) => {
            const date = new Date(dateString)
            return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
        }

        // 2. 周期文本计算
        const periodText = computed(() => {
            switch (props.item.type) {
                case 'month': return '本月'
                case 'quarter': return '本季'
                case 'year': return '今年'
                default: return ''
            }
        })

        // 3. 总天数计算
        const totalDays = computed(() => {
            const start = new Date(props.item.startDate)
            const end = new Date(props.item.deadline)
            const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
            return Math.max(1, days + 1)  // 确保最小为1天，并且包含起始日
        })

        // 4. 已过天数计算
        const passedDays = computed(() => {
            const start = new Date(props.item.startDate)
            const now = new Date()
            const days = Math.ceil((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
            return Math.min(totalDays.value, Math.max(0, days))  // 修改这里，允许从0开始计数
        })

        // 5. 剩余天数计算
        const remainingDays = computed(() => {
            const end = new Date(props.item.deadline).getTime()
            const now = new Date().getTime()
            return Math.ceil((end - now) / (1000 * 60 * 60 * 24))
        })

        // 6. 进度计算
        const progress = computed(() => {
            const start = new Date(props.item.startDate).getTime()
            const end = new Date(props.item.deadline).getTime()
            const now = new Date().getTime()
            const total = end - start
            const current = now - start

            if (now >= end) return 100
            if (now <= start) return 0

            return Math.min(100, Math.max(0, Math.round((current / total) * 100)))
        })

        // 7. UI 相关计算
        const hasActions = computed(() => {
            return !!slots.actions
        })

        // 8. 新增计算属性
        const isExpired = computed(() => {
            const now = new Date()
            const deadline = new Date(props.item.deadline)
            
            // 设置 deadline 为当天的最后一刻 (23:59:59.999)
            deadline.setHours(23, 59, 59, 999)
            
            return now.getTime() > deadline.getTime()
        })

        const isLastDay = computed(() => {
            const now = new Date()
            const deadline = new Date(props.item.deadline)
            
            // 判断是否是同一天
            return now.getFullYear() === deadline.getFullYear() &&
                    now.getMonth() === deadline.getMonth() &&
                    now.getDate() === deadline.getDate()
        })

        const isFirstDay = computed(() => {
            const now = new Date()
            const startDate = new Date(props.item.startDate)
            
            // 判断是否是同一天
            return now.getFullYear() === startDate.getFullYear() &&
                    now.getMonth() === startDate.getMonth() &&
                    now.getDate() === startDate.getDate()
        })

        return {
            formatDate,
            periodText,
            totalDays,
            passedDays,
            remainingDays,
            progress,
            hasActions,
            isExpired,
            isLastDay,
            isFirstDay
        }
    }
}
</script>

<style scoped>
@import "../styles/progress-vue.css";

.progress-wrapper {
    position: relative;  /* 确保相对定位 */
}

.crown-mark {
    position: absolute;
    top: -5px;
    right: -5px;
    font-size: 20px;
    transform: rotate(15deg);
    filter: drop-shadow(0 2px 2px rgba(0,0,0,0.1));
    z-index: 999;
}
</style>