<template>
  <div class="dashboard">
    <!-- 统计卡片 -->
    <div class="stats-grid">
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ stats.courses }}</div>
          <div class="stat-label">课程总数</div>
        </div>
        <el-icon class="stat-icon"><i-ep-document /></el-icon>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ stats.products }}</div>
          <div class="stat-label">商品总数</div>
        </div>
        <el-icon class="stat-icon"><i-ep-goods /></el-icon>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ stats.orders }}</div>
          <div class="stat-label">订单总数</div>
        </div>
        <el-icon class="stat-icon"><i-ep-s-order /></el-icon>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ stats.users }}</div>
          <div class="stat-label">用户总数</div>
        </div>
        <el-icon class="stat-icon"><i-ep-user /></el-icon>
      </el-card>
    </div>
    
    <!-- 最近订单 -->
    <el-card class="mt-4">
      <template #header>
        <div class="card-header">
          <span>最近订单</span>
          <el-button type="primary" size="small">查看全部</el-button>
        </div>
      </template>
      <el-table :data="recentOrders" style="width: 100%">
        <el-table-column prop="id" label="订单号" width="180" />
        <el-table-column prop="user" label="用户" />
        <el-table-column prop="amount" label="金额" width="120" />
        <el-table-column prop="status" label="状态" width="120">
          <template #default="scope">
            <el-tag :type="getOrderStatusType(scope.row.status)">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="下单时间" width="180" />
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button type="primary" size="small" @click="viewOrder(scope.row.id)">
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <!-- 销售趋势 -->
    <el-card class="mt-4">
      <template #header>
        <div class="card-header">
          <span>销售趋势</span>
          <el-select v-model="timeRange" size="small" placeholder="选择时间范围">
            <el-option label="近7天" value="7" />
            <el-option label="近30天" value="30" />
            <el-option label="近90天" value="90" />
          </el-select>
        </div>
      </template>
      <div class="chart-container">
        <div class="chart-placeholder">
          <el-icon class="chart-icon"><i-ep-data-analysis /></el-icon>
          <p>销售趋势图表</p>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { iEpDocument, iEpGoods, iEpSOrder, iEpUser, iEpDataAnalysis } from '@element-plus/icons-vue'

// 统计数据
const stats = reactive({
  courses: 24,
  products: 36,
  orders: 128,
  users: 512
})

// 最近订单
const recentOrders = ref([
  { id: 'ORD20260416001', user: '张三', amount: '¥299', status: '已完成', time: '2026-04-16 10:30' },
  { id: 'ORD20260416002', user: '李四', amount: '¥89', status: '待发货', time: '2026-04-16 09:15' },
  { id: 'ORD20260415001', user: '王五', amount: '¥499', status: '已完成', time: '2026-04-15 16:45' },
  { id: 'ORD20260415002', user: '赵六', amount: '¥35', status: '待付款', time: '2026-04-15 14:20' },
  { id: 'ORD20260414001', user: '钱七', amount: '¥199', status: '已完成', time: '2026-04-14 11:00' }
])

// 时间范围
const timeRange = ref('7')

// 获取订单状态标签类型
const getOrderStatusType = (status) => {
  const typeMap = {
    '待付款': 'warning',
    '待发货': 'info',
    '已完成': 'success',
    '已取消': 'danger'
  }
  return typeMap[status] || 'info'
}

// 查看订单
const viewOrder = (orderId) => {
  ElMessage.info(`查看订单 ${orderId}`)
}
</script>

<style scoped>
.dashboard {
  padding: 0;
}

/* 统计卡片 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.stat-card {
  position: relative;
  overflow: hidden;
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-content {
  padding: 20px;
}

.stat-number {
  font-size: 32px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.stat-icon {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 48px;
  color: rgba(64, 158, 255, 0.1);
}

/* 卡片头部 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 图表容器 */
.chart-container {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.chart-placeholder {
  text-align: center;
  color: #999;
}

.chart-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

/* 响应式 */
@media screen and (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media screen and (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
