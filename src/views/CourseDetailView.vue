<template>
  <div class="course-detail-view">
    <div class="course-container">
      <!-- 左侧：视频播放器 -->
      <div class="video-section">
        <div class="video-player">
          <!-- 模拟视频播放器 -->
          <div class="video-placeholder">
            <img :src="course.cover" alt="course" />
            <div class="play-button">
              <el-icon><VideoPlay /></el-icon>
            </div>
          </div>
        </div>
        <div class="video-info">
          <h1>{{ course.title }}</h1>
          <div class="course-meta">
            <span>{{ course.lessons }}课时</span>
            <span>{{ course.level }}</span>
            <span>¥{{ course.price }}</span>
            <div class="course-rating">
              <el-rate v-model="course.rating" disabled show-score />
            </div>
          </div>
          <p class="course-description">{{ course.description }}</p>
        </div>
      </div>
      
      <!-- 右侧：课程大纲、讲师介绍等 -->
      <div class="sidebar">
        <!-- 课程大纲 -->
        <div class="section">
          <h3>课程大纲</h3>
          <div class="course-outline">
            <div class="chapter" v-for="(chapter, index) in courseChapters" :key="index">
              <div class="chapter-header" @click="toggleChapter(index)">
                <span>{{ chapter.title }}</span>
                <el-icon>{{ chapter.expanded ? 'ArrowUp' : 'ArrowDown' }}</el-icon>
              </div>
              <div class="chapter-content" v-if="chapter.expanded">
                <div class="lesson" v-for="(lesson, lessonIndex) in chapter.lessons" :key="lessonIndex">
                  <el-checkbox v-model="lesson.completed" disabled>
                    {{ lesson.title }}
                  </el-checkbox>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 讲师介绍 -->
        <div class="section">
          <h3>讲师介绍</h3>
          <div class="instructor">
            <div class="instructor-avatar">
              <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=instructor%20avatar%20chinese%20female%20paper%20cutting%20master&image_size=square" alt="instructor" />
            </div>
            <div class="instructor-info">
              <h4>王老师</h4>
              <p>海口秀英剪纸非遗传承人，从事剪纸艺术30余年，擅长传统纹样和现代创意剪纸。</p>
            </div>
          </div>
        </div>
        
        <!-- 学习进度 -->
        <div class="section">
          <h3>学习进度</h3>
          <div class="progress-section">
            <el-progress :percentage="learningProgress" />
            <p class="progress-text">{{ completedLessons }}/{{ totalLessons }} 课时已完成</p>
          </div>
        </div>
        
        <!-- 立即学习按钮 -->
        <div class="section">
          <el-button type="primary" size="large" class="start-learning-btn">立即学习</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCourseStore } from '../stores/courseStore'
import { VideoPlay, ArrowUp, ArrowDown } from '@element-plus/icons-vue'

const route = useRoute()
const courseStore = useCourseStore()

// 获取课程ID
const courseId = parseInt(route.params.id)

// 获取课程详情
const course = ref(courseStore.getCourseById(courseId) || {
  id: courseId,
  title: '剪纸基础入门',
  description: '适合初学者的剪纸基础课程，从工具使用到基本剪法',
  cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=paper%20cutting%20basic%20course%20cover&image_size=landscape_4_3',
  lessons: 10,
  level: '入门',
  price: 99,
  rating: 4.8,
  category: '入门基础'
})

// 课程章节
const courseChapters = ref([
  {
    title: '第1章 课程介绍与工具准备',
    expanded: true,
    lessons: [
      { title: '1.1 课程介绍', completed: true },
      { title: '1.2 剪纸工具介绍', completed: true },
      { title: '1.3 纸张选择与准备', completed: false }
    ]
  },
  {
    title: '第2章 基本剪法',
    expanded: false,
    lessons: [
      { title: '2.1 直线剪法', completed: false },
      { title: '2.2 曲线剪法', completed: false },
      { title: '2.3 镂空剪法', completed: false }
    ]
  },
  {
    title: '第3章 基础图案练习',
    expanded: false,
    lessons: [
      { title: '3.1 简单几何图形', completed: false },
      { title: '3.2 花卉图案', completed: false },
      { title: '3.3 动物图案', completed: false }
    ]
  },
  {
    title: '第4章 作品创作',
    expanded: false,
    lessons: [
      { title: '4.1 传统纹样创作', completed: false },
      { title: '4.2 现代创意剪纸', completed: false }
    ]
  }
])

// 切换章节展开/折叠
const toggleChapter = (index) => {
  courseChapters.value[index].expanded = !courseChapters.value[index].expanded
}

// 计算总课时数
const totalLessons = computed(() => {
  return courseChapters.value.reduce((total, chapter) => {
    return total + chapter.lessons.length
  }, 0)
})

// 计算已完成课时数
const completedLessons = computed(() => {
  return courseChapters.value.reduce((total, chapter) => {
    return total + chapter.lessons.filter(lesson => lesson.completed).length
  }, 0)
})

// 计算学习进度
const learningProgress = computed(() => {
  if (totalLessons.value === 0) return 0
  return Math.round((completedLessons.value / totalLessons.value) * 100)
})
</script>

<style scoped>
.course-detail-view {
  padding: 30px 0;
}

.course-container {
  display: flex;
  gap: 30px;
}

/* 左侧视频区域 */
.video-section {
  flex: 1;
}

.video-player {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 20px;
}

.video-placeholder {
  position: relative;
  height: 400px;
  cursor: pointer;
}

.video-placeholder img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.play-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 32px;
  transition: all 0.3s;
}

.play-button:hover {
  background-color: rgba(0, 0, 0, 0.8);
  transform: translate(-50%, -50%) scale(1.1);
}

.video-info {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.video-info h1 {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}

.course-meta {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  align-items: center;
}

.course-meta span {
  font-size: 14px;
  color: #666;
  padding: 4px 12px;
  background-color: #f5f5f5;
  border-radius: 12px;
}

.course-description {
  font-size: 14px;
  line-height: 1.6;
  color: #666;
}

/* 右侧边栏 */
.sidebar {
  flex: 0 0 350px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.section h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 15px;
  color: #333;
}

/* 课程大纲 */
.course-outline {
  font-size: 14px;
}

.chapter {
  margin-bottom: 10px;
}

.chapter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.chapter-header:hover {
  background-color: #e6f7ff;
}

.chapter-content {
  padding: 10px 10px 0 10px;
}

.lesson {
  margin-bottom: 8px;
}

/* 讲师介绍 */
.instructor {
  display: flex;
  gap: 15px;
}

.instructor-avatar {
  flex: 0 0 60px;
}

.instructor-avatar img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

.instructor-info h4 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 5px;
  color: #333;
}

.instructor-info p {
  font-size: 12px;
  line-height: 1.4;
  color: #666;
}

/* 学习进度 */
.progress-section {
  margin-bottom: 10px;
}

.progress-text {
  font-size: 12px;
  color: #666;
  margin-top: 10px;
  text-align: right;
}

/* 立即学习按钮 */
.start-learning-btn {
  width: 100%;
  margin-top: 10px;
}
</style>