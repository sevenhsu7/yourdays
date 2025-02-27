export interface ProgressItem {
    id: number;
    title: string;
    startDate: string;
    deadline: string;
    description?: string;
    type: 'task' | 'month' | 'quarter' | 'year';  // 用于区分不同类型的实例
}

// 计算进度的通用方法
export function calculateProgress(item: ProgressItem): number {
    const start: number = new Date(item.startDate).getTime()
    const end: number = new Date(item.deadline).getTime()
    const now: number = new Date().getTime()

    const total: number = end - start
    const current: number = now - start

    let progress: number = (current / total) * 100
    return Math.min(Math.max(progress, 0), 100)
}

// 普通任务实例创建
export function createTaskProgress(
    title: string,
    startDate: string,
    deadline: string,
    description?: string
): ProgressItem {
    return {
        id: Date.now(),
        title,
        startDate,
        deadline,
        description,
        type: 'task'
    }
}

// 特殊时间进度实例创建（仅在 MyDays 中使用）
export function createTimeProgress(type: 'month' | 'quarter' | 'year'): ProgressItem {
    const now = new Date()
    let startDate: Date
    let endDate: Date
    let title: string

    switch (type) {
        case 'month':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1)
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
            title = `${now.getMonth() + 1}月进度`
            break
        case 'quarter':
            const quarter = Math.floor(now.getMonth() / 3)
            startDate = new Date(now.getFullYear(), quarter * 3, 1)
            endDate = new Date(now.getFullYear(), (quarter + 1) * 3, 0)
            title = `Q${quarter + 1}季度`
            break
        case 'year':
            startDate = new Date(now.getFullYear(), 0, 1)
            endDate = new Date(now.getFullYear(), 11, 31)
            title = `${now.getFullYear()}年`
            break
        default:
            throw new Error('Invalid progress type')
    }

    return {
        id: Date.now(),
        title,
        startDate: startDate.toISOString(),
        deadline: endDate.toISOString(),
        type
    }
}