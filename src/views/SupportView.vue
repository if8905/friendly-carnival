<template>
  <div class="support-view">
    <!-- 顶部大幅 Banner -->
    <div class="support-banner">
      <div class="banner-content">
        <h1>非遗助农</h1>
        <p>传承非遗文化，助力乡村振兴</p>
        <el-button type="primary" size="large">了解更多</el-button>
      </div>
      <img src="/farmer-1.jpg" alt="banner" />
    </div>
    
    <!-- 农户故事区 -->
    <div class="farmer-story">
      <div class="story-container">
        <div class="story-image">
          <img src="/farmer-2.jpg" alt="farmer" />
        </div>
        <div class="story-content">
          <h2>农户故事</h2>
          <p>海口市秀英区石山镇的果农王大叔，种植火山荔枝已有20余年。在非遗助农项目的帮助下，他的荔枝通过电商平台销往全国各地，收入翻了一番。同时，他还学习了剪纸技艺，将剪纸图案印在荔枝包装盒上，增加了产品的文化附加值。</p>
          <p>通过非遗助农项目，我们不仅帮助农户增收，还将传统剪纸文化与现代农业相结合，实现了文化传承与乡村振兴的双赢。</p>
        </div>
      </div>
    </div>
    
    <!-- 火山荔枝礼盒展示区 -->
    <div class="lychee-products">
      <h2>火山荔枝礼盒</h2>
      <div class="product-grid">
        <div class="product-card" v-for="product in lycheeProducts" :key="product.id">
          <div class="product-image">
            <img :src="product.image" alt="product" />
          </div>
          <div class="product-info">
            <h3>{{ product.name }}</h3>
            <div class="product-price">¥{{ product.price }}</div>
            <div class="product-specs">
              <div 
                class="spec-option" 
                v-for="(spec, index) in product.specs" 
                :key="index"
                :class="{ active: selectedSpecs[product.id] === spec.value }"
                @click="selectedSpecs[product.id] = spec.value"
              >
                {{ spec.label }}
              </div>
            </div>
            <div class="product-actions">
              <el-button type="primary" size="small" @click="addToCart(product)">
                加入购物车
              </el-button>
              <el-button type="success" size="small" @click="buyNow(product)">
                立即购买
              </el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="group-purchase">
        <el-button type="primary" size="large" @click="showGroupPurchaseForm = true">
          企业团购
        </el-button>
      </div>
    </div>
    
    <!-- 助农数据看板 -->
    <div class="data-board">
      <h2>助农数据</h2>
      <div class="data-grid">
        <div class="data-card">
          <div class="data-value">{{ data.sales }}</div>
          <div class="data-label">累计销量（斤）</div>
        </div>
        <div class="data-card">
          <div class="data-value">{{ data.farmers }}</div>
          <div class="data-label">带动农户（户）</div>
        </div>
        <div class="data-card">
          <div class="data-value">{{ data.income }}</div>
          <div class="data-label">农户增收（万元）</div>
        </div>
        <div class="data-card">
          <div class="data-value">{{ data.orders }}</div>
          <div class="data-label">订单数（单）</div>
        </div>
      </div>
    </div>
    
    <!-- 企业团购表单 -->
    <el-dialog
      v-model="showGroupPurchaseForm"
      title="企业团购"
      width="600px"
    >
      <el-form :model="groupPurchaseForm" label-width="100px">
        <el-form-item label="联系人" required>
          <el-input v-model="groupPurchaseForm.contact" />
        </el-form-item>
        <el-form-item label="联系电话" required>
          <el-input v-model="groupPurchaseForm.phone" />
        </el-form-item>
        <el-form-item label="采购数量" required>
          <el-input-number v-model="groupPurchaseForm.quantity" :min="10" :step="5" />
          <span class="unit">箱</span>
        </el-form-item>
        <el-form-item label="留言">
          <el-input type="textarea" v-model="groupPurchaseForm.message" rows="4" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showGroupPurchaseForm = false">取消</el-button>
          <el-button type="primary" @click="submitGroupPurchase">提交</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useCartStore } from '../stores/cartStore'
