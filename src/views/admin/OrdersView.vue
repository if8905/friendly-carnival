<template>
  <div class="orders-management">
    <!-- 操作栏 -->
    <div class="action-bar">
      <el-input
        v-model="searchQuery"
        placeholder="搜索订单号或用户"
        style="width: 300px"
        prefix-icon="Search"
      />
      <el-select v-model="statusFilter" placeholder="按状态筛选" style="margin-left: 20px">
        <el-option label="全部状态" value="" />
        <el-option label="待付款" value="待付款" />
        <el-option label="待发货" value="待发货" />
        <el-option label="已完成" value="已完成" />
        <el-option label="已取消" value="已取消" />
      </el-select>
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        style="margin-left: 20px"
      />
    </div>
    
    <!-- 订单列表 -->
    <el-card class="mt-4">
      <el-table :data="filteredOrders" style="width: 100%">
        <el-table-column prop="id" label="订单号" width="180" />
        <el-table-column prop="user" label="用户" />
        <el-table-column prop="items" label="商品" width="300">
          <template #default="scope">
            <div v-for="(item, index) in scope.row.items" :key="index" class="order-item">
              {{ item.name }} x {{ item.quantity }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="totalAmount" label="总金额" width="120" />
        <el-table-column prop="status" label="状态" width="120">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="下单时间" width="180" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button type="primary" size="small" @click="viewOrderDetail(scope.row)">
              查看详情
            </el-button>
            <el-button 
              v-if="scope.row.status === '待发货'" 
              type="success" 
              size="small" 
              @click="shipOrder(scope.row.id)"
            >
              发货
            </el-button>
            <el-button 
              v-if="scope.row.status === '待付款'" 
              type="danger" 
              size="small" 
              @click="cancelOrder(scope.row.id)"
            >
              取消
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination mt-4">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="orders.length"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 订单详情对话框 -->
    <el-dialog
      v-model="showOrderDetailDialog"
      title="订单详情"
      width="800px"
    >
      <div v-if="selectedOrder" class="order-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="订单号">{{ selectedOrder.id }}</el-descriptions-item>
          <el-descriptions-item label="用户">{{ selectedOrder.user }}</el-descriptions-item>
          <el-descriptions-item label="下单时间">{{ selectedOrder.createTime }}</el-descriptions-item>
          <el-descriptions-item label="订单状态">{{ selectedOrder.status }}</el-descriptions-item>
          <el-descriptions-item label="总金额" span="2">{{ selectedOrder.totalAmount }}</el-descriptions-item>
        </el-descriptions>
        
        <h4 class="mt-4">商品信息</h4>
        <el-table :data="selectedOrder.items" style="width: 100%" border>
          <el-table-column prop="name" label="商品名称" />
          <el-table-column prop="price" label="单价" width="100" />
          <el-table-column prop="quantity" label="数量" width="100" />
          <el-table-column label="小计" width="120">
            <template #default="scope">
              {{ calculateItemTotal(scope.row) }}
            </template>
          </el-table-column>
        </el-table>
        
        <h4 class="mt-4">收货信息</h4>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="收货人">{{ selectedOrder.shippingInfo.name }}</el-descriptions-item>
          <el-descriptions-item label="联系电话">{{ selectedOrder.shippingInfo.phone }}</el-descriptions-item>
          <el-descriptions-item label="收货地址">{{ selectedOrder.shippingInfo.address }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showOrderDetailDialog = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { iEpSearch } from '@element-plus/icons-vue'

// 订单数据
const orders = ref([
  {
    id: 'ORD20260416001',
    user: '张三',
    items: [
      { name: '传统剪纸作品', price: '¥128', quantity: 1 },
      { name: 'IP周边抱枕', price: '¥89', quantity: 1 }
    ],
    totalAmount: '¥217',
    status: '已完成',
    createTime: '2026-04-16 10:30',
    shippingInfo: {
      name: '张三',
      phone: '13800138000',
      address: '北京市朝阳区某某街道123号'
    }
  },
  {
    id: 'ORD20260416002',
    user: '李四',
    items: [
      { name: 'IP周边抱枕', price: '¥89', quantity: 2 }
    ],
    totalAmount: '¥178',
    status: '待发货',
    createTime: '2026-04-16 09:15',
    shippingInfo: {
      name: '李四',
      phone: '13900139000',
      address: '上海市浦东新区某某路456号'
    }
  },
  {
    id: 'ORD20260415001',
    user: '王五',
    items: [
      { name: '火山荔枝礼盒（大盒）', price: '¥499', quantity: 1 }
    ],
    totalAmount: '¥499',
    status: '已完成',
    createTime: '2026-04-15 16:45',
    shippingInfo: {
      name: '王五',
      phone: '13700137000',
      address: '广州市天河区某某大道789号'
    }
  },
  {
    id: 'ORD20260415002',
    user: '赵六',
    items: [
      { name: 'IP周边钥匙扣', price: '¥35', quantity: 3 }
    ],
    totalAmount: '¥105',
    status: '待付款',
    createTime: '2026-04-15 14:20',
    shippingInfo: {
      name: '赵六',
      phone: '13600136000',
      address: '深圳市南山区某某路321号'
    }
  }
])

// 搜索和筛选
const searchQuery = ref('')
const statusFilter = ref('')
const dateRange = ref([])
const currentPage = ref(1)
const pageSize = ref(10)

// 订单详情
const showOrderDetailDialog = ref(false)
const selectedOrder = ref(null)

// 过滤后的订单
const filteredOrders = computed(() => {
  let result = orders.value
  
  // 搜索筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(order => 
      order.id.toLowerCase().includes(query) || 
      order.user.toLowerCase().includes(query)
    )
  }
  
  // 状态筛选
  if (statusFilter.value) {
    result = result.filter(order => order.status === statusFilter.value)
  }
  
  // 日期筛选
  if (dateRange.value && dateRange.value.length === 2) {
    const startDate = new Date(dateRange.value[0])
    const endDate = new Date(dateRange.value[1])
    endDate.setHours(23, 59, 59, 999)
    
    result = result.filter(order => {
      const orderDate = new Date(order.createTime)
      return orderDate >= startDate && orderDate <= endDate
    })
  }
  
  // 分页
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return result.slice(start, end)
})

