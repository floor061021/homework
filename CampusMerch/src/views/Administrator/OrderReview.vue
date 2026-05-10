<script setup>
import { ref, computed } from 'vue'
import { useOrdersStore } from '../../stores/orders'

const ordersStore = useOrdersStore()

// 搜索关键词
const searchKeyword = ref('')

// 状态筛选
const statusFilter = ref('all')

// 拒绝弹窗相关
const showRejectModal = ref(false)
const rejectOrderId = ref('')
const rejectReason = ref('')
const rejectError = ref('')

// 过滤后的订单
const filteredOrders = computed(() => {
  let result = ordersStore.orders
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
  return result
})

// 审核通过
const handleApprove = (orderId) => {
  ordersStore.approveOrder(orderId)
}

// 打开拒绝弹窗
const openRejectModal = (orderId) => {
  rejectOrderId.value = orderId
  rejectReason.value = ''
  rejectError.value = ''
  showRejectModal.value = true
}

// 关闭拒绝弹窗
const closeRejectModal = () => {
  showRejectModal.value = false
  rejectOrderId.value = ''
  rejectReason.value = ''
  rejectError.value = ''
}

// 确认拒绝订单
const confirmReject = () => {
  if (!rejectReason.value.trim()) {
    rejectError.value = '请填写拒绝理由'
    return
  }
  
  if (rejectReason.value.trim().length < 5) {
    rejectError.value = '拒绝理由至少需要5个字符'
    return
  }
  
  ordersStore.rejectOrder(rejectOrderId.value, rejectReason.value.trim())
  closeRejectModal()
}

// 获取状态样式
const getStatusClass = (status) => {
  return ordersStore.getStatusClass(status)
}

const getStatusText = (status) => {
  return ordersStore.getStatusText(status)
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
      <div class="stat-card pending">
        <div class="stat-icon">📋</div>
        <div class="stat-content">
          <div class="stat-number">{{ ordersStore.stats.pending }}</div>
          <div class="stat-label">待审核</div>
        </div>
      </div>
      <div class="stat-card approved">
        <div class="stat-icon">✓</div>
        <div class="stat-content">
          <div class="stat-number">{{ ordersStore.stats.approved }}</div>
          <div class="stat-label">已通过</div>
        </div>
      </div>
      <div class="stat-card rejected">
        <div class="stat-icon">✗</div>
        <div class="stat-content">
          <div class="stat-number">{{ ordersStore.stats.rejected }}</div>
          <div class="stat-label">已拒绝</div>
        </div>
      </div>
      <div class="stat-card total">
        <div class="stat-icon">📦</div>
        <div class="stat-content">
          <div class="stat-number">{{ ordersStore.stats.total }}</div>
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
          class="search-input"
        />
        <button class="search-btn">🔍</button>
      </div>
      <select v-model="statusFilter" class="status-select">
        <option value="all">全部状态</option>
        <option value="pending">待审核</option>
        <option value="approved">已通过</option>
        <option value="rejected">已拒绝</option>
      </select>
    </div>

    <!-- 订单列表 -->
    <div class="orders-table">
      <table>
        <thead>
          <tr>
            <th>订单号</th>
            <th>客户</th>
            <th>商品</th>
            <th>数量</th>
            <th>金额</th>
            <th>下单时间</th>
            <th>状态</th>
            <th>拒绝理由</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in filteredOrders" :key="order.id">
            <td>{{ order.id }}</td>
            <td>{{ order.customer }}</td>
            <td>{{ order.product }}</td>
            <td>{{ order.items }}</td>
            <td>¥{{ order.amount.toFixed(2) }}</td>
            <td>{{ order.createTime }}</td>
            <td><span :class="['status-tag', getStatusClass(order.status)]">{{ getStatusText(order.status) }}</span></td>
            <td>
              <span v-if="order.rejectReason" class="reject-reason">{{ order.rejectReason }}</span>
              <span v-else class="no-reason">-</span>
            </td>
            <td>
              <div class="actions">
                <button 
                  v-if="order.status === 'pending'" 
                  class="action-btn approve"
                  @click="handleApprove(order.id)"
                >
                  通过
                </button>
                <button 
                  v-if="order.status === 'pending'" 
                  class="action-btn reject"
                  @click="openRejectModal(order.id)"
                >
                  拒绝
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div v-if="filteredOrders.length === 0" class="empty-state">
        <p>暂无订单</p>
      </div>
    </div>

    <!-- 拒绝订单弹窗 -->
    <div v-if="showRejectModal" class="modal-overlay" @click.self="closeRejectModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>拒绝订单</h3>
          <button class="close-btn" @click="closeRejectModal">×</button>
        </div>
        <div class="modal-body">
          <p>请输入拒绝订单的理由：</p>
          <textarea 
            v-model="rejectReason" 
            placeholder="请输入拒绝理由（至少5个字符）..."
            rows="4"
            class="reason-input"
          ></textarea>
          <span v-if="rejectError" class="error-message">{{ rejectError }}</span>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="closeRejectModal">取消</button>
          <button class="btn-confirm" @click="confirmReject">确认拒绝</button>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.main-content {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 30px;
}

.page-header h1 {
  font-size: 28px;
  color: #333;
  margin: 0 0 10px 0;
}

.page-header p {
  color: #999;
  margin: 0;
}

/* 统计卡片 */
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
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

.stat-card.pending .stat-icon {
  background: #fff3cd;
}

.stat-card.approved .stat-icon {
  background: #d4edda;
}

.stat-card.rejected .stat-icon {
  background: #f8d7da;
}

.stat-card.total .stat-icon {
  background: #e7f3ff;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 28px;
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
  gap: 20px;
  margin-bottom: 20px;
  align-items: center;
}

.search-input-wrapper {
  flex: 1;
  display: flex;
  max-width: 500px;
}

.search-input {
  flex: 1;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px 0 0 8px;
  font-size: 14px;
}

.search-btn {
  padding: 12px 20px;
  background: #ffcc00;
  border: none;
  border-radius: 0 8px 8px 0;
  cursor: pointer;
  font-size: 16px;
}

.status-select {
  padding: 12px 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  cursor: pointer;
}

/* 订单表格 */
.orders-table {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  overflow: hidden;
}

.orders-table table {
  width: 100%;
  border-collapse: collapse;
}

.orders-table th,
.orders-table td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
}

