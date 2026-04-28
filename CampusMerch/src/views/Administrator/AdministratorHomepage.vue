<script setup>import { ref, onMounted, onUnmounted } from 'vue';
import * as echarts from 'echarts';
import Header from '../../components/headerUser.vue';
// 核心指标数据
const coreMetrics = ref({
 totalOrders: 1258,
 totalRevenue: 256890,
 avgOrderValue: 204,
 conversionRate: 3.2,
 newCustomers: 156,
 repeatCustomers: 234
});
// 销售趋势数据（最近7天）
const salesTrend = ref([
 { date: '01-11', sales: 3200, orders: 18 },
 { date: '01-12', sales: 4500, orders: 25 },
 { date: '01-13', sales: 3800, orders: 22 },
 { date: '01-14', sales: 5200, orders: 30 },
 { date: '01-15', sales: 4100, orders: 24 },
 { date: '01-16', sales: 5800, orders: 35 },
 { date: '01-17', sales: 6200, orders: 38 }
]);
// 订单状态分布
const orderStatusDistribution = ref([
 { status: '待审核', count: 156, color: '#ff9800' },
 { status: '已审核', count: 234, color: '#2196f3' },
 { status: '已发货', count: 456, color: '#4caf50' },
 { status: '已完成', count: 890, color: '#9c27b0' },
 { status: '已取消', count: 128, color: '#f44336' }
]);
// 库存预警数据
const stockAlerts = ref([
 { id: 'P001', name: '卫衣', stock: 23, threshold: 50, status: 'danger' },
 { id: 'P003', name: '帽子', stock: 34, threshold: 50, status: 'warning' },
 { id: 'P005', name: '外套', stock: 45, threshold: 50, status: 'warning' },
 { id: 'P007', name: '配饰套装', stock: 12, threshold: 50, status: 'danger' },
 { id: 'P009', name: '定制T恤', stock: 0, threshold: 30, status: 'danger' }
]);
// 热门商品排行
const hotProducts = ref([
 { rank: 1, name: '连帽卫衣', sales: 345, growth: 12.5 },
 { rank: 2, name: '印花T恤', sales: 289, growth: 8.3 },
 { rank: 3, name: '棒球帽', sales: 234, growth: -2.1 },
 { rank: 4, name: '运动裤', sales: 198, growth: 15.7 },
 { rank: 5, name: '定制卫衣', sales: 176, growth: 23.4 }
]);
// 定制订单统计
const customOrdersStats = ref({
 total: 156,
 pending: 23,
 producing: 45,
 completed: 78,
 cancelled: 10
});
// ECharts实例
let salesChart = null;
let orderChart = null;
const salesChartRef = ref(null);
const orderChartRef = ref(null);
// 计算库存预警数量
const alertCount = ref(stockAlerts.value.filter(item => item.status === 'danger').length);
// 获取状态样式
const getStatusClass = (status) => {
 const classes = {
 danger: 'alert-danger',
 warning: 'alert-warning'
 };
 return classes[status] || '';
};
// 获取状态文字
const getStatusText = (status) => {
 const texts = {
 danger: '严重不足',
 warning: '即将不足'
 };
 return texts[status] || '';
};
// 获取增长率样式
const getGrowthClass = (growth) => {
 return growth >= 0 ? 'growth-up' : 'growth-down';
};
// 获取库存进度百分比
const getStockPercentage = (stock, threshold) => {
 return Math.min((stock / threshold) * 100, 100);
};
// 初始化ECharts图表
const initCharts = () => {
 // 销售趋势图表
 if (salesChartRef.value) {
 salesChart = echarts.init(salesChartRef.value);
 const salesOption = {
 tooltip: {
 trigger: 'axis',
 axisPointer: {
 type: 'shadow'
 }
 },
 legend: {
 data: ['销售额', '订单数'],
 top: 10
 },
 grid: {
 left: '3%',
 right: '4%',
 bottom: '3%',
 containLabel: true
 },
 xAxis: {
 type: 'category',
 data: salesTrend.value.map(item => item.date),
 axisLabel: {
 color: '#666'
 },
 axisLine: {
 lineStyle: {
 color: '#e0e0e0'
 }
 }
 },
 yAxis: [
 {
 type: 'value',
 name: '销售额',
 position: 'left',
 axisLabel: {
 color: '#666',
 formatter: '¥{value}'
 },
 axisLine: {
 show: true,
 lineStyle: {
 color: '#e0e0e0'
 }
 },
 splitLine: {
 lineStyle: {
 color: '#f0f0f0'
 }
 }
 },
 {
 type: 'value',
 name: '订单数',
 position: 'right',
 axisLabel: {
 color: '#666',
 formatter: '{value}单'
 },
 axisLine: {
 show: true,
 lineStyle: {
 color: '#e0e0e0'
 }
 },
 splitLine: {
 show: false
 }
 }
 ],
 series: [
 {
 name: '销售额',
 type: 'bar',
 data: salesTrend.value.map(item => item.sales),
 itemStyle: {
 color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
 { offset: 0, color: '#ffcc00' },
 { offset: 1, color: '#ffeb3b' }
 ]),
 borderRadius: [4, 4, 0, 0]
 },
 emphasis: {
 itemStyle: {
 color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
 { offset: 0, color: '#ffb700' },
 { offset: 1, color: '#ffcc00' }
 ])
 }
 }
 },
 {
 name: '订单数',
 type: 'line',
 yAxisIndex: 1,
 data: salesTrend.value.map(item => item.orders),
 smooth: true,
 lineStyle: {
 color: '#ff3b30',
 width: 3
 },
 itemStyle: {
 color: '#ff3b30'
 },
 areaStyle: {
 color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
 { offset: 0, color: 'rgba(255,59,48,0.3)' },
 { offset: 1, color: 'rgba(255,59,48,0.05)' }
 ])
 }
 }
 ]
 };
 salesChart.setOption(salesOption);
 }
 // 订单状态分布图表
 if (orderChartRef.value) {
 orderChart = echarts.init(orderChartRef.value);
 const orderOption = {
 tooltip: {
 trigger: 'item',
 formatter: '{b}: {c} ({d}%)'
 },
 legend: {
 orient: 'vertical',
 right: 10,
 top: 'center',
 textStyle: {
 color: '#666'
 }
 },
 series: [
 {
 name: '订单状态',
 type: 'pie',
 radius: ['45%', '70%'],
 center: ['35%', '50%'],
 avoidLabelOverlap: false,
 itemStyle: {
 borderRadius: 8,
 borderColor: '#fff',
 borderWidth: 2
 },
 label: {
 show: false,
 position: 'center'
 },
 emphasis: {
 label: {
 show: true,
 fontSize: 20,
 fontWeight: 'bold',
 formatter: '{d}%'
 },
 itemStyle: {
 shadowBlur: 10,
 shadowOffsetX: 0,
 shadowColor: 'rgba(0, 0, 0, 0.2)'
 }
 },
 labelLine: {
 show: false
 },
 data: orderStatusDistribution.value.map(item => ({
 value: item.count,
 name: item.status,
 itemStyle: {
 color: item.color
 }
 }))
 }
 ]
 };
 orderChart.setOption(orderOption);
 }
};
// 处理窗口大小变化
const handleResize = () => {
 salesChart?.resize();
 orderChart?.resize();
};
onMounted(() => {
 initCharts();
 window.addEventListener('resize', handleResize);
});
onUnmounted(() => {
 window.removeEventListener('resize', handleResize);
 salesChart?.dispose();
 orderChart?.dispose();
});
</script>

