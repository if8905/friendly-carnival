<template>
  <div class="home-view">
    <!-- 大横幅 Banner -->
    <div class="banner">
      <el-carousel height="500px" indicator-position="outside">
        <el-carousel-item v-for="(item, index) in bannerItems" :key="index">
          <div class="banner-item">
            <img :src="item.image" alt="banner" />
            <div class="banner-content">
              <h2>{{ item.title }}</h2>
              <p>{{ item.description }}</p>
              <el-button type="primary" size="large">{{ item.buttonText }}</el-button>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
    
    <!-- 快捷入口区 -->
    <div class="quick-entry">
      <div class="entry-card" v-for="(entry, index) in quickEntries" :key="index">
        <router-link :to="entry.route">
          <div class="entry-icon">
            <img :src="entry.icon" alt="icon" />
          </div>
          <h3>{{ entry.title }}</h3>
          <p>{{ entry.description }}</p>
        </router-link>
      </div>
    </div>
    
    <!-- 推荐内容区 -->
    <div class="recommended-section">
      <!-- 精品课程 -->
      <div class="section">
        <div class="section-header">
          <h2>精品课程</h2>
          <router-link to="/courses" class="more-link">查看更多 ></router-link>
        </div>
        <div class="course-grid">
          <div class="course-card" v-for="course in recommendedCourses" :key="course.id">
            <router-link :to="`/course/${course.id}`">
              <div class="course-cover">
                <img :src="course.cover" alt="course" />
              </div>
              <div class="course-info">
                <h3>{{ course.title }}</h3>
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
      </div>
      
      <!-- 畅销商品 -->
      <div class="section">
        <div class="section-header">
          <h2>畅销商品</h2>
          <router-link to="/shop" class="more-link">查看更多 ></router-link>
        </div>
        <div class="product-grid">
          <div class="product-card" v-for="product in recommendedProducts" :key="product.id">
            <router-link :to="`/product/${product.id}`">
              <div class="product-image">
                <img :src="product.image" alt="product" />
              </div>
              <div class="product-info">
                <h3>{{ product.name }}</h3>
                <div class="product-price">¥{{ product.price }}</div>
                <div class="product-sales">销量: {{ product.sales }}</div>
              </div>
            </router-link>
            <el-button type="primary" size="small" class="add-cart-btn">加入购物车</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCourseStore } from '../stores/courseStore'

const courseStore = useCourseStore()

// Banner数据
const bannerItems = ref([
  {
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=paper%20cutting%20banner%20traditional%20chinese%20style%20with%20coconut%20tree%20and%20sea&image_size=landscape_16_9',
    title: '椰风纸语',
    description: '海口秀英剪纸数字化传承平台',
    buttonText: '探索非遗文化'
  },
  {
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=paper%20cutting%20art%20workshop%20traditional%20chinese%20culture&image_size=landscape_16_9',
    title: '在线课程',
    description: '跟随非遗传承人学习剪纸技艺',
    buttonText: '立即报名'
  },
  {
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=paper%20cutting%20cultural%20products%20gift%20box&image_size=landscape_16_9',
    title: '文创商城',
    description: '选购精美剪纸文创产品',
    buttonText: '进入商城'
  }
])

// 快捷入口数据
const quickEntries = ref([
  {
    icon: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=online%20course%20icon%20paper%20cutting&image_size=square',
    title: '在线课程',
    description: '学习剪纸技艺，传承非遗文化',
    route: '/courses'
  },
  {
    icon: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=shopping%20mall%20icon%20paper%20cutting&image_size=square',
    title: '文创商城',
    description: '选购精美剪纸文创产品',
    route: '/shop'
  },
  {
    icon: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=agriculture%20support%20icon%20paper%20cutting&image_size=square',
    title: '非遗助农',
    description: '购买火山荔枝，助力农户增收',
    route: '/support'
  }
])

// 推荐课程数据
const recommendedCourses = ref(courseStore.courses.slice(0, 4))

// 推荐商品数据
const recommendedProducts = ref([
  {
    id: 1,
    name: '剪纸工具套装',
    price: 99,
    sales: 234,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=paper%20cutting%20tool%20set&image_size=landscape_4_3'
  },
  {
    id: 2,
    name: 'IP周边抱枕',
    price: 89,
    sales: 156,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20paper%20cut%20style%20girl%20with%20red%20dress%20and%20flower%20hair%20accessory%20traditional%20chinese%20style&image_size=landscape_4_3'
  },
  {
    id: 3,
    name: '文创笔记本',
    price: 45,
    sales: 312,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=creative%20notebook%20paper%20cutting%20pattern&image_size=landscape_4_3'
  },
  {
    id: 4,
    name: '火山荔枝礼盒',
    price: 299,
    sales: 89,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=volcanic%20lychee%20gift%20box&image_size=landscape_4_3'
  }
])
</script>

<style scoped>
.home-view {
  padding-bottom: 60px;
}

/* Banner样式 */
.banner {
  margin-bottom: 60px;
}

.banner-item {
  position: relative;
  height: 500px;
  overflow: hidden;
}

.banner-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-content {
  position: absolute;
  top: 50%;
  left: 10%;
  transform: translateY(-50%);
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  max-width: 500px;
}

.banner-content h2 {
  font-size: 48px;
  margin-bottom: 20px;
}

.banner-content p {
  font-size: 20px;
  margin-bottom: 30px;
}

/* 快捷入口样式 */
.quick-entry {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-bottom: 60px;
}

.entry-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 30px;
  text-align: center;
  transition: transform 0.3s;
}

.entry-card:hover {
  transform: translateY(-5px);
}

.entry-card a {
  text-decoration: none;
  color: inherit;
}

.entry-icon img {
  width: 80px;
  height: 80px;
  margin-bottom: 20px;
}

.entry-card h3 {
  font-size: 20px;
  margin-bottom: 10px;
  color: #333;
}

.entry-card p {
  color: #666;
  font-size: 14px;
}

/* 推荐内容区样式 */
.recommended-section {
  margin-bottom: 60px;
}

.section {
  margin-bottom: 60px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.section-header h2 {
  font-size: 24px;
  color: #333;
}

.more-link {
  color: #409eff;
  text-decoration: none;
  font-size: 14px;
}

/* 课程网格 */
.course-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
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

/* 商品网格 */
.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.product-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 15px;
  transition: transform 0.3s;
  position: relative;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-card a {
  text-decoration: none;
  color: inherit;
  display: block;
}

.product-image {
  height: 200px;
  overflow: hidden;
  margin-bottom: 15px;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.product-info h3 {
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

.product-price {
  font-size: 18px;
  font-weight: bold;
  color: #f56c6c;
  margin-bottom: 5px;
}

.product-sales {
  font-size: 12px;
  color: #999;
}

.add-cart-btn {
  position: absolute;
  bottom: 15px;
  right: 15px;
  padding: 5px 15px;
}
</style>