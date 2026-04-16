<template>
  <div class="admin-layout">
    <!-- 侧边栏导航 -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <h2>椰风纸语管理后台</h2>
      </div>
      <nav class="sidebar-nav">
        <el-menu
          :default-active="activeMenu"
          class="sidebar-menu"
          @select="handleMenuSelect"
        >
          <el-menu-item index="dashboard">
            <el-icon><i-ep-home /></el-icon>
            <span>仪表盘</span>
          </el-menu-item>
          <el-menu-item index="courses">
            <el-icon><i-ep-document /></el-icon>
            <span>课程管理</span>
          </el-menu-item>
          <el-menu-item index="products">
            <el-icon><i-ep-goods /></el-icon>
            <span>商品管理</span>
          </el-menu-item>
          <el-menu-item index="orders">
            <el-icon><i-ep-s-order /></el-icon>
            <span>订单管理</span>
          </el-menu-item>
          <el-menu-item index="users">
            <el-icon><i-ep-user /></el-icon>
            <span>用户管理</span>
          </el-menu-item>
          <el-menu-item index="support">
            <el-icon><i-ep-help-filled /></el-icon>
            <span>助农管理</span>
          </el-menu-item>
          <el-menu-item index="settings">
            <el-icon><i-ep-setting /></el-icon>
            <span>系统设置</span>
          </el-menu-item>
        </el-menu>
      </nav>
    </aside>
    
    <!-- 主内容区域 -->
    <main class="main-content">
      <!-- 顶部导航栏 -->
      <header class="top-nav">
        <div class="nav-left">
          <el-button type="text" @click="toggleSidebar">
            <el-icon><i-ep-menu /></el-icon>
          </el-button>
          <h3>{{ currentPageTitle }}</h3>
        </div>
        <div class="nav-right">
          <el-dropdown>
            <span class="user-info">
              <el-avatar size="small">A</el-avatar>
              <span>管理员</span>
              <el-icon class="el-icon--right"><i-ep-arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人中心</el-dropdown-item>
                <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>
      
      <!-- 内容区域 -->
      <div class="content-wrapper">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { iEpHome, iEpDocument, iEpGoods, iEpSOrder, iEpUser, iEpHelpFilled, iEpSetting, iEpMenu, iEpArrowDown } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

const sidebarCollapsed = ref(false)
const activeMenu = ref('dashboard')

const currentPageTitle = computed(() => {
  const titleMap = {
    '/admin/dashboard': '仪表盘',
    '/admin/courses': '课程管理',
    '/admin/products': '商品管理',
    '/admin/orders': '订单管理',
    '/admin/users': '用户管理',
    '/admin/support': '助农管理',
    '/admin/settings': '系统设置'
  }
  return titleMap[route.path] || '仪表盘'
})

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const handleMenuSelect = (key) => {
  activeMenu.value = key
  router.push(`/admin/${key}`)
}

const handleLogout = () => {
  localStorage.removeItem('adminToken')
  ElMessage.success('退出登录成功')
  router.push('/admin/login')
}

onMounted(() => {
  // 暂时跳过登录验证，直接访问后台
  console.log('直接访问后台管理页面')
  // 为了方便测试，自动设置token
  if (!localStorage.getItem('adminToken')) {
    localStorage.setItem('adminToken', 'mock-admin-token')
  }
})
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f5f7fa;
}

/* 侧边栏 */
.sidebar {
  width: 240px;
  background-color: #2c3e50;
  color: white;
  transition: width 0.3s;
}

.sidebar.collapsed {
  width: 80px;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid #34495e;
}

.sidebar-header h2 {
  font-size: 18px;
  margin: 0;
  text-align: center;
}

.sidebar-nav {
  padding: 20px 0;
}

.sidebar-menu {
  border-right: none;
  background-color: transparent;
}

.sidebar-menu .el-menu-item {
  color: white;
  height: 50px;
  line-height: 50px;
  margin: 0 10px;
  border-radius: 8px;
}

.sidebar-menu .el-menu-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.sidebar-menu .el-menu-item.is-active {
  background-color: #3498db;
  color: white;
}

/* 主内容区域 */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 顶部导航栏 */
.top-nav {
  height: 60px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.nav-left h3 {
  font-size: 18px;
  margin: 0;
  color: #333;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 20px;
  transition: background-color 0.3s;
}

.user-info:hover {
  background-color: #f0f0f0;
}

/* 内容区域 */
.content-wrapper {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}
</style>
