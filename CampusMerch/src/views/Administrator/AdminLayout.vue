<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import HeaderManager from '../../components/headerManager.vue'
import AdministratorManage from '../../components/AdministratorManage.vue'

const route = useRoute()

const currentActive = computed(() => {
  const path = route.path
  if (path === '/admin') return 'home'
  if (path.includes('/admin/products')) return 'products'
  if (path.includes('/admin/orders')) return 'orders'
  if (path.includes('/admin/custom')) return 'custom'
  if (path.includes('/admin/report')) return 'report'
  if (path.includes('/admin/settings')) return 'settings'
  return 'home'
})
</script>

<template>
  <div class="admin-layout">
    <!-- 顶部导航 -->
    <HeaderManager />
    
    <!-- 主内容区 -->
    <div class="admin-container">
      <!-- 侧边栏 -->
      <AdministratorManage :active-item="currentActive" />
      
      <!-- 内容区域 -->
      <main class="main-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style scoped>
.admin-layout {
  min-height: 100vh;
  background-color: #f5f5f5;
  width: 100%;
}

.admin-container {
  display: flex;
  gap: 20px;
  padding: 20px;
  width: calc(100% - 40px);
}

.main-content {
  flex: 1;
  min-height: calc(100vh - 120px);
}
</style>
