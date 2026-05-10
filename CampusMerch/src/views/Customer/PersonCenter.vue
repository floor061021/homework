<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useUserStore } from '../../stores/user';

const userStore = useUserStore();

// 返回顶部按钮显示状态
const showBackTop = ref(false)

// 滚动到顶部
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 监听滚动事件
const handleScroll = () => {
  showBackTop.value = window.scrollY > 300
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const localUserInfo = ref({
  username: '校园用户',
  email: 'user@campus.com'
});

const isEditing = ref(false);
const activeTab = ref('profile');
const avatarPreview = ref('');

const showConfirmModal = ref(false);
const confirmType = ref('');
const confirmData = ref({});

const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const emailForm = ref({
  password: '',
  newEmail: ''
});

// 计算显示的用户信息
const displayUserInfo = computed(() => {
  return {
    ...localUserInfo.value,
    ...userStore.userInfo
  };
});

const openEdit = () => {
  isEditing.value = true;
};

const saveProfile = () => {
  userStore.updateUserInfo({ username: localUserInfo.value.username });
  isEditing.value = false;
};

const cancelEdit = () => {
  isEditing.value = false;
};

const handleAvatarUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      avatarPreview.value = e.target.result;
      userStore.updateUserInfo({ avatar: e.target.result });
    };
    reader.readAsDataURL(file);
  }
};

const validatePassword = (password) => {
  const errors = [];
  if (password.length < 8) errors.push('至少8位');
  if (!/[A-Z]/.test(password)) errors.push('包含大写字母');
  if (!/[a-z]/.test(password)) errors.push('包含小写字母');
  if (!/[0-9]/.test(password)) errors.push('包含数字');
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push('包含特殊字符');
  return errors;
};

const confirmPasswordChange = () => {
  if (passwordForm.value.oldPassword !== '123456') {
    alert('旧密码错误，请重新输入！');
    return;
  }
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    alert('两次输入的密码不一致！');
    return;
  }
  const errors = validatePassword(passwordForm.value.newPassword);
  if (errors.length > 0) {
    alert('密码必须：' + errors.join('、'));
    return;
  }
  confirmType.value = 'password';
  confirmData.value = { ...passwordForm.value };
  showConfirmModal.value = true;
};

const confirmEmailChange = () => {
  if (emailForm.value.password !== '123456') {
    alert('密码错误，请重新输入！');
    return;
  }
  if (!emailForm.value.newEmail || !emailForm.value.newEmail.includes('@')) {
    alert('请输入有效的邮箱地址！');
    return;
  }
  confirmType.value = 'email';
  confirmData.value = { ...emailForm.value };
  showConfirmModal.value = true;
};

