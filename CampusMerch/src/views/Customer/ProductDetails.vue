<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getProductById } from '../../data/products.js'
import { useUserStore } from '../../stores/user'
import { useOrdersStore } from '../../stores/orders'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const ordersStore = useOrdersStore()

// 当前商品数据
const product = ref(null)
const loading = ref(true)

// 默认商品数据（用于补充缺失的字段）
const getDefaultProductData = (baseProduct) => {
  return {
    ...baseProduct,
    description: baseProduct.description || `${baseProduct.name}采用优质面料，舒适透气，时尚百搭。经典的设计风格适合各种场合穿着。`,
    details: baseProduct.details || [
      '优质面料制作',
      '舒适透气',
      '时尚设计',
      '经典版型',
      '多色可选'
    ],
    images: baseProduct.images || [
      baseProduct.image,
      baseProduct.image,
      baseProduct.image,
      baseProduct.image
    ],
    colors: baseProduct.colors || [
      { id: 'black', name: '黑色', hex: '#000000' },
      { id: 'white', name: '白色', hex: '#FFFFFF' },
      { id: 'grey', name: '灰色', hex: '#808080' }
    ],
    sizes: baseProduct.sizes || [
      { id: 's', name: 'S', stock: Math.floor(baseProduct.stock / 4) },
      { id: 'm', name: 'M', stock: Math.floor(baseProduct.stock / 4) },
      { id: 'l', name: 'L', stock: Math.floor(baseProduct.stock / 4) },
      { id: 'xl', name: 'XL', stock: Math.floor(baseProduct.stock / 4) }
    ]
  }
}

onMounted(() => {
  const productId = route.params.id
  if (productId) {
    const foundProduct = getProductById(productId)
    if (foundProduct) {
      product.value = getDefaultProductData(foundProduct)
    } else {
      // 商品不存在，返回商品大厅
      alert('商品不存在或已下架')
      router.push('/')
    }
  }
  loading.value = false
})

// 选中的规格
const selectedColor = ref('')
const selectedSize = ref('')
const quantity = ref(1)

// 当前显示的主图索引
const currentImageIndex = ref(0)

// 表单验证错误
const errors = ref({
  color: '',
  size: '',
  quantity: ''
})

// 计算折扣金额
const discountAmount = computed(() => {
  if (!product.value) return 0
  return (product.value.originalPrice || product.value.price) - product.value.price
})

// 计算折扣百分比
const discountPercent = computed(() => {
  if (!product.value || !product.value.originalPrice) return 0
  return Math.round(((product.value.originalPrice - product.value.price) / product.value.originalPrice) * 100)
})

// 获取当前选中规格的库存
const currentStock = computed(() => {
  if (!product.value || !selectedSize.value) return 0
  const size = product.value.sizes.find(s => s.id === selectedSize.value)
  return size ? size.stock : 0
})

// 判断是否有库存
const hasStock = computed(() => {
  return currentStock.value > 0
})

// 验证表单
const validateForm = () => {
  let isValid = true
  errors.value = { color: '', size: '', quantity: '' }

  if (!selectedColor.value) {
    errors.value.color = '请选择颜色'
    isValid = false
  }

  if (!selectedSize.value) {
    errors.value.size = '请选择尺码'
    isValid = false
  }

  if (quantity.value < 1) {
    errors.value.quantity = '数量不能小于1'
    isValid = false
  }

  if (quantity.value > currentStock.value) {
    errors.value.quantity = `库存不足，仅剩${currentStock.value}件`
    isValid = false
  }

  return isValid
}

// 增加数量
const increaseQuantity = () => {
  if (quantity.value < currentStock.value) {
    quantity.value++
    errors.value.quantity = ''
  }
}

// 减少数量
const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
    errors.value.quantity = ''
  }
}

// 添加到购物车
const addToCart = () => {
  if (validateForm()) {
    alert(`已添加到购物车：\n商品: ${product.value.name}\n颜色: ${selectedColor.value}\n尺码: ${selectedSize.value}\n数量: ${quantity.value}`)
  }
}

