<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user'
import Header from '../../components/headerUser.vue'

const userStore = useUserStore()
const router = useRouter()

// 用户表单数据
const loginForm = ref({
  username: '',
  password: ''
})

// 提交登录
const handleLogin = () => {
  userStore.login(loginForm.value.username, loginForm.value.password)
  loginForm.value = { username: '', password: '' }
}

// 跳转到注册页面
const goToRegister = () => {
  userStore.closeLoginModal()
  router.push('/register')
}

// 点击外部关闭头像菜单
const handleClickOutside = (event) => {
  const target = event.target
  if (!target.closest('.avatar-dropdown') && !target.closest('.avatar-trigger')) {
    userStore.closeAvatarMenu()
  }
}

// 监听点击事件
if (typeof window !== 'undefined') {
  window.addEventListener('click', handleClickOutside)
}
</script>

<template>
  <div class="customer-homepage">
    <!-- 顶部导航组件 -->
    <Header @open-login="userStore.openLoginModal" />
    
    <!-- 主内容区 -->
    <main class="main-content">
      <router-view />
    </main>
    
    <!-- 登录弹窗 -->
    <div v-if="userStore.showLoginModal" class="login-modal-overlay" @click.self="userStore.closeLoginModal">
      <div class="login-modal">
        <div class="login-header">
          <h3>用户登录</h3>
          <button class="close-btn" @click="userStore.closeLoginModal">×</button>
        </div>
        <div class="login-body">
          <form @submit.prevent="handleLogin" class="login-form">
            <div class="form-group">
              <label for="username">用户名</label>
              <input 
                type="text" 
                id="username" 
                v-model="loginForm.username" 
                placeholder="请输入用户名"
                required
              />
            </div>
            <div class="form-group">
              <label for="password">密码</label>
              <input 
                type="password" 
                id="password" 
                v-model="loginForm.password" 
                placeholder="请输入密码"
                required
              />
            </div>
            <div class="form-options">
              <label class="remember-me">
                <input type="checkbox" />
                <span>记住我</span>
              </label>
              <a href="#" class="forgot-password">忘记密码?</a>
            </div>
            <button type="submit" class="login-btn">登录</button>
            <div class="register-link">
              <span>还没有账号? <a href="#" @click.prevent="goToRegister">立即注册</a></span>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- 退出登录确认弹窗 -->
    <div v-if="userStore.showLogoutConfirm" class="logout-modal-overlay" @click.self="userStore.closeLogoutConfirm">
      <div class="logout-modal">
        <div class="logout-header">
          <h3>确认退出</h3>
        </div>
        <div class="logout-body">
          <p>确定要退出登录吗？</p>
        </div>
        <div class="logout-footer">
          <button class="cancel-btn" @click="userStore.closeLogoutConfirm">取消</button>
          <button class="confirm-btn" @click="userStore.logout">确认退出</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.customer-homepage {
  font-family: Arial, sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 主内容区 */
.main-content {
  flex: 1;
  padding-top: 160px; /* 为固定导航栏留出空间，增大间距 */
}

/* 登录弹窗样式 */
.login-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.login-modal {
  background-color: white;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

.login-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
  border-bottom: 1px solid #e0e0e0;
  background-color: #f8f8f8;
}

.login-header h3 {
  margin: 0;
  font-size: 20px;
  color: #333;
  font-weight: bold;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #999;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  transition: color 0.3s;
}

.close-btn:hover {
  color: #333;
}

.login-body {
  padding: 30px 25px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.form-group input {
  padding: 12px 15px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s, box-shadow 0.3s;
  outline: none;
}

.form-group input:focus {
  border-color: #ffcc00;
  box-shadow: 0 0 0 2px rgba(255, 204, 0, 0.2);
}

.form-group input::placeholder {
  color: #999;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #666;
  cursor: pointer;
}

.remember-me input {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.forgot-password {
  font-size: 13px;
  color: #ffcc00;
  text-decoration: none;
  transition: color 0.3s;
}

.forgot-password:hover {
  color: #e6b800;
}

.login-btn {
  padding: 12px 20px;
  background-color: #ffcc00;
  color: #1a1a1a;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.login-btn:hover {
  background-color: #e6b800;
  transform: translateY(-1px);
}

.login-btn:active {
  transform: translateY(0);
}

.register-link {
  text-align: center;
  font-size: 13px;
  color: #666;
  padding-top: 10px;
}

.register-link a {
  color: #ffcc00;
  text-decoration: none;
  font-weight: 500;
}

.register-link a:hover {
  text-decoration: underline;
}

/* 退出确认弹窗样式 */
.logout-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadeIn 0.3s ease;
}

.logout-modal {
  background-color: white;
  border-radius: 8px;
  width: 100%;
  max-width: 360px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.logout-header {
  padding: 20px 25px;
  border-bottom: 1px solid #e0e0e0;
  background-color: #f8f8f8;
}

.logout-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
  font-weight: bold;
}

.logout-body {
  padding: 30px 25px;
  text-align: center;
}

.logout-body p {
  margin: 0;
  font-size: 15px;
  color: #333;
}

.logout-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 15px 25px;
  border-top: 1px solid #e0e0e0;
  background-color: #fafafa;
}

.logout-footer .cancel-btn {
  padding: 8px 20px;
  background-color: transparent;
  color: #666;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.logout-footer .cancel-btn:hover {
  background-color: #f5f5f5;
}

.logout-footer .confirm-btn {
  padding: 8px 20px;
  background-color: #ff4444;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.logout-footer .confirm-btn:hover {
  background-color: #cc0000;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-content {
    padding-top: 180px;
  }
  
  .login-modal, .logout-modal {
    margin: 0 20px;
  }
}
</style>
