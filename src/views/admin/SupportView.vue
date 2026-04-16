<template>
  <div class="support-management">
    <!-- 操作栏 -->
    <div class="action-bar">
      <el-button type="primary" @click="openAddFarmerDialog">
        <el-icon><i-ep-plus /></el-icon> 添加农户
      </el-button>
      <el-button type="primary" @click="openAddProductDialog">
        <el-icon><i-ep-plus /></el-icon> 添加助农产品
      </el-button>
    </div>
    
    <!-- 农户列表 -->
    <el-card class="mt-4">
      <template #header>
        <div class="card-header">
          <span>农户管理</span>
        </div>
      </template>
      <el-table :data="farmers" style="width: 100%">
        <el-table-column prop="id" label="农户ID" width="80" />
        <el-table-column prop="name" label="农户姓名" />
        <el-table-column prop="location" label="所在地区" />
        <el-table-column prop="products" label="产品数量" width="120" />
        <el-table-column prop="sales" label="销售额" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'active' ? 'success' : 'danger'">
              {{ scope.row.status === 'active' ? '活跃' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button type="primary" size="small" @click="editFarmer(scope.row)">
              编辑
            </el-button>
            <el-button type="danger" size="small" @click="deleteFarmer(scope.row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <!-- 助农产品列表 -->
    <el-card class="mt-4">
      <template #header>
        <div class="card-header">
          <span>助农产品管理</span>
        </div>
      </template>
      <el-table :data="supportProducts" style="width: 100%">
        <el-table-column prop="id" label="产品ID" width="80" />
        <el-table-column label="图片" width="100">
          <template #default="scope">
            <el-image
              :src="scope.row.image"
              fit="cover"
              style="width: 80px; height: 60px"
            />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="产品名称" />
        <el-table-column prop="farmer" label="所属农户" />
        <el-table-column prop="price" label="价格" width="100" />
        <el-table-column prop="stock" label="库存" width="100" />
        <el-table-column prop="sales" label="销量" width="100" />
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button type="primary" size="small" @click="editProduct(scope.row)">
              编辑
            </el-button>
            <el-button type="danger" size="small" @click="deleteProduct(scope.row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <!-- 助农数据 -->
    <el-card class="mt-4">
      <template #header>
        <div class="card-header">
          <span>助农数据统计</span>
        </div>
      </template>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">{{ totalFarmers }}</div>
          <div class="stat-label">累计农户数</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ totalProducts }}</div>
          <div class="stat-label">助农产品数</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ totalSales }}</div>
          <div class="stat-label">总销售额</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ totalOrders }}</div>
          <div class="stat-label">总订单数</div>
        </div>
      </div>
    </el-card>
    
    <!-- 添加/编辑农户对话框 -->
    <el-dialog
      v-model="showFarmerDialog"
      :title="isEditFarmerMode ? '编辑农户' : '添加农户'"
      width="600px"
    >
      <el-form :model="farmerForm" :rules="farmerRules" ref="farmerFormRef" label-width="100px">
        <el-form-item label="农户姓名" prop="name">
          <el-input v-model="farmerForm.name" placeholder="请输入农户姓名" />
        </el-form-item>
        <el-form-item label="所在地区" prop="location">
          <el-input v-model="farmerForm.location" placeholder="请输入所在地区" />
        </el-form-item>
        <el-form-item label="联系方式" prop="contact">
          <el-input v-model="farmerForm.contact" placeholder="请输入联系方式" />
        </el-form-item>
        <el-form-item label="农户简介" prop="description">
          <el-input type="textarea" v-model="farmerForm.description" rows="4" placeholder="请输入农户简介" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="farmerForm.status" placeholder="请选择状态">
            <el-option label="活跃" value="active" />
            <el-option label="禁用" value="inactive" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showFarmerDialog = false">取消</el-button>
          <el-button type="primary" @click="saveFarmer">保存</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 添加/编辑助农产品对话框 -->
    <el-dialog
      v-model="showProductDialog"
      :title="isEditProductMode ? '编辑助农产品' : '添加助农产品'"
      width="600px"
    >
      <el-form :model="productForm" :rules="productRules" ref="productFormRef" label-width="100px">
        <el-form-item label="产品名称" prop="name">
          <el-input v-model="productForm.name" placeholder="请输入产品名称" />
        </el-form-item>
        <el-form-item label="产品图片" prop="image">
          <el-input v-model="productForm.image" placeholder="请输入产品图片URL" />
        </el-form-item>
        <el-form-item label="所属农户" prop="farmerId">
          <el-select v-model="productForm.farmerId" placeholder="请选择所属农户">
            <el-option 
              v-for="farmer in farmers" 
              :key="farmer.id" 
              :label="farmer.name" 
              :value="farmer.id" 
            />
          </el-select>
        </el-form-item>
        <el-form-item label="产品价格" prop="price">
          <el-input-number v-model="productForm.price" :min="0" :step="0.01" />
        </el-form-item>
        <el-form-item label="产品库存" prop="stock">
          <el-input-number v-model="productForm.stock" :min="0" :step="1" />
        </el-form-item>
        <el-form-item label="产品描述" prop="description">
          <el-input type="textarea" v-model="productForm.description" rows="4" placeholder="请输入产品描述" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showProductDialog = false">取消</el-button>
          <el-button type="primary" @click="saveProduct">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { iEpPlus } from '@element-plus/icons-vue'

