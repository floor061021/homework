import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

// 从 localStorage 加载用户数据
const loadUserFromStorage = () => {
  try {
    const saved = localStorage.getItem('campus_user')
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (e) {
    console.error('Failed to load user from storage:', e)
  }
  return null
}

// 保存用户数据到 localStorage
const saveUserToStorage = (data) => {
  try {
    localStorage.setItem('campus_user', JSON.stringify(data))
  } catch (e) {
    console.error('Failed to save user to storage:', e)
  }
}

export const useUserStore = defineStore('user', () => {
  // 从 localStorage 恢复数据
  const savedUser = loadUserFromStorage()
  
  // 用户登录状态
  const isLoggedIn = ref(savedUser?.isLoggedIn || false)
  
  // 用户信息
  const userInfo = ref(savedUser?.userInfo || {
    username: '',
    avatar: '',
    email: ''
  })
  
  // 登录弹窗显示状态
  const showLoginModal = ref(false)
  
  // 退出确认弹窗显示状态
  const showLogoutConfirm = ref(false)
  
  // 用户头像下拉菜单显示状态
  const showAvatarMenu = ref(false)
  
  // 搜索关键字
  const searchKeyword = ref('')

  // 登录
  function login(username, password) {
    // 模拟登录
    isLoggedIn.value = true
    userInfo.value = {
      username: username || '校园用户',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + (username || 'user'),
      email: 'user@campus.com'
    }
    showLoginModal.value = false
  }

  // 退出登录
  function logout() {
    isLoggedIn.value = false
    userInfo.value = {
      username: '',
      avatar: '',
      email: ''
    }
    showLogoutConfirm.value = false
    showAvatarMenu.value = false
  }

  // 打开登录弹窗
  function openLoginModal() {
    showLoginModal.value = true
  }

  // 关闭登录弹窗
  function closeLoginModal() {
    showLoginModal.value = false
  }

  // 打开退出确认弹窗
  function openLogoutConfirm() {
    showLogoutConfirm.value = true
  }

  // 关闭退出确认弹窗
  function closeLogoutConfirm() {
    showLogoutConfirm.value = false
  }

  // 切换头像菜单显示
  function toggleAvatarMenu() {
    showAvatarMenu.value = !showAvatarMenu.value
  }

  // 关闭头像菜单
  function closeAvatarMenu() {
    showAvatarMenu.value = false
  }

  // 更新用户信息
  function updateUserInfo(info) {
    // 如果更新了用户名，需要同步更新订单中的客户名
    if (info.username && info.username !== userInfo.value.username) {
      const oldName = userInfo.value.username
      // 动态导入避免循环依赖
      import('./orders').then(({ useOrdersStore }) => {
        const ordersStore = useOrdersStore()
        ordersStore.updateCustomerName(oldName, info.username)
      })
    }
    userInfo.value = { ...userInfo.value, ...info }
  }
  
  // 设置搜索关键字
  function setSearchKeyword(keyword) {
    searchKeyword.value = keyword
  }
  
  // 清除搜索关键字
  function clearSearchKeyword() {
    searchKeyword.value = ''
  }
  
  // 监听用户状态变化，自动保存到 localStorage
  watch([isLoggedIn, userInfo], () => {
    saveUserToStorage({
      isLoggedIn: isLoggedIn.value,
      userInfo: userInfo.value
    })
  }, { deep: true })

  return {
    isLoggedIn,
    userInfo,
    showLoginModal,
    showLogoutConfirm,
    showAvatarMenu,
    searchKeyword,
    login,
    logout,
    openLoginModal,
    closeLoginModal,
    openLogoutConfirm,
    closeLogoutConfirm,
    toggleAvatarMenu,
    closeAvatarMenu,
    updateUserInfo,
    setSearchKeyword,
    clearSearchKeyword
  }
})
