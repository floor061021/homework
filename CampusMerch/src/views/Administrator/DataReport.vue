<script setup>
import { ref, computed } from 'vue'

// 报表类型
const reportTypes = [
  { value: 'sales', label: '销售报表' },
  { value: 'orders', label: '订单报表' },
  { value: 'products', label: '商品报表' },
  { value: 'custom', label: '定制报表' }
]

// 当前选中的报表类型
const currentReportType = ref('sales')

// 时间范围选项
const dateRanges = [
  { value: 'today', label: '今日' },
  { value: 'week', label: '本周' },
  { value: 'month', label: '本月' },
  { value: 'quarter', label: '本季度' },
  { value: 'year', label: '本年' },
  { value: 'custom', label: '自定义' }
]

// 当前选中的时间范围
const currentDateRange = ref('month')

// 自定义日期范围
const customStartDate = ref('')
const customEndDate = ref('')

// 订单状态筛选
const orderStatusFilter = ref('all')
const orderStatusOptions = [
  { value: 'all', label: '全部状态' },
  { value: 'pending', label: '待处理' },
  { value: 'processing', label: '处理中' },
  { value: 'completed', label: '已完成' },
  { value: 'cancelled', label: '已取消' }
]

// 商品分类筛选
const categoryFilter = ref('all')
const categoryOptions = [
  { value: 'all', label: '全部分类' },
  { value: 'clothing', label: '服装' },
  { value: 'accessories', label: '配饰' },
  { value: 'custom', label: '定制' }
]

// 模拟销售数据
const salesData = ref([
  { date: '2024-01-01', amount: 1250, orders: 15, products: 23 },
  { date: '2024-01-02', amount: 1890, orders: 22, products: 35 },
  { date: '2024-01-03', amount: 980, orders: 12, products: 18 },
  { date: '2024-01-04', amount: 2150, orders: 28, products: 42 },
  { date: '2024-01-05', amount: 1680, orders: 20, products: 31 },
  { date: '2024-01-06', amount: 2340, orders: 32, products: 48 },
  { date: '2024-01-07', amount: 1950, orders: 25, products: 38 },
  { date: '2024-01-08', amount: 1420, orders: 18, products: 27 },
  { date: '2024-01-09', amount: 1780, orders: 23, products: 34 },
  { date: '2024-01-10', amount: 2100, orders: 27, products: 41 }
])

// 模拟订单数据
const ordersData = ref([
  { id: 'ORD001', customer: '张三', amount: 299, status: 'completed', date: '2024-01-10', product: '卫衣' },
  { id: 'ORD002', customer: '李四', amount: 599, status: 'processing', date: '2024-01-10', product: '定制T恤' },
  { id: 'ORD003', customer: '王五', amount: 159, status: 'pending', date: '2024-01-09', product: '帽子' },
  { id: 'ORD004', customer: '赵六', amount: 899, status: 'completed', date: '2024-01-09', product: '外套' },
  { id: 'ORD005', customer: '钱七', amount: 399, status: 'cancelled', date: '2024-01-08', product: '裤子' },
  { id: 'ORD006', customer: '孙八', amount: 259, status: 'completed', date: '2024-01-08', product: 'T恤' },
  { id: 'ORD007', customer: '周九', amount: 799, status: 'processing', date: '2024-01-07', product: '定制卫衣' },
  { id: 'ORD008', customer: '吴十', amount: 199, status: 'completed', date: '2024-01-07', product: '配饰' }
])

// 模拟商品数据
const productsData = ref([
  { id: 'P001', name: '卫衣', category: '服装', price: 199, sales: 156, stock: 89, revenue: 31044 },
  { id: 'P002', name: 'T恤', category: '服装', price: 99, sales: 234, stock: 156, revenue: 23166 },
  { id: 'P003', name: '帽子', category: '配饰', price: 59, sales: 189, stock: 67, revenue: 11151 },
  { id: 'P004', name: '定制卫衣', category: '定制', price: 399, sales: 45, stock: 0, revenue: 17955 },
  { id: 'P005', name: '外套', category: '服装', price: 299, sales: 78, stock: 45, revenue: 23322 },
  { id: 'P006', name: '裤子', category: '服装', price: 159, sales: 123, stock: 78, revenue: 19557 }
])