const handleConfirm = () => {
  if (confirmType.value === 'password') {
    alert('密码修改成功！');
    passwordForm.value = {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
  } else if (confirmType.value === 'email') {
    localUserInfo.value.email = emailForm.value.newEmail;
    userStore.updateUserInfo({ email: emailForm.value.newEmail });
    alert('邮箱修改成功！');
    emailForm.value = {
      password: '',
      newEmail: ''
    };
  }
  showConfirmModal.value = false;
  confirmType.value = '';
  confirmData.value = {};
};

const handleCancel = () => {
  showConfirmModal.value = false;
  confirmType.value = '';
  confirmData.value = {};
};

const tabs = [
  { key: 'profile', label: '基本信息' },
  { key: 'password', label: '修改密码' },
  { key: 'email', label: '修改邮箱' },
  { key: 'reset', label: '找回密码' },
  { key: 'delete', label: '注销账号' }
];

// 注销账号表单
const deleteAccountForm = ref({
  password: ''
});

// 注销确认弹窗
const showDeleteConfirmModal = ref(false);

// 验证密码并显示确认弹窗
const confirmDeleteAccount = () => {
  if (deleteAccountForm.value.password !== '123456') {
    alert('密码错误，请重新输入！');
    return;
  }
  showDeleteConfirmModal.value = true;
};

// 确认注销账号
const handleDeleteAccount = () => {
  userStore.logout();
  showDeleteConfirmModal.value = false;
  deleteAccountForm.value.password = '';
};

// 取消注销
const cancelDeleteAccount = () => {
  showDeleteConfirmModal.value = false;
  deleteAccountForm.value.password = '';
};

// 找回密码相关状态
const resetPasswordForm = ref({
  email: '',
  verifyCode: '',
  newPassword: '',
  confirmPassword: ''
});

const verificationCode = ref(''); // 生成的6位验证码
const verifyCodeSent = ref(false); // 验证码是否已发送
const verifyCodeSentTime = ref(0); // 验证码发送时间
const countdown = ref(0); // 倒计时
const isCodeVerified = ref(false); // 验证码是否已验证
const originalPassword = ref('User@123'); // 模拟原始密码
const showFoundPassword = ref(false); // 是否显示找到的密码
const foundPassword = ref(''); // 找到的密码

let countdownTimer = null;

// 发送验证码
const sendVerifyCode = () => {
  if (!resetPasswordForm.value.email || !resetPasswordForm.value.email.includes('@')) {
    alert('请输入有效的邮箱地址！');
    return;
  }
  
  // 模拟发送验证码
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  verificationCode.value = code;
  verifyCodeSent.value = true;
  verifyCodeSentTime.value = Date.now();
  countdown.value = 60;
  
  alert(`验证码已发送至 ${resetPasswordForm.value.email}\n（模拟：${code}）`);
  
  // 开始倒计时
  if (countdownTimer) clearInterval(countdownTimer);
  countdownTimer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(countdownTimer);
      countdownTimer = null;
    }
  }, 1000);
};

// 验证验证码
const verifyCode = () => {
  if (resetPasswordForm.value.verifyCode.length !== 6) {
    alert('请输入6位验证码！');
    return;
  }
  
  if (resetPasswordForm.value.verifyCode !== verificationCode.value) {
    alert('验证码错误，请重新输入！');
    return;
  }
  
  isCodeVerified.value = true;
  foundPassword.value = originalPassword.value;
  showFoundPassword.value = true;
  alert('验证码验证成功！');
};

// 重置密码
const resetPassword = () => {
  if (resetPasswordForm.value.newPassword !== resetPasswordForm.value.confirmPassword) {
    alert('两次输入的密码不一致！');
    return;
  }
  
  const errors = validatePassword(resetPasswordForm.value.newPassword);
  if (errors.length > 0) {
    alert('密码必须：' + errors.join('、'));
    return;
  }
  
  if (resetPasswordForm.value.newPassword === originalPassword.value) {
    alert('新密码不能与原密码相同！');
    return;
  }
  
  // 模拟密码重置成功
  originalPassword.value = resetPasswordForm.value.newPassword;
  showSuccessModal.value = true;
};

// 关闭成功弹窗并重置表单
const closeSuccessModal = () => {
  showSuccessModal.value = false;
  resetPasswordForm.value = {
    email: '',
    verifyCode: '',
    newPassword: '',
    confirmPassword: ''
  };
  isCodeVerified.value = false;
  showFoundPassword.value = false;
  verifyCodeSent.value = false;
  countdown.value = 0;
  if (countdownTimer) {
    clearInterval(countdownTimer);
    countdownTimer = null;
  }
};

// 找回密码成功弹窗
const showSuccessModal = ref(false);
</script>

