import type { RouteRecordRaw } from 'vue-router'

/**
 * 路由定义规范!
 *
 * path: 中横线连接
 * name: 大驼峰，保持和组件name一致
 * component: 中横线连接
 */

export const basicRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Root',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/home/index.vue'),
  },
]
