<script setup>
import { ref, computed } from 'vue'

// 当前激活的标签页
const activeTab = ref('products')

// 当前选中的订单类型（普通订单/定制订单）
const orderType = ref('normal')

// 商品状态选项
const productStatusOptions = [
  { value: 'all', label: '全部' },
  { value: 'draft', label: '草稿' },
  { value: 'active', label: '上架' },
  { value: 'inactive', label: '下架' }
]

// 订单状态选项
const orderStatusOptions = [
  { value: 'all', label: '全部订单' },
  { value: 'pending_review', label: '待审核' },
  { value: 'approved', label: '已审核' },
  { value: 'shipped', label: '已发货' },
  { value: 'completed', label: '已完成' },
  { value: 'cancelled', label: '已取消' }
]

// 定制订单状态选项
const customOrderStatusOptions = [
  { value: 'all', label: '全部定制' },
  { value: 'pending', label: '待处理' },
  { value: 'producing', label: '制作中' },
  { value: 'completed', label: '已完成' },
  { value: 'cancelled', label: '已取消' }
]

// 当前选中的商品状态
const productStatus = ref('all')

// 当前选中的订单状态
const orderStatus = ref('all')

// 当前选中的定制订单状态
const customOrderStatus = ref('all')

// 商品列表数据
const products = ref([
  {
    id: 'P001',
    name: '连帽衫',
    price: 199,
    stock: 100,
    status: 'active',
    category: '卫衣',
    createTime: '2024-01-10'
  },
  {
    id: 'P002',
    name: 'T恤',
    price: 99,
    stock: 200,
    status: 'active',
    category: '上衣',
    createTime: '2024-01-11'
  },
  {
    id: 'P003',
    name: '帽子',
    price: 59,
    stock: 50,
    status: 'inactive',
    category: '配饰',
    createTime: '2024-01-12'
  },
  {
    id: 'P004',
    name: '卫衣',
    price: 159,
    stock: 80,
    status: 'active',
    category: '卫衣',
    createTime: '2024-01-13'
  },
  {
    id: 'P005',
    name: '裤子',
    price: 129,
    stock: 0,
    status: 'draft',
    category: '下装',
    createTime: '2024-01-14'
  }
])

// 订单列表数据
const orders = ref([
  {
    id: 'ORD20240115001',
    customer: '张三',
    totalPrice: 398,
    status: 'pending_review',
    createTime: '2024-01-15 14:30:00',
    items: '连帽衫 x2'
  },
  {
    id: 'ORD20240114002',
    customer: '李四',
    totalPrice: 99,
    status: 'approved',
    createTime: '2024-01-14 10:20:00',
    items: 'T恤 x1'
  },
  {
    id: 'ORD20240113003',
    customer: '王五',
    totalPrice: 59,
    status: 'shipped',
    createTime: '2024-01-13 16:45:00',
    items: '帽子 x1'
  },
  {
    id: 'ORD20240112004',
    customer: '赵六',
    totalPrice: 159,
    status: 'completed',
    createTime: '2024-01-12 09:15:00',
    items: '卫衣 x1'
  },
  {
    id: 'ORD20240111005',
    customer: '钱七',
    totalPrice: 499,
    status: 'pending_review',
    createTime: '2024-01-11 20:00:00',
    items: '连帽衫 x2, 帽子 x2'
  }
])

