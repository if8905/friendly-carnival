<template>
  <div class="profile-view">
    <div class="profile-container">
      <!-- 左侧边栏导航 -->
      <div class="sidebar">
        <div class="user-info">
          <div class="avatar">
            <img :src="userStore.userInfo.avatar" alt="avatar" />
          </div>
          <h3>{{ userStore.userInfo.username }}</h3>
        </div>
        <nav class="profile-nav">
          <ul>
            <li 
              :class="{ active: activeTab === 'courses' }"
              @click="activeTab = 'courses'"
            >
              <el-icon><VideoPlay /></el-icon>
              <span>我的课程</span>
            </li>
            <li 
              :class="{ active: activeTab === 'orders' }"
              @click="activeTab = 'orders'"
            >
              <el-icon><Document /></el-icon>
              <span>我的订单</span>
            </li>
            <li 
              :class="{ active: activeTab === 'favorites' }"
              @click="activeTab = 'favorites'"
            >
              <el-icon><Star /></el-icon>
              <span>我的收藏</span>
            </li>
            <li 
              :class="{ active: activeTab === 'info' }"
              @click="activeTab = 'info'"
            >
              <el-icon><User /></el-icon>
              <span>个人信息</span>
            </li>
            <li 
              :class="{ active: activeTab === 'settings' }"
              @click="activeTab = 'settings'"
            >
              <el-icon><Setting /></el-icon>
              <span>账号设置</span>
            </li>
          </ul>
        </nav>
      </div>
      
      <!-- 右侧主内容区域 -->
      <div class="main-content">
        <!-- 我的课程 -->
        <div v-if="activeTab === 'courses'" class="tab-content">
          <h2>我的课程</h2>
          <div class="course-list">
            <div class="course-item" v-for="course in userStore.myCourses" :key="course.id">
              <div class="course-cover">
                <img :src="course.cover" alt="course" />
              </div>
              <div class="course-info">
                <h3>{{ course.title }}</h3>
                <div class="course-progress">
                  <el-progress :percentage="course.progress" />
                  <span class="progress-text">{{ course.progress }}% 已完成</span>
                </div>
                <div class="course-last-chapter">
                  <span>最近学习：{{ course.lastChapter }}</span>
                </div>
              </div>
              <div class="course-actions">
                <el-button type="primary" size="small">继续学习</el-button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 我的订单 -->
        <div v-if="activeTab === 'orders'" class="tab-content">
          <h2>我的订单</h2>
          <div class="order-tabs">
            <el-tabs v-model="activeOrderTab">
              <el-tab-pane label="全部" name="all" />
              <el-tab-pane label="待付款" name="pending" />
              <el-tab-pane label="待发货" name="shipping" />
              <el-tab-pane label="已完成" name="completed" />
            </el-tabs>
          </div>
          <div class="order-list">
            <div class="order-item" v-for="order in filteredOrders" :key="order.id">
              <div class="order-header">
                <span class="order-id">订单号：{{ order.id }}</span>
                <span class="order-status" :class="'status-' + order.status">
                  {{ order.status }}
                </span>
              </div>
              <div class="order-content">
                <div class="order-items">
                  <div class="order-item-detail" v-for="(item, index) in order.items" :key="index">
                    <span class="item-name">{{ item.name }}</span>
                    <span class="item-price">¥{{ item.price }} × {{ item.quantity }}</span>
                  </div>
                </div>
                <div class="order-footer">
                  <span class="order-time">下单时间：{{ order.createTime }}</span>
                  <div class="order-total">
                    <span>总计：</span>
                    <span class="total-price">¥{{ order.totalAmount }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 我的收藏 -->
        <div v-if="activeTab === 'favorites'" class="tab-content">
          <h2>我的收藏</h2>
          <div class="favorites-tabs">
            <el-tabs v-model="activeFavTab">
              <el-tab-pane label="课程" name="courses" />
              <el-tab-pane label="商品" name="products" />
            </el-tabs>
          </div>
          
          <!-- 收藏的课程 -->
          <div v-if="activeFavTab === 'courses'" class="favorites-list">
            <div class="favorite-item" v-for="course in userStore.myFavorites.courses" :key="course.id">
              <div class="favorite-cover">
                <img :src="course.cover" alt="course" />
              </div>
              <div class="favorite-info">
                <h3>{{ course.title }}</h3>
                <div class="favorite-price">¥{{ course.price }}</div>
              </div>
              <div class="favorite-actions">
                <el-button type="danger" size="small" @click="removeFavorite('course', course.id)">
                  取消收藏
                </el-button>
              </div>
            </div>
          </div>
          
          <!-- 收藏的商品 -->
          <div v-if="activeFavTab === 'products'" class="favorites-list">
            <div class="favorite-item" v-for="product in userStore.myFavorites.products" :key="product.id">
              <div class="favorite-cover">
                <img :src="product.image" alt="product" />
              </div>
              <div class="favorite-info">
                <h3>{{ product.name }}</h3>
                <div class="favorite-price">¥{{ product.price }}</div>
              </div>
              <div class="favorite-actions">
                <el-button type="danger" size="small" @click="removeFavorite('product', product.id)">
                  取消收藏
                </el-button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 个人信息 -->
        <div v-if="activeTab === 'info'" class="tab-content">
          <h2>个人信息</h2>
          <div class="info-form">
            <el-form :model="userInfoForm" label-width="100px">
              <el-form-item label="用户名">
                <el-input v-model="userInfoForm.username" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="userInfoForm.email" />
              </el-form-item>
              <el-form-item label="手机号">
                <el-input v-model="userInfoForm.phone" />
              </el-form-item>
              <el-form-item label="头像">
                <el-upload
                  class="avatar-uploader"
                  action="#"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                >
                  <img v-if="userInfoForm.avatar" :src="userInfoForm.avatar" class="avatar" />
                  <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                </el-upload>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveUserInfo">保存</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
        
        <!-- 账号设置 -->
        <div v-if="activeTab === 'settings'" class="tab-content">
          <h2>账号设置</h2>
          <div class="settings-form">
            <el-form :model="settingsForm" label-width="120px">
              <el-form-item label="修改密码">
                <el-button type="primary" @click="showChangePasswordDialog = true">修改密码</el-button>
              </el-form-item>
              <el-form-item label="绑定手机">
                <el-input v-model="settingsForm.phone" disabled />
                <el-button type="primary" size="small" @click="bindPhone">绑定</el-button>
              </el-form-item>
              <el-form-item label="绑定邮箱">
                <el-input v-model="settingsForm.email" disabled />
                <el-button type="primary" size="small" @click="bindEmail">绑定</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 修改密码对话框 -->
    <el-dialog
      v-model="showChangePasswordDialog"
      title="修改密码"
      width="500px"
    >
      <el-form :model="passwordForm" label-width="100px">
        <el-form-item label="当前密码">
          <el-input type="password" v-model="passwordForm.oldPassword" />
        </el-form-item>
        <el-form-item label="新密码">
          <el-input type="password" v-model="passwordForm.newPassword" />
        </el-form-item>
        <el-form-item label="确认新密码">
          <el-input type="password" v-model="passwordForm.confirmPassword" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showChangePasswordDialog = false">取消</el-button>
          <el-button type="primary" @click="changePassword">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '../stores/userStore'
import { VideoPlay, Document, Star, User, Setting, Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()

// 当前激活的标签
const activeTab = ref('courses')

// 订单标签
const activeOrderTab = ref('all')

// 收藏标签
const activeFavTab = ref('courses')

// 个人信息表单
const userInfoForm = ref({
  username: userStore.userInfo.username,
  email: '',
  phone: '',
  avatar: userStore.userInfo.avatar
})

// 设置表单
const settingsForm = ref({
  phone: '',
  email: ''
})

// 密码表单
const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 显示修改密码对话框
const showChangePasswordDialog = ref(false)

// 过滤后的订单
const filteredOrders = computed(() => {
  if (activeOrderTab.value === 'all') {
    return userStore.myOrders
  }
  // 这里可以根据状态过滤订单
  return userStore.myOrders
})

// 移除收藏
const removeFavorite = (type, id) => {
  userStore.removeFavorite(type, id)
  ElMessage.success('已取消收藏')
}

// 保存用户信息
const saveUserInfo = () => {
  // 保存逻辑
  ElMessage.success('保存成功')
}

// 处理头像上传
const handleAvatarSuccess = (response, file) => {
  userInfoForm.value.avatar = URL.createObjectURL(file.raw)
}

// 头像上传前验证
const beforeAvatarUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isJpgOrPng) {
    ElMessage.error('只能上传 JPG/PNG 图片')
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB')
  }
  return isJpgOrPng && isLt2M
}

