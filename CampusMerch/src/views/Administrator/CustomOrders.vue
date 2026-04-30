<script setup>import { ref } from 'vue';
// 统计数据
const stats = ref({
 pending: 5,
 designing: 3,
 production: 4,
 completed: 18
});
// 定制订单列表
const customOrders = ref([
 {
 id: 'CUS20241201001',
 customer: '设计学院',
 product: '毕业文化衫',
 category: '服装',
 amount: 2999.00,
 quantity: 50,
 status: 'pending',
 createTime: '2024-12-01 10:30:00',
 deadline: '2024-12-20',
 requirement: '印校徽和毕业年份，颜色为深蓝色',
 progress: 0
 },
 {
 id: 'CUS20241201002',
 customer: '计算机学院',
 product: '社团招新海报',
 category: '印刷品',
 amount: 899.00,
 quantity: 100,
 status: 'designing',
 createTime: '2024-12-02 14:15:30',
 deadline: '2024-12-15',
 requirement: '科技感设计，突出AI主题',
 progress: 45
 },
 {
 id: 'CUS20241201003',
 customer: '学生会',
 product: '活动纪念徽章',
 category: '饰品',
 amount: 599.00,
 quantity: 200,
 status: 'production',
 createTime: '2024-12-03 09:00:00',
 deadline: '2024-12-18',
 requirement: '圆形徽章，珐琅工艺',
 progress: 75
 },
 {
 id: 'CUS20241201004',
 customer: '外国语学院',
 product: '语言文化节帆布袋',
 category: '箱包',
 amount: 1299.00,
 quantity: 80,
 status: 'production',
 createTime: '2024-12-04 16:45:00',
 deadline: '2024-12-22',
 requirement: '多语言设计，环保材质',
 progress: 60
 },
 {
 id: 'CUS20241201005',
 customer: '校团委',
 product: '校庆纪念册',
 category: '书籍',
 amount: 4599.00,
 quantity: 300,
 status: 'completed',
 createTime: '2024-11-20 08:30:00',
 deadline: '2024-12-10',
 requirement: '精装硬壳，全彩印刷',
 progress: 100
 },
 {
 id: 'CUS20241201006',
 customer: '体育学院',
 product: '运动会奖牌',
 category: '饰品',
 amount: 3299.00,
 quantity: 150,
 status: 'pending',
 createTime: '2024-12-05 11:20:00',
 deadline: '2024-12-25',
 requirement: '金银铜三种，刻字',
 progress: 0
 }
]);
// 搜索关键词
const searchKeyword = ref('');
// 状态筛选
const statusFilter = ref('all');
// 分类筛选
const categoryFilter = ref('all');
// 分类选项
const categories = ['全部', '服装', '印刷品', '饰品', '箱包', '书籍'];
// 过滤后的订单
const filteredOrders = ref(customOrders.value);
// 筛选订单
const filterOrders = () => {
 let result = customOrders.value;
 if (statusFilter.value !== 'all') {
 result = result.filter(order => order.status === statusFilter.value);
 }
 if (categoryFilter.value !== 'all') {
 result = result.filter(order => order.category === categoryFilter.value);
 }
 if (searchKeyword.value) {
 const keyword = searchKeyword.value.toLowerCase();
 result = result.filter(order => order.id.toLowerCase().includes(keyword) ||
 order.customer.toLowerCase().includes(keyword) ||
 order.product.toLowerCase().includes(keyword));
 }
 filteredOrders.value = result;
};
// 获取状态样式
const getStatusClass = (status) => {
 const classes = {
 pending: 'status-pending',
 designing: 'status-designing',
 production: 'status-production',
 completed: 'status-completed'
 };
 return classes[status] || '';
};
const getStatusText = (status) => {
 const texts = {
 pending: '待确认',
 designing: '设计中',
 production: '制作中',
 completed: '已完成'
 };
 return texts[status] || status;
};
// 获取进度颜色
const getProgressColor = (progress) => {
 if (progress === 100)
 return '#10b981';
 if (progress >= 50)
 return '#f59e0b';
 return '#ef4444';
};
</script>