// 定制订单列表数据
const customOrders = ref([
  {
    id: 'CUS20240116001',
    customer: '小明',
    totalPrice: 599,
    status: 'producing',
    createTime: '2024-01-16 09:00:00',
    customInfo: '定制图案：校园LOGO',
    progress: [
      { time: '2024-01-16 09:00:00', status: 'created', desc: '客户小明创建了订单，制作中' }
    ]
  },
  {
    id: 'CUS20240115002',
    customer: '小红',
    totalPrice: 799,
    status: 'pending',
    createTime: '2024-01-15 14:30:00',
    customInfo: '定制图案：班级徽章',
    progress: [
      { time: '2024-01-15 14:30:00', status: 'created', desc: '客户小红创建了订单，待处理' }
    ]
  },
  {
    id: 'CUS20240114003',
    customer: '小刚',
    totalPrice: 459,
    status: 'completed',
    createTime: '2024-01-14 10:00:00',
    customInfo: '定制图案：运动会标志',
    progress: [
      { time: '2024-01-14 10:00:00', status: 'created', desc: '客户小刚创建了订单，制作中' },
      { time: '2024-01-16 11:00:00', status: 'completed', desc: '制作已完成，已完成' }
    ]
  },
  {
    id: 'CUS20240113004',
    customer: '小丽',
    totalPrice: 399,
    status: 'cancelled',
    createTime: '2024-01-13 16:00:00',
    customInfo: '定制图案：社团LOGO',
    progress: [
      { time: '2024-01-13 16:00:00', status: 'created', desc: '客户小丽创建了订单，制作中' },
      { time: '2024-01-14 09:00:00', status: 'cancelled', desc: '客户取消订单，已取消' }
    ]
  }
])

// 过滤后的商品列表
const filteredProducts = computed(() => {
  if (productStatus.value === 'all') {
    return products.value
  }
  return products.value.filter(p => p.status === productStatus.value)
})

// 过滤后的订单列表
const filteredOrders = computed(() => {
  if (orderStatus.value === 'all') {
    return orders.value
  }
  return orders.value.filter(o => o.status === orderStatus.value)
})

// 过滤后的定制订单列表
const filteredCustomOrders = computed(() => {
  if (customOrderStatus.value === 'all') {
    return customOrders.value
  }
  return customOrders.value.filter(o => o.status === customOrderStatus.value)
})

// 获取商品状态样式
const getProductStatusStyle = (status) => {
  const styles = {
    draft: { text: '草稿', class: 'status-draft' },
    active: { text: '上架', class: 'status-active' },
    inactive: { text: '下架', class: 'status-inactive' }
  }
  return styles[status] || { text: '未知', class: 'status-unknown' }
}

// 获取订单状态样式
const getOrderStatusStyle = (status) => {
  const styles = {
    pending_review: { text: '待审核', class: 'order-pending' },
    approved: { text: '已审核', class: 'order-approved' },
    shipped: { text: '已发货', class: 'order-shipped' },
    completed: { text: '已完成', class: 'order-completed' },
    cancelled: { text: '已取消', class: 'order-cancelled' }
  }
  return styles[status] || { text: '未知', class: 'order-unknown' }
}

// 获取定制订单状态样式（状态机处理）
const getCustomOrderStatusStyle = (status) => {
  const styles = {
    pending: { text: '待处理', class: 'custom-pending' },
    producing: { text: '制作中', class: 'custom-producing' },
    completed: { text: '已完成', class: 'custom-completed' },
    cancelled: { text: '已取消', class: 'custom-cancelled' }
  }
  return styles[status] || { text: '未知', class: 'custom-unknown' }
}

// 获取进度状态的圆点颜色样式
const getProgressDotClass = (status) => {
  const styles = {
    created: 'progress-dot-orange',
    producing: 'progress-dot-orange',
    completed: 'progress-dot-green',
    cancelled: 'progress-dot-grey'
  }
  return styles[status] || 'progress-dot-grey'
}

// 商品状态机
const productStateMachine = {
  draft: {
    transitions: { publish: 'active', delete: 'deleted' }
  },
  active: {
    transitions: { unpublish: 'inactive', edit: 'active' }
  },
  inactive: {
    transitions: { publish: 'active', delete: 'deleted' }
  }
}

// 订单状态机
const orderStateMachine = {
  pending_review: {
    transitions: { approve: 'approved', reject: 'cancelled' }
  },
  approved: {
    transitions: { ship: 'shipped' }
  },
  shipped: {
    transitions: { complete: 'completed' }
  },
  completed: {
    transitions: {}
  },
  cancelled: {
    transitions: {}
  }
}

// 定制订单状态机
const customOrderStateMachine = {
  pending: {
    transitions: { start: 'producing', cancel: 'cancelled' }
  },
  producing: {
    transitions: { complete: 'completed', cancel: 'cancelled' }
  },
  completed: {
    transitions: {}
  },
  cancelled: {
    transitions: {}
  }
}

