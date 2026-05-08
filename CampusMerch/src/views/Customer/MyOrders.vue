<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '../../stores/user'

const userStore = useUserStore()

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
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// 订单状态选项
const statusOptions = [
  { value: 'all', label: '全部订单' },
  { value: 'pending_payment', label: '待付款' },
  { value: 'pending_shipping', label: '待发货' },
  { value: 'pending_receipt', label: '待收货' },
  { value: 'completed', label: '已完成' }
]

// 当前选中的状态
const activeStatus = ref('all')

// 模拟订单数据
const orders = ref([
  {
    id: 'ORD20240115001',
    createTime: '2024-01-15 14:30:00',
    status: 'pending_receipt',
    totalPrice: 398.00,
    items: [
      { name: '连帽衫', price: 199, quantity: 2, image: '' }
    ]
  },
  {
    id: 'ORD20240114002',
    createTime: '2024-01-14 10:20:00',
    status: 'completed',
    totalPrice: 99.00,
    items: [
      { name: 'T恤', price: 99, quantity: 1, image: '' }
    ]
  },
  {
    id: 'ORD20240113003',
    createTime: '2024-01-13 16:45:00',
    status: 'pending_shipping',
    totalPrice: 59.00,
    items: [
      { name: '帽子', price: 59, quantity: 1, image: '' }
    ]
  },
  {
    id: 'ORD20240112004',
    createTime: '2024-01-12 09:15:00',
    status: 'pending_payment',
    totalPrice: 159.00,
    items: [
      { name: '卫衣', price: 159, quantity: 1, image: '' }
    ]
  },
  {
    id: 'ORD20240111005',
    createTime: '2024-01-11 20:00:00',
    status: 'completed',
    totalPrice: 499.00,
    items: [
      { name: '连帽衫', price: 199, quantity: 2, image: '' },
      { name: '帽子', price: 59, quantity: 2, image: '' }
    ]
  }
])

// 过滤后的订单列表
const filteredOrders = computed(() => {
  if (activeStatus.value === 'all') {
    return orders.value
  }
  return orders.value.filter(order => order.status === activeStatus.value)
})

// 获取状态标签样式
const getStatusStyle = (status) => {
  const styles = {
    pending_payment: { text: '待付款', color: '#ff6b6b' },
    pending_shipping: { text: '待发货', color: '#ffa502' },
    pending_receipt: { text: '待收货', color: '#ffcc00' },
    completed: { text: '已完成', color: '#4ecdc4' }
  }
  return styles[status] || { text: '未知', color: '#999' }
}

// 确认收货
const confirmReceipt = (orderId) => {
  const order = orders.value.find(o => o.id === orderId)
  if (order && order.status === 'pending_receipt') {
    order.status = 'completed'
    alert(`订单 ${orderId} 已确认收货`)
  }
}
</script>

<template>
  <div class="my-orders">
    <!-- 页面主体 -->
    <div class="page-container">
      <!-- 页面标题 -->
      <div class="page-header">
        <h1>我的订单</h1>
        <p>管理您的所有订单</p>
      </div>
      
      <!-- 未登录状态 -->
      <div v-if="!userStore.isLoggedIn" class="login-prompt">
        <div class="login-prompt-content">
          <svg t="1777463809803" class="login-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8185"><path d="M983.722576 312.747226a510.463422 510.463422 0 0 0-109.653876-162.815816A510.377422 510.377422 0 0 0 512.00011 0.00158a510.292422 510.292422 0 0 0-362.06859 149.92983A510.292422 510.292422 0 0 0 0.00169 512.001a510.121422 510.121422 0 0 0 149.92983 362.06759A510.292422 510.292422 0 0 0 512.00111 1023.99942a510.292422 510.292422 0 0 0 362.06759-149.92983A510.121422 510.121422 0 0 0 1023.99953 512c0-69.119922-13.567985-136.190846-40.276954-199.252774zM516.096105 577.023926a183.039793 183.039793 0 0 1-182.868792-182.868793c0-100.863886 82.005907-182.868793 182.783792-182.868792 100.863886 0 182.869793 82.004907 182.869793 182.869792a183.039793 183.039793 0 0 1-182.869793 182.867793zM320.342327 693.759794a311.977647 311.977647 0 0 1 195.669778-68.009923c71.763919 0 139.347842 23.465973 195.411779 67.924923a315.732642 315.732642 0 0 1 109.311876 166.911811 460.116479 460.116479 0 0 1-304.809654 114.68787 459.689479 459.689479 0 0 1-304.639655-114.60287A315.732642 315.732642 0 0 1 320.342327 693.759794z m413.695531-38.825956a362.665589 362.665589 0 0 0-108.885876-59.477933c32.255963-18.772979 59.562933-45.055949 79.61591-76.543913a232.532737 232.532737 0 0 0-195.924778-356.777596 232.532737 232.532737 0 0 0-196.180778 356.436597 234.299735 234.299735 0 0 0 79.18991 76.543913 362.921589 362.921589 0 0 0-110.250875 59.989932 369.321582 369.321582 0 0 0-117.589867 165.716812 457.727481 457.727481 0 0 1-115.199869-304.469655 456.788483 456.788483 0 0 1 134.399847-324.862632 457.556482 457.556482 0 0 1 324.692633-134.569847 457.641482 457.641482 0 0 1 324.692632 134.569847 458.239481 458.239481 0 0 1 134.485847 324.862632 456.873482 456.873482 0 0 1-115.199869 304.383655 369.236582 369.236582 0 0 0-117.759867-165.801812z" p-id="8186" fill="#ffcc00"></path></svg>
          <h2>您还未登录</h2>
          <p>登录后可以查看您的订单信息</p>
          <button class="go-login-btn" @click="userStore.openLoginModal">去登录</button>
        </div>
      </div>
      
      <!-- 已登录状态 -->
      <div v-else>
        <!-- 状态筛选栏 -->
        <div class="status-filter">
          <div 
            v-for="option in statusOptions" 
            :key="option.value"
            :class="['filter-item', { active: activeStatus === option.value }]"
            @click="activeStatus = option.value"
          >
            {{ option.label }}
          </div>
        </div>
        
        <!-- 订单列表 -->
        <div class="orders-list">
          <div v-if="filteredOrders.length === 0" class="empty-state">
            <div class="empty-icon">📦</div>
            <p>暂无订单</p>
          </div>
          
          <div v-for="order in filteredOrders" :key="order.id" class="order-card">
            <!-- 订单头部 -->
            <div class="order-header">
              <div class="order-id">订单号：{{ order.id }}</div>
              <div class="order-time">{{ order.createTime }}</div>
            </div>
            
            <!-- 订单商品列表 -->
            <div class="order-items">
              <div v-for="(item, index) in order.items" :key="index" class="order-item">
                <div class="item-image">
                  <div class="image-placeholder">👕</div>
                </div>
                <div class="item-info">
                  <h4>{{ item.name }}</h4>
                  <p class="item-price">¥{{ item.price.toFixed(2) }}</p>
                  <p class="item-quantity">x{{ item.quantity }}</p>
                </div>
              </div>
            </div>
            
            <!-- 订单底部 -->
            <div class="order-footer">
              <div class="order-total">
                <span>实付款：</span>
                <span class="total-price">¥{{ order.totalPrice.toFixed(2) }}</span>
              </div>
              <div class="order-status">
                <span :style="{ color: getStatusStyle(order.status).color }">
                  {{ getStatusStyle(order.status).text }}
                </span>
              </div>
              <div class="order-actions">
                <button 
                  v-if="order.status === 'pending_payment'" 
                  class="action-btn primary"
                >
                  立即支付
                </button>
                <button 
                  v-if="order.status === 'pending_receipt'" 
                  class="action-btn primary"
                  @click="confirmReceipt(order.id)"
                >
                  确认收货
                </button>
                <button 
                  v-if="order.status === 'completed'" 
                  class="action-btn secondary"
                >
                  查看详情
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 返回顶部按钮 -->
    <button class="back-to-top" @click="scrollToTop" v-show="showBackTop">↑</button>
    
    <!-- 版权标识 -->
    <footer class="page-footer">
      <p>校园文创预订 © 2026</p>
    </footer>
  </div>
