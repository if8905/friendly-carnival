import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/courses',
      name: 'Courses',
      component: () => import('../views/CoursesView.vue')
    },
    {
      path: '/course/:id',
      name: 'CourseDetail',
      component: () => import('../views/CourseDetailView.vue')
    },
    {
      path: '/shop',
      name: 'Shop',
      component: () => import('../views/ShopView.vue')
    },
    {
      path: '/product/:id',
      name: 'ProductDetail',
      component: () => import('../views/ProductDetailView.vue')
    },
    {
      path: '/support',
      name: 'Support',
      component: () => import('../views/SupportView.vue')
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('../views/ProfileView.vue')
    },
    // 管理端路由
    {
      path: '/admin/login',
      name: 'AdminLogin',
      component: () => import('../views/admin/LoginView.vue')
    },
    {
      path: '/admin',
      component: () => import('../views/admin/AdminLayout.vue'),
      children: [
        {
          path: '',
          redirect: 'dashboard'
        },
        {
          path: 'dashboard',
          name: 'AdminDashboard',
          component: () => import('../views/admin/DashboardView.vue')
        },
        {
          path: 'courses',
          name: 'AdminCourses',
          component: () => import('../views/admin/CoursesView.vue')
        },
        {
          path: 'products',
          name: 'AdminProducts',
          component: () => import('../views/admin/ProductsView.vue')
        },
        {
          path: 'orders',
          name: 'AdminOrders',
          component: () => import('../views/admin/OrdersView.vue')
        },
        {
          path: 'users',
          name: 'AdminUsers',
          component: () => import('../views/admin/UsersView.vue')
        },
        {
          path: 'support',
          name: 'AdminSupport',
          component: () => import('../views/admin/SupportView.vue')
        },
        {
          path: 'settings',
          name: 'AdminSettings',
          component: () => import('../views/admin/SettingsView.vue')
        }
      ]
    },
    {
      path: '/simple-admin',
      name: 'SimpleAdmin',
      component: () => import('../views/admin/SimpleAdmin.vue')
    }
  ]
})

export default router