<template>
  <div class="person-center">
    <div class="page-container">
      <div class="page-header">
        <h1>个人中心</h1>
        <p>管理您的个人信息</p>
      </div>
      
      <!-- 未登录状态 -->
      <div v-if="!userStore.isLoggedIn" class="login-prompt">
        <div class="login-prompt-content">
          <svg t="1777463809803" class="login-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8185"><path d="M983.722576 312.747226a510.463422 510.463422 0 0 0-109.653876-162.815816A510.377422 510.377422 0 0 0 512.00011 0.00158a510.292422 510.292422 0 0 0-362.06859 149.92983A510.292422 510.292422 0 0 0 0.00169 512.001a510.121422 510.121422 0 0 0 149.92983 362.06759A510.292422 510.292422 0 0 0 512.00111 1023.99942a510.292422 510.292422 0 0 0 362.06759-149.92983A510.121422 510.121422 0 0 0 1023.99953 512c0-69.119922-13.567985-136.190846-40.276954-199.252774zM516.096105 577.023926a183.039793 183.039793 0 0 1-182.868792-182.868793c0-100.863886 82.005907-182.868793 182.783792-182.868792 100.863886 0 182.869793 82.004907 182.869793 182.869792a183.039793 183.039793 0 0 1-182.869793 182.867793zM320.342327 693.759794a311.977647 311.977647 0 0 1 195.669778-68.009923c71.763919 0 139.347842 23.465973 195.411779 67.924923a315.732642 315.732642 0 0 1 109.311876 166.911811 460.116479 460.116479 0 0 1-304.809654 114.68787 459.689479 459.689479 0 0 1-304.639655-114.60287A315.732642 315.732642 0 0 1 320.342327 693.759794z m413.695531-38.825956a362.665589 362.665589 0 0 0-108.885876-59.477933c32.255963-18.772979 59.562933-45.055949 79.61591-76.543913a232.532737 232.532737 0 0 0-195.924778-356.777596 232.532737 232.532737 0 0 0-196.180778 356.436597 234.299735 234.299735 0 0 0 79.18991 76.543913 362.921589 362.921589 0 0 0-110.250875 59.989932 369.321582 369.321582 0 0 0-117.589867 165.716812 457.727481 457.727481 0 0 1-115.199869-304.469655 456.788483 456.788483 0 0 1 134.399847-324.862632 457.556482 457.556482 0 0 1 324.692633-134.569847 457.641482 457.641482 0 0 1 324.692632 134.569847 458.239481 458.239481 0 0 1 134.485847 324.862632 456.873482 456.873482 0 0 1-115.199869 304.383655 369.236582 369.236582 0 0 0-117.759867-165.801812z" p-id="8186" fill="#ffcc00"></path></svg>
          <h2>您还未登录</h2>
          <p>登录后可以管理您的个人信息</p>
          <button class="go-login-btn" @click="userStore.openLoginModal">去登录</button>
        </div>
      </div>
      
      <!-- 已登录状态 -->
      <div v-else class="content-wrapper">
        <aside class="sidebar">
          <div class="avatar-section">
            <div class="avatar-container">
              <img 
                :src="avatarPreview || userStore.userInfo.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=1'" 
                alt="头像" 
                class="avatar"
              />
              <label class="upload-btn" for="avatar-upload">
                <span>📷</span>
              </label>
              <input type="file" id="avatar-upload" accept="image/*" @change="handleAvatarUpload" class="upload-input" />
            </div>
            <h3>{{ displayUserInfo.username }}</h3>
            <p>{{ displayUserInfo.email }}</p>
          </div>
          
          <nav class="tab-nav">
            <div 
              v-for="tab in tabs" 
              :key="tab.key"
              :class="['tab-item', { active: activeTab === tab.key }]"
              @click="activeTab = tab.key"
            >
              {{ tab.label }}
            </div>
          </nav>
        </aside>
        
        <main class="main-content">
          <div v-if="activeTab === 'profile'" class="form-section">
            <div class="section-header">
              <h2>基本信息</h2>
              <div class="actions">
                <button v-if="!isEditing" class="edit-btn" @click="openEdit">编辑信息</button>
                <button v-if="isEditing" class="save-btn" @click="saveProfile">保存</button>
                <button v-if="isEditing" class="cancel-btn" @click="cancelEdit">取消</button>
              </div>
            </div>
            
            <form class="info-form">
              <div class="form-group">
                <label for="username">用户名</label>
                <input 
                  type="text" 
                  id="username" 
                  v-model="localUserInfo.username"
                  :disabled="!isEditing"
                  placeholder="请输入用户名"
                />
              </div>
              
              <div class="form-group">
                <label for="email">邮箱</label>
                <input 
                  type="email" 
                  id="email" 
                  v-model="localUserInfo.email"
                  disabled
                  placeholder="请在修改邮箱板块更改"
                  class="readonly-input"
                />
              </div>
              
              <div class="form-group">
                <label>注册时间</label>
                <input 
                  type="text" 
                  value="2024-01-15 10:30:00"
                  disabled
                  class="readonly-input"
                />
              </div>
            </form>
          </div>
          
          <div v-if="activeTab === 'password'" class="form-section">
            <div class="section-header">
              <h2>修改密码</h2>
            </div>
            
            <form class="info-form" @submit.prevent="confirmPasswordChange">
              <div class="form-group">
                <label for="oldPassword">旧密码</label>
                <input 
                  type="password" 
                  id="oldPassword" 
                  v-model="passwordForm.oldPassword"
                  placeholder="请输入旧密码"
                  required
                />
              </div>
              
              <div class="form-group">
                <label for="newPassword">新密码</label>
                <input 
                  type="password" 
                  id="newPassword" 
                  v-model="passwordForm.newPassword"
                  placeholder="请输入新密码（8位以上，包含大写字母、小写字母、数字和特殊字符）"
                  required
                />
              </div>
              
              <div class="form-group">
                <label for="confirmPassword">确认新密码</label>
                <input 
                  type="password" 
                  id="confirmPassword" 
                  v-model="passwordForm.confirmPassword"
                  placeholder="请再次输入新密码"
                  required
                />
              </div>
              
              <button type="submit" class="submit-btn">确认修改</button>
            </form>
          </div>
          
          <div v-if="activeTab === 'email'" class="form-section">
            <div class="section-header">
              <h2>修改邮箱</h2>
            </div>
            
            <form class="info-form" @submit.prevent="confirmEmailChange">
              <div class="form-group">
                <label for="emailPassword">当前密码</label>
                <input 
                  type="password" 
                  id="emailPassword" 
                  v-model="emailForm.password"
                  placeholder="请输入当前密码以验证身份"
                  required
                />
              </div>
              
              <div class="form-group">
                <label for="newEmail">新邮箱</label>
                <input 
                  type="email" 
                  id="newEmail" 
                  v-model="emailForm.newEmail"
                  placeholder="请输入新邮箱地址"
                  required
                />
              </div>
              
              <button type="submit" class="submit-btn">确认修改</button>
            </form>
          </div>
          
          <!-- 找回密码 -->
          <div v-if="activeTab === 'reset'" class="form-section reset-section">
            <div class="section-header">
              <h2>找回密码</h2>
            </div>
            
            <div v-if="!isCodeVerified" class="reset-step">
              <p class="step-title">步骤1：验证邮箱</p>
              <form class="info-form" @submit.prevent="sendVerifyCode">
                <div class="form-group">
                  <label for="resetEmail">邮箱地址</label>
                  <input 
                    type="email" 
                    id="resetEmail" 
                    v-model="resetPasswordForm.email"
                    placeholder="请输入您注册的邮箱地址"
                    required
                  />
                </div>
                <button type="submit" class="send-code-btn" :disabled="countdown > 0">
                  {{ countdown > 0 ? `${countdown}秒后可重新发送` : '发送验证码' }}
                </button>
              </form>
              
              <form class="info-form verify-form" @submit.prevent="verifyCode" v-if="verifyCodeSent">
                <div class="form-group">
                  <label for="verifyCode">验证码</label>
                  <div class="verify-code-input">
                    <input 
                      type="text" 
                      id="verifyCode" 
                      v-model="resetPasswordForm.verifyCode"
                      placeholder="请输入6位验证码"
                      maxlength="6"
                      required
                    />
                    <button type="submit" class="verify-btn">验证</button>
                  </div>
                </div>
              </form>
            </div>
            
            <div v-else class="reset-step">
              <p class="step-title">步骤2：重置密码</p>
              
              <div v-if="showFoundPassword" class="found-password-box">
                <p class="found-label">您找到的密码是：</p>
                <p class="found-password">{{ foundPassword }}</p>
              </div>
              
              <form class="info-form" @submit.prevent="resetPassword">
                <div class="form-group">
                  <label for="newResetPassword">新密码</label>
                  <input 
                    type="password" 
                    id="newResetPassword" 
                    v-model="resetPasswordForm.newPassword"
                    placeholder="请输入新密码（8位以上，包含大写字母、小写字母、数字和特殊字符）"
                    required
                  />
                </div>
                
                <div class="form-group">
                  <label for="confirmResetPassword">确认新密码</label>
                  <input 
                    type="password" 
                    id="confirmResetPassword" 
                    v-model="resetPasswordForm.confirmPassword"
                    placeholder="请再次输入新密码"
                    required
                  />
                </div>
                
                <button type="submit" class="reset-btn">确认重置密码</button>
              </form>
            </div>
          </div>
          
          <div v-if="activeTab === 'delete'" class="form-section delete-section">
            <div class="section-header">
              <h2>注销账号</h2>
            </div>
            
            <div class="delete-warning">
              <p class="warning-icon">⚠️</p>
              <p class="warning-text">注销账号后，您的所有个人信息将被永久删除，此操作不可撤销！</p>
            </div>
            
            <form class="info-form" @submit.prevent="confirmDeleteAccount">
              <div class="form-group">
                <label for="deletePassword">当前密码</label>
                <input 
                  type="password" 
                  id="deletePassword" 
                  v-model="deleteAccountForm.password"
                  placeholder="请输入当前密码以确认身份"
                  required
                />
              </div>
              
              <button type="submit" class="delete-btn">确认注销账号</button>
            </form>
          </div>
        </main>
      </div>
    </div>

    <!-- 确认修改弹窗 -->
    <div v-if="showConfirmModal" class="confirm-modal-overlay" @click.self="handleCancel">
      <div class="confirm-modal">
        <div class="confirm-header">
          <h3>确认修改</h3>
          <button class="close-btn" @click="handleCancel">×</button>
        </div>
        <div class="confirm-body">
          <p v-if="confirmType === 'password'">确定要修改密码吗？</p>
          <p v-if="confirmType === 'email'">确定要将邮箱修改为 {{ confirmData.newEmail }} 吗？</p>
        </div>
        <div class="confirm-footer">
          <button class="cancel-btn" @click="handleCancel">取消</button>
          <button class="confirm-btn" @click="handleConfirm">确认</button>
        </div>
      </div>
    </div>

    <!-- 注销账号确认弹窗 -->
    <div v-if="showDeleteConfirmModal" class="confirm-modal-overlay" @click.self="cancelDeleteAccount">
      <div class="confirm-modal delete-modal">
        <div class="confirm-header">
          <h3>⚠️ 注销账号</h3>
          <button class="close-btn" @click="cancelDeleteAccount">×</button>
        </div>
        <div class="confirm-body delete-body">
          <p class="delete-icon">🗑️</p>
          <p class="delete-title">确定要注销账号吗？</p>
          <p class="delete-desc">此操作将永久删除您的所有个人信息，且无法恢复！</p>
        </div>
        <div class="confirm-footer">
          <button class="cancel-btn" @click="cancelDeleteAccount">取消</button>
          <button class="delete-confirm-btn" @click="handleDeleteAccount">确认注销</button>
        </div>
      </div>
    </div>

    <!-- 密码重置成功弹窗 -->
    <div v-if="showSuccessModal" class="confirm-modal-overlay" @click.self="closeSuccessModal">
      <div class="confirm-modal success-modal">
        <div class="confirm-header success-header">
          <h3>🎉 密码重置成功</h3>
          <button class="close-btn" @click="closeSuccessModal">×</button>
        </div>
        <div class="confirm-body success-body">
          <p class="success-icon">✅</p>
          <p class="success-title">您的密码已成功重置！</p>
          <p class="success-desc">请使用新密码重新登录。</p>
        </div>
        <div class="confirm-footer">
          <button class="success-btn" @click="closeSuccessModal">确定</button>
        </div>
      </div>
    </div>

    <!-- 返回顶部按钮 -->
    <button class="back-to-top" @click="scrollToTop" v-show="showBackTop">↑</button>
    
    <!-- 版权标识 -->
    <footer class="page-footer">
      <p>校园文创预订 © 2026</p>
    </footer>
  </div>
