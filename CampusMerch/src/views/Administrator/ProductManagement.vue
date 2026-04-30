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

// 商品添加弹窗
const showAddProductModal = ref(false)

const openAddProductModal = () => {
  showAddProductModal.value = true
}

const closeAddProductModal = () => {
  showAddProductModal.value = false
  resetProductForm()
}

// 商品表单数据
const newProduct = ref({
  name: '',
  code: '',
  description: '',
  price: '',
  stock: '',
  category: '',
  coverImage: '',
  allowCustom: false,
  status: 'draft'
})

// 分类选项
const categoryOptions = [
  { value: '文化衫', label: '文化衫' },
  { value: '卫衣', label: '卫衣' },
  { value: 'T恤', label: 'T恤' },
  { value: '帽子', label: '帽子' },
  { value: '帆布包', label: '帆布包' },
  { value: '文具', label: '文具' },
  { value: '饰品', label: '饰品' }
]

// 重置表单
const resetProductForm = () => {
  newProduct.value = {
    name: '',
    code: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    coverImage: '',
    allowCustom: false,
    status: 'draft'
  }
}

// 提交商品
const submitProduct = () => {
  if (!newProduct.value.name) {
    alert('请输入商品名称')
    return
  }
  if (!newProduct.value.price) {
    alert('请输入商品价格')
    return
  }
  if (!newProduct.value.stock) {
    alert('请输入商品库存')
    return
  }
  if (!newProduct.value.category) {
    alert('请选择商品分类')
    return
  }

  const product = {
    id: 'P' + String(products.value.length + 1).padStart(3, '0'),
    name: newProduct.value.name,
    code: newProduct.value.code || 'AUTO' + Date.now(),
    price: parseFloat(newProduct.value.price),
    stock: parseInt(newProduct.value.stock),
    status: newProduct.value.status,
    category: newProduct.value.category,
    createTime: new Date().toISOString().split('T')[0]
  }

  products.value.unshift(product)
  alert(`商品 "${product.name}" 添加成功！`)
  closeAddProductModal()
}
</script>