.orders-table th {
  background: #fafafa;
  font-weight: 600;
  color: #666;
  font-size: 14px;
}

.orders-table tbody tr:hover {
  background: #f9f9f9;
}

/* 状态标签 */
.status-tag {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
}

.status-pending {
  background: #fff3cd;
  color: #856404;
}

.status-approved {
  background: #d4edda;
  color: #155724;
}

.status-rejected {
  background: #f8d7da;
  color: #721c24;
}

/* 拒绝理由 */
.reject-reason {
  font-size: 13px;
  color: #dc3545;
  max-width: 150px;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.no-reason {
  color: #999;
  font-size: 13px;
}

/* 操作按钮 */
.actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 6px 16px;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.action-btn.approve {
  background: #28a745;
  color: white;
}

.action-btn.approve:hover {
  background: #218838;
}

.action-btn.reject {
  background: #dc3545;
  color: white;
}

.action-btn.reject:hover {
  background: #c82333;
}

/* 空状态 */
.empty-state {
  padding: 60px 20px;
  text-align: center;
}

.empty-state p {
  color: #999;
  font-size: 16px;
}

/* 弹窗遮罩 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

/* 弹窗内容 */
.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 480px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #333;
}

.modal-body {
  padding: 20px;
}

.modal-body p {
  margin: 0 0 15px 0;
  font-size: 14px;
  color: #666;
}

.reason-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  resize: none;
  box-sizing: border-box;
}

.reason-input:focus {
  outline: none;
  border-color: #ffcc00;
}

.error-message {
  display: block;
  color: #dc3545;
  font-size: 12px;
  margin-top: 10px;
}

.modal-footer {
  display: flex;
  gap: 15px;
  padding: 20px;
  border-top: 1px solid #f0f0f0;
  justify-content: flex-end;
}

.btn-cancel {
  padding: 10px 24px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-cancel:hover {
  background: #f5f5f5;
}

.btn-confirm {
  padding: 10px 24px;
  border: none;
  border-radius: 6px;
  background: #dc3545;
  color: white;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-confirm:hover {
  background: #c82333;
}

/* 响应式 */
@media (max-width: 768px) {
  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .search-bar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-input-wrapper {
    max-width: none;
  }
  
  .orders-table {
    overflow-x: auto;
  }
  
  .orders-table th,
  .orders-table td {
    padding: 10px 8px;
    font-size: 12px;
  }
  
  .action-btn {
    padding: 4px 10px;
    font-size: 11px;
  }
}
</style>