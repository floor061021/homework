<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useUserStore } from '../../stores/user'

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

// 分类选项
const categories = [
  { value: 'all', label: '全部' },
  { value: 'top', label: '上衣' },
  { value: 'pants', label: '裤子' },
  { value: 'hat', label: '帽子' },
  { value: 'other', label: '其他' }
]

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

// 商品数据（带分类）
const products = ref([
  { id: 1, name: '连帽衫', price: 199, originalPrice: 399, discount: -48, category: 'top' },
  { id: 2, name: 'T恤', price: 99, originalPrice: 249, discount: -60, category: 'top' },
  { id: 3, name: '帽子', price: 59, originalPrice: 129, discount: -55, category: 'hat' },
  { id: 4, name: '卫衣', price: 159, originalPrice: 359, discount: -55, category: 'top' },
  { id: 5, name: '连帽衫', price: 199, originalPrice: 369, discount: -45, category: 'top' },
  { id: 6, name: '连帽衫', price: 199, originalPrice: 499, discount: -60, category: 'top' },
  { id: 7, name: '连帽衫', price: 199, originalPrice: 349, discount: -42, category: 'top' },
  { id: 8, name: '连帽衫', price: 199, originalPrice: 349, discount: -42, category: 'top' }
])

// 过滤后的商品列表
const filteredProducts = computed(() => {
  let result = products.value
  
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
        <div 
          v-for="product in filteredProducts" 
          :key="product.id" 
          class="product-card"
        >
          <div class="product-image">
            <div class="discount-tag">{{ product.discount }}%</div>
          </div>
          <h3>{{ product.name }}</h3>
          <p class="price">¥{{ product.price.toFixed(2) }}</p>
          <p class="original-price">¥{{ product.originalPrice.toFixed(2) }}</p>
        </div>
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

/* 主横幅 */
.hero-banner {
  background-color: #1a1a1a;
  background-image: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZjYzMwIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDVMNSAwWk02IDRMNCA2Wk0tMSAxTDEgLTFaIiBzdHJva2U9IiNmZmNjMzAiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=');
  background-size: cover;
  background-position: center;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.banner-content {
  text-align: center;
  color: white;
  z-index: 2;
}

.banner-text h1 {
  font-size: 80px;
  font-weight: bold;
  color: #ffcc00;
  margin: 0;
  line-height: 1;
}

.banner-text h2 {
  font-size: 30px;
  font-weight: normal;
  color: white;
  margin: 10px 0 40px 0;
}

.shop-now-btn {
  padding: 15px 40px;
  background-color: transparent;
  border: 2px solid white;
  color: white;
  font-size: 16px;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.shop-now-btn:hover {
  background-color: white;
  color: #1a1a1a;
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
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.15);
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