<template>
  <div class="admin-homepage">
    <Header />
    
    <div class="admin-container">
      <!-- 侧边栏导航 -->
      <AdministratorManage
        active-item="home"
        @select="(item) => { console.log('Selected:', item.value) }"
      />

      <!-- 主内容区 -->
      <main class="main-content">
        <!-- 页面标题 -->
        <div class="page-header">
          <h1>管理员首页</h1>
          <p class="subtitle">欢迎回来，管理员</p>
        </div>

        <!-- 核心指标卡片 -->
        <section class="metrics-section">
          <h2 class="section-title">核心指标</h2>
          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-icon orders">📋</div>
              <div class="metric-info">
                <span class="metric-label">总订单数</span>
                <span class="metric-value">{{ coreMetrics.totalOrders.toLocaleString() }}</span>
                <span class="metric-change positive">+12%</span>
              </div>
            </div>
            <div class="metric-card">
              <div class="metric-icon revenue">💰</div>
              <div class="metric-info">
                <span class="metric-label">总销售额</span>
                <span class="metric-value">¥{{ coreMetrics.totalRevenue.toLocaleString() }}</span>
                <span class="metric-change positive">+8.5%</span>
              </div>
            </div>
            <div class="metric-card">
              <div class="metric-icon avg">💵</div>
              <div class="metric-info">
                <span class="metric-label">平均客单价</span>
                <span class="metric-value">¥{{ coreMetrics.avgOrderValue }}</span>
                <span class="metric-change positive">+3.2%</span>
              </div>
            </div>
            <div class="metric-card">
              <div class="metric-icon conversion">📈</div>
              <div class="metric-info">
                <span class="metric-label">转化率</span>
                <span class="metric-value">{{ coreMetrics.conversionRate }}%</span>
                <span class="metric-change positive">+0.5%</span>
              </div>
            </div>
            <div class="metric-card">
              <div class="metric-icon new">👥</div>
              <div class="metric-info">
                <span class="metric-label">新增客户</span>
                <span class="metric-value">{{ coreMetrics.newCustomers }}</span>
                <span class="metric-change positive">+23%</span>
              </div>
            </div>
            <div class="metric-card">
              <div class="metric-icon repeat">🔄</div>
              <div class="metric-info">
                <span class="metric-label">复购客户</span>
                <span class="metric-value">{{ coreMetrics.repeatCustomers }}</span>
                <span class="metric-change negative">-2%</span>
              </div>
            </div>
          </div>
        </section>

        <div class="content-grid">
          <!-- 销售趋势图表 -->
          <section class="chart-section">
            <h2 class="section-title">销售趋势（近7天）</h2>
            <div ref="salesChartRef" class="chart-container"></div>
          </section>

          <!-- 订单状态分布 -->
          <section class="distribution-section">
            <h2 class="section-title">订单状态分布</h2>
            <div ref="orderChartRef" class="chart-container"></div>
          </section>
        </div>

        <div class="content-grid">
          <!-- 库存预警 -->
          <section class="alerts-section">
            <h2 class="section-title">
              库存预警
              <span class="alert-badge">{{ alertCount }}</span>
            </h2>
            <div class="alerts-list">
              <div
                v-for="item in stockAlerts"
                :key="item.id"
                class="alert-item"
              >
                <div class="alert-info">
                  <span class="alert-name">{{ item.name }}</span>
                  <span :class="['alert-status', getStatusClass(item.status)]">
                    {{ getStatusText(item.status) }}
                  </span>
                </div>
                <div class="alert-stock">
                  <span class="stock-value">库存: {{ item.stock }}</span>
                  <div class="stock-bar">
                    <div
                      :class="['stock-fill', getStatusClass(item.status)]"
                      :style="{ width: getStockPercentage(item.stock, item.threshold) + '%' }"
                    ></div>
                  </div>
                  <span class="stock-threshold">阈值: {{ item.threshold }}</span>
                </div>
              </div>
            </div>
          </section>

          <!-- 热门商品排行 -->
          <section class="ranking-section">
            <h2 class="section-title">热门商品排行</h2>
            <div class="ranking-list">
              <div
                v-for="item in hotProducts"
                :key="item.rank"
                class="ranking-item"
              >
                <span :class="['rank-badge', { top: item.rank <= 3 }]">{{ item.rank }}</span>
                <div class="ranking-info">
                  <span class="ranking-name">{{ item.name }}</span>
                  <span :class="['ranking-growth', getGrowthClass(item.growth)]">
                    {{ item.growth >= 0 ? '+' : '' }}{{ item.growth }}%
                  </span>
                </div>
                <span class="ranking-sales">{{ item.sales }}件</span>
              </div>
            </div>
          </section>

          <!-- 定制订单概览 -->
          <section class="custom-section">
            <h2 class="section-title">定制订单概览</h2>
            <div class="custom-stats">
              <div class="custom-stat-item">
                <span class="custom-stat-value">{{ customOrdersStats.total }}</span>
                <span class="custom-stat-label">总定制订单</span>
              </div>
              <div class="custom-stat-item">
                <span class="custom-stat-value pending">{{ customOrdersStats.pending }}</span>
                <span class="custom-stat-label">待处理</span>
              </div>
              <div class="custom-stat-item">
                <span class="custom-stat-value producing">{{ customOrdersStats.producing }}</span>
                <span class="custom-stat-label">制作中</span>
              </div>
              <div class="custom-stat-item">
                <span class="custom-stat-value completed">{{ customOrdersStats.completed }}</span>
                <span class="custom-stat-label">已完成</span>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.admin-homepage {
  font-family: Arial, sans-serif;
  padding-top: 120px;
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

.page-header {
  margin-bottom: 20px;
}

.page-header h1 {
  margin: 0 0 5px 0;
  font-size: 28px;
  color: #333;
}

.page-header .subtitle {
  margin: 0;
  color: #999;
  font-size: 14px;
}

.section-title {
  font-size: 16px;
  color: #333;
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.alert-badge {
  background-color: #ff3b30;
  color: white;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: bold;
}

/* 核心指标卡片 */
.metrics-section {
  margin-bottom: 20px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.metric-card {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.metric-icon {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.metric-icon.orders {
  background-color: #e3f2fd;
}

.metric-icon.revenue {
  background-color: #fff8e1;
}

.metric-icon.avg {
  background-color: #e8f5e9;
}

.metric-icon.conversion {
  background-color: #f3e5f5;
}

.metric-icon.new {
  background-color: #e1f5fe;
}

.metric-icon.repeat {
  background-color: #fff3e0;
}

.metric-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.metric-label {
  font-size: 13px;
  color: #999;
}

.metric-value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.metric-change {
  font-size: 12px;
  font-weight: 500;
}

.metric-change.positive {
  color: #4caf50;
}

.metric-change.negative {
  color: #f44336;
}

/* 内容网格 */
.content-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.content-grid:last-child {
  grid-template-columns: repeat(3, 1fr);
}

/* 图表区域 */
.chart-section,
.distribution-section,
.alerts-section,
.ranking-section,
.custom-section {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* ECharts图表容器 */
.chart-container {
  height: 250px;
}

/* 库存预警 */
.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.alert-item {
  padding: 15px;
  background-color: #fafafa;
  border-radius: 8px;
}

.alert-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.alert-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.alert-status {
  font-size: 12px;
  padding: 3px 8px;
  border-radius: 15px;
}

.alert-status.alert-danger {
  background-color: #ffebee;
  color: #f44336;
}

.alert-status.alert-warning {
  background-color: #fff3e0;
  color: #ff9800;
}

.alert-stock {
  display: flex;
  align-items: center;
  gap: 10px;
}

.stock-value,
.stock-threshold {
  font-size: 12px;
  color: #666;
}

.stock-bar {
  flex: 1;
  height: 6px;
  background-color: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
}

.stock-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s;
}

.stock-fill.alert-danger {
  background-color: #f44336;
}

.stock-fill.alert-warning {
  background-color: #ff9800;
}

/* 热门商品排行 */
.ranking-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.ranking-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px 15px;
  background-color: #fafafa;
  border-radius: 8px;
}

.rank-badge {
  width: 24px;
  height: 24px;
  background-color: #e0e0e0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  color: #666;
}

.rank-badge.top {
  background-color: #ffcc00;
  color: #1a1a1a;
}

.ranking-info {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ranking-name {
  font-size: 14px;
  color: #333;
}

.ranking-growth {
  font-size: 12px;
  font-weight: 500;
}

.ranking-growth.growth-up {
  color: #4caf50;
}

.ranking-growth.growth-down {
  color: #f44336;
}

.ranking-sales {
  font-size: 14px;
  font-weight: 500;
  color: #ff3b30;
}

/* 定制订单概览 */
.custom-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
}

.custom-stat-item {
  text-align: center;
  padding: 15px;
  background-color: #fafafa;
  border-radius: 8px;
}

.custom-stat-value {
  display: block;
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.custom-stat-value.pending {
  color: #ff9800;
}

.custom-stat-value.producing {
  color: #2196f3;
}

.custom-stat-value.completed {
  color: #4caf50;
}

.custom-stat-label {
  font-size: 12px;
  color: #999;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .content-grid {
    grid-template-columns: 1fr;
  }
  
  .content-grid:last-child {
    grid-template-columns: repeat(2, 1fr);
  }
}

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
  
  .metrics-grid {
    grid-template-columns: 1fr;
  }
  
  .content-grid:last-child {
    grid-template-columns: 1fr;
  }
  
  .custom-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
