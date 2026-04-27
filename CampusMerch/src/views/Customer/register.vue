<script setup>
import { ref } from 'vue'

// 当前模式：'register' 或 'forgetPassword'
const currentMode = ref('register')

// 注册表单
const registerForm = ref({
  username: '',
  password: '',
  confirmPassword: '',
  phone: '',
  verifyCode: ''
})

// 忘记密码表单
const forgetPasswordForm = ref({
  email: '',
  verifyCode: '',
  newPassword: '',
  confirmPassword: ''
})

const getRegisterCode = () => {
  if (!registerForm.value.phone) {
    alert('请先输入邮箱账号')
    return
  }
  alert('验证码已发送')
}

const getForgetCode = () => {
  if (!forgetPasswordForm.value.email) {
    alert('请先输入邮箱账号')
    return
  }
  alert('验证码已发送')
}

const handleRegister = () => {
  if (!registerForm.value.username) {
    alert('请输入用户名')
    return
  }
  if (!registerForm.value.password) {
    alert('请输入密码')
    return
  }
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    alert('两次输入的密码不一致')
    return
  }
  if (!registerForm.value.phone) {
    alert('请输入邮箱账号')
    return
  }
  if (!registerForm.value.verifyCode) {
    alert('请输入验证码')
    return
  }
  alert('注册成功！')
}

const handleForgetPassword = () => {
  if (!forgetPasswordForm.value.email) {
    alert('请输入邮箱账号')
    return
  }
  if (!forgetPasswordForm.value.verifyCode) {
    alert('请输入验证码')
    return
  }
  if (!forgetPasswordForm.value.newPassword) {
    alert('请输入新密码')
    return
  }
  if (forgetPasswordForm.value.newPassword !== forgetPasswordForm.value.confirmPassword) {
    alert('两次输入的密码不一致')
    return
  }
  alert('密码重置成功！')
  // 重置成功后切换回注册页面
  currentMode.value = 'register'
}

// 切换到忘记密码模式
const goToForgetPassword = () => {
  currentMode.value = 'forgetPassword'
}

// 切换到注册模式
const goToRegister = () => {
  currentMode.value = 'register'
}
</script>

<template>
  <div class="register-container">
    <!-- 顶部Logo区域 - 放在页面最顶部 -->
    <div class="header">
      <div class="header-content">
        <div class="logo-wrapper">
          <div class="logo-bg"></div>
          <span class="logo-title">校园文创预订</span>
        </div>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="main-content">
      <div class="register-content">
        <!-- 左侧品牌区域 -->
        <div class="brand-section">
          <div class="brand-logo">
            <!-- 校园文创预订商标位置 -->
            <div class="logo-placeholder">
              <div class="logo-icon"></div>
              <span class="logo-text">校园文创预订</span>
            </div>
          </div>
          <div class="brand-slogan">
            <p>发现校园之美</p>
            <p>传承文化创意</p>
          </div>
          <div class="brand-features">
            <div class="feature-item">
              <span class="feature-icon">✓</span>
              <span>品质保证</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">✓</span>
              <span>原创设计</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">✓</span>
              <span>专属定制</span>
            </div>
          </div>
        </div>

        <!-- 右侧注册/忘记密码区域 -->
        <div class="form-section">
          <!-- 用户注册表单 -->
          <div v-if="currentMode === 'register'">
            <div class="form-header">
              <h1>用户注册</h1>
            </div>
            <div class="register-form">
              <div class="form-item">
                <input 
                  v-model="registerForm.username" 
                  type="text" 
                  placeholder="请输入用户名"
                  class="form-input"
                />
              </div>
              <div class="form-item">
                <input 
                  v-model="registerForm.password" 
                  type="password" 
                  placeholder="请输入密码"
                  class="form-input"
                />
              </div>
              <div class="form-item">
                <input 
                  v-model="registerForm.confirmPassword" 
                  type="password" 
                  placeholder="请确认密码"
                  class="form-input"
                />
              </div>
              <div class="form-item">
                <input 
                  v-model="registerForm.phone" 
                  type="email" 
                  placeholder="请输入邮箱账号"
                  class="form-input"
                />
              </div>
              <div class="form-item form-item-code">
                <input 
                  v-model="registerForm.verifyCode" 
                  type="text" 
                  placeholder="请输入验证码"
                  class="form-input code-input"
                />
                <button class="code-btn" @click="getRegisterCode">获取验证码</button>
              </div>
              <div class="form-item form-item-agree">
                <input type="checkbox" id="agree" class="agree-checkbox" />
                <label for="agree" class="agree-label">
                  我已阅读并同意
                  <a href="#" class="link">《用户协议》</a>
                  和
                  <a href="#" class="link">《隐私政策》</a>
                </label>
              </div>
              <button class="register-btn" @click="handleRegister">注册</button>
            </div>
            <div class="form-footer">
              <a href="#" class="link login-link" @click.prevent="goToForgetPassword">忘记密码</a>
            </div>
          </div>

          <!-- 忘记密码表单 -->
          <div v-else>
            <div class="form-header">
              <h1>忘记密码</h1>
            </div>
            <div class="register-form">
              <div class="form-item">
                <input 
                  v-model="forgetPasswordForm.email" 
                  type="email" 
                  placeholder="请输入邮箱账号"
                  class="form-input"
                />
              </div>
              <div class="form-item form-item-code">
                <input 
                  v-model="forgetPasswordForm.verifyCode" 
                  type="text" 
                  placeholder="请输入验证码"
                  class="form-input code-input"
                />
                <button class="code-btn" @click="getForgetCode">获取验证码</button>
              </div>
              <div class="form-item">
                <input 
                  v-model="forgetPasswordForm.newPassword" 
                  type="password" 
                  placeholder="请输入新密码"
                  class="form-input"
                />
              </div>
              <div class="form-item">
                <input 
                  v-model="forgetPasswordForm.confirmPassword" 
                  type="password" 
                  placeholder="请确认新密码"
                  class="form-input"
                />
              </div>
              <button class="register-btn" @click="handleForgetPassword">重置密码</button>
            </div>
            <div class="form-footer">
              <a href="#" class="link login-link" @click.prevent="goToRegister">返回注册</a>
            </div>
          </div>
        </div>
      </div>
      <div class="footer">
        <p>校园文创预订 © 2026</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 顶部Logo区域 - 放在页面最顶部 */
