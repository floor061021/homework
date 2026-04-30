<script setup>
import { useRouter } from 'vue-router'

defineProps({
  title: {
    type: String,
    default: '管理中心'
  },
  activeItem: {
    type: String,
    default: ''
  }
})

const router = useRouter()

const menuItems = [
  { value: 'home', label: '首页', icon: '🏠', path: '/admin' },
  { value: 'products', label: '商品管理', icon: '📦', path: '/admin/products' },
  { value: 'orders', label: '订单审核', icon: '📋', path: '/admin/orders' },
  { value: 'custom', label: '定制订单', icon: '🎨', path: '/admin/custom' },
  { value: 'report', label: '数据统计', icon: '📊', path: '/admin/report' },
  { value: 'settings', label: '系统设置', icon: '⚙️', path: '/admin/settings' }
]

const handleSelect = (item) => {
  if (item.path) {
    router.push(item.path)
  }
}
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <h2>{{ title }}</h2>
    </div>
    <nav class="sidebar-nav">
      <div
        v-for="item in menuItems"
        :key="item.value"
        :class="['nav-item', { active: activeItem === item.value }]"
        @click="handleSelect(item)"
      >
        <span class="nav-icon">{{ item.icon }}</span>
        <span class="nav-label">{{ item.label }}</span>
      </div>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 220px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 20px;
  flex-shrink: 0;
  height: fit-content;
}

.sidebar-header h2 {
  margin: 0 0 20px 0;
  font-size: 18px;
  color: #333;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;
}

.nav-item:hover {
  background-color: #f5f5f5;
}

.nav-item.active {
  background-color: #ffcc00;
  color: #1a1a1a;
  font-weight: bold;
}

.nav-icon {
  margin-right: 10px;
  font-size: 16px;
}

.nav-label {
  flex: 1;
}

@media (max-width: 768px) {
  .sidebar {
    width: 100%;
  }

  .sidebar-nav {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .nav-item {
    flex: 1;
    min-width: 100px;
    text-align: center;
    justify-content: center;
  }
}
</style>
