<script setup>

</script>

<template>
  <header class="header-component">
    <!-- 顶部导航栏 -->
    <div class="top-header">
      <div class="header-content">
        <div class="logo">校园物料</div>
        <div class="search-bar">
          <input type="text" placeholder="产品搜索">
          <button class="search-btn">🔍</button>
        </div>
        <div class="user-actions">
          <span class="user-icon">👤</span>
          <span class="cart">🛒 ¥0.00</span>
        </div>
      </div>
    </div>
    
    <!-- 导航菜单 -->
    <nav class="main-nav">
      <div class="nav-content">
        <a href="#" class="nav-item active">首页</a>
        <a href="#" class="nav-item">商品</a>
        <a href="#" class="nav-item">最新周边</a>
        <a href="#" class="nav-item">连帽衫</a>
        <a href="#" class="nav-item">衬衫</a>
        <a href="#" class="nav-item">卫衣</a>
        <a href="#" class="nav-item">帽子</a>
        <a href="#" class="nav-item">裤子</a>
        <a href="#" class="nav-item">博客</a>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.header-component {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* 顶部导航栏 */
.top-header {
  border-bottom: 1px solid #e0e0e0;
  padding: 10px 0;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: #ffcc00;
  text-transform: uppercase;
}

.search-bar {
  display: flex;
  align-items: center;
  flex: 1;
  max-width: 400px;
  margin: 0 20px;
}

.search-bar input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
  font-size: 14px;
}

.search-btn {
  padding: 8px 15px;
  background-color: #ffcc00;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-icon, .cart {
  font-size: 16px;
  cursor: pointer;
}

/* 导航菜单 */
.main-nav {
  border-bottom: 1px solid #e0e0e0;
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  gap: 30px;
  padding: 15px 20px;
}

.nav-item {
  text-decoration: none;
  color: #333;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-item:hover, .nav-item.active {
  color: #ffcc00;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 10px;
  }
  
  .search-bar {
    width: 100%;
    max-width: none;
  }
  
  .nav-content {
    flex-wrap: wrap;
    gap: 15px;
  }
}
</style>