</template>

<style scoped>
.person-center {
  min-height: 100vh;
  background-color: #f8f8f8;
}

.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
}

.page-header h1 {
  font-size: 32px;
  color: #333;
  margin: 0 0 10px 0;
}

.page-header p {
  color: #999;
  margin: 0;
}

/* 未登录提示样式 */
.login-prompt {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.login-prompt-content {
  background-color: white;
  border-radius: 12px;
  padding: 60px 40px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.login-icon {
  font-size: 80px;
  margin-bottom: 20px;
}

.login-prompt-content h2 {
  font-size: 24px;
  color: #333;
  margin: 0 0 10px 0;
}

.login-prompt-content p {
  color: #999;
  margin: 0 0 30px 0;
  font-size: 14px;
}

.go-login-btn {
  padding: 14px 40px;
  background-color: #ffcc00;
  color: #1a1a1a;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.go-login-btn:hover {
  background-color: #e6b800;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 204, 0, 0.3);
}

.content-wrapper {
  display: flex;
  gap: 30px;
}

.sidebar {
  width: 280px;
  flex-shrink: 0;
}

.avatar-section {
  background-color: white;
  border-radius: 8px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  margin-bottom: 20px;
}

.avatar-container {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 20px;
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #ffcc00;
}

.upload-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 35px;
  height: 35px;
  background-color: #ffcc00;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  transition: transform 0.3s, background-color 0.3s;
}

.upload-btn:hover {
  transform: scale(1.1);
  background-color: #e6b800;
}

.upload-input {
  display: none;
}

.avatar-section h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #333;
}