// 立即购买
const buyNow = () => {
  // 检查用户是否登录
  if (!userStore.isLoggedIn) {
    alert('请先登录后再购买')
    userStore.openLoginModal()
    return
  }
  
  if (validateForm()) {
    // 创建订单
    const orderData = {
      product: `${product.value.name}(${selectedColor.value}/${selectedSize.value})`,
      amount: product.value.price * quantity.value,
      items: quantity.value
    }
    
    ordersStore.addOrder(orderData)
    
    alert(`订单提交成功！\n商品: ${product.value.name}\n颜色: ${selectedColor.value}\n尺码: ${selectedSize.value}\n数量: ${quantity.value}\n总价: ¥${(product.value.price * quantity.value).toFixed(2)}`)
    
    // 跳转到我的订单页面
    router.push('/myorders')
  }
}

// 切换主图
const setMainImage = (index) => {
  currentImageIndex.value = index
}
</script>

<template>
  <div class="product-detail-page">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner">加载中...</div>
    </div>
    
    <!-- 商品内容 -->
    <div v-else-if="product" class="product-container">
      <!-- 面包屑导航 -->
      <div class="breadcrumbs">
        <router-link to="/">Home</router-link> / <router-link to="/">Shop</router-link> / {{ product.name }}
      </div>

      <div class="product-main">
        <!-- 图片区域 -->
        <div class="image-section">
          <!-- 缩略图列表 -->
          <div class="thumbnail-list">
            <div
              v-for="(image, index) in product.images"
              :key="index"
              :class="['thumbnail-item', { active: currentImageIndex === index }]"
              @click="setMainImage(index)"
            >
              <img :src="image" :alt="`Product ${index + 1}`" />
            </div>
          </div>
          
          <!-- 主图展示 -->
          <div class="main-image">
            <img :src="product.images[currentImageIndex]" :alt="product.name" />
            <div v-if="discountPercent > 0" class="discount-badge">-{{ discountPercent }}%</div>
          </div>
        </div>

        <!-- 商品信息区域 -->
        <div class="info-section">
          <!-- 商品名称 -->
          <h1 class="product-name">{{ product.name }}</h1>
          
          <!-- 价格信息 -->
          <div class="price-section">
            <span class="current-price">¥{{ product.price }}</span>
            <span v-if="product.originalPrice" class="original-price">¥{{ product.originalPrice }}</span>
            <span v-if="discountAmount > 0" class="you-save">You Save ¥{{ discountAmount }}</span>
          </div>

          <!-- 商品详情列表 -->
          <ul class="product-details">
            <li v-for="(detail, index) in product.details" :key="index">{{ detail }}</li>
          </ul>

          <!-- 规格选择 -->
          <div class="spec-section">
            <!-- 颜色选择 -->
            <div class="spec-item">
              <label>Color:</label>
              <div class="color-options">
                <button
                  v-for="color in product.colors"
                  :key="color.id"
                  :class="['color-btn', { active: selectedColor === color.id, 'error-border': errors.color && !selectedColor }]"
                  :style="{ backgroundColor: color.hex, borderColor: color.hex }"
                  :title="color.name"
                  @click="selectedColor = color.id"
                ></button>
              </div>
              <span v-if="errors.color" class="error-message">{{ errors.color }}</span>
              <span v-if="selectedColor" class="selected-value">{{ selectedColor }}</span>
            </div>

            <!-- 尺码选择 -->
            <div class="spec-item">
              <label>Size:</label>
              <select 
                v-model="selectedSize" 
                :class="{ 'error-border': errors.size }"
              >
                <option value="">Select Size</option>
                <option v-for="size in product.sizes" :key="size.id" :value="size.id">
                  {{ size.name }} ({{ size.stock }} available)
                </option>
              </select>
              <span v-if="errors.size" class="error-message">{{ errors.size }}</span>
            </div>

            <!-- 数量选择 -->
            <div class="spec-item">
              <label>Qty:</label>
              <div class="quantity-control">
                <button class="qty-btn" @click="decreaseQuantity" :disabled="quantity <= 1">-</button>
                <input type="number" v-model="quantity" :min="1" :max="currentStock" />
                <button class="qty-btn" @click="increaseQuantity" :disabled="quantity >= currentStock">+</button>
              </div>
              <span v-if="errors.quantity" class="error-message">{{ errors.quantity }}</span>
              <span v-if="!errors.quantity && currentStock" class="stock-info">Stock: {{ currentStock }}</span>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="action-buttons">
            <button 
              class="btn-add-cart" 
              @click="addToCart"
              :disabled="!hasStock"
            >
              ADD TO CART
            </button>
            <button 
              class="btn-buy-now" 
              @click="buyNow"
              :disabled="!hasStock"
            >
              BUY NOW
            </button>
          </div>

          <!-- 支付方式 -->
          <div class="payment-info">
            <span>Pay in 4 interest-free payments of ¥{{ (product.price / 4).toFixed(2) }}</span>
            <img src="https://neeko-copilot.bytedance.net/api/text_to_image?prompt=paypal%20logo%20icon%20simple%20white%20background&image_size=square" alt="PayPal" class="paypal-logo" />
          </div>

          <!-- 收藏和分享 -->
          <div class="social-links">
            <button class="social-btn">♡ Add to wishlist</button>
            <button class="social-btn">↔ Add to compare</button>
          </div>

          <!-- 购买人数 -->
          <div class="buyers-info">
            <span class="buyers-count">67 people are watching this product</span>
          </div>
        </div>
      </div>

      <!-- 商品描述 -->
      <div class="description-section">
        <h2>Description</h2>
        <div class="description-content">
          <h3>{{ product.name }}</h3>
          <p>{{ product.description }}</p>
        </div>
      </div>
    </div>
    
    <!-- 商品不存在 -->
    <div v-else class="not-found">
      <h2>商品不存在或已下架</h2>
      <router-link to="/" class="back-btn">返回商品大厅</router-link>
    </div>
  </div>