// 修改密码
const changePassword = () => {
  // 修改密码逻辑
  showChangePasswordDialog.value = false
  ElMessage.success('密码修改成功')
}

// 绑定手机
const bindPhone = () => {
  ElMessage.info('跳转到手机绑定页面')
}

// 绑定邮箱
const bindEmail = () => {
  ElMessage.info('跳转到邮箱绑定页面')
}
</script>

<style scoped>
.profile-view {
  padding: 30px 0;
}

.profile-container {
  display: flex;
  gap: 30px;
}

/* 左侧边栏 */
.sidebar {
  flex: 0 0 250px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 30px 20px;
}

.user-info {
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.avatar {
  width: 80px;
  height: 80px;
  margin: 0 auto 15px;
  border-radius: 50%;
  overflow: hidden;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-info h3 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.profile-nav ul {
  list-style: none;
  padding: 0;
}

.profile-nav li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 5px;
  font-size: 14px;
  color: #666;
}

.profile-nav li:hover {
  background-color: #f5f5f5;
  color: #409eff;
}

.profile-nav li.active {
  background-color: #e6f7ff;
  color: #409eff;
  font-weight: 500;
}

/* 右侧主内容 */
.main-content {
  flex: 1;
}

.tab-content {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 30px;
  min-height: 500px;
}

.tab-content h2 {
  font-size: 20px;
  margin-bottom: 30px;
  color: #333;
}

/* 我的课程 */
.course-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.course-item {
  display: flex;
  gap: 20px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.3s;
}

.course-item:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.course-cover {
  flex: 0 0 120px;
  height: 80px;
  overflow: hidden;
}

.course-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.course-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.course-info h3 {
  font-size: 16px;
  color: #333;
  margin: 0;
}

.course-progress {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.progress-text {
  font-size: 12px;
  color: #666;
  align-self: flex-end;
}

.course-last-chapter {
  font-size: 12px;
  color: #999;
}

.course-actions {
  flex: 0 0 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 我的订单 */
.order-tabs {
  margin-bottom: 30px;
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-item {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
}

.order-id {
  font-size: 14px;
  color: #666;
}

.order-status {
  font-size: 14px;
  font-weight: 500;
}

.status-已完成 {
  color: #67c23a;
}

.status-待发货 {
  color: #e6a23c;
}

.status-待付款 {
  color: #f56c6c;
}

.order-content {
  padding: 20px;
}

.order-items {
  margin-bottom: 20px;
}

.order-item-detail {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;
}

.item-name {
  color: #333;
}

.item-price {
  color: #666;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15px;
  border-top: 1px solid #e0e0e0;
}

.order-time {
  font-size: 12px;
  color: #999;
}

.order-total {
  font-size: 14px;
  font-weight: 500;
}

.total-price {
  color: #f56c6c;
  font-size: 16px;
  font-weight: bold;
}

/* 我的收藏 */
.favorites-tabs {
  margin-bottom: 30px;
}

.favorites-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.favorite-item {
  display: flex;
  gap: 20px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.3s;
}

.favorite-item:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.favorite-cover {
  flex: 0 0 100px;
  height: 100px;
  overflow: hidden;
}

.favorite-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.favorite-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
}

.favorite-info h3 {
  font-size: 16px;
  color: #333;
  margin: 0;
}

.favorite-price {
  font-size: 18px;
  font-weight: bold;
  color: #f56c6c;
}

.favorite-actions {
  flex: 0 0 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 个人信息和设置表单 */
.info-form,
.settings-form {
  max-width: 600px;
}

.avatar-uploader {
  width: 120px;
  height: 120px;
}

.avatar {
  width: 120px;
  height: 120px;
  object-fit: cover;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #999;
  width: 120px;
  height: 120px;
  line-height: 120px;
}

/* 对话框 */
.dialog-footer {
  text-align: right;
}
</style>