.avatar-section p {
  margin: 0;
  font-size: 14px;
  color: #999;
}

.tab-nav {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.tab-item {
  padding: 15px 20px;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  border-bottom: 1px solid #f0f0f0;
}

.tab-item:last-child {
  border-bottom: none;
}

.tab-item:hover {
  background-color: #f9f9f9;
  color: #ffcc00;
}

.tab-item.active {
  background-color: #ffcc00;
  color: #1a1a1a;
  font-weight: bold;
}

.main-content {
  flex: 1;
}

.form-section {
  background-color: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.section-header h2 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.actions {
  display: flex;
  gap: 10px;
}

.edit-btn, .save-btn, .cancel-btn, .confirm-btn {
  padding: 8px 20px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.edit-btn, .save-btn {
  background-color: #ffcc00;
  color: #1a1a1a;
}

.edit-btn:hover, .save-btn:hover {
  background-color: #e6b800;
}

.cancel-btn {
  background-color: transparent;
  color: #666;
  border: 1px solid #ddd;
}

.cancel-btn:hover {
  background-color: #f5f5f5;
}

.confirm-btn {
  background-color: #ffcc00;
  color: #1a1a1a;
}

.confirm-btn:hover {
  background-color: #e6b800;
}

.info-form {
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

.form-group input:disabled {
  background-color: #f8f8f8;
  color: #999;
  cursor: not-allowed;
}

.readonly-input {
  background-color: #f8f8f8;
  color: #999;
}

.submit-btn {
  padding: 12px 20px;
  background-color: #ffcc00;
  color: #1a1a1a;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 10px;
}

.submit-btn:hover {
  background-color: #e6b800;
}

.confirm-modal-overlay {
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
}

.confirm-modal {
  background-color: white;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.confirm-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
  border-bottom: 1px solid #e0e0e0;
  background-color: #f8f8f8;
}

.confirm-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #999;
  cursor: pointer;
}

.confirm-body {
  padding: 30px 25px;
}

.confirm-body p {
  margin: 0;
  font-size: 15px;
  color: #333;
}

.confirm-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 15px 25px;
  border-top: 1px solid #e0e0e0;
  background-color: #fafafa;
}

/* 注销账号相关样式 */
.delete-section {
  border: 1px solid #ffcccc;
}

.delete-section .section-header h2 {
  color: #d32f2f;
}

.delete-warning {
  background-color: #fff5f5;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  text-align: center;
}

.warning-icon {
  font-size: 36px;
  margin-bottom: 10px;
}

.warning-text {
  color: #d32f2f;
  font-size: 14px;
  margin: 0;
  line-height: 1.5;
}

.delete-btn {
  width: 100%;
  padding: 12px 24px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.delete-btn:hover {
  background-color: #d32f2f;
}

/* 注销确认弹窗样式 */
.delete-modal .confirm-header {
  background-color: #fff5f5;
  border-bottom-color: #ffcccc;
}

.delete-modal .confirm-header h3 {
  color: #d32f2f;
}

.delete-body {
  text-align: center;
}

.delete-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.delete-title {
  font-size: 18px;
  font-weight: bold;
  color: #d32f2f;
  margin: 0 0 10px 0;
}

.delete-desc {
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.5;
}

.delete-confirm-btn {
  padding: 10px 24px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.delete-confirm-btn:hover {
  background-color: #d32f2f;
}

/* 找回密码相关样式 */
.reset-section .section-header h2 {
  color: #4caf50;
}

.reset-step {
  margin-top: 10px;
}

.step-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin: 0 0 20px 0;
  padding-bottom: 10px;
  border-bottom: 2px solid #4caf50;
}

.send-code-btn {
  width: 100%;
  padding: 12px 24px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.send-code-btn:hover:not(:disabled) {
  background-color: #388e3c;
}

.send-code-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.verify-form {
  margin-top: 20px;
}

.verify-code-input {
  display: flex;
  gap: 10px;
}

.verify-code-input input {
  flex: 1;
}

.verify-btn {
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
}

.verify-btn:hover {
  background-color: #388e3c;
}

.found-password-box {
  background-color: #e8f5e9;
  border: 2px solid #4caf50;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  text-align: center;
}

.found-label {
  font-size: 14px;
  color: #333;
  margin: 0 0 10px 0;
}

.found-password {
  font-size: 24px;
  font-weight: bold;
  color: #4caf50;
  margin: 0;
  font-family: monospace;
  letter-spacing: 2px;
}

.reset-btn {
  width: 100%;
  padding: 12px 24px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.reset-btn:hover {
  background-color: #388e3c;
}

/* 密码重置成功弹窗样式 */
.success-modal .confirm-header {
  background-color: #e8f5e9;
  border-bottom-color: #c8e6c9;
}

.success-modal .confirm-header h3 {
  color: #4caf50;
}

.success-body {
  text-align: center;
  padding: 30px 25px;
}

.success-icon {
  font-size: 64px;
  margin-bottom: 15px;
}

.success-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 0 0 10px 0;
}

.success-desc {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.success-btn {
  padding: 10px 32px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.success-btn:hover {
  background-color: #388e3c;
}

/* 返回顶部按钮 */
.back-to-top {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  background-color: #ffcc00;
  color: #fff;
  border: none;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s;
  z-index: 100;
}

.back-to-top:hover {
  background-color: #e6b800;
  transform: translateY(-3px);
}

/* 版权标识 */
.page-footer {
  text-align: center;
  padding: 40px 20px;
  background-color: #f5f5f5;
  border-top: 1px solid #e0e0e0;
  margin-top: 60px;
}

.page-footer p {
  margin: 0;
  font-size: 14px;
  color: #999;
}

@media (max-width: 768px) {
  .content-wrapper {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
  }
  
  .tab-nav {
    display: flex;
    flex-wrap: wrap;
  }
  
  .tab-item {
    flex: 1;
    text-align: center;
    border-bottom: none;
    border-right: 1px solid #f0f0f0;
  }
  
  .tab-item:last-child {
    border-right: none;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .login-prompt-content {
    padding: 40px 20px;
    margin: 0 20px;
  }
}
</style>
