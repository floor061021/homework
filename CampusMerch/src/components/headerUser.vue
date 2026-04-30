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
        <router-link to="/" class="logo">校园文创预定</router-link>
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
              <svg t="1777463809803" class="user-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8185"><path d="M983.722576 312.747226a510.463422 510.463422 0 0 0-109.653876-162.815816A510.377422 510.377422 0 0 0 512.00011 0.00158a510.292422 510.292422 0 0 0-362.06859 149.92983A510.292422 510.292422 0 0 0 0.00169 512.001a510.121422 510.121422 0 0 0 149.92983 362.06759A510.292422 510.292422 0 0 0 512.00111 1023.99942a510.292422 510.292422 0 0 0 362.06759-149.92983A510.121422 510.121422 0 0 0 1023.99953 512c0-69.119922-13.567985-136.190846-40.276954-199.252774zM516.096105 577.023926a183.039793 183.039793 0 0 1-182.868792-182.868793c0-100.863886 82.005907-182.868793 182.783792-182.868792 100.863886 0 182.869793 82.004907 182.869793 182.869792a183.039793 183.039793 0 0 1-182.869793 182.867793zM320.342327 693.759794a311.977647 311.977647 0 0 1 195.669778-68.009923c71.763919 0 139.347842 23.465973 195.411779 67.924923a315.732642 315.732642 0 0 1 109.311876 166.911811 460.116479 460.116479 0 0 1-304.809654 114.68787 459.689479 459.689479 0 0 1-304.639655-114.60287A315.732642 315.732642 0 0 1 320.342327 693.759794z m413.695531-38.825956a362.665589 362.665589 0 0 0-108.885876-59.477933c32.255963-18.772979 59.562933-45.055949 79.61591-76.543913a232.532737 232.532737 0 0 0-195.924778-356.777596 232.532737 232.532737 0 0 0-196.180778 356.436597 234.299735 234.299735 0 0 0 79.18991 76.543913 362.921589 362.921589 0 0 0-110.250875 59.989932 369.321582 369.321582 0 0 0-117.589867 165.716812 457.727481 457.727481 0 0 1-115.199869-304.469655 456.788483 456.788483 0 0 1 134.399847-324.862632 457.556482 457.556482 0 0 1 324.692633-134.569847 457.641482 457.641482 0 0 1 324.692632 134.569847 458.239481 458.239481 0 0 1 134.485847 324.862632 456.873482 456.873482 0 0 1-115.199869 304.383655 369.236582 369.236582 0 0 0-117.759867-165.801812z" p-id="8186" fill="#ffcc00"></path></svg>
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
  padding: 15px 0;
}

.header-content {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
}

.logo {
  font-size: 32px;
  font-weight: bold;
  color: #ffcc00;
  text-transform: uppercase;
  text-decoration: none;
}

.search-bar {
  display: flex;
  align-items: center;
  flex: 1;
  max-width: 500px;
  margin: 0 30px;
}

.search-bar input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
  font-size: 16px;
}

.search-btn {
  padding: 12px 20px;
  background-color: #ffcc00;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  font-size: 18px;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 25px;
  position: relative;
}

.avatar-wrapper {
  cursor: pointer;
  display: flex;
  align-items: center;
}

.user-icon {
  width: 48px;
  height: 48px;
  transition: transform 0.3s;
}

.user-icon:hover {
  transform: scale(1.1);
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #ffcc00;
  transition: transform 0.3s, box-shadow 0.3s;
}

.user-avatar:hover {
  transform: scale(1.1);
  box-shadow: 0 0 10px rgba(255, 204, 0, 0.5);
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
  font-size: 26px;
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
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  gap: 45px;
  padding: 20px 30px;
}

.nav-item {
  text-decoration: none;
  color: #333;
  font-size: 18px;
  font-weight: 500;
  transition: color 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-item:hover, .nav-item.active {
  color: #ffcc00;
}

.nav-item.active .nav-icon {
  fill: #ffcc00;
}

.nav-icon {
  width: 20px;
  height: 20px;
  fill: #666;
  transition: fill 0.3s;
}

.nav-item:hover .nav-icon {
  fill: #ffcc00;
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
