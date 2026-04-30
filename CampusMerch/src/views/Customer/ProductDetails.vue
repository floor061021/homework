<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// 商品数据库
const productsDB = [
  { 
    id: 1, 
    name: '连帽衫', 
    price: 199, 
    originalPrice: 399, 
    discount: '-48%',
    description: '这款连帽衫采用优质面料，舒适保暖，时尚百搭。经典的设计风格适合各种场合穿着。',
    details: [
      '100%纯棉面料',
      '连帽设计',
      '袋鼠口袋',
      '罗纹袖口和下摆',
      '高品质印花'
    ],
    images: [
      'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=black%20hoodie%20with%20colorful%20doodle%20design%20product%20photo%20white%20background&image_size=portrait_4_3',
      'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=black%20hoodie%20side%20view%20product%20photo&image_size=portrait_4_3',
      'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=black%20hoodie%20back%20view%20product%20photography&image_size=portrait_4_3',
      'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=person%20wearing%20black%20hoodie%20casual%20style%20lifestyle%20photo&image_size=portrait_4_3'
    ],
    colors: [
      { id: 'black', name: 'Black', hex: '#000000' },
      { id: 'white', name: 'White', hex: '#FFFFFF' },
      { id: 'grey', name: 'Heather Grey', hex: '#808080' }
    ],
    sizes: [
      { id: 'xs', name: 'XS', stock: 5 },
      { id: 's', name: 'S', stock: 12 },
      { id: 'm', name: 'M', stock: 8 },
      { id: 'l', name: 'L', stock: 15 },
      { id: 'xl', name: 'XL', stock: 6 },
      { id: 'xxl', name: 'XXL', stock: 3 }
    ]
  },
  { 
    id: 2, 
    name: 'T恤', 
    price: 99, 
    originalPrice: 249, 
    discount: '-60%',
    description: '简约时尚的纯棉T恤，舒适透气，适合日常穿搭。',
    details: [
      '100%纯棉面料',
      '舒适透气',
      '简约设计',
      '修身版型',
      '多色可选'
    ],
    images: [
      'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=white%20cotton%20t-shirt%20minimalist%20design%20product%20photo&image_size=portrait_4_3',
      'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=white%20t-shirt%20side%20view%20product%20photo&image_size=portrait_4_3',
      'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=white%20t-shirt%20back%20view%20product%20photography&image_size=portrait_4_3',
      'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=person%20wearing%20white%20t-shirt%20casual%20style%20lifestyle%20photo&image_size=portrait_4_3'
    ],
    colors: [
      { id: 'black', name: 'Black', hex: '#000000' },
      { id: 'white', name: 'White', hex: '#FFFFFF' },
      { id: 'navy', name: 'Navy', hex: '#001f3f' }
    ],
    sizes: [
      { id: 's', name: 'S', stock: 20 },
      { id: 'm', name: 'M', stock: 15 },
      { id: 'l', name: 'L', stock: 18 },
      { id: 'xl', name: 'XL', stock: 10 }
    ]
  },
  { 
    id: 3, 
    name: '帽子', 
    price: 59, 
    originalPrice: 129, 
    discount: '-55%',
    description: '经典棒球帽，时尚百搭，适合户外活动。',
    details: [
      '优质棉质',
      '可调帽围',
      '透气网眼',
      '刺绣LOGO',
      '防晒遮阳'
    ],
    images: [
      'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=baseball%20cap%20casual%20style%20product%20photo%20white%20background&image_size=portrait_4_3',
      'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=baseball%20cap%20side%20view%20product%20photo&image_size=portrait_4_3',
      'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=baseball%20cap%20back%20view%20product%20photography&image_size=portrait_4_3',
      'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=person%20wearing%20baseball%20cap%20casual%20style%20lifestyle%20photo&image_size=portrait_4_3'
    ],
    colors: [
      { id: 'black', name: 'Black', hex: '#000000' },
      { id: 'white', name: 'White', hex: '#FFFFFF' },
      { id: 'navy', name: 'Navy', hex: '#001f3f' },
      { id: 'grey', name: 'Grey', hex: '#808080' }
    ],
    sizes: [
      { id: 'one', name: 'One Size', stock: 50 }
    ]
  },
  { 
    id: 4, 
    name: '卫衣', 
    price: 159, 
    originalPrice: 359, 
    discount: '-55%',
    description: '舒适保暖的圆领卫衣，简约时尚，适合春秋季节穿着。',
    details: [
      '抓绒内里',
      '圆领设计',
      '罗纹袖口',
      '柔软舒适',
      '经典版型'
    ],
    images: [
      'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=grey%20crewneck%20sweatshirt%20product%20photo%20white%20background&image_size=portrait_4_3',
      'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=grey%20sweatshirt%20side%20view%20product%20photo&image_size=portrait_4_3',
      'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=grey%20sweatshirt%20back%20view%20product%20photography&image_size=portrait_4_3',
      'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=person%20wearing%20grey%20sweatshirt%20casual%20style%20lifestyle%20photo&image_size=portrait_4_3'
    ],
    colors: [
      { id: 'grey', name: 'Grey', hex: '#808080' },
      { id: 'black', name: 'Black', hex: '#000000' },
      { id: 'navy', name: 'Navy', hex: '#001f3f' }
    ],
    sizes: [
      { id: 's', name: 'S', stock: 10 },
      { id: 'm', name: 'M', stock: 12 },
      { id: 'l', name: 'L', stock: 8 },
      { id: 'xl', name: 'XL', stock: 6 }
    ]
  },
  { 
    id: 5, 
    name: '长裤', 
    price: 179, 
    originalPrice: 369, 
    discount: '-52%',
    description: '舒适休闲长裤，经典版型，适合日常穿着。',
    details: [
      '棉质混纺',
      '舒适透气',
      '直筒版型',
      '多口袋设计',
      '百搭款式'
    ],
    images: [
      'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=black%20cotton%20pants%20casual%20style%20product%20photo&image_size=portrait_4_3',
      'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=black%20pants%20side%20view%20product%20photo&image_size=portrait_4_3',
      'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=black%20pants%20back%20view%20product%20photography&image_size=portrait_4_3',
      'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=person%20wearing%20black%20pants%20casual%20style%20lifestyle%20photo&image_size=portrait_4_3'
    ],
    colors: [
      { id: 'black', name: 'Black', hex: '#000000' },
      { id: 'navy', name: 'Navy', hex: '#001f3f' },
      { id: 'khaki', name: 'Khaki', hex: '#c3b091' }
    ],
    sizes: [
      { id: 'm', name: 'M', stock: 8 },
      { id: 'l', name: 'L', stock: 10 },
      { id: 'xl', name: 'XL', stock: 6 },
      { id: 'xxl', name: 'XXL', stock: 4 }
    ]
  },
  { 
    id: 6, 
    name: '运动裤', 
    price: 199, 
    originalPrice: 499, 
    discount: '-60%',
    description: '专业运动裤，舒适透气，适合运动休闲穿着。',
    details: [
      '速干面料',
      '弹性腰围',
      '修身版型',
      '侧边口袋',
      '反光细节'
    ],
    images: [
      'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=sport%20jogger%20pants%20athletic%20wear%20product%20photo&image_size=portrait_4_3',
      'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=sport%20pants%20side%20view%20product%20photo&image_size=portrait_4_3',
      'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=sport%20pants%20back%20view%20product%20photography&image_size=portrait_4_3',
      'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=person%20wearing%20sport%20pants%20athletic%20style%20lifestyle%20photo&image_size=portrait_4_3'
    ],
    colors: [
      { id: 'black', name: 'Black', hex: '#000000' },
      { id: 'grey', name: 'Grey', hex: '#808080' },
      { id: 'navy', name: 'Navy', hex: '#001f3f' }
    ],
    sizes: [
      { id: 's', name: 'S', stock: 6 },
      { id: 'm', name: 'M', stock: 8 },
      { id: 'l', name: 'L', stock: 10 },
      { id: 'xl', name: 'XL', stock: 5 }
    ]
  },
  { 
    id: 7, 
    name: '棒球帽', 
    price: 69, 
    originalPrice: 149, 
    discount: '-54%',
    description: '时尚棒球帽，经典设计，适合各种场合。',
    details: [
      '棉质面料',
      '可调金属扣',
      '正面刺绣',
      '透气舒适',
      '防晒遮阳'
    ],
    images: [
      'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=baseball%20cap%20with%20logo%20product%20photo%20white%20background&image_size=portrait_4_3',
      'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=baseball%20cap%20with%20logo%20side%20view%20product%20photo&image_size=portrait_4_3',
      'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=baseball%20cap%20with%20logo%20back%20view%20product%20photography&image_size=portrait_4_3',
      'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=person%20wearing%20baseball%20cap%20with%20logo%20lifestyle%20photo&image_size=portrait_4_3'
    ],
    colors: [
      { id: 'black', name: 'Black', hex: '#000000' },
      { id: 'white', name: 'White', hex: '#FFFFFF' },
      { id: 'red', name: 'Red', hex: '#ff0000' },
      { id: 'blue', name: 'Blue', hex: '#0066cc' }
    ],
    sizes: [
      { id: 'one', name: 'One Size', stock: 30 }
    ]
  },
  { 
    id: 8, 
    name: '帆布包', 
    price: 49, 
    originalPrice: 99, 
    discount: '-51%',
    description: '环保帆布包，大容量设计，适合日常使用。',
    details: [
      '100%帆布',
      '大容量空间',
      '内袋设计',
      '耐用把手',
      '印花图案'
    ],
    images: [
      'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=canvas%20tote%20bag%20minimalist%20design%20product%20photo&image_size=portrait_4_3',
      'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=canvas%20tote%20bag%20side%20view%20product%20photo&image_size=portrait_4_3',
      'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=canvas%20tote%20bag%20back%20view%20product%20photography&image_size=portrait_4_3',
      'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=person%20carrying%20canvas%20tote%20bag%20lifestyle%20photo&image_size=portrait_4_3'
    ],
    colors: [
      { id: 'natural', name: 'Natural', hex: '#f5f5dc' },
      { id: 'black', name: 'Black', hex: '#000000' },
      { id: 'navy', name: 'Navy', hex: '#001f3f' }
    ],
    sizes: [
      { id: 'one', name: 'One Size', stock: 25 }
    ]
  }
]

