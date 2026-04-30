<script setup>
import { ref } from 'vue'

// 订单统计数据
const stats = ref({
  pending: 12,
  approved: 156,
  rejected: 8,
  total: 176
})

// 订单列表数据
const orders = ref([
  { id: 'ORD20241201001', customer: '张三', product: '连帽衫-定制款', amount: 199.00, status: 'pending', createTime: '2024-12-01 14:30:25', items: 2 },
  { id: 'ORD20241201002', customer: '李四', product: 'T恤-校园款', amount: 99.00, status: 'pending', createTime: '2024-12-01 15:45:12', items: 3 },
  { id: 'ORD20241201003', customer: '王五', product: '文化衫-毕业季', amount: 159.00, status: 'pending', createTime: '2024-12-01 16:20:08', items: 1 },
  { id: 'ORD20241201004', customer: '赵六', product: '卫衣-学院风', amount: 179.00, status: 'pending', createTime: '2024-12-01 17:15:33', items: 2 },
  { id: 'ORD20241201005', customer: '孙七', product: '棒球帽-校徽款', amount: 59.00, status: 'pending', createTime: '2024-12-01 18:00:45', items: 5 },
  { id: 'ORD20241202001', customer: '周八', product: '帆布包-定制', amount: 49.00, status: 'approved', createTime: '2024-12-02 09:30:15', items: 10 },
  { id: 'ORD20241202002', customer: '吴九', product: '笔记本-校园风', amount: 29.00, status: 'approved', createTime: '2024-12-02 10:15:22', items: 20 },
  { id: 'ORD20241202003', customer: '郑十', product: '钥匙扣-文创', amount: 19.00, status: 'rejected', createTime: '2024-12-02 11:00:00', items: 15 }
])

// 搜索关键词
const searchKeyword = ref('')

// 状态筛选
const statusFilter = ref('all')

// 过滤后的订单
const filteredOrders = ref(orders.value)

// 筛选订单
const filterOrders = () => {
  let result = orders.value
  if (statusFilter.value !== 'all') {
    result = result.filter(order => order.status === statusFilter.value)
  }
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(order => 
      order.id.toLowerCase().includes(keyword) ||
      order.customer.toLowerCase().includes(keyword) ||
      order.product.toLowerCase().includes(keyword)
    )
  }
  filteredOrders.value = result
}

// 审核操作
const handleApprove = (orderId) => {
  const order = orders.value.find(o => o.id === orderId)
  if (order) {
    order.status = 'approved'
    stats.value.pending--
    stats.value.approved++
    filterOrders()
  }
}

const handleReject = (orderId) => {
  const order = orders.value.find(o => o.id === orderId)
  if (order) {
    order.status = 'rejected'
    stats.value.pending--
    stats.value.rejected++
    filterOrders()
  }
}

// 获取状态样式
const getStatusClass = (status) => {
  const classes = {
    pending: 'status-pending',
    approved: 'status-approved',
    rejected: 'status-rejected'
  }
  return classes[status] || ''
}

const getStatusText = (status) => {
  const texts = {
    pending: '待审核',
    approved: '已通过',
    rejected: '已拒绝'
  }
  return texts[status] || status
}
</script>

<template>
  <main class="main-content">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>订单审核</h1>
      <p>订单审核与管理</p>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-icon pending-icon">📋</div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.pending }}</div>
          <div class="stat-label">待审核</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon approved-icon">✅</div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.approved }}</div>
          <div class="stat-label">已通过</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon rejected-icon">❌</div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.rejected }}</div>
          <div class="stat-label">已拒绝</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon total-icon">📊</div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.total }}</div>
          <div class="stat-label">总订单</div>
        </div>
      </div>
    </div>

    <!-- 搜索和筛选 -->
    <div class="search-bar">
      <div class="search-input-wrapper">
        <input 
          type="text" 
          v-model="searchKeyword" 
          placeholder="搜索订单号、客户名、商品名..."
          @input="filterOrders"
          class="search-input"
        />
        <span class="search-icon">🔍</span>
      </div>
      <div class="filter-select">
        <select v-model="statusFilter" @change="filterOrders" class="status-select">
          <option value="all">全部状态</option>
          <option value="pending">待审核</option>
          <option value="approved">已通过</option>
          <option value="rejected">已拒绝</option>
        </select>
      </div>
    </div>

    <!-- 订单列表 -->
    <div class="order-list-card">
      <h2>订单列表</h2>
      <div class="order-table-wrapper">
        <table class="order-table">
          <thead>
            <tr>
              <th>订单号</th>
              <th>客户</th>
              <th>商品</th>
              <th>数量</th>
              <th>金额</th>
              <th>下单时间</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in filteredOrders" :key="order.id">
              <td class="order-id">{{ order.id }}</td>
              <td>{{ order.customer }}</td>
              <td class="product-name">{{ order.product }}</td>
              <td>{{ order.items }}</td>
              <td class="amount">¥{{ order.amount.toFixed(2) }}</td>
              <td>{{ order.createTime }}</td>
              <td><span :class="['status-tag', getStatusClass(order.status)]">{{ getStatusText(order.status) }}</span></td>
              <td class="actions">
                <button 
                  v-if="order.status === 'pending'" 
                  class="btn btn-approve" 
                  @click="handleApprove(order.id)"
                >
                  通过
                </button>
                <button 
                  v-if="order.status === 'pending'" 
                  class="btn btn-reject" 
                  @click="handleReject(order.id)"
                >
                  拒绝
                </button>
                <span v-else class="no-action">-</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</template>

<style scoped>
.main-content {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.page-header h1 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.page-header p {
  margin: 5px 0 0 0;
  color: #999;
  font-size: 14px;
}

/* 统计卡片 */
.stats-row {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.stat-card {
  flex: 1;
  min-width: 150px;
  background: white;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.pending-icon {
  background: #fff3e0;
}

.approved-icon {
  background: #e8f5e9;
}

.rejected-icon {
  background: #ffebee;
}

.total-icon {
  background: #e3f2fd;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.stat-label {
  font-size: 14px;
  color: #999;
}

/* 搜索栏 */
.search-bar {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  align-items: center;
}

.search-input-wrapper {
  position: relative;
  flex: 1;
  min-width: 200px;
  max-width: 400px;
}

.search-input {
  width: 100%;
  padding: 10px 40px 10px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;
}

.search-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
}

.status-select {
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  background: white;
}

/* 订单列表卡片 */
.order-list-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.order-list-card h2 {
  margin: 0 0 20px 0;
  font-size: 16px;
  color: #333;
}

.order-table-wrapper {
  overflow-x: auto;
}

.order-table {
  width: 100%;
  border-collapse: collapse;
}

.order-table th,
.order-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
}

.order-table th {
  background: #fafafa;
  font-weight: 600;
  color: #666;
}

.order-table tr:hover {
  background: #fafafa;
}

.order-id {
  font-family: monospace;
  color: #1890ff;
}

.product-name {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.amount {
  font-weight: 600;
  color: #333;
}

.status-tag {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.status-pending {
  background: #fff3e0;
  color: #f59e0b;
}

.status-approved {
  background: #e8f5e9;
  color: #10b981;
}

.status-rejected {
  background: #ffebee;
  color: #ef4444;
}

/* 操作按钮 */
.actions {
  display: flex;
  gap: 8px;
}

.btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-approve {
  background: #10b981;
  color: white;
}

.btn-approve:hover {
  background: #059669;
}

.btn-reject {
  background: #ef4444;
  color: white;
}

.btn-reject:hover {
  background: #dc2626;
}

.no-action {
  color: #999;
  font-size: 12px;
}
</style>