// 模拟定制数据
const customData = ref([
  { id: 'CUS001', customer: '客户A', type: '图案定制', amount: 599, status: 'completed', date: '2024-01-10' },
  { id: 'CUS002', customer: '客户B', type: '文字定制', amount: 399, status: 'processing', date: '2024-01-09' },
  { id: 'CUS003', customer: '客户C', type: '图案定制', amount: 799, status: 'pending', date: '2024-01-08' },
  { id: 'CUS004', customer: '客户D', type: '组合定制', amount: 999, status: 'completed', date: '2024-01-07' },
  { id: 'CUS005', customer: '客户E', type: '文字定制', amount: 299, status: 'cancelled', date: '2024-01-06' }
])

// 统计数据
const statistics = computed(() => {
  const data = salesData.value
  const totalAmount = data.reduce((sum, item) => sum + item.amount, 0)
  const totalOrders = data.reduce((sum, item) => sum + item.orders, 0)
  const totalProducts = data.reduce((sum, item) => sum + item.products, 0)
  const avgAmount = totalOrders > 0 ? Math.round(totalAmount / totalOrders) : 0

  return {
    totalAmount,
    totalOrders,
    totalProducts,
    avgAmount
  }
})

// 筛选后的订单数据
const filteredOrders = computed(() => {
  let data = ordersData.value
  if (orderStatusFilter.value !== 'all') {
    data = data.filter(item => item.status === orderStatusFilter.value)
  }
  return data
})

// 筛选后的商品数据
const filteredProducts = computed(() => {
  let data = productsData.value
  if (categoryFilter.value !== 'all') {
    data = data.filter(item => item.category === categoryFilter.value)
  }
  return data
})

// 获取状态样式
const getStatusStyle = (status) => {
  const styles = {
    completed: { text: '已完成', class: 'status-completed' },
    processing: { text: '处理中', class: 'status-processing' },
    pending: { text: '待处理', class: 'status-pending' },
    cancelled: { text: '已取消', class: 'status-cancelled' }
  }
  return styles[status] || { text: status, class: '' }
}

