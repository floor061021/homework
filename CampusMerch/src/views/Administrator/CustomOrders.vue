<script setup>
</script>

<template>
  <main class="main-content">
    <div class="page-header">
      <h1>定制订单</h1>
      <p>定制订单管理</p>
    </div>
    
    <div class="content-area">
      <div class="card">
        <h2>定制订单列表</h2>
        <div class="placeholder-content">
          <p>定制订单功能开发中...</p>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.main-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
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

.content-area {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.card h2 {
  margin: 0 0 15px 0;
  font-size: 16px;
  color: #333;
}

.placeholder-content {
  padding: 40px;
  text-align: center;
  color: #999;
}
</style>
