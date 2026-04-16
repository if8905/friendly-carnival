<template>
  <div class="shop-view">
    <!-- 顶部轮播 Banner -->
    <div class="shop-banner">
      <el-carousel height="300px">
        <el-carousel-item v-for="(item, index) in bannerItems" :key="index">
          <div class="banner-item">
            <img :src="item.image" alt="banner" />
            <div class="banner-content">
              <h2>{{ item.title }}</h2>
              <p>{{ item.description }}</p>
              <el-button type="primary">{{ item.buttonText }}</el-button>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
    
    <div class="shop-container">
      <!-- 左侧边栏：商品分类 -->
      <div class="sidebar">
        <h3>商品分类</h3>
        <ul class="category-list">
          <li 
            v-for="category in categories" 
            :key="category.value"
            :class="{ active: selectedCategory === category.value }"
            @click="selectedCategory = category.value"
          >
            {{ category.label }}
          </li>
        </ul>
      </div>
      
      <!-- 主区域 -->
      <div class="main-content">
        <!-- 视图切换 -->
        <div class="view-toggle">
          <el-button-group>
            <el-button 
              :type="viewMode === 'grid' ? 'primary' : 'default'"
              @click="viewMode = 'grid'"
            >
              <el-icon><Grid /></el-icon> 网格视图
            </el-button>
            <el-button 
              :type="viewMode === 'list' ? 'primary' : 'default'"
              @click="viewMode = 'list'"
            >
              <el-icon><List /></el-icon> 列表视图
            </el-button>
          </el-button-group>
        </div>
        
        <!-- 商品列表 -->
        <div :class="['product-list', viewMode === 'grid' ? 'grid-view' : 'list-view']">
          <!-- 网格视图 -->
          <div v-if="viewMode === 'grid'" class="product-grid">
            <div class="product-card" v-for="product in filteredProducts" :key="product.id">
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
              <el-button type="primary" size="small" class="add-cart-btn" @click="addToCart(product)">
                加入购物车
              </el-button>
            </div>
          </div>
          
          <!-- 列表视图 -->
          <div v-else class="product-list-view">
            <div class="product-item" v-for="product in filteredProducts" :key="product.id">
              <div class="product-item-image">
                <router-link :to="`/product/${product.id}`">
                  <img :src="product.image" alt="product" />
                </router-link>
              </div>
              <div class="product-item-info">
                <router-link :to="`/product/${product.id}`">
                  <h3>{{ product.name }}</h3>
                </router-link>
                <p class="product-description">{{ product.description }}</p>
                <div class="product-item-meta">
                  <span class="price">¥{{ product.price }}</span>
                  <span class="sales">销量: {{ product.sales }}</span>
                </div>
              </div>
              <div class="product-item-actions">
                <el-button type="primary" size="small" @click="addToCart(product)">
                  加入购物车
                </el-button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 分页 -->
        <div class="pagination">
          <el-pagination
            layout="prev, pager, next"
            :total="filteredProducts.length"
            :page-size="8"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
      
      <!-- 右侧悬浮购物车 -->
      <div class="cart-sidebar">
        <div class="cart-header" @click="toggleCart">
          <el-icon><ShoppingCart /></el-icon>
          <span>购物车 ({{ cartStore.totalQuantity }})</span>
        </div>
        <div class="cart-content" v-if="cartOpen">
          <div v-if="cartStore.items.length === 0" class="empty-cart">
            购物车为空
          </div>
          <div v-else>
            <div class="cart-item" v-for="item in cartStore.items" :key="item.id">
              <div class="cart-item-image">
                <img :src="item.image" alt="item" />
              </div>
              <div class="cart-item-info">
                <h4>{{ item.name }}</h4>
                <div class="cart-item-price">¥{{ item.price }}</div>
              </div>
              <div class="cart-item-quantity">
                <el-input-number 
                  v-model="item.quantity" 
                  :min="1" 
                  size="small"
                  @change="updateQuantity(item.id, item.quantity)"
                />
              </div>
              <div class="cart-item-remove">
                <el-button type="danger" size="small" circle @click="removeFromCart(item.id)">
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </div>
            <div class="cart-total">
              <span>总计：</span>
              <span class="total-price">¥{{ cartStore.totalPrice }}</span>
            </div>
            <el-button type="primary" class="checkout-btn">去结算</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCartStore } from '../stores/cartStore'