</template>

<style scoped>
.my-orders {
  font-family: Arial, sans-serif;
  min-height: 100vh;
  background-color: #f8f8f8;
}

.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
}

.page-header h1 {
  font-size: 32px;
  color: #333;
  margin: 0 0 10px 0;
}

.page-header p {
  color: #999;
  margin: 0;
}

/* 未登录提示样式 */
.login-prompt {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.login-prompt-content {
  background-color: white;
  border-radius: 12px;
  padding: 60px 40px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.login-icon {
  font-size: 80px;
  margin-bottom: 20px;
}

.login-prompt-content h2 {
  font-size: 24px;
  color: #333;
  margin: 0 0 10px 0;
}

.login-prompt-content p {
  color: #999;
  margin: 0 0 30px 0;
  font-size: 14px;
}

.go-login-btn {
  padding: 14px 40px;
  background-color: #ffcc00;
  color: #1a1a1a;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.go-login-btn:hover {
  background-color: #e6b800;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 204, 0, 0.3);
}

.status-filter {
  display: flex;
  background-color: white;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.filter-item {
  flex: 1;
  text-align: center;
  padding: 12px 15px;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;
}

.filter-item:hover {
  background-color: #f5f5f5;
}

.filter-item.active {
  background-color: #ffcc00;
  color: #1a1a1a;
  font-weight: bold;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.empty-state p {
  color: #999;
  font-size: 16px;
}

.order-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  overflow: hidden;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.order-id {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.order-time {
  font-size: 13px;
  color: #999;
}

.order-items {
  padding: 20px;
}

.order-item {
  display: flex;
  gap: 15px;
}

.order-item:not(:last-child) {
  padding-bottom: 15px;
  border-bottom: 1px solid #f5f5f5;
  margin-bottom: 15px;
}

.item-image {
  width: 80px;
  height: 80px;
  background-color: #f8f8f8;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.image-placeholder {
  font-size: 32px;
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.item-info h4 {
  margin: 0 0 5px 0;
  font-size: 15px;
  color: #333;
  font-weight: normal;
}

.item-price {
  margin: 0 0 3px 0;
  font-size: 14px;
  color: #ff3b30;
  font-weight: bold;
}

.item-quantity {
  margin: 0;
  font-size: 12px;
  color: #999;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #fafafa;
}

.order-total {
  font-size: 14px;
  color: #666;
}

.total-price {
  font-size: 18px;
  color: #ff3b30;
  font-weight: bold;
  margin-left: 5px;
}

.order-status {
  font-size: 14px;
  font-weight: 500;
}

.order-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  padding: 8px 20px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.action-btn.primary {
  background-color: #ffcc00;
  color: #1a1a1a;
}

.action-btn.primary:hover {
  background-color: #e6b800;
}

.action-btn.secondary {
  background-color: transparent;
  color: #666;
  border: 1px solid #ddd;
}

.action-btn.secondary:hover {
  background-color: #f5f5f5;
  border-color: #ccc;
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
  .my-orders {
    padding-top: 180px;
  }
  
  .status-filter {
    flex-wrap: wrap;
  }
  
  .filter-item {
    flex: none;
    min-width: 80px;
  }
  
  .order-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .order-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .order-actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>