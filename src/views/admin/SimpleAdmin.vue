<template>
  <div class="admin-container">
    <!-- 顶部导航 -->
    <header class="admin-header">
      <div class="header-left">
        <h1>椰风纸语管理后台</h1>
      </div>
      <div class="header-right">
        <span class="admin-user">管理员</span>
      </div>
    </header>
    
    <!-- 主内容区 -->
    <div class="admin-main">
      <!-- 侧边栏 -->
      <aside class="admin-sidebar">
        <nav class="sidebar-nav">
          <ul>
            <li v-for="menu in menuList" :key="menu.id" :class="{ active: activeMenu === menu.id }" @click="activeMenu = menu.id">
              <span class="menu-icon">{{ menu.icon }}</span>
              <span class="menu-text">{{ menu.text }}</span>
            </li>
          </ul>
        </nav>
      </aside>
      
      <!-- 内容区域 -->
      <main class="admin-content">
        <!-- 仪表盘 -->
        <div v-if="activeMenu === 'dashboard'" class="dashboard">
          <h2>仪表盘</h2>
          <div class="stats-grid">
            <div class="stat-card">
              <h3>总课程数</h3>
              <p>24</p>
            </div>
            <div class="stat-card">
              <h3>总商品数</h3>
              <p>48</p>
            </div>
            <div class="stat-card">
              <h3>总订单数</h3>
              <p>156</p>
            </div>
            <div class="stat-card">
              <h3>总用户数</h3>
              <p>892</p>
            </div>
          </div>
          
          <div class="recent-orders">
            <h3>最近订单</h3>
            <table class="orders-table">
              <thead>
                <tr>
                  <th>订单号</th>
                  <th>用户</th>
                  <th>金额</th>
                  <th>状态</th>
                  <th>时间</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in recentOrders" :key="order.id">
                  <td>{{ order.id }}</td>
                  <td>{{ order.user }}</td>
                  <td>¥{{ order.amount }}</td>
                  <td>
                    <span :class="['status-tag', order.status]">{{ order.statusText }}</span>
                  </td>
                  <td>{{ order.time }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <!-- 课程管理 -->
        <div v-if="activeMenu === 'courses'" class="courses">
          <div class="content-header">
            <h2>课程管理</h2>
            <button class="add-btn">添加课程</button>
          </div>
          
          <table class="courses-table">
            <thead>
              <tr>
                <th>课程ID</th>
                <th>课程名称</th>
                <th>价格</th>
                <th>课时</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="course in courses" :key="course.id">
                <td>{{ course.id }}</td>
                <td>{{ course.name }}</td>
                <td>¥{{ course.price }}</td>
                <td>{{ course.hours }}课时</td>
                <td>
                  <span :class="['status-tag', course.status]">{{ course.statusText }}</span>
                </td>
                <td>
                  <button class="edit-btn">编辑</button>
                  <button class="delete-btn">删除</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- 商品管理 -->
        <div v-if="activeMenu === 'products'" class="products">
          <div class="content-header">
            <h2>商品管理</h2>
            <button class="add-btn">添加商品</button>
          </div>
          
          <table class="products-table">
            <thead>
              <tr>
                <th>商品ID</th>
                <th>商品名称</th>
                <th>价格</th>
                <th>库存</th>
                <th>销量</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in products" :key="product.id">
                <td>{{ product.id }}</td>
                <td>{{ product.name }}</td>
                <td>¥{{ product.price }}</td>
                <td>{{ product.stock }}</td>
                <td>{{ product.sales }}</td>
                <td>
                  <button class="edit-btn">编辑</button>
                  <button class="delete-btn">删除</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- 订单管理 -->
        <div v-if="activeMenu === 'orders'" class="orders">
          <h2>订单管理</h2>
          
          <table class="orders-table">
            <thead>
              <tr>
                <th>订单号</th>
                <th>用户</th>
                <th>商品</th>
                <th>金额</th>
                <th>状态</th>
                <th>时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in allOrders" :key="order.id">
                <td>{{ order.id }}</td>
                <td>{{ order.user }}</td>
                <td>{{ order.product }}</td>
                <td>¥{{ order.amount }}</td>
                <td>
                  <span :class="['status-tag', order.status]">{{ order.statusText }}</span>
                </td>
                <td>{{ order.time }}</td>
                <td>
                  <button class="edit-btn">处理</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- 用户管理 -->
        <div v-if="activeMenu === 'users'" class="users">
          <h2>用户管理</h2>
          
          <table class="users-table">
            <thead>
              <tr>
                <th>用户ID</th>
                <th>用户名</th>
                <th>邮箱</th>
                <th>注册时间</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id">
                <td>{{ user.id }}</td>
                <td>{{ user.username }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.registerTime }}</td>
                <td>
                  <span :class="['status-tag', user.status]">{{ user.statusText }}</span>
                </td>
                <td>
                  <button class="edit-btn">编辑</button>
                  <button class="delete-btn">禁用</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 菜单列表
const menuList = [
  { id: 'dashboard', text: '仪表盘', icon: '📊' },
  { id: 'courses', text: '课程管理', icon: '📚' },
  { id: 'products', text: '商品管理', icon: '🛍️' },
  { id: 'orders', text: '订单管理', icon: '📋' },
  { id: 'users', text: '用户管理', icon: '👥' }
]

