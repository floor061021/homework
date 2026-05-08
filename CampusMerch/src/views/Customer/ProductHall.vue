<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useUserStore } from '../../stores/user'
import { products, getCategoryOptions } from '../../data/products.js'

const userStore = useUserStore()

// 滚动到热门商品区域
const scrollToProducts = () => {
  const element = document.getElementById('product-section')
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

// 返回顶部按钮显示状态
const showBackTop = ref(false)

// 滚动到顶部
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 监听滚动事件
const handleScroll = () => {
  showBackTop.value = window.scrollY > 300
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  // 如果有搜索关键字，自动滚动到商品区域
  if (userStore.searchKeyword) {
    setTimeout(() => {
      scrollToProducts()
    }, 300)
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// 分类选项（从共享数据获取）
const categories = computed(() => getCategoryOptions())

// 当前选中的分类
const activeCategory = ref('all')

// 搜索关键字
const localSearchKeyword = ref('')

// 监听全局搜索关键字
watch(() => userStore.searchKeyword, (newKeyword) => {
  if (newKeyword) {
    localSearchKeyword.value = newKeyword
    // 检查是否是分类名称
    const categoryMatch = categories.find(c => c.label === newKeyword)
    if (categoryMatch) {
      activeCategory.value = categoryMatch.value
    } else {
      // 搜索商品名称，保持分类为全部
      activeCategory.value = 'all'
    }
    // 清除全局搜索关键字（避免下次进入页面还显示搜索状态）
    setTimeout(() => {
      userStore.clearSearchKeyword()
    }, 500)
  }
}, { immediate: true })

// 过滤后的商品列表（仅显示上架商品）
const filteredProducts = computed(() => {
  let result = products.value.filter(p => p.status === 'active')
  
  // 先按分类过滤
  if (activeCategory.value !== 'all') {
    result = result.filter(product => product.category === activeCategory.value)
  }
  
  // 再按搜索关键字过滤（如果有关键字且不是分类搜索）
  if (localSearchKeyword.value) {
    const keyword = localSearchKeyword.value.toLowerCase()
    // 检查是否是分类名称
    const isCategorySearch = categories.some(c => c.label === localSearchKeyword.value)
    if (!isCategorySearch) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(keyword)
      )
    }
  }
  
  return result
})

// 搜索是否有结果
const hasSearchResult = computed(() => {
  if (!localSearchKeyword.value) return true
  return filteredProducts.value.length > 0
})

// 切换分类
const selectCategory = (category) => {
  activeCategory.value = category
  localSearchKeyword.value = ''
}
</script>

<template>
  <div class="product-hall">
    <!-- 主横幅 -->
    <section class="hero-banner">
      <div class="banner-content">
        <div class="banner-text">
          <h1>校园文创预定</h1>
          <h2>Campus Merch</h2>
        </div>
        <div class="banner-cta">
          <button class="shop-now-btn" @click="scrollToProducts">立即购买</button>
        </div>
      </div>
    </section>
    
    <!-- 产品展示区 -->
    <section id="product-section" class="product-section">
      <h2 class="section-title">热门商品</h2>
      
      <!-- 分类筛选栏 -->
      <div class="category-filter">
        <div 
          v-for="category in categories" 
          :key="category.value"
          :class="['category-item', { active: activeCategory === category.value }]"
          @click="selectCategory(category.value)"
        >
          {{ category.label }}
        </div>
      </div>
      
      <!-- 商品列表 -->
      <div v-if="filteredProducts.length > 0" class="product-grid">
        <router-link 
          v-for="product in filteredProducts" 
          :key="product.id" 
          :to="`/productdetails/${product.id}`"
          class="product-card"
        >
          <div class="product-image">
            <img :src="product.image" :alt="product.name" />
            <div class="discount-tag">{{ product.discount }}%</div>
          </div>
          <h3>{{ product.name }}</h3>
          <p class="price">¥{{ product.price.toFixed(2) }}</p>
          <p class="original-price">¥{{ product.originalPrice.toFixed(2) }}</p>
        </router-link>
      </div>
      
      <!-- 空状态 -->
      <div v-else class="empty-state">
        <div class="empty-icon">📦</div>
        <p>{{ localSearchKeyword ? '暂无该商品' : '该类商品不存在' }}</p>
      </div>
    </section>

    <!-- 返回顶部按钮 -->
    <button class="back-to-top" @click="scrollToTop" v-show="showBackTop">↑</button>
    
    <!-- 版权标识 -->
    <footer class="page-footer">
      <p>校园文创预订 © 2026</p>
    </footer>
  </div>
</template>

<style scoped>
.product-hall {
  min-height: 100%;
}

/* 主横幅 - 现代渐变背景 */
.hero-banner {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

/* 动态光晕效果 */
.hero-banner::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 204, 0, 0.15) 0%, transparent 50%);
  animation: pulse-glow 8s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% {
    transform: scale(1) rotate(0deg);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.1) rotate(180deg);
    opacity: 0.8;
  }
}

