<template>
  <div class="courses-management">
    <!-- 操作栏 -->
    <div class="action-bar">
      <el-button type="primary" @click="openAddCourseDialog">
        <el-icon><i-ep-plus /></el-icon> 添加课程
      </el-button>
      <el-input
        v-model="searchQuery"
        placeholder="搜索课程名称"
        style="width: 300px; margin-left: 20px"
        prefix-icon="Search"
      />
    </div>
    
    <!-- 课程列表 -->
    <el-card class="mt-4">
      <el-table :data="filteredCourses" style="width: 100%">
        <el-table-column prop="id" label="课程ID" width="80" />
        <el-table-column label="封面" width="100">
          <template #default="scope">
            <el-image
              :src="scope.row.image"
              fit="cover"
              style="width: 80px; height: 60px"
            />
          </template>
        </el-table-column>
        <el-table-column prop="title" label="课程名称" />
        <el-table-column prop="price" label="价格" width="100" />
        <el-table-column prop="level" label="难度" width="100">
          <template #default="scope">
            <el-tag :type="getLevelType(scope.row.level)">
              {{ scope.row.level }}
            </el-tag>
          </template>
        </el-table-column>
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
            <el-button type="primary" size="small" @click="editCourse(scope.row)">
              编辑
            </el-button>
            <el-button type="danger" size="small" @click="deleteCourse(scope.row.id)">
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
          :total="courses.length"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 添加/编辑课程对话框 -->
    <el-dialog
      v-model="showCourseDialog"
      :title="isEditMode ? '编辑课程' : '添加课程'"
      width="800px"
    >
      <el-form :model="courseForm" :rules="courseRules" ref="courseFormRef" label-width="100px">
        <el-form-item label="课程名称" prop="title">
          <el-input v-model="courseForm.title" placeholder="请输入课程名称" />
        </el-form-item>
        <el-form-item label="课程封面" prop="image">
          <el-input v-model="courseForm.image" placeholder="请输入封面图片URL" />
        </el-form-item>
        <el-form-item label="课程价格" prop="price">
          <el-input-number v-model="courseForm.price" :min="0" :step="1" />
        </el-form-item>
        <el-form-item label="课程难度" prop="level">
          <el-select v-model="courseForm.level" placeholder="请选择课程难度">
            <el-option label="入门基础" value="入门基础" />
            <el-option label="进阶技法" value="进阶技法" />
            <el-option label="研学课程" value="研学课程" />
          </el-select>
        </el-form-item>
        <el-form-item label="课程状态" prop="status">
          <el-select v-model="courseForm.status" placeholder="请选择课程状态">
            <el-option label="上架" value="上架" />
            <el-option label="下架" value="下架" />
          </el-select>
        </el-form-item>
        <el-form-item label="课程简介" prop="description">
          <el-input type="textarea" v-model="courseForm.description" rows="4" placeholder="请输入课程简介" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showCourseDialog = false">取消</el-button>
          <el-button type="primary" @click="saveCourse">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { iEpPlus, iEpSearch } from '@element-plus/icons-vue'

// 课程数据
const courses = ref([
  {
    id: 1,
    title: '剪纸基础入门',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=paper%20cutting%20basic%20course&image_size=landscape_4_3',
    price: 99,
    level: '入门基础',
    status: '上架',
    createTime: '2026-04-01 10:00'
  },
  {
    id: 2,
    title: '进阶剪纸技法',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=advanced%20paper%20cutting%20techniques&image_size=landscape_4_3',
    price: 199,
    level: '进阶技法',
    status: '上架',
    createTime: '2026-04-02 14:30'
  },
  {
    id: 3,
    title: '秀英剪纸研学',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=paper%20cutting%20study%20tour&image_size=landscape_4_3',
    price: 299,
    level: '研学课程',
    status: '上架',
    createTime: '2026-04-03 09:15'
  }
])

// 搜索和分页
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

// 过滤后的课程
const filteredCourses = computed(() => {
  let result = courses.value
  if (searchQuery.value) {
    result = result.filter(course => 
      course.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
  // 分页
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return result.slice(start, end)
})

// 课程表单
const showCourseDialog = ref(false)
const isEditMode = ref(false)
const courseFormRef = ref(null)
const courseForm = reactive({
  id: '',
  title: '',
  image: '',
  price: 0,
  level: '入门基础',
  status: '上架',
  description: ''
})

const courseRules = {
  title: [
    { required: true, message: '请输入课程名称', trigger: 'blur' }
  ],
  image: [
    { required: true, message: '请输入封面图片URL', trigger: 'blur' }
  ],
  price: [
    { required: true, message: '请输入课程价格', trigger: 'blur' }
  ],
  level: [
    { required: true, message: '请选择课程难度', trigger: 'change' }
  ],
  status: [
    { required: true, message: '请选择课程状态', trigger: 'change' }
  ]
}

// 打开添加课程对话框
const openAddCourseDialog = () => {
  isEditMode.value = false
  // 重置表单
  Object.assign(courseForm, {
    id: '',
    title: '',
    image: '',
    price: 0,
    level: '入门基础',
    status: '上架',
    description: ''
  })
  showCourseDialog.value = true
}

// 编辑课程
const editCourse = (course) => {
  isEditMode.value = true
  // 复制课程数据到表单
  Object.assign(courseForm, course)
  showCourseDialog.value = true
}

// 保存课程
const saveCourse = async () => {
  if (!courseFormRef.value) return
  
  try {
    await courseFormRef.value.validate()
    
    if (isEditMode.value) {
      // 编辑课程
      const index = courses.value.findIndex(c => c.id === courseForm.id)
      if (index !== -1) {
        courses.value[index] = { ...courseForm }
        ElMessage.success('课程编辑成功')
      }
    } else {
      // 添加课程
      const newCourse = {
        ...courseForm,
        id: courses.value.length + 1,
        createTime: new Date().toLocaleString('zh-CN')
      }
      courses.value.unshift(newCourse)
      ElMessage.success('课程添加成功')
    }
    
    showCourseDialog.value = false
  } catch (error) {
    console.error('保存课程失败:', error)
  }
}

// 删除课程
const deleteCourse = (courseId) => {
  ElMessageBox.confirm('确定要删除这门课程吗？', '删除课程', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = courses.value.findIndex(c => c.id === courseId)
    if (index !== -1) {
      courses.value.splice(index, 1)
      ElMessage.success('课程删除成功')
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

// 获取难度标签类型
const getLevelType = (level) => {
  const typeMap = {
    '入门基础': 'info',
    '进阶技法': 'warning',
    '研学课程': 'success'
  }
  return typeMap[level] || 'info'
}

// 获取状态标签类型
const getStatusType = (status) => {
  return status === '上架' ? 'success' : 'danger'
}
</script>

<style scoped>
.courses-management {
  padding: 0;
}

.action-bar {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
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