import { Grid, List, ShoppingCart, Delete } from '@element-plus/icons-vue'

const cartStore = useCartStore()

// Banner数据
const bannerItems = ref([
  {
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=paper%20cutting%20cultural%20products%20promotion%20banner&image_size=landscape_16_9',
    title: '剪纸文创',
    description: '传统工艺与现代设计的完美结合',
    buttonText: '立即选购'
  },
  {
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20paper%20cut%20style%20girl%20with%20red%20dress%20and%20flower%20hair%20accessory%20traditional%20chinese%20style&image_size=landscape_16_9',
    title: '新品上架',
    description: '椰小荔IP周边系列全新上市',
    buttonText: '查看详情'
  },
  {
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=volcanic%20lychee%20gift%20box%20promotion&image_size=landscape_16_9',
    title: '火山荔枝',
    description: '助农专区，新鲜直达',
    buttonText: '立即购买'
  }
])

// 商品分类
const categories = ref([
  { label: '全部商品', value: 'all' },
  { label: '剪纸文创', value: 'paper-cut' },
  { label: 'IP周边', value: 'ip-peripheral' },
  { label: '火山荔枝礼盒', value: 'lychee' }
])

// 选中的分类
const selectedCategory = ref('all')

// 视图模式
const viewMode = ref('grid')

// 购物车展开状态
const cartOpen = ref(false)

// 商品数据
const products = ref([
  {
    id: 1,
    name: '剪纸工具套装',
    price: 99,
    sales: 234,
    category: 'paper-cut',
    description: '专业剪纸工具套装，包含剪刀、刻刀、纸张等必备工具',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=paper%20cutting%20tool%20set&image_size=landscape_4_3'
  },
  {
    id: 2,
    name: 'IP周边抱枕',
    price: 89,
    sales: 156,
    category: 'ip-peripheral',
    description: '椰小荔IP形象抱枕，柔软舒适，居家必备',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20paper%20cut%20style%20girl%20with%20red%20dress%20and%20flower%20hair%20accessory%20traditional%20chinese%20style&image_size=landscape_4_3'
  },
  {
    id: 3,
    name: '文创笔记本',
    price: 45,
    sales: 312,
    category: 'paper-cut',
    description: '剪纸图案笔记本，内页采用优质纸张',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=creative%20notebook%20paper%20cutting%20pattern&image_size=landscape_4_3'
  },
  {
    id: 4,
    name: '火山荔枝礼盒',
    price: 299,
    sales: 89,
    category: 'lychee',
    description: '海口石山火山荔枝，新鲜直达，礼盒装',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=volcanic%20lychee%20gift%20box&image_size=landscape_4_3'
  },
  {
    id: 5,
    name: '剪纸书签',
    price: 25,
    sales: 456,
    category: 'paper-cut',
    description: '精美剪纸书签，多种图案可选',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=paper%20cutting%20bookmark%20traditional%20pattern&image_size=landscape_4_3'
  },
  {
    id: 6,
    name: 'IP周边钥匙扣',
    price: 35,
    sales: 278,
    category: 'ip-peripheral',
    description: '椰小荔IP形象钥匙扣，小巧可爱',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20paper%20cut%20style%20girl%20with%20red%20dress%20and%20flower%20hair%20accessory%20traditional%20chinese%20style&image_size=landscape_4_3'
  },
  {
    id: 7,
    name: '剪纸装饰画',
    price: 199,
    sales: 67,
    category: 'paper-cut',
    description: '传统剪纸装饰画，适合家居装饰',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=paper%20cutting%20decorative%20painting%20traditional%20chinese%20style&image_size=landscape_4_3'
  },
  {
    id: 8,
    name: '火山荔枝干',
    price: 129,
    sales: 134,
    category: 'lychee',
    description: '海口石山火山荔枝干，自然晾晒，香甜可口',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=dried%20lychee%20package&image_size=landscape_4_3'
  }
])

// 过滤后的商品列表
const filteredProducts = computed(() => {
  if (selectedCategory.value === 'all') {
    return products.value
  }
  return products.value.filter(product => product.category === selectedCategory.value)
})

