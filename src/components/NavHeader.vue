<template>
  <header class="nav-header">
    <div class="nav-container">
      <!-- Logo -->
      <div class="logo">
        <router-link to="/">
          <img src="/ip-logo.jpg" alt="椰风纸语" />
          <span>椰风纸语</span>
        </router-link>
      </div>
      
      <!-- 导航菜单 -->
      <nav class="nav-menu">
        <router-link to="/" class="nav-item">首页</router-link>
        <router-link to="/courses" class="nav-item">课程</router-link>
        <router-link to="/shop" class="nav-item">商城</router-link>
        <router-link to="/support" class="nav-item">助农</router-link>
        <router-link to="/profile" class="nav-item">个人中心</router-link>
      </nav>
      
      <!-- 搜索框 -->
      <div class="search-box">
        <el-input
          placeholder="搜索课程、商品..."
          prefix-icon="el-icon-search"
          size="small"
          class="search-input"
        />
      </div>
      
      <!-- 登录/注册按钮 -->
      <div class="auth-buttons">
        <el-button size="small" class="login-btn">登录</el-button>
        <el-button size="small" type="primary" class="register-btn">注册</el-button>
      </div>
    </div>
  </header>
</template>

<script setup>
// 导航栏组件
</script>

<style scoped>
.nav-header {
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 20px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo img {
  width: 40px;
  height: 40px;
}

.logo span {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.nav-menu {
  display: flex;
  gap: 30px;
}

.nav-item {
  color: #333;
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-item:hover {
  color: #409eff;
}

.search-box {
  flex: 0 0 300px;
}

.search-input {
  width: 100%;
}

.auth-buttons {
  display: flex;
  gap: 10px;
}

.login-btn {
  border-color: #409eff;
  color: #409eff;
}

.register-btn {
  background-color: #409eff;
  border-color: #409eff;
}
</style>