// 农户数据
const farmers = ref([
  {
    id: 1,
    name: '王大叔',
    location: '海口市秀英区石山镇',
    contact: '13800138001',
    description: '种植火山荔枝已有20余年，是当地的种植大户',
    status: 'active',
    products: 3,
    sales: '¥12,580'
  },
  {
    id: 2,
    name: '李阿姨',
    location: '海口市秀英区永兴镇',
    contact: '13900139001',
    description: '主要种植火山荔枝和黄皮，同时学习剪纸技艺',
    status: 'active',
    products: 2,
    sales: '¥8,920'
  }
])

// 助农产品数据
const supportProducts = ref([
  {
    id: 1,
    name: '火山荔枝礼盒（小盒）',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=volcanic%20lychee%20gift%20box%20small&image_size=landscape_4_3',
    farmerId: 1,
    farmer: '王大叔',
    price: 299,
    stock: 100,
    sales: 85
  },
  {
    id: 2,
    name: '火山荔枝礼盒（大盒）',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=volcanic%20lychee%20gift%20box%20large&image_size=landscape_4_3',
    farmerId: 1,
    farmer: '王大叔',
    price: 499,
    stock: 50,
    sales: 42
  },
  {
    id: 3,
    name: '火山黄皮礼盒',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=volcanic%20yellow%20peel%20gift%20box&image_size=landscape_4_3',
    farmerId: 2,
    farmer: '李阿姨',
    price: 199,
    stock: 80,
    sales: 63
  }
])

// 统计数据
const totalFarmers = computed(() => farmers.value.length)
const totalProducts = computed(() => supportProducts.value.length)
const totalSales = computed(() => {
  const sales = supportProducts.value.reduce((total, product) => {
    return total + product.price * product.sales
  }, 0)
  return `¥${sales.toLocaleString()}`
})
const totalOrders = computed(() => {
  return supportProducts.value.reduce((total, product) => {
    return total + product.sales
  }, 0)
})

// 农户表单
const showFarmerDialog = ref(false)
const isEditFarmerMode = ref(false)
const farmerFormRef = ref(null)
const farmerForm = reactive({
  id: '',
  name: '',
  location: '',
  contact: '',
  description: '',
  status: 'active'
})

const farmerRules = {
  name: [
    { required: true, message: '请输入农户姓名', trigger: 'blur' }
  ],
  location: [
    { required: true, message: '请输入所在地区', trigger: 'blur' }
  ],
  contact: [
    { required: true, message: '请输入联系方式', trigger: 'blur' }
  ]
}

// 产品表单
const showProductDialog = ref(false)
const isEditProductMode = ref(false)
const productFormRef = ref(null)
const productForm = reactive({
  id: '',
  name: '',
  image: '',
  farmerId: '',
  price: 0,
  stock: 0,
  description: ''
})

const productRules = {
  name: [
    { required: true, message: '请输入产品名称', trigger: 'blur' }
  ],
  image: [
    { required: true, message: '请输入产品图片URL', trigger: 'blur' }
  ],
  farmerId: [
    { required: true, message: '请选择所属农户', trigger: 'change' }
  ],
  price: [
    { required: true, message: '请输入产品价格', trigger: 'blur' }
  ],
  stock: [
    { required: true, message: '请输入产品库存', trigger: 'blur' }
  ]
}