// 切换购物车
const toggleCart = () => {
  cartOpen.value = !cartOpen.value
}

// 添加到购物车
const addToCart = (product) => {
  cartStore.addToCart(product)
  // 显示购物车
  cartOpen.value = true
  // 提示
  ElMessage.success('已加入购物车')
}

// 从购物车移除
const removeFromCart = (id) => {
  cartStore.removeFromCart(id)
}

// 更新数量
const updateQuantity = (id, quantity) => {
  cartStore.updateQuantity(id, quantity)
}

// 处理分页变化
const handleCurrentChange = (page) => {
  // 分页逻辑
}

// 导入ElMessage
import { ElMessage } from 'element-plus'
</script>

<style scoped>
.shop-view {
  padding: 30px 0;
}

/* Banner样式 */
.shop-banner {
  margin-bottom: 30px;
}

.banner-item {
  position: relative;
  height: 300px;
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
  max-width: 400px;
}

.banner-content h2 {
  font-size: 36px;
  margin-bottom: 15px;
}

.banner-content p {
  font-size: 16px;
  margin-bottom: 20px;
}

/* 商城容器 */
.shop-container {
  display: flex;
  gap: 30px;
  position: relative;
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

.category-list {
  list-style: none;
  padding: 0;
}

.category-list li {
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 5px;
}

.category-list li:hover {
  background-color: #f5f5f5;
}

.category-list li.active {
  background-color: #e6f7ff;
  color: #409eff;
  font-weight: 500;
}

/* 主内容区 */
.main-content {
  flex: 1;
}

/* 视图切换 */
.view-toggle {
  margin-bottom: 20px;
  text-align: right;
}

/* 商品列表 */
.product-list {
  margin-bottom: 30px;
}

/* 网格视图 */
.grid-view .product-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
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

/* 列表视图 */
.list-view .product-item {
  display: flex;
  gap: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
  transition: transform 0.3s;
}

.product-item:hover {
  transform: translateY(-2px);
}

.product-item-image {
  flex: 0 0 200px;
  height: 150px;
  overflow: hidden;
}

.product-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.product-item:hover .product-item-image img {
  transform: scale(1.05);
}

.product-item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-item-info a {
  text-decoration: none;
  color: inherit;
}

.product-item-info h3 {
  font-size: 18px;
  margin-bottom: 10px;
  color: #333;
}

.product-description {
  font-size: 14px;
  color: #666;
  margin-bottom: 15px;
  line-height: 1.4;
}

.product-item-meta {
  display: flex;
  gap: 30px;
  align-items: center;
}

.product-item-meta .price {
  font-size: 20px;
  font-weight: bold;
  color: #f56c6c;
}

.product-item-meta .sales {
  font-size: 14px;
  color: #999;
}

.product-item-actions {
  flex: 0 0 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 分页 */
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

/* 右侧悬浮购物车 */
.cart-sidebar {
  position: fixed;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  width: 300px;
  z-index: 1000;
}

.cart-header {
  padding: 15px;
  border-bottom: 1px solid #e0e0e0;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
  background-color: #f5f5f5;
  border-radius: 8px 8px 0 0;
}

.cart-content {
  max-height: 400px;
  overflow-y: auto;
  padding: 15px;
}

.empty-cart {
  text-align: center;
  padding: 30px 0;
  color: #999;
}

.cart-item {
  display: flex;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.cart-item-image {
  flex: 0 0 60px;
  height: 60px;
  overflow: hidden;
}

.cart-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cart-item-info {
  flex: 1;
}

.cart-item-info h4 {
  font-size: 14px;
  margin-bottom: 5px;
  color: #333;
  line-height: 1.4;
  height: 40px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.cart-item-price {
  font-size: 14px;
  color: #f56c6c;
  font-weight: 500;
}

.cart-item-quantity {
  flex: 0 0 80px;
  display: flex;
  align-items: center;
}

.cart-item-remove {
  flex: 0 0 30px;
  display: flex;
  align-items: center;
}

.cart-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-top: 1px solid #e0e0e0;
  margin-top: 15px;
  font-weight: 500;
}

.total-price {
  font-size: 18px;
  color: #f56c6c;
  font-weight: bold;
}

.checkout-btn {
  width: 100%;
  margin-top: 15px;
}
</style>