import { ElMessage } from 'element-plus'

const cartStore = useCartStore()

// 选中的规格
const selectedSpecs = reactive({})

// 火山荔枝产品数据
const lycheeProducts = ref([
  {
    id: 1,
    name: '火山荔枝礼盒（小盒）',
    price: 299,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=volcanic%20lychee%20gift%20box%20small&image_size=landscape_4_3',
    specs: [
      { label: '3斤装', value: '3斤' },
      { label: '5斤装', value: '5斤' }
    ]
  },
  {
    id: 2,
    name: '火山荔枝礼盒（大盒）',
    price: 499,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=volcanic%20lychee%20gift%20box%20large&image_size=landscape_4_3',
    specs: [
      { label: '8斤装', value: '8斤' },
      { label: '10斤装', value: '10斤' }
    ]
  }
])

// 初始化选中的规格
lycheeProducts.value.forEach(product => {
  selectedSpecs[product.id] = product.specs[0].value
})

// 助农数据
const data = ref({
  sales: '12,580',
  farmers: '45',
  income: '86.5',
  orders: '3,240'
})

// 企业团购表单
const showGroupPurchaseForm = ref(false)
const groupPurchaseForm = ref({
  contact: '',
  phone: '',
  quantity: 10,
  message: ''
})

// 加入购物车
const addToCart = (product) => {
  const cartItem = {
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    quantity: 1
  }
  cartStore.addToCart(cartItem)
  ElMessage.success('已加入购物车')
}

// 立即购买
const buyNow = (product) => {
  ElMessage.info('跳转到结算页面')
}

// 提交企业团购
const submitGroupPurchase = () => {
  // 提交逻辑
  showGroupPurchaseForm.value = false
  ElMessage.success('提交成功，我们会尽快与您联系')
}
</script>

<style scoped>
.support-view {
  padding: 30px 0;
}

/* Banner样式 */
.support-banner {
  position: relative;
  height: 400px;
  margin-bottom: 60px;
  overflow: hidden;
}

.support-banner img {
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

.banner-content h1 {
  font-size: 48px;
  margin-bottom: 20px;
}

.banner-content p {
  font-size: 20px;
  margin-bottom: 30px;
}

/* 农户故事区 */
.farmer-story {
  margin-bottom: 60px;
}

.story-container {
  display: flex;
  gap: 40px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 40px;
}

.story-image {
  flex: 0 0 400px;
  height: 300px;
  overflow: hidden;
}

.story-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.story-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
}

.story-content h2 {
  font-size: 24px;
  color: #333;
  margin: 0;
}

.story-content p {
  font-size: 16px;
  line-height: 1.6;
  color: #666;
  margin: 0;
}

/* 火山荔枝产品 */
.lychee-products {
  margin-bottom: 60px;
}

.lychee-products h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 30px;
  text-align: center;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  margin-bottom: 40px;
}

.product-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-image {
  height: 250px;
  overflow: hidden;
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

.product-info {
  padding: 20px;
}

.product-info h3 {
  font-size: 18px;
  margin-bottom: 15px;
  color: #333;
}

.product-price {
  font-size: 24px;
  font-weight: bold;
  color: #f56c6c;
  margin-bottom: 20px;
}

.product-specs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
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

.product-actions {
  display: flex;
  gap: 10px;
}

.group-purchase {
  text-align: center;
  margin-top: 40px;
}

/* 数据看板 */
.data-board {
  margin-bottom: 60px;
}

.data-board h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 30px;
  text-align: center;
}

.data-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
}

.data-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 30px;
  text-align: center;
  transition: transform 0.3s;
}

.data-card:hover {
  transform: translateY(-5px);
}

.data-value {
  font-size: 36px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 10px;
}

.data-label {
  font-size: 14px;
  color: #666;
}

/* 对话框 */
.dialog-footer {
  text-align: right;
}

.unit {
  margin-left: 10px;
  color: #666;
}
</style>