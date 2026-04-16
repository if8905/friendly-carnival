<template>
  <div class="product-detail-view">
    <div class="product-container">
      <!-- 左侧大图轮播 -->
      <div class="product-images">
        <el-carousel height="500px" indicator-position="outside">
          <el-carousel-item v-for="(image, index) in product.images" :key="index">
            <img :src="image" alt="product" />
          </el-carousel-item>
        </el-carousel>
        <div class="thumbnails">
          <div 
            class="thumbnail" 
            v-for="(image, index) in product.images" 
            :key="index"
            :class="{ active: activeThumbnail === index }"
            @click="activeThumbnail = index"
          >
            <img :src="image" alt="thumbnail" />
          </div>
        </div>
      </div>
      
      <!-- 右侧商品信息 -->
      <div class="product-info">
        <h1>{{ product.name }}</h1>
        <div class="product-price">¥{{ product.price }}</div>
        <div class="product-sales">销量: {{ product.sales }}</div>
        <div class="product-description">
          <h3>商品描述</h3>
          <p>{{ product.description }}</p>
        </div>
        
        <!-- 规格选择 -->
        <div class="specification" v-if="product.specs && product.specs.length > 0">
          <h3>规格选择</h3>
          <div class="spec-options">
            <div 
              class="spec-option" 
              v-for="(spec, index) in product.specs" 
              :key="index"
              :class="{ active: selectedSpec === spec.value }"
              @click="selectedSpec = spec.value"
            >
              {{ spec.label }}
            </div>
          </div>
        </div>
        
        <!-- 数量选择 -->
        <div class="quantity">
          <h3>数量</h3>
          <el-input-number 
            v-model="quantity" 
            :min="1" 
            :max="99"
            size="large"
          />
        </div>
        
        <!-- 操作按钮 -->
        <div class="action-buttons">
          <el-button type="primary" size="large" class="add-cart-btn" @click="addToCart">
            加入购物车
          </el-button>
          <el-button type="success" size="large" class="buy-now-btn" @click="buyNow">
            立即购买
          </el-button>
        </div>
      </div>
    </div>
    
    <!-- 商品详情 -->
    <div class="product-details-section">
      <div class="section-header">
        <h2>商品详情</h2>
      </div>
      <div class="details-content">
        <img :src="product.detailImage" alt="details" />
        <div class="details-text">
          <p>{{ product.detailDescription }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from '../stores/cartStore'
import { ElMessage } from 'element-plus'

const route = useRoute()
const cartStore = useCartStore()

// 获取商品ID
const productId = parseInt(route.params.id)

// 商品数据
const product = ref({
  id: productId,
  name: '剪纸工具套装',
  price: 99,
  sales: 234,
  description: '专业剪纸工具套装，包含剪刀、刻刀、纸张等必备工具，适合初学者和专业人士使用。',
  images: [
    'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=paper%20cutting%20tool%20set&image_size=landscape_4_3',
    'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=paper%20cutting%20scissors%20and%20tools&image_size=landscape_4_3',
    'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=paper%20cutting%20tools%20close%20up&image_size=landscape_4_3'
  ],
  specs: [
    { label: '标准套装', value: 'standard' },
    { label: '专业套装', value: 'professional' }
  ],
  detailImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=paper%20cutting%20tool%20set%20details&image_size=landscape_4_3',
  detailDescription: '本套装包含：1. 专业剪纸剪刀2把；2. 精细刻刀5把；3. 各种规格纸张100张；4. 教程手册1本。适合初学者入门使用，也可满足专业人士的需求。'
})

// 选中的缩略图
const activeThumbnail = ref(0)

// 选中的规格
const selectedSpec = ref(product.value.specs ? product.value.specs[0].value : '')

// 数量
const quantity = ref(1)

// 加入购物车
const addToCart = () => {
  const cartItem = {
    id: product.value.id,
    name: product.value.name,
    price: product.value.price,
    image: product.value.images[0],
    quantity: quantity.value
  }
  cartStore.addToCart(cartItem)
  ElMessage.success('已加入购物车')
}

// 立即购买
const buyNow = () => {
  // 立即购买逻辑
  ElMessage.info('跳转到结算页面')
}
</script>

<style scoped>
.product-detail-view {
  padding: 30px 0;
}

.product-container {
  display: flex;
  gap: 40px;
  margin-bottom: 60px;
}

/* 左侧图片区域 */
.product-images {
  flex: 0 0 500px;
}

.product-images img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnails {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.thumbnail {
  flex: 0 0 100px;
  height: 100px;
  overflow: hidden;
  border: 2px solid #e0e0e0;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.thumbnail:hover {
  border-color: #409eff;
}

.thumbnail.active {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 右侧商品信息 */
.product-info {
  flex: 1;
}

.product-info h1 {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}

.product-price {
  font-size: 28px;
  font-weight: bold;
  color: #f56c6c;
  margin-bottom: 10px;
}

.product-sales {
  font-size: 14px;
  color: #999;
  margin-bottom: 30px;
}

.product-description {
  margin-bottom: 30px;
}

.product-description h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #333;
}

.product-description p {
  font-size: 14px;
  line-height: 1.6;
  color: #666;
}

/* 规格选择 */
.specification {
  margin-bottom: 30px;
}

.specification h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #333;
}

.spec-options {
  display: flex;
  gap: 10px;
}

.spec-option {
  padding: 8px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
}

.spec-option:hover {
  border-color: #409eff;
}

.spec-option.active {
  border-color: #409eff;
  background-color: #e6f7ff;
  color: #409eff;
}

/* 数量选择 */
.quantity {
  margin-bottom: 30px;
}

.quantity h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #333;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: 20px;
}

.add-cart-btn,
.buy-now-btn {
  flex: 1;
  height: 50px;
  font-size: 16px;
}

/* 商品详情 section */
.product-details-section {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 30px;
}

.section-header {
  margin-bottom: 30px;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 15px;
}

.section-header h2 {
  font-size: 20px;
  color: #333;
}

.details-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.details-content img {
  width: 100%;
  max-height: 500px;
  object-fit: cover;
  border-radius: 4px;
}

.details-text p {
  font-size: 14px;
  line-height: 1.6;
  color: #666;
}
</style>