/* 浮动粒子效果 */
.hero-banner::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(circle at 20% 30%, rgba(255, 204, 0, 0.3) 0%, transparent 2%),
    radial-gradient(circle at 80% 20%, rgba(255, 204, 0, 0.2) 0%, transparent 3%),
    radial-gradient(circle at 40% 80%, rgba(255, 204, 0, 0.25) 0%, transparent 2%),
    radial-gradient(circle at 70% 60%, rgba(255, 204, 0, 0.2) 0%, transparent 2.5%),
    radial-gradient(circle at 10% 70%, rgba(255, 204, 0, 0.15) 0%, transparent 2%);
  animation: float-particles 15s ease-in-out infinite;
}

@keyframes float-particles {
  0%, 100% {
    transform: translateY(0) translateX(0);
  }
  25% {
    transform: translateY(-20px) translateX(10px);
  }
  50% {
    transform: translateY(-10px) translateX(-10px);
  }
  75% {
    transform: translateY(-30px) translateX(5px);
  }
}

.banner-content {
  text-align: center;
  color: white;
  z-index: 2;
}

.banner-text h1 {
  font-size: 80px;
  font-weight: bold;
  background: linear-gradient(135deg, #ffcc00 0%, #ffdb4d 50%, #ffcc00 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  line-height: 1;
  animation: shimmer 3s linear infinite;
  text-shadow: 0 0 30px rgba(255, 204, 0, 0.3);
}

@keyframes shimmer {
  0% {
    background-position: 200% center;
  }
  100% {
    background-position: -200% center;
  }
}

.banner-text h2 {
  font-size: 30px;
  font-weight: normal;
  color: rgba(255, 255, 255, 0.9);
  margin: 10px 0 40px 0;
  letter-spacing: 3px;
  text-transform: uppercase;
}

.shop-now-btn {
  padding: 15px 40px;
  background: linear-gradient(135deg, #ffcc00 0%, #ffdb4d 100%);
  border: none;
  color: #1a1a1a;
  font-size: 16px;
  font-weight: bold;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 204, 0, 0.4);
  position: relative;
  overflow: hidden;
}

.shop-now-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.5s;
}

.shop-now-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(255, 204, 0, 0.6);
}

.shop-now-btn:hover::before {
  left: 100%;
}

/* 产品展示区 */
.product-section {
  padding: 60px 20px;
  background-color: white;
}

.section-title {
  text-align: center;
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

/* 分类筛选栏 */
.category-filter {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.category-item {
  padding: 10px 25px;
  background-color: #f5f5f5;
  border-radius: 25px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
}

.category-item:hover {
  background-color: #e8e8e8;
}

.category-item.active {
  background-color: #ffcc00;
  color: #1a1a1a;
  font-weight: bold;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.empty-icon {
  font-size: 80px;
  margin-bottom: 20px;
}

.empty-state p {
  font-size: 16px;
  color: #999;
  margin: 0;
}

.product-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 30px;
  justify-items: center;
}

.product-card {
  width: 100%;
  max-width: 280px;
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  position: relative;
  text-decoration: none;
  color: inherit;
  display: block;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.15);
  text-decoration: none;
}

.product-image {
  height: 300px;
  background-color: white;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #e0e0e0;
}

.discount-tag {
  position: absolute;
  top: 15px;
  left: 15px;
  background-color: #ff3b30;
  color: white;
  font-size: 12px;
  font-weight: bold;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  z-index: 2;
}

.product-card h3 {
  padding: 15px 15px 5px;
  margin: 0;
  font-size: 16px;
  color: #333;
  font-weight: normal;
}

.price {
  padding: 0 15px 5px;
  margin: 0;
  font-size: 18px;
  font-weight: bold;
  color: #ff3b30;
}

.original-price {
  padding: 0 15px 15px;
  margin: 0;
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
}

/* 返回顶部按钮 */
.back-to-top {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  background-color: #ffcc00;
  color: #fff;
  border: none;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s;
  z-index: 100;
}

.back-to-top:hover {
  background-color: #e6b800;
  transform: translateY(-3px);
}

/* 版权标识 */
.page-footer {
  text-align: center;
  padding: 40px 20px;
  background-color: #f5f5f5;
  border-top: 1px solid #e0e0e0;
  margin-top: 60px;
}

.page-footer p {
  margin: 0;
  font-size: 14px;
  color: #999;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .banner-text h1 {
    font-size: 50px;
  }
  
  .banner-text h2 {
    font-size: 20px;
  }
  
  .product-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
  }
  
  .product-image {
    height: 250px;
  }
}
</style>