// 查看订单详情
const viewOrderDetail = (order) => {
  selectedOrder.value = { ...order }
  showOrderDetailDialog.value = true
}

// 发货
const shipOrder = (orderId) => {
  ElMessageBox.confirm('确定要发货吗？', '确认发货', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info'
  }).then(() => {
    const order = orders.value.find(o => o.id === orderId)
    if (order) {
      order.status = '已完成'
      ElMessage.success('发货成功')
    }
  }).catch(() => {
    // 取消发货
  })
}

// 取消订单
const cancelOrder = (orderId) => {
  ElMessageBox.confirm('确定要取消这个订单吗？', '取消订单', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const order = orders.value.find(o => o.id === orderId)
    if (order) {
      order.status = '已取消'
      ElMessage.success('订单已取消')
    }
  }).catch(() => {
    // 取消操作
  })
}

// 计算商品小计
const calculateItemTotal = (item) => {
  const price = parseFloat(item.price.replace('¥', ''))
  return `¥${(price * item.quantity).toFixed(2)}`
}

// 分页处理
const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
}

const handleCurrentChange = (current) => {
  currentPage.value = current
}

// 获取状态标签类型
const getStatusType = (status) => {
  const typeMap = {
    '待付款': 'warning',
    '待发货': 'info',
    '已完成': 'success',
    '已取消': 'danger'
  }
  return typeMap[status] || 'info'
}
</script>

<style scoped>
.orders-management {
  padding: 0;
}

.action-bar {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
}

.order-item {
  margin-bottom: 5px;
  font-size: 14px;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.order-detail {
  max-height: 500px;
  overflow-y: auto;
}

.dialog-footer {
  text-align: right;
}
</style>