</template>

<style scoped>
.product-detail-page {
  font-family: Arial, sans-serif;
  min-height: 100vh;
  background-color: white;
}

.product-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

/* 加载状态 */
.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 500px;
}

.loading-spinner {
  font-size: 18px;
  color: #666;
}

/* 商品不存在 */
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 500px;
  gap: 20px;
}

.not-found h2 {
  color: #666;
}

.back-btn {
  padding: 12px 30px;
  background-color: #ffcc00;
  color: #1a1a1a;
  text-decoration: none;
  border-radius: 4px;
  font-weight: bold;
  transition: background-color 0.3s;
}

.back-btn:hover {
  background-color: #e6b800;
}

/* 面包屑导航 */
.breadcrumbs {
  font-size: 14px;
  color: #999;
  margin-bottom: 30px;
}

.breadcrumbs a {
  color: #999;
  text-decoration: none;
}

.breadcrumbs a:hover {
  color: #ff3b30;
}

/* 商品主区域 */
.product-main {
  display: flex;
  gap: 60px;
  margin-bottom: 60px;
}

/* 图片区域 */
.image-section {
  display: flex;
  gap: 20px;
  flex-shrink: 0;
}

.thumbnail-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.thumbnail-item {
  width: 80px;
  height: 80px;
  border: 2px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
}

.thumbnail-item:hover {
  border-color: #ffcc00;
}

.thumbnail-item.active {
  border-color: #ff3b30;
}