<template>
  <div class="admin-page">
    <!-- 主内容区 -->
    <main class="main-content">
      <!-- 商品管理 -->
      <div>
          <div class="section-header">
            <h1>商品管理</h1>
            <button class="add-btn" @click="openAddProductModal">+ 添加商品</button>
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
    </main>
  </div>

  <!-- 商品添加弹窗 -->
  <div v-if="showAddProductModal" class="add-product-modal-overlay" @click.self="closeAddProductModal">
    <div class="add-product-modal">
      <div class="add-product-modal-header">
        <h2>添加商品</h2>
        <button class="close-modal-btn" @click="closeAddProductModal">×</button>
      </div>
      <div class="add-product-modal-body">
        <div class="form-grid">
          <div class="form-group">
            <label>商品名称 <span class="required">*</span></label>
            <input type="text" v-model="newProduct.name" class="form-input" placeholder="请输入商品名称" />
          </div>
          <div class="form-group">
            <label>商品编码</label>
            <input type="text" v-model="newProduct.code" class="form-input" placeholder="系统自动生成" />
          </div>
          <div class="form-group">
            <label>商品分类 <span class="required">*</span></label>
            <select v-model="newProduct.category" class="form-select">
              <option value="">请选择分类</option>
              <option v-for="cat in categoryOptions" :key="cat.value" :value="cat.value">{{ cat.label }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>商品价格 <span class="required">*</span></label>
            <input type="number" v-model="newProduct.price" class="form-input" placeholder="0.00" step="0.01" />
          </div>
          <div class="form-group">
            <label>商品库存 <span class="required">*</span></label>
            <input type="number" v-model="newProduct.stock" class="form-input" placeholder="0" />
          </div>
          <div class="form-group">
            <label>商品状态</label>
            <div class="status-options">
              <label :class="['status-option', { selected: newProduct.status === 'draft' }]">
                <input type="radio" v-model="newProduct.status" value="draft" />
                <span class="status-dot draft"></span>
                <span>草稿</span>
              </label>
              <label :class="['status-option', { selected: newProduct.status === 'active' }]">
                <input type="radio" v-model="newProduct.status" value="active" />
                <span class="status-dot active"></span>
                <span>上架</span>
              </label>
              <label :class="['status-option', { selected: newProduct.status === 'inactive' }]">
                <input type="radio" v-model="newProduct.status" value="inactive" />
                <span class="status-dot inactive"></span>
                <span>下架</span>
              </label>
            </div>
          </div>
          <div class="form-group full-width">
            <label>商品描述</label>
            <textarea v-model="newProduct.description" class="form-textarea" placeholder="请输入商品描述..."></textarea>
          </div>
          <div class="form-group full-width">
            <label>封面图片</label>
            <div class="image-upload-area">
              <div class="image-upload-icon">📷</div>
              <div class="image-upload-text">点击上传图片</div>
              <div class="image-upload-hint">支持 JPG、PNG 格式，文件小于 5MB</div>
            </div>
          </div>
          <div class="form-group full-width">
            <div class="checkbox-group">
              <label class="checkbox-wrapper">
                <input type="checkbox" v-model="newProduct.allowCustom" />
                <span class="checkbox-mark"></span>
              </label>
              <span class="checkbox-label">允许定制</span>
            </div>
          </div>
        </div>
      </div>
      <div class="add-product-modal-footer">
        <button class="cancel-btn" @click="closeAddProductModal">取消</button>
        <button class="submit-btn" @click="submitProduct">添加商品</button>
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

/* 主内容区 */
.main-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
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

/* 商品添加弹窗样式 */
.add-product-modal-overlay {
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

.add-product-modal {
  background-color: white;
  border-radius: 12px;
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.add-product-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: linear-gradient(135deg, #ffcc00 0%, #ff9500 100%);
  color: #1a1a1a;
}

.add-product-modal-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: bold;
}

.close-modal-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.close-modal-btn:hover {
  background: rgba(0, 0, 0, 0.2);
  transform: rotate(90deg);
}

.add-product-modal-body {
  padding: 24px;
  max-height: calc(90vh - 140px);
  overflow-y: auto;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.form-group label .required {
  color: #ff3b30;
  margin-left: 2px;
}

.form-input,
.form-textarea,
.form-select {
  padding: 12px 16px;
  border: 2px solid #e8e8e8;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s;
  background: white;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #ffcc00;
  box-shadow: 0 0 0 3px rgba(255, 204, 0, 0.2);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
}

.form-select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  padding-right: 40px;
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 0;
}

.checkbox-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.checkbox-wrapper input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkbox-mark {
  width: 22px;
  height: 22px;
  background: white;
  border: 2px solid #ddd;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.checkbox-mark::after {
  content: '✓';
  font-size: 14px;
  color: white;
  opacity: 0;
  transform: scale(0);
  transition: all 0.2s;
}

.checkbox-wrapper input:checked ~ .checkbox-mark {
  background: #ffcc00;
  border-color: #ffcc00;
}

.checkbox-wrapper input:checked ~ .checkbox-mark::after {
  opacity: 1;
  transform: scale(1);
}

.checkbox-label {
  font-size: 14px;
  color: #666;
  user-select: none;
}

.image-upload-area {
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  background: #fafafa;
}

.image-upload-area:hover {
  border-color: #ffcc00;
  background: #fffef5;
}

.image-upload-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.image-upload-text {
  font-size: 14px;
  color: #666;
}

.image-upload-hint {
  font-size: 12px;
  color: #999;
  margin-top: 8px;
}

.status-options {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.status-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: 2px solid #e8e8e8;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.status-option:hover {
  border-color: #ffcc00;
}

.status-option input[type="radio"] {
  display: none;
}

.status-option.selected {
  border-color: #ffcc00;
  background: #fffef5;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.status-dot.draft {
  background: #999;
}

.status-dot.active {
  background: #4caf50;
}

.status-dot.inactive {
  background: #f44336;
}

.status-option span:last-child {
  font-size: 14px;
  color: #333;
}

.add-product-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #f0f0f0;
  background: #fafafa;
}

.cancel-btn {
  padding: 12px 24px;
  background: white;
  color: #666;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.cancel-btn:hover {
  border-color: #999;
  color: #333;
}

.submit-btn {
  padding: 12px 32px;
  background: linear-gradient(135deg, #ffcc00 0%, #ff9500 100%);
  color: #1a1a1a;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(255, 153, 0, 0.3);
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(255, 153, 0, 0.4);
}

.submit-btn:active {
  transform: translateY(0);
}
</style>