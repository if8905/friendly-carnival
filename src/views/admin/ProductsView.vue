<template>
  <div class="products-management">
    <!-- 操作栏 -->
    <div class="action-bar">
      <el-button type="primary" @click="openAddProductDialog">
        <el-icon><i-ep-plus /></el-icon> 添加商品
      </el-button>
      <el-input
        v-model="searchQuery"
        placeholder="搜索商品名称"
        style="width: 300px; margin-left: 20px"
        prefix-icon="Search"
      />
      <el-select v-model="categoryFilter" placeholder="按分类筛选" style="margin-left: 20px">
        <el-option label="全部商品" value="" />
        <el-option label="剪纸文创" value="paper-cut" />
        <el-option label="IP周边" value="ip-peripheral" />
        <el-option label="火山荔枝礼盒" value="lychee-gift" />
      </el-select>
    </div>
    
    <!-- 商品列表 -->
    <el-card class="mt-4">
      <el-table :data="filteredProducts" style="width: 100%">
        <el-table-column prop="id" label="商品ID" width="80" />
        <el-table-column label="图片" width="100">
          <template #default="scope">
            <el-image
              :src="scope.row.image"
              fit="cover"
              style="width: 80px; height: 60px"
            />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="商品名称" />
        <el-table-column prop="category" label="分类" width="120">
          <template #default="scope">
            <el-tag>{{ getCategoryName(scope.row.category) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="价格" width="100" />
        <el-table-column prop="stock" label="库存" width="100" />
        <el-table-column prop="sales" label="销量" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
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
      
      <!-- 分页 -->
      <div class="pagination mt-4">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="products.length"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 添加/编辑商品对话框 -->
    <el-dialog
      v-model="showProductDialog"
      :title="isEditMode ? '编辑商品' : '添加商品'"
      width="800px"
    >
      <el-form :model="productForm" :rules="productRules" ref="productFormRef" label-width="100px">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="productForm.name" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="商品图片" prop="image">
          <el-input v-model="productForm.image" placeholder="请输入商品图片URL" />
        </el-form-item>
        <el-form-item label="商品分类" prop="category">
          <el-select v-model="productForm.category" placeholder="请选择商品分类">
            <el-option label="剪纸文创" value="paper-cut" />
            <el-option label="IP周边" value="ip-peripheral" />
            <el-option label="火山荔枝礼盒" value="lychee-gift" />
          </el-select>
        </el-form-item>
        <el-form-item label="商品价格" prop="price">
          <el-input-number v-model="productForm.price" :min="0" :step="0.01" />
        </el-form-item>
        <el-form-item label="商品库存" prop="stock">
          <el-input-number v-model="productForm.stock" :min="0" :step="1" />
        </el-form-item>
        <el-form-item label="商品状态" prop="status">
          <el-select v-model="productForm.status" placeholder="请选择商品状态">
            <el-option label="上架" value="上架" />
            <el-option label="下架" value="下架" />
          </el-select>
        </el-form-item>
        <el-form-item label="商品描述" prop="description">
          <el-input type="textarea" v-model="productForm.description" rows="4" placeholder="请输入商品描述" />
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
import { iEpPlus, iEpSearch } from '@element-plus/icons-vue'

// 商品数据
const products = ref([
  {
    id: 1,
    name: '传统剪纸作品',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=traditional%20paper%20cutting%20artwork&image_size=landscape_4_3',
    category: 'paper-cut',
    price: 128,
    stock: 50,
    sales: 120,
    status: '上架',
    createTime: '2026-04-01 10:00'
  },
  {
    id: 2,
    name: 'IP周边抱枕',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=IP%20peripheral%20pillow%20paper%20cut%20style&image_size=landscape_4_3',
    category: 'ip-peripheral',
    price: 89,
    stock: 100,
    sales: 156,
    status: '上架',
    createTime: '2026-04-02 14:30'
  },
  {
    id: 3,
    name: '火山荔枝礼盒（小盒）',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=volcanic%20lychee%20gift%20box%20small&image_size=landscape_4_3',
    category: 'lychee-gift',
    price: 299,
    stock: 80,
    sales: 98,
    status: '上架',
    createTime: '2026-04-03 09:15'
  }
])

// 搜索和筛选
const searchQuery = ref('')
const categoryFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

// 过滤后的商品
const filteredProducts = computed(() => {
  let result = products.value
  
  // 搜索筛选
  if (searchQuery.value) {
    result = result.filter(product => 
      product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
  
  // 分类筛选
  if (categoryFilter.value) {
    result = result.filter(product => product.category === categoryFilter.value)
  }
  
  // 分页
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return result.slice(start, end)
})

// 商品表单
const showProductDialog = ref(false)
const isEditMode = ref(false)
const productFormRef = ref(null)
const productForm = reactive({
  id: '',
  name: '',
  image: '',
  category: 'paper-cut',
  price: 0,
  stock: 0,
  status: '上架',
  description: ''
})

const productRules = {
  name: [
    { required: true, message: '请输入商品名称', trigger: 'blur' }
  ],
  image: [
    { required: true, message: '请输入商品图片URL', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择商品分类', trigger: 'change' }
  ],
  price: [
    { required: true, message: '请输入商品价格', trigger: 'blur' }
  ],
  stock: [
    { required: true, message: '请输入商品库存', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择商品状态', trigger: 'change' }
  ]
}

// 打开添加商品对话框
const openAddProductDialog = () => {
  isEditMode.value = false
  // 重置表单
  Object.assign(productForm, {
    id: '',
    name: '',
    image: '',
    category: 'paper-cut',
    price: 0,
    stock: 0,
    status: '上架',
    description: ''
  })
  showProductDialog.value = true
}

// 编辑商品
const editProduct = (product) => {
  isEditMode.value = true
  // 复制商品数据到表单
  Object.assign(productForm, product)
  showProductDialog.value = true
}

// 保存商品
const saveProduct = async () => {
  if (!productFormRef.value) return
  
  try {
    await productFormRef.value.validate()
    
    if (isEditMode.value) {
      // 编辑商品
      const index = products.value.findIndex(p => p.id === productForm.id)
      if (index !== -1) {
        products.value[index] = { ...productForm }
        ElMessage.success('商品编辑成功')
      }
    } else {
      // 添加商品
      const newProduct = {
        ...productForm,
        id: products.value.length + 1,
        sales: 0,
        createTime: new Date().toLocaleString('zh-CN')
      }
      products.value.unshift(newProduct)
      ElMessage.success('商品添加成功')
    }
    
    showProductDialog.value = false
  } catch (error) {
    console.error('保存商品失败:', error)
  }
}

// 删除商品
const deleteProduct = (productId) => {
  ElMessageBox.confirm('确定要删除这个商品吗？', '删除商品', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = products.value.findIndex(p => p.id === productId)
    if (index !== -1) {
      products.value.splice(index, 1)
      ElMessage.success('商品删除成功')
    }
  }).catch(() => {
    // 取消删除
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

// 获取分类名称
const getCategoryName = (category) => {
  const categoryMap = {
    'paper-cut': '剪纸文创',
    'ip-peripheral': 'IP周边',
    'lychee-gift': '火山荔枝礼盒'
  }
  return categoryMap[category] || category
}

// 获取状态标签类型
const getStatusType = (status) => {
  return status === '上架' ? 'success' : 'danger'
}
</script>

<style scoped>
.products-management {
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

.dialog-footer {
  text-align: right;
}
</style>
