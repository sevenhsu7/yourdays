import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            redirect: '/mydays'
        },
        {
            path: '/mydays',
            name: 'MyDays',
            component: () => import('../views/MyDays.vue')
        },
        {
            path: '/yours',
            name: 'YoursPlan',
            component: () => import('../views/YoursPlan.vue')
        },
        {
            path: '/addmy',
            name: 'AddMy',
            component: () => import('../views/AddMy.vue')
        }
    ]
})

export default router