// Excel流式导出功能
const exportToExcel = () => {
  let data = []
  let headers = []
  let filename = ''

  switch (currentReportType.value) {
    case 'sales':
      filename = '销售报表'
      headers = ['日期', '销售额', '订单数', '商品数']
      data = salesData.value.map(item => [item.date, item.amount, item.orders, item.products])
      break
    case 'orders':
      filename = '订单报表'
      headers = ['订单号', '客户', '金额', '状态', '日期', '商品']
      data = filteredOrders.value.map(item => [
        item.id,
        item.customer,
        item.amount,
        getStatusStyle(item.status).text,
        item.date,
        item.product
      ])
      break
    case 'products':
      filename = '商品报表'
      headers = ['商品ID', '名称', '分类', '价格', '销量', '库存', '销售额']
      data = filteredProducts.value.map(item => [
        item.id,
        item.name,
        item.category,
        item.price,
        item.sales,
        item.stock,
        item.revenue
      ])
      break
    case 'custom':
      filename = '定制报表'
      headers = ['订单号', '客户', '类型', '金额', '状态', '日期']
      data = customData.value.map(item => [
        item.id,
        item.customer,
        item.type,
        item.amount,
        getStatusStyle(item.status).text,
        item.date
      ])
      break
  }

  // 创建CSV内容（流式导出）
  const BOM = '\uFEFF'
  let csvContent = BOM + headers.join(',') + '\n'

  // 分批处理数据，避免内存溢出
  const batchSize = 1000
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize)
    batch.forEach(row => {
      csvContent += row.map(cell => `"${cell}"`).join(',') + '\n'
    })
  }

  // 创建Blob并下载
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// 导出JSON格式
const exportToJSON = () => {
  let data = []
  let filename = ''

  switch (currentReportType.value) {
    case 'sales':
      filename = '销售报表'
      data = salesData.value
      break
    case 'orders':
      filename = '订单报表'
      data = filteredOrders.value
      break
    case 'products':
      filename = '商品报表'
      data = filteredProducts.value
      break
    case 'custom':
      filename = '定制报表'
      data = customData.value
      break
  }

  const jsonContent = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonContent], { type: 'application/json' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.json`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// 打印报表
const printReport = () => {
  window.print()
}

// 刷新数据
const refreshData = () => {
  alert('数据已刷新')
}
</script>

<template>
  <div class="report-page">
    <div class="report-container">
      <!-- 侧边栏 -->
      <AdministratorManage
        active-item="report"
        @select="(item) => { console.log('Selected:', item.value) }"
      />

      <!-- 主内容区 -->
      <main class="main-content">
        <!-- 筛选栏 -->
        <div class="filter-section">
          <div class="filter-row">
            <!-- 时间范围 -->
            <div class="filter-group">
              <label>时间范围</label>
              <div class="filter-options">
                <button
                  v-for="range in dateRanges"
                  :key="range.value"
                  :class="['filter-btn', { active: currentDateRange === range.value }]"
                  @click="currentDateRange = range.value"
                >
                  {{ range.label }}
                </button>
              </div>
            </div>

            <!-- 自定义日期 -->
            <div v-if="currentDateRange === 'custom'" class="filter-group custom-date">
              <label>自定义日期</label>
              <div class="date-inputs">
                <input type="date" v-model="customStartDate" />
                <span>至</span>
                <input type="date" v-model="customEndDate" />
              </div>
            </div>
          </div>

          <!-- 额外筛选条件 -->
          <div class="filter-row">
            <div v-if="currentReportType === 'orders'" class="filter-group">
              <label>订单状态</label>
              <select v-model="orderStatusFilter">
                <option v-for="option in orderStatusOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </div>

            <div v-if="currentReportType === 'products'" class="filter-group">
              <label>商品分类</label>
              <select v-model="categoryFilter">
                <option v-for="option in categoryOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </div>

            <!-- 操作按钮 -->
            <div class="filter-actions">
              <button class="action-btn refresh" @click="refreshData">
                <span class="icon">🔄</span> 刷新
              </button>
              <button class="action-btn print" @click="printReport">
                <span class="icon">🖨️</span> 打印
              </button>
              <button class="action-btn export-json" @click="exportToJSON">
                <span class="icon">📄</span> 导出JSON
              </button>
              <button class="action-btn export-excel" @click="exportToExcel">
                <span class="icon">📊</span> 导出Excel
              </button>
            </div>
          </div>
        </div>

        <!-- 统计卡片 -->
        <div class="statistics-cards">
          <div class="stat-card">
            <div class="stat-icon">💰</div>
            <div class="stat-info">
              <span class="stat-label">总销售额</span>
              <span class="stat-value">¥{{ statistics.totalAmount.toLocaleString() }}</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">📦</div>
            <div class="stat-info">
              <span class="stat-label">总订单数</span>
              <span class="stat-value">{{ statistics.totalOrders }}</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🛍️</div>
            <div class="stat-info">
              <span class="stat-label">商品销量</span>
              <span class="stat-value">{{ statistics.totalProducts }}</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">💵</div>
            <div class="stat-info">
              <span class="stat-label">平均客单价</span>
              <span class="stat-value">¥{{ statistics.avgAmount }}</span>
            </div>
          </div>
        </div>

        <!-- 数据表格 -->
        <div class="data-section">
          <!-- 销售报表 -->
          <div v-if="currentReportType === 'sales'" class="data-table">
            <table>
              <thead>
                <tr>
                  <th>日期</th>
                  <th>销售额</th>
                  <th>订单数</th>
                  <th>商品数</th>
                  <th>占比</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in salesData" :key="item.date">
                  <td>{{ item.date }}</td>
                  <td class="amount">¥{{ item.amount.toLocaleString() }}</td>
                  <td>{{ item.orders }}</td>
                  <td>{{ item.products }}</td>
                  <td>
                    <div class="progress-bar">
                      <div
                        class="progress-fill"
                        :style="{ width: (item.amount / Math.max(...salesData.map(d => d.amount)) * 100) + '%' }"
                      ></div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- 订单报表 -->
          <div v-if="currentReportType === 'orders'" class="data-table">
            <table>
              <thead>
                <tr>
                  <th>订单号</th>
                  <th>客户</th>
                  <th>商品</th>
                  <th>金额</th>
                  <th>状态</th>
                  <th>日期</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in filteredOrders" :key="item.id">
                  <td>{{ item.id }}</td>
                  <td>{{ item.customer }}</td>
                  <td>{{ item.product }}</td>
                  <td class="amount">¥{{ item.amount }}</td>
                  <td>
                    <span :class="['status-tag', getStatusStyle(item.status).class]">
                      {{ getStatusStyle(item.status).text }}
                    </span>
                  </td>
                  <td>{{ item.date }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- 商品报表 -->
          <div v-if="currentReportType === 'products'" class="data-table">
            <table>
              <thead>
                <tr>
                  <th>商品ID</th>
                  <th>名称</th>
                  <th>分类</th>
                  <th>价格</th>
                  <th>销量</th>
                  <th>库存</th>
                  <th>销售额</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in filteredProducts" :key="item.id">
                  <td>{{ item.id }}</td>
                  <td>{{ item.name }}</td>
                  <td>{{ item.category }}</td>
                  <td class="amount">¥{{ item.price }}</td>
                  <td>{{ item.sales }}</td>
                  <td :class="{ 'low-stock': item.stock < 50 }">{{ item.stock }}</td>
                  <td class="amount">¥{{ item.revenue.toLocaleString() }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- 定制报表 -->
          <div v-if="currentReportType === 'custom'" class="data-table">
            <table>
              <thead>
                <tr>
                  <th>订单号</th>
                  <th>客户</th>
                  <th>类型</th>
                  <th>金额</th>
                  <th>状态</th>
                  <th>日期</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in customData" :key="item.id">
                  <td>{{ item.id }}</td>
                  <td>{{ item.customer }}</td>
                  <td>{{ item.type }}</td>
                  <td class="amount">¥{{ item.amount }}</td>
                  <td>
                    <span :class="['status-tag', getStatusStyle(item.status).class]">
                      {{ getStatusStyle(item.status).text }}
                    </span>
                  </td>
                  <td>{{ item.date }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.report-page {
  font-family: Arial, sans-serif;
  padding-top: 20px;
  min-height: 100vh;
  background-color: #f8f8f8;
}

.report-container {
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 20px;
  flex-shrink: 0;
  height: fit-content;
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

/* 筛选栏 */
.filter-section {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 15px;
}

.filter-row:last-child {
  margin-bottom: 0;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-group label {
  font-size: 13px;
  color: #666;
  font-weight: 500;
}

.filter-options {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background-color: white;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-btn:hover {
  border-color: #ffcc00;
}

.filter-btn.active {
  background-color: #ffcc00;
  border-color: #ffcc00;
  color: #1a1a1a;
  font-weight: 500;
}

.custom-date .date-inputs {
  display: flex;
  align-items: center;
  gap: 10px;
}

.date-inputs input[type="date"] {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 13px;
}

.date-inputs span {
  color: #666;
}

.filter-group select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 13px;
  min-width: 120px;
  cursor: pointer;
}

.filter-actions {
  display: flex;
  gap: 10px;
  margin-left: auto;
  align-items: flex-end;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.action-btn .icon {
  font-size: 14px;
}

.action-btn.refresh {
  background-color: #f5f5f5;
  color: #666;
}

.action-btn.refresh:hover {
  background-color: #e8e8e8;
}

.action-btn.print {
  background-color: #e3f2fd;
  color: #2196f3;
}

.action-btn.print:hover {
  background-color: #bbdefb;
}

.action-btn.export-json {
  background-color: #f3e5f5;
  color: #9c27b0;
}

.action-btn.export-json:hover {
  background-color: #e1bee7;
}

.action-btn.export-excel {
  background-color: #ffcc00;
  color: #1a1a1a;
}

.action-btn.export-excel:hover {
  background-color: #e6b800;
}

/* 统计卡片 */
.statistics-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.stat-card {
  background-color: white;
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
  background-color: #fff8e1;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.stat-label {
  font-size: 13px;
  color: #999;
}

.stat-value {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

/* 数据表格 */
.data-section {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.data-table {
  overflow-x: auto;
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

.amount {
  font-weight: 500;
  color: #ff3b30;
}

.low-stock {
  color: #ff3b30;
  font-weight: bold;
}

/* 进度条 */
.progress-bar {
  width: 100px;
  height: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #ffcc00;
  border-radius: 4px;
  transition: width 0.3s;
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

.status-completed {
  background-color: #e8f5e9;
  color: #4caf50;
}

.status-processing {
  background-color: #fff3e0;
  color: #ff9800;
}

.status-pending {
  background-color: #e3f2fd;
  color: #2196f3;
}

.status-cancelled {
  background-color: #ffebee;
  color: #f44336;
}

/* 打印样式 */
@media print {
  .sidebar,
  .filter-section,
  .action-btn {
    display: none !important;
  }

  .report-page {
    padding-top: 0;
  }

  .main-content {
    width: 100%;
  }
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .statistics-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .report-container {
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

  .statistics-cards {
    grid-template-columns: 1fr;
  }

  .filter-row {
    flex-direction: column;
  }

  .filter-actions {
    margin-left: 0;
    width: 100%;
    flex-wrap: wrap;
  }

  .action-btn {
    flex: 1;
    min-width: 100px;
    justify-content: center;
  }

  .data-table {
    overflow-x: auto;
  }

  .data-table table {
    min-width: 600px;
  }
}
</style>