.thumbnail-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.main-image {
  position: relative;
  width: 500px;
  height: 500px;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f8f8f8;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.discount-badge {
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: #ff3b30;
  color: white;
  font-size: 14px;
  font-weight: bold;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

/* 商品信息区域 */
.info-section {
  flex: 1;
}

.product-name {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin: 0 0 20px 0;
}

.price-section {
  display: flex;
  align-items: baseline;
  gap: 15px;
  margin-bottom: 30px;
}

.current-price {
  font-size: 32px;
  font-weight: bold;
  color: #ff3b30;
}

.original-price {
  font-size: 20px;
  color: #999;
  text-decoration: line-through;
}

.you-save {
  font-size: 14px;
  color: #4caf50;
  font-weight: 500;
}

.product-details {
  list-style: none;
  padding: 0;
  margin: 0 0 30px 0;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
  padding: 20px 0;
}

.product-details li {
  font-size: 14px;
  color: #666;
  padding: 5px 0;
}

/* 规格选择 */
.spec-section {
  margin-bottom: 30px;
}

.spec-item {
  margin-bottom: 20px;
}

.spec-item label {
  display: block;
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.color-options {
  display: flex;
  gap: 15px;
}

.color-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid;
  cursor: pointer;
  transition: all 0.3s;
}

.color-btn:hover {
  transform: scale(1.1);
}

.color-btn.active {
  transform: scale(1.1);
  box-shadow: 0 0 0 3px rgba(255, 59, 48, 0.3);
}

.color-btn.error-border {
  box-shadow: 0 0 0 2px #f44336;
}

.spec-item select {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
  cursor: pointer;
}

.spec-item select.error-border {
  border-color: #f44336;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 10px;
}

.qty-btn {
  width: 40px;
  height: 40px;
  border: 1px solid #ddd;
  background-color: white;
  font-size: 20px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;
}

.qty-btn:hover:not(:disabled) {
  background-color: #f5f5f5;
}

.qty-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-control input {
  width: 60px;
  height: 40px;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.error-message {
  display: block;
  font-size: 12px;
  color: #f44336;
  margin-top: 5px;
}

.selected-value {
  display: inline-block;
  margin-left: 10px;
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.stock-info {
  display: block;
  font-size: 12px;
  color: #999;
  margin-top: 5px;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
}

.btn-add-cart,
.btn-buy-now {
  flex: 1;
  padding: 15px 20px;
  font-size: 14px;
  font-weight: bold;
  text-transform: uppercase;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-add-cart {
  background-color: #ffcc00;
  color: #1a1a1a;
}

.btn-add-cart:hover:not(:disabled) {
  background-color: #e6b800;
}

.btn-buy-now {
  background-color: #ff3b30;
  color: white;
}

.btn-buy-now:hover:not(:disabled) {
  background-color: #e03024;
}

.btn-add-cart:disabled,
.btn-buy-now:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 支付信息 */
.payment-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 15px;
  background-color: #f8f8f8;
  border-radius: 4px;
  margin-bottom: 20px;
}

.payment-info span {
  font-size: 13px;
  color: #666;
}

.paypal-logo {
  height: 20px;
}

/* 社交链接 */
.social-links {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.social-btn {
  padding: 10px 20px;
  border: 1px solid #ddd;
  background-color: white;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;
}

.social-btn:hover {
  background-color: #f5f5f5;
  border-color: #ffcc00;
}

/* 购买人数 */
.buyers-info {
  padding: 15px;
  background-color: #fff8e1;
  border-radius: 4px;
}

.buyers-count {
  font-size: 14px;
  color: #ff9800;
  font-weight: 500;
}

/* 商品描述 */
.description-section {
  padding-top: 30px;
  border-top: 1px solid #f0f0f0;
}

.description-section h2 {
  font-size: 20px;
  color: #333;
  margin: 0 0 20px 0;
}

.description-content h3 {
  font-size: 18px;
  color: #333;
  margin: 0 0 15px 0;
}

.description-content p {
  font-size: 14px;
  color: #666;
  line-height: 1.8;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 900px) {
  .product-main {
    flex-direction: column;
  }

  .image-section {
    flex-direction: column;
    align-items: center;
  }

  .thumbnail-list {
    flex-direction: row;
    order: 2;
  }

  .main-image {
    width: 100%;
    max-width: 400px;
    height: auto;
    order: 1;
  }

  .action-buttons {
    flex-direction: column;
  }

  .social-links {
    flex-direction: column;
  }
}
</style>