// 操作商品
const handleProductAction = (action, product) => {
  const currentState = product.status
  const machine = productStateMachine[currentState]
  
  if (!machine || !machine.transitions[action]) {
    alert(`无法执行此操作: ${action}`)
    return
  }

  switch (action) {
    case 'edit':
      alert(`编辑商品: ${product.name}`)
      break
    case 'toggle':
      const targetState = currentState === 'active' ? 'inactive' : 'active'
      product.status = targetState
      alert(`${product.name} 已${targetState === 'active' ? '上架' : '下架'}`)
      break
    case 'delete':
      if (confirm(`确定删除商品 ${product.name}?`)) {
        const index = products.value.findIndex(p => p.id === product.id)
        if (index > -1) {
          products.value.splice(index, 1)
        }
      }
      break
  }
}

// 审核订单
const handleOrderReview = (orderId, approve) => {
  const order = orders.value.find(o => o.id === orderId)
  if (!order) return

  const action = approve ? 'approve' : 'reject'
  const machine = orderStateMachine[order.status]
  
  if (!machine || !machine.transitions[action]) {
    alert(`无法执行此操作`)
    return
  }

  if (approve) {
    order.status = 'approved'
    alert(`订单 ${orderId} 已审核通过`)
  } else {
    order.status = 'cancelled'
    alert(`订单 ${orderId} 已拒绝`)
  }
}

// 发货
const handleShipOrder = (orderId) => {
  const order = orders.value.find(o => o.id === orderId)
  if (!order) return

  const machine = orderStateMachine[order.status]
  
  if (!machine || !machine.transitions['ship']) {
    alert(`无法执行发货操作`)
    return
  }

  if (order.status === 'approved') {
    order.status = 'shipped'
    alert(`订单 ${orderId} 已发货`)
  }
}

// 查看定制订单详情
const viewCustomOrder = (order) => {
  alert(`查看定制订单详情:\n订单号: ${order.id}\n客户: ${order.customer}\n定制内容: ${order.customInfo}\n金额: ¥${order.totalPrice}`)
}

// 编辑定制订单
const editCustomOrder = (order) => {
  alert(`编辑定制订单: ${order.id}`)
}

// 取消定制订单
const cancelCustomOrder = (orderId) => {
  const order = customOrders.value.find(o => o.id === orderId)
  if (!order) return

  const machine = customOrderStateMachine[order.status]
  
  if (!machine || !machine.transitions['cancel']) {
    alert(`无法取消此订单`)
    return
  }

  order.status = 'cancelled'
  order.progress.push({
    time: new Date().toLocaleString(),
    status: 'cancelled',
    desc: '客户取消订单，已取消'
  })
  alert(`定制订单 ${orderId} 已取消`)
}

// 完成定制订单
const completeCustomOrder = (orderId) => {
  const order = customOrders.value.find(o => o.id === orderId)
  if (!order) return

  const machine = customOrderStateMachine[order.status]
  
  if (!machine || !machine.transitions['complete']) {
    alert(`无法完成此订单`)
    return
  }

  order.status = 'completed'
  order.progress.push({
    time: new Date().toLocaleString(),
    status: 'completed',
    desc: '制作已完成，已完成'
  })
  alert(`定制订单 ${orderId} 已完成`)
}

// 开始制作定制订单
const startCustomOrder = (orderId) => {
  const order = customOrders.value.find(o => o.id === orderId)
  if (!order) return

  const machine = customOrderStateMachine[order.status]
  
  if (!machine || !machine.transitions['start']) {
    alert(`无法开始制作此订单`)
    return
  }

  order.status = 'producing'
  order.progress[0].desc = order.progress[0].desc.replace('待处理', '制作中')
  alert(`定制订单 ${orderId} 已开始制作`)
}

// 显示进度跟踪弹窗
const showProgressModal = ref(false)
const currentOrderProgress = ref(null)

const openProgressTrack = (order) => {
  currentOrderProgress.value = order
  showProgressModal.value = true
}

const closeProgressModal = () => {
  showProgressModal.value = false
  currentOrderProgress.value = null
}
</script>

