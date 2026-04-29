<script setup>
import { useUserStore } from '../stores/user'

const userStore = useUserStore()

const handleAvatarClick = () => {
  if (userStore.isLoggedIn) {
    userStore.toggleAvatarMenu()
  } else {
    userStore.openLoginModal()
  }
}

const handleLogoutClick = () => {
  userStore.openLogoutConfirm()
  userStore.closeAvatarMenu()
}
</script>

<template>
  <header class="header-component">
    <!-- 顶部导航栏 -->
    <div class="top-header">
      <div class="header-content">
        <router-link to="/" class="logo">校园物料</router-link>
        <div class="search-bar">
          <input type="text" placeholder="产品搜索">
          <button class="search-btn">🔍</button>
        </div>
        <div class="user-actions">
          <!-- 用户头像 -->
          <div class="avatar-wrapper" @click.stop="handleAvatarClick">
            <template v-if="userStore.isLoggedIn">
              <img 
                :src="userStore.userInfo.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=1'" 
                alt="用户头像" 
                class="user-avatar"
              />
            </template>
            <template v-else>
              <span class="user-icon">👤</span>
            </template>
          </div>
          
          <!-- 头像下拉菜单 -->
          <div v-if="userStore.showAvatarMenu" class="avatar-dropdown">
            <div class="dropdown-content">
              <router-link to="/personcenter" class="dropdown-item" @click="userStore.closeAvatarMenu">
                个人中心
              </router-link>
              <div class="dropdown-divider"></div>
              <button class="dropdown-item logout-btn" @click="handleLogoutClick">
                退出登录
              </button>
            </div>
          </div>
          
          <span class="cart">🛒 ¥0.00</span>
        </div>
      </div>
    </div>
    
    <!-- 导航菜单 -->
    <nav class="main-nav">
      <div class="nav-content">
        <router-link to="/" class="nav-item" exact-active-class="active">商品大厅</router-link>
        <router-link to="/uploadforeign" class="nav-item" exact-active-class="active">设计上传</router-link>
        <router-link to="/myorders" class="nav-item" exact-active-class="active">我的订单</router-link>
        <router-link to="/personcenter" class="nav-item" exact-active-class="active">个人中心</router-link>
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
  text-decoration: none;
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
  position: relative;
}

.avatar-wrapper {
  cursor: pointer;
  display: flex;
  align-items: center;
}

.user-icon {
  font-size: 24px;
  transition: transform 0.3s;
}

.user-icon:hover {
  transform: scale(1.1);
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #ffcc00;
  transition: transform 0.3s, box-shadow 0.3s;
}

.user-avatar:hover {
  transform: scale(1.1);
  box-shadow: 0 0 8px rgba(255, 204, 0, 0.5);
}

/* 头像下拉菜单 */
.avatar-dropdown {
  position: absolute;
  top: 45px;
  right: 0;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  min-width: 150px;
  overflow: hidden;
  z-index: 1001;
}

.dropdown-content {
  padding: 8px 0;
}

.dropdown-item {
  display: block;
  padding: 10px 15px;
  color: #333;
  font-size: 14px;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.dropdown-item:hover {
  background-color: #f5f5f5;
}

.dropdown-divider {
  height: 1px;
  background-color: #e0e0e0;
  margin: 8px 0;
}

.logout-btn {
  width: 100%;
  text-align: left;
  border: none;
  background: none;
  color: #ff4444;
}

.logout-btn:hover {
  color: #cc0000;
  background-color: #fff5f5;
}

.cart {
  font-size: 20px;
  cursor: pointer;
  transition: transform 0.3s;
}

.cart:hover {
  transform: scale(1.1);
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
  
  .avatar-dropdown {
    right: auto;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