// 打开添加农户对话框
const openAddFarmerDialog = () => {
  isEditFarmerMode.value = false
  // 重置表单
  Object.assign(farmerForm, {
    id: '',
    name: '',
    location: '',
    contact: '',
    description: '',
    status: 'active'
  })
  showFarmerDialog.value = true
}

// 编辑农户
const editFarmer = (farmer) => {
  isEditFarmerMode.value = true
  // 复制农户数据到表单
  Object.assign(farmerForm, farmer)
  showFarmerDialog.value = true
}

// 保存农户
const saveFarmer = async () => {
  if (!farmerFormRef.value) return
  
  try {
    await farmerFormRef.value.validate()
    
    if (isEditFarmerMode.value) {
      // 编辑农户
      const index = farmers.value.findIndex(f => f.id === farmerForm.id)
      if (index !== -1) {
        farmers.value[index] = { ...farmerForm }
        ElMessage.success('农户编辑成功')
      }
    } else {
      // 添加农户
      const newFarmer = {
        ...farmerForm,
        id: farmers.value.length + 1,
        products: 0,
        sales: '¥0'
      }
      farmers.value.unshift(newFarmer)
      ElMessage.success('农户添加成功')
    }
    
    showFarmerDialog.value = false
  } catch (error) {
    console.error('保存农户失败:', error)
  }
}

// 删除农户
const deleteFarmer = (farmerId) => {
  ElMessageBox.confirm('确定要删除这个农户吗？', '删除农户', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = farmers.value.findIndex(f => f.id === farmerId)
    if (index !== -1) {
      farmers.value.splice(index, 1)
      ElMessage.success('农户删除成功')
    }
  }).catch(() => {
    // 取消删除
  })
}

// 打开添加助农产品对话框
const openAddProductDialog = () => {
  isEditProductMode.value = false
  // 重置表单
  Object.assign(productForm, {
    id: '',
    name: '',
    image: '',
    farmerId: '',
    price: 0,
    stock: 0,
    description: ''
  })
  showProductDialog.value = true
}

// 编辑助农产品
const editProduct = (product) => {
  isEditProductMode.value = true
  // 复制产品数据到表单
  Object.assign(productForm, product)
  showProductDialog.value = true
}

// 保存助农产品
const saveProduct = async () => {
  if (!productFormRef.value) return
  
  try {
    await productFormRef.value.validate()
    
    if (isEditProductMode.value) {
      // 编辑助农产品
      const index = supportProducts.value.findIndex(p => p.id === productForm.id)
      if (index !== -1) {
        const farmer = farmers.value.find(f => f.id === productForm.farmerId)
        supportProducts.value[index] = {
          ...productForm,
          farmer: farmer ? farmer.name : ''
        }
        ElMessage.success('助农产品编辑成功')
      }
    } else {
      // 添加助农产品
      const farmer = farmers.value.find(f => f.id === productForm.farmerId)
      const newProduct = {
        ...productForm,
        id: supportProducts.value.length + 1,
        farmer: farmer ? farmer.name : '',
        sales: 0
      }
      supportProducts.value.unshift(newProduct)
      // 更新农户的产品数量
      if (farmer) {
        farmer.products++
      }
      ElMessage.success('助农产品添加成功')
    }
    
    showProductDialog.value = false
  } catch (error) {
    console.error('保存助农产品失败:', error)
  }
}

// 删除助农产品
const deleteProduct = (productId) => {
  ElMessageBox.confirm('确定要删除这个助农产品吗？', '删除助农产品', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = supportProducts.value.findIndex(p => p.id === productId)
    if (index !== -1) {
      const product = supportProducts.value[index]
      // 更新农户的产品数量
      const farmer = farmers.value.find(f => f.id === product.farmerId)
      if (farmer && farmer.products > 0) {
        farmer.products--
      }
      supportProducts.value.splice(index, 1)
      ElMessage.success('助农产品删除成功')
    }
  }).catch(() => {
    // 取消删除
  })
}
</script>

<style scoped>
.support-management {
  padding: 0;
}

.action-bar {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  gap: 10px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 统计卡片 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.stat-card {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 10px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.dialog-footer {
  text-align: right;
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
