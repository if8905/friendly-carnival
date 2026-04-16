<template>
  <div class="courses-view">
    <div class="courses-container">
      <!-- 左侧边栏：课程分类树 -->
      <div class="sidebar">
        <h3>课程分类</h3>
        <el-tree
          :data="categoryTree"
          :props="treeProps"
          @node-click="handleCategoryClick"
          default-expand-all
          class="category-tree"
        />
      </div>
      
      <!-- 右侧主区域 -->
      <div class="main-content">
        <!-- 顶部筛选栏 -->
        <div class="filter-bar">
          <div class="filter-item">
            <span>综合排序：</span>
            <el-select v-model="sortBy" size="small" @change="handleSortChange">
              <el-option label="推荐" value="recommend" />
              <el-option label="销量" value="sales" />
              <el-option label="价格" value="price" />
              <el-option label="评分" value="rating" />
            </el-select>
          </div>
          <div class="filter-item">
            <span>价格区间：</span>
            <el-select v-model="priceRange" size="small" @change="handlePriceChange">
              <el-option label="全部" value="all" />
              <el-option label="0-100元" value="0-100" />
              <el-option label="100-200元" value="100-200" />
              <el-option label="200元以上" value="200+" />
            </el-select>
          </div>
          <div class="filter-item">
            <span>难度：</span>
            <el-select v-model="level" size="small" @change="handleLevelChange">
              <el-option label="全部" value="all" />
              <el-option label="入门" value="入门" />
              <el-option label="中级" value="中级" />
              <el-option label="高级" value="高级" />
            </el-select>
          </div>
        </div>
        
        <!-- 课程卡片网格列表 -->
        <div class="course-grid">
          <div class="course-card" v-for="course in filteredCourses" :key="course.id">
            <router-link :to="`/course/${course.id}`">
              <div class="course-cover">
                <img :src="course.cover" alt="course" />
              </div>
              <div class="course-info">
                <h3>{{ course.title }}</h3>
                <p class="course-desc">{{ course.description }}</p>
                <div class="course-meta">
                  <span>{{ course.lessons }}课时</span>
                  <span>{{ course.level }}</span>
                  <span>¥{{ course.price }}</span>
                </div>
                <div class="course-rating">
                  <el-rate v-model="course.rating" disabled show-score />
                </div>
              </div>
            </router-link>
          </div>
        </div>
        
        <!-- 分页 -->
        <div class="pagination">
          <el-pagination
            layout="prev, pager, next"
            :total="filteredCourses.length"
            :page-size="8"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCourseStore } from '../stores/courseStore'

const courseStore = useCourseStore()

// 分类树数据
const categoryTree = ref([
  {
    label: '全部课程',
    value: 'all',
    children: [
      {
        label: '入门基础',
        value: '入门基础'
      },
      {
        label: '进阶技法',
        value: '进阶技法'
      },
      {
        label: '研学课程',
        value: '研学课程'
      }
    ]
  }
])

const treeProps = {
  children: 'children',
  label: 'label',
  value: 'value'
}

// 筛选条件
const selectedCategory = ref('all')
const sortBy = ref('recommend')
const priceRange = ref('all')
const level = ref('all')

// 处理分类点击
const handleCategoryClick = (data) => {
  selectedCategory.value = data.value
}

// 处理排序变化
const handleSortChange = () => {
  // 排序逻辑
}

// 处理价格区间变化
const handlePriceChange = () => {
  // 价格筛选逻辑
}

// 处理难度变化
const handleLevelChange = () => {
  // 难度筛选逻辑
}

// 处理分页变化
const handleCurrentChange = (page) => {
  // 分页逻辑
}

// 过滤后的课程列表
const filteredCourses = computed(() => {
  let courses = courseStore.courses
  
  // 按分类筛选
  if (selectedCategory.value !== 'all') {
    courses = courses.filter(course => course.category === selectedCategory.value)
  }
  
  // 按难度筛选
  if (level.value !== 'all') {
    courses = courses.filter(course => course.level === level.value)
  }
  
  // 按价格筛选
  if (priceRange.value !== 'all') {
    if (priceRange.value === '0-100') {
      courses = courses.filter(course => course.price <= 100)
    } else if (priceRange.value === '100-200') {
      courses = courses.filter(course => course.price > 100 && course.price <= 200)
    } else if (priceRange.value === '200+') {
      courses = courses.filter(course => course.price > 200)
    }
  }
  
  // 排序
  if (sortBy.value === 'price') {
    courses.sort((a, b) => a.price - b.price)
  } else if (sortBy.value === 'rating') {
    courses.sort((a, b) => b.rating - a.rating)
  }
  
  return courses
})
</script>

<style scoped>
.courses-view {
  padding: 30px 0;
}

.courses-container {
  display: flex;
  gap: 30px;
}

/* 左侧边栏 */
.sidebar {
  flex: 0 0 200px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.sidebar h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
}

.category-tree {
  font-size: 14px;
}

/* 右侧主区域 */
.main-content {
  flex: 1;
}

/* 筛选栏 */
.filter-bar {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 15px 20px;
  margin-bottom: 20px;
  display: flex;
  gap: 30px;
  align-items: center;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-item span {
  font-size: 14px;
  color: #666;
}

/* 课程网格 */
.course-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.course-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s;
}

.course-card:hover {
  transform: translateY(-5px);
}

.course-card a {
  text-decoration: none;
  color: inherit;
  display: block;
}

.course-cover {
  height: 180px;
  overflow: hidden;
}

.course-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.course-card:hover .course-cover img {
  transform: scale(1.05);
}

.course-info {
  padding: 15px;
}

.course-info h3 {
  font-size: 16px;
  margin-bottom: 10px;
  color: #333;
  line-height: 1.4;
  height: 40px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.course-desc {
  font-size: 14px;
  color: #666;
  margin-bottom: 15px;
  line-height: 1.4;
  height: 60px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.course-meta {
  display: flex;
  gap: 10px;
  font-size: 12px;
  color: #666;
  margin-bottom: 10px;
}

.course-rating {
  margin-top: 10px;
}

/* 分页 */
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}
</style>