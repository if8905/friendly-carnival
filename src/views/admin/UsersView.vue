<template>
  <div class="users-management">
    <!-- 操作栏 -->
    <div class="action-bar">
      <el-input
        v-model="searchQuery"
        placeholder="搜索用户名或邮箱"
        style="width: 300px"
        prefix-icon="Search"
      />
      <el-select v-model="roleFilter" placeholder="按角色筛选" style="margin-left: 20px">
        <el-option label="全部角色" value="" />
        <el-option label="普通用户" value="user" />
        <el-option label="学员" value="student" />
        <el-option label="管理员" value="admin" />
      </el-select>
    </div>
    
    <!-- 用户列表 -->
    <el-card class="mt-4">
      <el-table :data="filteredUsers" style="width: 100%">
        <el-table-column prop="id" label="用户ID" width="80" />
        <el-table-column label="头像" width="80">
          <template #default="scope">
            <el-avatar size="small">{{ scope.row.username.charAt(0).toUpperCase() }}</el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="phone" label="手机号" width="150" />
        <el-table-column prop="role" label="角色" width="120">
          <template #default="scope">
            <el-tag :type="getRoleType(scope.row.role)">
              {{ getRoleName(scope.row.role) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'active' ? 'success' : 'danger'">
              {{ scope.row.status === 'active' ? '活跃' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="注册时间" width="180" />
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button type="primary" size="small" @click="viewUserDetail(scope.row)">
              查看
            </el-button>
            <el-button 
              :type="scope.row.status === 'active' ? 'danger' : 'success'" 
              size="small" 
              @click="toggleUserStatus(scope.row)"
            >
              {{ scope.row.status === 'active' ? '禁用' : '启用' }}
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
          :total="users.length"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 用户详情对话框 -->
    <el-dialog
      v-model="showUserDetailDialog"
      title="用户详情"
      width="600px"
    >
      <div v-if="selectedUser" class="user-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="用户ID">{{ selectedUser.id }}</el-descriptions-item>
          <el-descriptions-item label="用户名">{{ selectedUser.username }}</el-descriptions-item>
          <el-descriptions-item label="邮箱">{{ selectedUser.email }}</el-descriptions-item>
          <el-descriptions-item label="手机号">{{ selectedUser.phone }}</el-descriptions-item>
          <el-descriptions-item label="角色">{{ getRoleName(selectedUser.role) }}</el-descriptions-item>
          <el-descriptions-item label="状态">{{ selectedUser.status === 'active' ? '活跃' : '禁用' }}</el-descriptions-item>
          <el-descriptions-item label="注册时间" span="2">{{ selectedUser.createTime }}</el-descriptions-item>
        </el-descriptions>
        
        <h4 class="mt-4">用户统计</h4>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="已购课程">{{ selectedUser.stats.courses }}</el-descriptions-item>
          <el-descriptions-item label="已购商品">{{ selectedUser.stats.products }}</el-descriptions-item>
          <el-descriptions-item label="总订单数">{{ selectedUser.stats.orders }}</el-descriptions-item>
          <el-descriptions-item label="总消费">{{ selectedUser.stats.totalSpent }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showUserDetailDialog = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { iEpSearch } from '@element-plus/icons-vue'

// 用户数据
const users = ref([
  {
    id: 1,
    username: '张三',
    email: 'zhangsan@example.com',
    phone: '13800138000',
    role: 'user',
    status: 'active',
    createTime: '2026-04-01 10:00',
    stats: {
      courses: 2,
      products: 3,
      orders: 5,
      totalSpent: '¥1280'
    }
  },
  {
    id: 2,
    username: '李四',
    email: 'lisi@example.com',
    phone: '13900139000',
    role: 'student',
    status: 'active',
    createTime: '2026-04-02 14:30',
    stats: {
      courses: 5,
      products: 1,
      orders: 6,
      totalSpent: '¥1980'
    }
  },
  {
    id: 3,
    username: '王五',
    email: 'wangwu@example.com',
    phone: '13700137000',
    role: 'user',
    status: 'active',
    createTime: '2026-04-03 09:15',
    stats: {
      courses: 0,
      products: 4,
      orders: 4,
      totalSpent: '¥890'
    }
  },
  {
    id: 4,
    username: '赵六',
    email: 'zhaoliu@example.com',
    phone: '13600136000',
    role: 'user',
    status: 'inactive',
    createTime: '2026-04-04 16:45',
    stats: {
      courses: 1,
      products: 0,
      orders: 1,
      totalSpent: '¥199'
    }
  },
  {
    id: 5,
    username: 'admin',
    email: 'admin@example.com',
    phone: '13500135000',
    role: 'admin',
    status: 'active',
    createTime: '2026-03-01 00:00',
    stats: {
      courses: 0,
      products: 0,
      orders: 0,
      totalSpent: '¥0'
    }
  }
])

// 搜索和筛选
const searchQuery = ref('')
const roleFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

// 用户详情
const showUserDetailDialog = ref(false)
const selectedUser = ref(null)

// 过滤后的用户
const filteredUsers = computed(() => {
  let result = users.value
  
  // 搜索筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(user => 
      user.username.toLowerCase().includes(query) || 
      user.email.toLowerCase().includes(query)
    )
  }
  
  // 角色筛选
  if (roleFilter.value) {
    result = result.filter(user => user.role === roleFilter.value)
  }
  
  // 分页
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return result.slice(start, end)
})

// 查看用户详情
const viewUserDetail = (user) => {
  selectedUser.value = { ...user }
  showUserDetailDialog.value = true
}

// 切换用户状态
const toggleUserStatus = (user) => {
  const newStatus = user.status === 'active' ? 'inactive' : 'active'
  const action = newStatus === 'active' ? '启用' : '禁用'
  
  ElMessageBox.confirm(`确定要${action}这个用户吗？`, `${action}用户`, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: newStatus === 'active' ? 'success' : 'warning'
  }).then(() => {
    user.status = newStatus
    ElMessage.success(`${action}成功`)
  }).catch(() => {
    // 取消操作
  })
}

// 分页处理
const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
}

const handleCurrentChange = (current) => {
  currentPage.value = current
}

// 获取角色名称
const getRoleName = (role) => {
  const roleMap = {
    'user': '普通用户',
    'student': '学员',
    'admin': '管理员'
  }
  return roleMap[role] || role
}

// 获取角色标签类型
const getRoleType = (role) => {
  const typeMap = {
    'user': 'info',
    'student': 'warning',
    'admin': 'success'
  }
  return typeMap[role] || 'info'
}
</script>

<style scoped>
.users-management {
  padding: 0;
}

.action-bar {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.user-detail {
  max-height: 500px;
  overflow-y: auto;
}

.dialog-footer {
  text-align: right;
}
</style>
