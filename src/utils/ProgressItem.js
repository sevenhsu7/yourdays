class ProgressItem {
    constructor(title, startDate, deadline, description = '', type = 'task') {
        this.id = Date.now()
        this.title = title
        this.startDate = startDate
        this.deadline = deadline
        this.description = description
        this.type = type
    }

    static createTimeProgress(type) {
        const now = new Date()
        let startDate, endDate, title
        const quarter = Math.floor(now.getMonth() / 3)

        switch (type) {
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1)
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
                title = `${now.getMonth() + 1}月进度`
                break
            case 'quarter':
                startDate = new Date(now.getFullYear(), quarter * 3, 1)
                endDate = new Date(now.getFullYear(), (quarter + 1) * 3, 0)
                title = `Q${quarter + 1}季度`
                break
            case 'year':
                startDate = new Date(now.getFullYear(), 0, 1)
                endDate = new Date(now.getFullYear(), 11, 31)
                title = `${now.getFullYear()}年`
                break
        }

        return new ProgressItem(
            title,
            startDate.toISOString(),
            endDate.toISOString(),
            '',
            type
        )
    }

    calculateProgress() {
        const start = new Date(this.startDate).getTime()
        const end = new Date(this.deadline).getTime()
        const now = new Date().getTime()

        if (now >= end) return 100
        if (now <= start) return 0

        const total = end - start
        const current = now - start
        return Math.round((current / total) * 100)
    }
}

export default ProgressItem