<template>
  <main class="main-content">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>定制订单</h1>
      <p>定制订单管理与进度跟踪</p>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-icon pending-icon">📋</div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.pending }}</div>
          <div class="stat-label">待确认</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon designing-icon">🎨</div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.designing }}</div>
          <div class="stat-label">设计中</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon production-icon">🏭</div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.production }}</div>
          <div class="stat-label">制作中</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon completed-icon">✅</div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.completed }}</div>
          <div class="stat-label">已完成</div>
        </div>
      </div>
    </div>

    <!-- 搜索和筛选 -->
    <div class="search-bar">
      <div class="search-input-wrapper">
        <input 
          type="text" 
          v-model="searchKeyword" 
          placeholder="搜索订单号、客户、商品名..."
          @input="filterOrders"
          class="search-input"
        />
        <span class="search-icon">🔍</span>
      </div>
      <div class="filter-group">
        <select v-model="statusFilter" @change="filterOrders" class="filter-select">
          <option value="all">全部状态</option>
          <option value="pending">待确认</option>
          <option value="designing">设计中</option>
          <option value="production">制作中</option>
          <option value="completed">已完成</option>
        </select>
        <select v-model="categoryFilter" @change="filterOrders" class="filter-select">
          <option v-for="cat in categories" :key="cat" :value="cat === '全部' ? 'all' : cat">{{ cat }}</option>
        </select>
      </div>
    </div>

    <!-- 订单列表 -->
    <div class="order-grid">
      <div v-for="order in filteredOrders" :key="order.id" class="order-card">
        <div class="card-header">
          <div class="order-info">
            <span class="order-id">{{ order.id }}</span>
            <span :class="['status-tag', getStatusClass(order.status)]">{{ getStatusText(order.status) }}</span>
          </div>
          <div class="category-badge">{{ order.category }}</div>
        </div>
        
        <div class="card-body">
          <h3 class="product-name">{{ order.product }}</h3>
          <p class="customer">客户：{{ order.customer }}</p>
          <p class="requirement">需求：{{ order.requirement }}</p>
          
          <div class="order-details">
            <div class="detail-item">
              <span class="detail-label">数量</span>
              <span class="detail-value">{{ order.quantity }}件</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">金额</span>
              <span class="detail-value">¥{{ order.amount.toFixed(2) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">截止日期</span>
              <span class="detail-value deadline">{{ order.deadline }}</span>
            </div>
          </div>
          
          <!-- 进度条 -->
          <div class="progress-section" v-if="order.status !== 'pending'">
            <div class="progress-header">
              <span>进度</span>
              <span>{{ order.progress }}%</span>
            </div>
            <div class="progress-bar">
              <div 
                class="progress-fill" 
                :style="{ width: order.progress + '%', backgroundColor: getProgressColor(order.progress) }"
              ></div>
            </div>
          </div>
        </div>
        
        <div class="card-footer">
          <button class="btn btn-primary">查看详情</button>
          <button v-if="order.status === 'pending'" class="btn btn-secondary">确认订单</button>
        </div>
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

.designing-icon {
  background: #e0e7ff;
}

.production-icon {
  background: #fef3c7;
}

.completed-icon {
  background: #d1fae5;
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

.filter-group {
  display: flex;
  gap: 10px;
}

.filter-select {
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  background: white;
}

/* 订单卡片网格 */
.order-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.order-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s, box-shadow 0.3s;
}

.order-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.card-header {
  padding: 16px;
  background: #fafafa;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-info {
  display: flex;
  gap: 12px;
  align-items: center;
}

.order-id {
  font-family: monospace;
  font-size: 14px;
  color: #1890ff;
  font-weight: 500;
}

.status-tag {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.status-pending {
  background: #fff3e0;
  color: #f59e0b;
}

.status-designing {
  background: #e0e7ff;
  color: #6366f1;
}

.status-production {
  background: #fef3c7;
  color: #d97706;
}

.status-completed {
  background: #d1fae5;
  color: #059669;
}

.category-badge {
  padding: 4px 12px;
  background: #f0f0f0;
  border-radius: 4px;
  font-size: 12px;
  color: #666;
}

.card-body {
  padding: 20px;
}

.product-name {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.customer {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #666;
}

.requirement {
  margin: 0 0 16px 0;
  font-size: 14px;
  color: #888;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.order-details {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.detail-item {
  display: flex;
  flex-direction: column;
}

.detail-label {
  font-size: 12px;
  color: #999;
}

.detail-value {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.detail-value.deadline {
  color: #f59e0b;
}

/* 进度条 */
.progress-section {
  margin-bottom: 8px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 12px;
  color: #666;
}

.progress-bar {
  height: 6px;
  background: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.card-footer {
  padding: 16px 20px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  gap: 10px;
}

.btn {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: #1890ff;
  color: white;
}

.btn-primary:hover {
  background: #096dd9;
}

.btn-secondary {
  background: #f5f5f5;
  color: #666;
}

.btn-secondary:hover {
  background: #e8e8e8;
}
</style>