// 根据ID获取商品
const getProductById = (id) => {
  return productsDB.find(p => p.id === parseInt(id)) || productsDB[0]
}

// 当前商品数据
const product = ref(productsDB[0])

onMounted(() => {
  const productId = route.params.id
  if (productId) {
    product.value = getProductById(productId)
  }
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
  return product.value.originalPrice - product.value.price
})

// 获取当前选中规格的库存
const currentStock = computed(() => {
  if (!selectedSize.value) return 0
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
  if (validateForm()) {
    alert(`订单提交成功！\n商品: ${product.value.name}\n颜色: ${selectedColor.value}\n尺码: ${selectedSize.value}\n数量: ${quantity.value}\n总价: ¥${(product.value.price * quantity.value).toFixed(2)}`)
  }
}

// 切换主图
const setMainImage = (index) => {
  currentImageIndex.value = index
}
</script>

<template>
  <div class="product-detail-page">
    <div class="product-container">
      <!-- 面包屑导航 -->
      <div class="breadcrumbs">
        <a href="/">Home</a> / <a href="/producthall">Shop</a> / {{ product.name }}
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
            <div class="discount-badge">{{ product.discount }}</div>
          </div>
        </div>

        <!-- 商品信息区域 -->
        <div class="info-section">
          <!-- 商品名称 -->
          <h1 class="product-name">{{ product.name }}</h1>
          
          <!-- 价格信息 -->
          <div class="price-section">
            <span class="current-price">¥{{ product.price }}</span>
            <span class="original-price">¥{{ product.originalPrice }}</span>
            <span class="you-save">You Save ¥{{ discountAmount }}</span>
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
  width: 40px;
  height: 40px;
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