// 当前激活的菜单
const activeMenu = ref('dashboard')

// 最近订单数据
const recentOrders = [
  { id: '20240416001', user: '张三', amount: 199, status: 'completed', statusText: '已完成', time: '2024-04-16 10:30' },
  { id: '20240416002', user: '李四', amount: 299, status: 'pending', statusText: '待处理', time: '2024-04-16 09:15' },
  { id: '20240415001', user: '王五', amount: 89, status: 'completed', statusText: '已完成', time: '2024-04-15 16:45' }
]

// 课程数据
const courses = [
  { id: 'C001', name: '剪纸入门基础', price: 99, hours: 10, status: 'active', statusText: '在售' },
  { id: 'C002', name: '进阶剪纸技法', price: 199, hours: 15, status: 'active', statusText: '在售' },
  { id: 'C003', name: '传统纹样剪纸', price: 149, hours: 12, status: 'inactive', statusText: '下架' }
]

// 商品数据
const products = [
  { id: 'P001', name: 'IP周边抱枕', price: 59, stock: 100, sales: 25 },
  { id: 'P002', name: '剪纸艺术书签', price: 29, stock: 200, sales: 45 },
  { id: 'P003', name: '火山荔枝礼盒（小）', price: 128, stock: 50, sales: 18 },
  { id: 'P004', name: '火山荔枝礼盒（大）', price: 198, stock: 30, sales: 12 }
]

// 所有订单数据
const allOrders = [
  { id: '20240416001', user: '张三', product: 'IP周边抱枕', amount: 59, status: 'completed', statusText: '已完成', time: '2024-04-16 10:30' },
  { id: '20240416002', user: '李四', product: '火山荔枝礼盒（大）', amount: 198, status: 'pending', statusText: '待处理', time: '2024-04-16 09:15' },
  { id: '20240415001', user: '王五', product: '剪纸艺术书签', amount: 29, status: 'completed', statusText: '已完成', time: '2024-04-15 16:45' },
  { id: '20240415002', user: '赵六', product: '火山荔枝礼盒（小）', amount: 128, status: 'shipped', statusText: '已发货', time: '2024-04-15 14:20' }
]

// 用户数据
const users = [
  { id: 'U001', username: '张三', email: 'zhangsan@example.com', registerTime: '2024-04-01', status: 'active', statusText: '活跃' },
  { id: 'U002', username: '李四', email: 'lisi@example.com', registerTime: '2024-04-05', status: 'active', statusText: '活跃' },
  { id: 'U003', username: '王五', email: 'wangwu@example.com', registerTime: '2024-04-10', status: 'inactive', statusText: '禁用' }
]
</script>

<style scoped>
.admin-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f7fa;
}

/* 顶部导航 */
.admin-header {
  height: 60px;
  background-color: #2c3e50;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.admin-header h1 {
  font-size: 20px;
  margin: 0;
}

.admin-user {
  font-size: 14px;
  padding: 6px 12px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
}

/* 主内容区 */
.admin-main {
  flex: 1;
  display: flex;
}

/* 侧边栏 */
.admin-sidebar {
  width: 200px;
  background-color: #34495e;
  color: white;
}

.sidebar-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-nav li {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.sidebar-nav li:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.sidebar-nav li.active {
  background-color: #3498db;
}

.menu-icon {
  margin-right: 10px;
  font-size: 18px;
}

.menu-text {
  font-size: 14px;
}

/* 内容区域 */
.admin-content {
  flex: 1;
  padding: 30px;
  overflow-y: auto;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.content-header h2 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.add-btn {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.add-btn:hover {
  background-color: #2980b9;
}

/* 仪表盘 */
.dashboard h2 {
  margin-bottom: 30px;
  color: #333;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.stat-card h3 {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #666;
}

.stat-card p {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.recent-orders h3 {
  margin-bottom: 15px;
  color: #333;
}

/* 表格样式 */
table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

th, td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

th {
  background-color: #f5f5f5;
  font-weight: 600;
  color: #333;
}

tr:hover {
  background-color: #f9f9f9;
}

/* 状态标签 */
.status-tag {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-tag.active {
  background-color: #e8f5e8;
  color: #2e7d32;
}

.status-tag.inactive {
  background-color: #ffebee;
  color: #c62828;
}

.status-tag.completed {
  background-color: #e3f2fd;
  color: #1565c0;
}

.status-tag.pending {
  background-color: #fff8e1;
  color: #ef6c00;
}

.status-tag.shipped {
  background-color: #f3e5f5;
  color: #7b1fa2;
}

/* 操作按钮 */
.edit-btn, .delete-btn {
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  margin-right: 5px;
  transition: background-color 0.3s;
}

.edit-btn {
  background-color: #4caf50;
  color: white;
}

.edit-btn:hover {
  background-color: #388e3c;
}

.delete-btn {
  background-color: #f44336;
  color: white;
}

.delete-btn:hover {
  background-color: #d32f2f;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .admin-sidebar {
    width: 160px;
  }
  
  .admin-content {
    padding: 20px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  table {
    font-size: 14px;
  }
  
  th, td {
    padding: 8px 10px;
  }
}
</style>