<template>
  <div class="admin-page">
    <!-- 页面主体 -->
    <div class="admin-container">
      <!-- 侧边栏 -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <h2>管理面板</h2>
        </div>
        <nav class="sidebar-nav">
          <div 
            :class="['nav-item', { active: activeTab === 'products' }]"
            @click="activeTab = 'products'"
          >
            📦 商品管理
          </div>
          <div 
            :class="['nav-item', { active: activeTab === 'orders' }]"
            @click="activeTab = 'orders'"
          >
            📋 订单审核
          </div>
          <div 
            :class="['nav-item', { active: activeTab === 'customOrders' }]"
            @click="activeTab = 'customOrders'"
          >
            🎨 定制订单
          </div>
          <div class="nav-item">
            📊 数据统计
          </div>
          <div class="nav-item">
            ⚙️ 系统设置
          </div>
        </nav>
      </aside>
      
      <!-- 主内容区 -->
      <main class="main-content">
        <!-- 商品管理 -->
        <div v-if="activeTab === 'products'">
          <div class="section-header">
            <h1>商品管理</h1>
            <button class="add-btn">+ 添加商品</button>
          </div>
          
          <!-- 状态筛选 -->
          <div class="filter-bar">
            <div 
              v-for="option in productStatusOptions" 
              :key="option.value"
              :class="['filter-item', { active: productStatus === option.value }]"
              @click="productStatus = option.value"
            >
              {{ option.label }}
            </div>
          </div>
          
          <!-- 商品列表 -->
          <div class="data-table">
            <table>
              <thead>
                <tr>
                  <th>商品ID</th>
                  <th>商品名称</th>
                  <th>分类</th>
                  <th>价格</th>
                  <th>库存</th>
                  <th>状态</th>
                  <th>创建时间</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="product in filteredProducts" :key="product.id">
                  <td>{{ product.id }}</td>
                  <td>{{ product.name }}</td>
                  <td>{{ product.category }}</td>
                  <td>¥{{ product.price.toFixed(2) }}</td>
                  <td :class="{ 'low-stock': product.stock < 10 }">
                    {{ product.stock }}
                  </td>
                  <td>
                    <span :class="['status-tag', getProductStatusStyle(product.status).class]">
                      {{ getProductStatusStyle(product.status).text }}
                    </span>
                  </td>
                  <td>{{ product.createTime }}</td>
                  <td class="actions">
                    <button class="action-btn edit" @click="handleProductAction('edit', product)">
                      编辑
                    </button>
                    <button 
                      class="action-btn toggle" 
                      @click="handleProductAction('toggle', product)"
                    >
                      {{ product.status === 'active' ? '下架' : '上架' }}
                    </button>
                    <button class="action-btn delete" @click="handleProductAction('delete', product)">
                      删除
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            
            <div v-if="filteredProducts.length === 0" class="empty-state">
              <p>暂无商品</p>
            </div>
          </div>
        </div>
        
        <!-- 订单审核 -->
        <div v-if="activeTab === 'orders'">
          <div class="section-header">
            <h1>订单审核</h1>
            <span class="pending-count">待审核: {{ orders.filter(o => o.status === 'pending_review').length }}</span>
          </div>
          
          <!-- 状态筛选 -->
          <div class="filter-bar">
            <div 
              v-for="option in orderStatusOptions" 
              :key="option.value"
              :class="['filter-item', { active: orderStatus === option.value }]"
              @click="orderStatus = option.value"
            >
              {{ option.label }}
            </div>
          </div>
          
          <!-- 订单列表 -->
          <div class="data-table">
            <table>
              <thead>
                <tr>
                  <th>订单号</th>
                  <th>客户</th>
                  <th>商品信息</th>
                  <th>订单金额</th>
                  <th>状态</th>
                  <th>创建时间</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in filteredOrders" :key="order.id">
                  <td>{{ order.id }}</td>
                  <td>{{ order.customer }}</td>
                  <td class="item-info">{{ order.items }}</td>
                  <td class="order-price">¥{{ order.totalPrice.toFixed(2) }}</td>
                  <td>
                    <span :class="['status-tag', getOrderStatusStyle(order.status).class]">
                      {{ getOrderStatusStyle(order.status).text }}
                    </span>
                  </td>
                  <td>{{ order.createTime }}</td>
                  <td class="actions">
                    <template v-if="order.status === 'pending_review'">
                      <button class="action-btn approve" @click="handleOrderReview(order.id, true)">
                        通过
                      </button>
                      <button class="action-btn reject" @click="handleOrderReview(order.id, false)">
                        拒绝
                      </button>
                    </template>
                    <template v-else-if="order.status === 'approved'">
                      <button class="action-btn ship" @click="handleShipOrder(order.id)">
                        发货
                      </button>
                    </template>
                    <template v-else>
                      <button class="action-btn view">详情</button>
                    </template>
                  </td>
                </tr>
              </tbody>
            </table>
            
            <div v-if="filteredOrders.length === 0" class="empty-state">
              <p>暂无订单</p>
            </div>
          </div>
        </div>
        
        <!-- 定制订单 -->
        <div v-if="activeTab === 'customOrders'">
          <div class="section-header">
            <h1>定制订单管理</h1>
            <span class="pending-count">待处理: {{ customOrders.filter(o => o.status === 'pending').length }}</span>
          </div>
          
          <!-- 状态筛选 -->
          <div class="filter-bar">
            <div 
              v-for="option in customOrderStatusOptions" 
              :key="option.value"
              :class="['filter-item', { active: customOrderStatus === option.value }]"
              @click="customOrderStatus = option.value"
            >
              {{ option.label }}
            </div>
          </div>
          
          <!-- 定制订单列表 -->
          <div class="data-table">
            <table>
              <thead>
                <tr>
                  <th>订单号</th>
                  <th>客户</th>
                  <th>定制内容</th>
                  <th>订单金额</th>
                  <th>状态</th>
                  <th>创建时间</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in filteredCustomOrders" :key="order.id">
                  <td>{{ order.id }}</td>
                  <td>{{ order.customer }}</td>
                  <td class="item-info">{{ order.customInfo }}</td>
                  <td class="order-price">¥{{ order.totalPrice.toFixed(2) }}</td>
                  <td>
                    <span :class="['status-tag', getCustomOrderStatusStyle(order.status).class]">
                      {{ getCustomOrderStatusStyle(order.status).text }}
                    </span>
                  </td>
                  <td>{{ order.createTime }}</td>
                  <td class="actions">
                    <button class="action-btn view-white" @click="viewCustomOrder(order)">
                      查看
                    </button>
                    <button class="action-btn edit-blue" @click="editCustomOrder(order)">
                      编辑
                    </button>
                    <button 
                      class="action-btn cancel-grey" 
                      :disabled="order.status === 'completed' || order.status === 'cancelled'"
                      @click="cancelCustomOrder(order.id)"
                    >
                      取消
                    </button>
                    <button 
                      v-if="order.status === 'pending' || order.status === 'producing'"
                      class="action-btn complete-green" 
                      @click="order.status === 'pending' ? startCustomOrder(order.id) : completeCustomOrder(order.id)"
                    >
                      {{ order.status === 'pending' ? '开始制作' : '完成' }}
                    </button>
                    <button class="action-btn track-orange" @click="openProgressTrack(order)">
                      进度跟踪
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            
            <div v-if="filteredCustomOrders.length === 0" class="empty-state">
              <p>暂无定制订单</p>
            </div>
          </div>
        </div>
      </main>
    </div>
    
    <!-- 进度跟踪弹窗 -->
    <div v-if="showProgressModal" class="progress-modal-overlay" @click.self="closeProgressModal">
      <div class="progress-modal">
        <div class="progress-modal-header">
          <h3>订单进度跟踪 - {{ currentOrderProgress?.id }}</h3>
          <button class="close-btn" @click="closeProgressModal">×</button>
        </div>
        <div class="progress-modal-body">
          <div class="progress-info">
            <div class="info-row">
              <span class="label">客户</span>
              <span class="value">{{ currentOrderProgress?.customer }}</span>
            </div>
            <div class="info-row">
              <span class="label">定制内容</span>
              <span class="value">{{ currentOrderProgress?.customInfo }}</span>
            </div>
            <div class="info-row">
              <span class="label">订单金额</span>
              <span class="value">¥{{ currentOrderProgress?.totalPrice.toFixed(2) }}</span>
            </div>
            <div class="info-row">
              <span class="label">当前状态</span>
              <span :class="['status-tag', getCustomOrderStatusStyle(currentOrderProgress?.status).class]">
                {{ getCustomOrderStatusStyle(currentOrderProgress?.status).text }}
              </span>
            </div>
          </div>
          
          <div class="progress-timeline">
            <h4>进度时间线</h4>
            <div class="timeline-list">
              <div 
                v-for="(step, index) in currentOrderProgress?.progress" 
                :key="index"
                class="timeline-item"
              >
                <div :class="['timeline-dot', getProgressDotClass(step.status)]"></div>
                <div class="timeline-content">
                  <p class="timeline-desc">{{ step.desc }}</p>
                  <p class="timeline-time">{{ step.time }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-page {
  font-family: Arial, sans-serif;
  padding-top: 20px;
  min-height: 100vh;
  background-color: #f8f8f8;
}

.admin-container {
  display: flex;
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  gap: 20px;
}

/* 侧边栏 */
.sidebar {
  width: 220px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  padding: 20px;
  flex-shrink: 0;
}

.sidebar-header h2 {
  margin: 0 0 20px 0;
  font-size: 18px;
  color: #333;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.nav-item {
  padding: 12px 15px;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;
}

.nav-item:hover {
  background-color: #f5f5f5;
}

.nav-item.active {
  background-color: #ffcc00;
  color: #1a1a1a;
  font-weight: bold;
}

/* 主内容区 */
.main-content {
  flex: 1;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h1 {
  font-size: 24px;
  color: #333;
  margin: 0;
}

.add-btn {
  padding: 10px 20px;
  background-color: #ffcc00;
  color: #1a1a1a;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-btn:hover {
  background-color: #e6b800;
}

.pending-count {
  padding: 8px 16px;
  background-color: #ff3b30;
  color: white;
  border-radius: 20px;
  font-size: 13px;
  font-weight: bold;
}

/* 筛选栏 */
.filter-bar {
  display: flex;
  background-color: white;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  flex-wrap: wrap;
  gap: 5px;
}

.filter-item {
  padding: 10px 20px;
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

/* 数据表格 */
.data-table {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  overflow: hidden;
}

.data-table table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
}

.data-table th {
  background-color: #f8f8f8;
  font-weight: bold;
  color: #666;
  font-size: 14px;
}

.data-table tbody tr:hover {
  background-color: #fafafa;
}

.data-table tbody tr:last-child td {
  border-bottom: none;
}

/* 状态标签 */
.status-tag {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}

.status-draft {
  background-color: #f5f5f5;
  color: #666;
}

.status-active {
  background-color: #e8f5e9;
  color: #4caf50;
}

.status-inactive {
  background-color: #ffebee;
  color: #f44336;
}

.order-pending {
  background-color: #fff3e0;
  color: #ff9800;
}

.order-approved {
  background-color: #e3f2fd;
  color: #2196f3;
}

.order-shipped {
  background-color: #e8f5e9;
  color: #4caf50;
}

.order-completed {
  background-color: #f3e5f5;
  color: #9c27b0;
}

.order-cancelled {
  background-color: #f5f5f5;
  color: #9e9e9e;
}

/* 库存警告 */
.low-stock {
  color: #ff3b30;
  font-weight: bold;
}

/* 订单价格 */
.order-price {
  font-weight: bold;
  color: #ff3b30;
}

.item-info {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 操作按钮 */
.actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 6px 14px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.action-btn.edit {
  background-color: #2196f3;
  color: white;
}

.action-btn.edit:hover {
  background-color: #1976d2;
}

.action-btn.toggle {
  background-color: #ffcc00;
  color: #1a1a1a;
}

.action-btn.toggle:hover {
  background-color: #e6b800;
}

.action-btn.delete {
  background-color: #f44336;
  color: white;
}

.action-btn.delete:hover {
  background-color: #d32f2f;
}

.action-btn.approve {
  background-color: #4caf50;
  color: white;
}

.action-btn.approve:hover {
  background-color: #388e3c;
}

.action-btn.reject {
  background-color: #f44336;
  color: white;
}

.action-btn.reject:hover {
  background-color: #d32f2f;
}

.action-btn.ship {
  background-color: #ffcc00;
  color: #1a1a1a;
}

.action-btn.ship:hover {
  background-color: #e6b800;
}

.action-btn.view {
  background-color: #f5f5f5;
  color: #666;
  border: 1px solid #ddd;
}

.action-btn.view:hover {
  background-color: #eee;
}

/* 空状态 */
.empty-state {
  padding: 60px 20px;
  text-align: center;
  color: #999;
}

.empty-state p {
  margin: 0;
}

/* 定制订单状态标签 */
.custom-pending {
  background-color: #fff3e0;
  color: #ff9800;
}

.custom-producing {
  background-color: #fff3e0;
  color: #ff9800;
}

.custom-completed {
  background-color: #e8f5e9;
  color: #4caf50;
}

.custom-cancelled {
  background-color: #f5f5f5;
  color: #9e9e9e;
}

/* 定制订单操作按钮 */
.action-btn.view-white {
  background-color: white;
  color: #333;
  border: 1px solid #ddd;
}

.action-btn.view-white:hover {
  background-color: #f5f5f5;
}

.action-btn.edit-blue {
  background-color: #2196f3;
  color: white;
}

.action-btn.edit-blue:hover {
  background-color: #1976d2;
}

.action-btn.cancel-grey {
  background-color: #f5f5f5;
  color: #666;
  border: 1px solid #ddd;
}

.action-btn.cancel-grey:hover:not(:disabled) {
  background-color: #e8e8e8;
}

.action-btn.cancel-grey:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-btn.complete-green {
  background-color: #4caf50;
  color: white;
}

.action-btn.complete-green:hover {
  background-color: #388e3c;
}

.action-btn.track-orange {
  background-color: #ff9800;
  color: white;
}

.action-btn.track-orange:hover {
  background-color: #f57c00;
}

/* 进度跟踪弹窗 */
.progress-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.progress-modal {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.progress-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  background-color: #f8f8f8;
}

.progress-modal-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.progress-modal-header .close-btn {
  width: 30px;
  height: 30px;
  border: none;
  background-color: transparent;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  line-height: 1;
}

.progress-modal-header .close-btn:hover {
  color: #333;
}

.progress-modal-body {
  padding: 20px;
  overflow-y: auto;
  max-height: calc(80vh - 80px);
}

.progress-info {
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.info-row {
  display: flex;
  margin-bottom: 12px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-row .label {
  width: 100px;
  color: #999;
  font-size: 14px;
}

.info-row .value {
  flex: 1;
  color: #333;
  font-size: 14px;
}

.progress-timeline h4 {
  margin: 0 0 15px 0;
  font-size: 16px;
  color: #333;
}

.timeline-list {
  position: relative;
  padding-left: 20px;
}

.timeline-list::before {
  content: '';
  position: absolute;
  left: 8px;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: #e0e0e0;
}

.timeline-item {
  position: relative;
  padding-left: 25px;
  margin-bottom: 20px;
}

.timeline-item:last-child {
  margin-bottom: 0;
}

.timeline-dot {
  position: absolute;
  left: -20px;
  top: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
}

.progress-dot-orange {
  background-color: #ff9800;
}

.progress-dot-green {
  background-color: #4caf50;
}

.progress-dot-grey {
  background-color: #9e9e9e;
}

.timeline-content {
  background-color: #fafafa;
  padding: 12px 15px;
  border-radius: 6px;
}

.timeline-desc {
  margin: 0 0 5px 0;
  font-size: 14px;
  color: #333;
}

.timeline-time {
  margin: 0;
  font-size: 12px;
  color: #999;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .admin-container {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
  }
  
  .sidebar-nav {
    flex-direction: row;
    flex-wrap: wrap;
  }
  
  .nav-item {
    flex: 1;
    min-width: 100px;
    text-align: center;
  }
  
  .data-table {
    overflow-x: auto;
  }
  
  .data-table table {
    min-width: 800px;
  }
  
  .actions {
    flex-direction: column;
  }
  
  .action-btn {
    width: 100%;
  }
}
</style>