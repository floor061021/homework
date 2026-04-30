import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  // 用户登录状态
  const isLoggedIn = ref(false)
  
  // 用户信息
  const userInfo = ref({
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
