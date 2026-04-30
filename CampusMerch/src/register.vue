<script setup>
import { ref } from 'vue'

// 当前模式：'register' 或 'forgetPassword'
const currentMode = ref('register')

// 弹窗显示状态
const showUserAgreement = ref(false)
const showPrivacyPolicy = ref(false)

// 打开用户协议弹窗
const openUserAgreement = () => {
  showUserAgreement.value = true
}

// 关闭用户协议弹窗
const closeUserAgreement = () => {
  showUserAgreement.value = false
}

// 打开隐私政策弹窗
const openPrivacyPolicy = () => {
  showPrivacyPolicy.value = true
}

// 关闭隐私政策弹窗
const closePrivacyPolicy = () => {
  showPrivacyPolicy.value = false
}

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

// 验证码倒计时状态
const registerCodeCountdown = ref(0)
const forgetCodeCountdown = ref(0)

// 获取注册验证码
const getRegisterCode = () => {
  if (!registerForm.value.phone) {
    alert('请先输入邮箱账号')
    return
  }
  if (registerCodeCountdown.value > 0) {
    return
  }
  alert('验证码已发送')
  registerCodeCountdown.value = 60
  const timer = setInterval(() => {
    registerCodeCountdown.value--
    if (registerCodeCountdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

// 获取忘记密码验证码
const getForgetCode = () => {
  if (!forgetPasswordForm.value.email) {
    alert('请先输入邮箱账号')
    return
  }
  if (forgetCodeCountdown.value > 0) {
    return
  }
  alert('验证码已发送')
  forgetCodeCountdown.value = 60
  const timer = setInterval(() => {
    forgetCodeCountdown.value--
    if (forgetCodeCountdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
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
                <button 
              class="code-btn" 
              :class="{ disabled: registerCodeCountdown > 0 }"
              @click="getRegisterCode"
              :disabled="registerCodeCountdown > 0"
            >
              {{ registerCodeCountdown > 0 ? `${registerCodeCountdown}s` : '获取验证码' }}
            </button>
              </div>
              <div class="form-item form-item-agree">
                <input type="checkbox" id="agree" class="agree-checkbox" />
                <label for="agree" class="agree-label">
                  我已阅读并同意
                  <a href="#" class="link" @click.prevent="openUserAgreement">《用户协议》</a>
                  和
                  <a href="#" class="link" @click.prevent="openPrivacyPolicy">《隐私政策》</a>
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
                <button 
              class="code-btn" 
              :class="{ disabled: forgetCodeCountdown > 0 }"
              @click="getForgetCode"
              :disabled="forgetCodeCountdown > 0"
            >
              {{ forgetCodeCountdown > 0 ? `${forgetCodeCountdown}s` : '获取验证码' }}
            </button>
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
    </div>

    <!-- 用户协议弹窗 -->
    <div v-if="showUserAgreement" class="modal-overlay" @click.self="closeUserAgreement">
      <div class="modal-content">
        <div class="modal-header">
          <h2>用户协议</h2>
          <button class="modal-close" @click="closeUserAgreement">×</button>
        </div>
        <div class="modal-body">
          <h3>一、用户服务协议</h3>
          <p>欢迎您注册并使用校园文创预订平台（以下简称"本平台"）。本协议是您与本平台之间关于使用本平台服务的法律协议。</p>
          
          <h3>二、用户注册</h3>
          <p>1. 您必须年满18周岁才能注册成为本平台用户。</p>
          <p>2. 您需要提供真实、准确的注册信息。</p>
          <p>3. 您负责保管自己的账号和密码，并对其下的所有活动负责。</p>
          
          <h3>三、用户权利与义务</h3>
          <p>1. 用户有权使用本平台提供的各项服务。</p>
          <p>2. 用户应遵守本平台的各项规则和国家法律法规。</p>
          <p>3. 用户不得利用本平台从事违法违规活动。</p>
          
          <h3>四、服务内容</h3>
          <p>本平台提供校园文创产品的浏览、购买、定制等服务。</p>
          
          <h3>五、协议变更</h3>
          <p>本平台有权随时修改本协议，修改后的协议将在平台公告后生效。</p>
          
          <h3>六、其他</h3>
          <p>本协议的解释权归本平台所有。如有争议，双方应协商解决；协商不成的，可向有管辖权的法院提起诉讼。</p>
        </div>
        <div class="modal-footer">
          <button class="modal-btn" @click="closeUserAgreement">我已阅读</button>
        </div>
      </div>
    </div>

    <!-- 隐私政策弹窗 -->
    <div v-if="showPrivacyPolicy" class="modal-overlay" @click.self="closePrivacyPolicy">
      <div class="modal-content">
        <div class="modal-header">
          <h2>隐私政策</h2>
          <button class="modal-close" @click="closePrivacyPolicy">×</button>
        </div>
        <div class="modal-body">
          <h3>一、隐私政策概述</h3>
          <p>本隐私政策旨在说明本平台如何收集、使用、存储和保护您的个人信息。</p>
          
          <h3>二、信息收集</h3>
          <p>1. 注册信息：包括用户名、密码、邮箱等。</p>
          <p>2. 使用信息：包括浏览记录、购买记录、偏好设置等。</p>
          <p>3. 设备信息：包括IP地址、浏览器类型、设备型号等。</p>
          
          <h3>三、信息使用</h3>
          <p>1. 提供和优化服务。</p>
          <p>2. 个性化推荐。</p>
          <p>3. 安全保障。</p>
          <p>4. 合规要求。</p>
          
          <h3>四、信息保护</h3>
          <p>1. 采用加密技术保护数据传输。</p>
          <p>2. 限制访问权限。</p>
          <p>3. 定期安全审计。</p>
          
          <h3>五、信息共享</h3>
          <p>1. 不会向第三方出售您的个人信息。</p>
          <p>2. 在法律要求或用户同意的情况下可能披露信息。</p>
          
          <h3>六、用户权利</h3>
          <p>1. 访问和更正个人信息。</p>
          <p>2. 删除个人信息。</p>
          <p>3. 撤回同意。</p>
          
          <h3>七、政策变更</h3>
          <p>本政策可能不定期更新，更新后将在平台公告。</p>
        </div>
        <div class="modal-footer">
          <button class="modal-btn" @click="closePrivacyPolicy">我已阅读</button>
        </div>
      </div>
    </div>

    <!-- 版权标识 -->
    <footer class="page-footer">
      <p>校园文创预订 © 2026</p>
    </footer>
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
  background: linear-gradient(180deg, #ffcc00 0%, #e6b800 100%);
  border-radius: 8px;
}

.logo-title {
  font-size: 32px;
  font-weight: bold;
  color: #ffcc00;
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
  background: linear-gradient(180deg, #ffcc00 0%, #e6b800 100%);
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
  background: rgba(255, 204, 0, 0.2);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-icon::before {
  content: '文';
  font-size: 28px;
  font-weight: bold;
  color: #fff;
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
  background: rgba(255, 204, 0, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #fff;
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
  border-color: #ffcc00;
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

.code-btn.disabled {
  background: #d0d0d0;
  color: #999;
  cursor: not-allowed;
}

.code-btn.disabled:hover {
  background: #d0d0d0;
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
  color: #ffcc00;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}

.register-btn {
  width: 100%;
  height: 45px;
  background: linear-gradient(180deg, #ffcc00 0%, #e6b800 100%);
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

.page-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  text-align: center;
  padding: 20px;
  background-color: #f5f5f5;
  border-top: 1px solid #e0e0e0;
  z-index: 10;
}

.page-footer p {
  margin: 0;
  font-size: 14px;
  color: #999;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background-color: white;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
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

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
  border-bottom: 1px solid #e0e0e0;
  background-color: #f8f8f8;
}

.modal-header h2 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.modal-close {
  background: none;
  border: none;
  font-size: 28px;
  color: #999;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  transition: color 0.3s;
}

.modal-close:hover {
  color: #333;
}

.modal-body {
  padding: 25px;
  max-height: 50vh;
  overflow-y: auto;
}

.modal-body h3 {
  font-size: 16px;
  color: #333;
  margin: 15px 0 10px 0;
}

.modal-body h3:first-child {
  margin-top: 0;
}

.modal-body p {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 5px 0;
}

.modal-footer {
  padding: 15px 25px;
  border-top: 1px solid #e0e0e0;
  background-color: #fafafa;
  display: flex;
  justify-content: flex-end;
}

.modal-btn {
  padding: 10px 30px;
  background-color: #ffcc00;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.modal-btn:hover {
  background-color: #e6b800;
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