.header {
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  padding-left: 100px;
  box-sizing: border-box;
}

.header-content {
  display: flex;
  align-items: center;
}

.logo-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-bg {
  width: 54px;
  height: 54px;
  background: linear-gradient(180deg, #e74c3c 0%, #c0392b 100%);
  border-radius: 8px;
}

.logo-title {
  font-size: 32px;
  font-weight: bold;
  color: #e74c3c;
  letter-spacing: 2px;
}

.register-container {
  height: 100vh;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 主内容区域 */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
  box-sizing: border-box;
}

.register-content {
  display: flex;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 800px;
  max-width: 90%;
}

/* 左侧品牌区域 */
.brand-section {
  width: 40%;
  background: linear-gradient(180deg, #e74c3c 0%, #c0392b 100%);
  padding: 60px 40px;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.brand-logo {
  margin-bottom: 30px;
}

.logo-placeholder {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-icon::before {
  content: '文';
  font-size: 28px;
  font-weight: bold;
}

.logo-text {
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 2px;
}

.brand-slogan {
  margin-bottom: 40px;
}

.brand-slogan p {
  margin: 8px 0;
  font-size: 16px;
  opacity: 0.9;
}

.brand-features {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.feature-icon {
  width: 24px;
  height: 24px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

/* 右侧注册区域 */
.form-section {
  width: 60%;
  padding: 40px;
}

.form-header {
  text-align: center;
  margin-bottom: 30px;
}

.form-header h1 {
  font-size: 28px;
  color: #333;
  margin: 0;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-item {
  display: flex;
  flex-direction: column;
}

.form-input {
  width: 100%;
  height: 45px;
  padding: 0 15px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;
  transition: border-color 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: #e74c3c;
}

.form-input::placeholder {
  color: #999;
}

.form-item-code {
  flex-direction: row;
  gap: 10px;
}

.code-input {
  flex: 1;
}

.code-btn {
  width: 120px;
  height: 45px;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.code-btn:hover {
  background: #e8e8e8;
}

.form-item-agree {
  flex-direction: row;
  align-items: center;
  gap: 8px;
}

.agree-checkbox {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.agree-label {
  font-size: 12px;
  color: #666;
}

.link {
  color: #e74c3c;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}

.register-btn {
  width: 100%;
  height: 45px;
  background: linear-gradient(180deg, #e74c3c 0%, #c0392b 100%);
  border: none;
  border-radius: 6px;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 10px;
}

.register-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.form-footer {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #666;
}

.login-link {
  margin-left: 5px;
}

.footer {
  margin-top: 70px;
  text-align: center;
  color: #999;
  font-size: 12px;
}

.footer p {
  margin: 0;
}

@media (max-width: 768px) {
  .header {
    height: 80px;
    padding-left: 30px;
    justify-content: center;
  }

  .logo-title {
    font-size: 24px;
  }

  .logo-bg {
    width: 44px;
    height: 44px;
  }

  .register-content {
    flex-direction: column;
    width: 95%;
  }

  .brand-section {
    width: 100%;
    padding: 30px;
  }

  .form-section {
    width: 100%;
    padding: 30px;
  }
}
</style>
