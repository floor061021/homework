import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useUserStore } from './user'

// 从 localStorage 加载订单数据
const loadOrdersFromStorage = () => {
  try {
    const saved = localStorage.getItem('campus_orders')
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (e) {
    console.error('Failed to load orders from storage:', e)
  }
  return null
}

// 保存订单数据到 localStorage
const saveOrdersToStorage = (data) => {
  try {
    localStorage.setItem('campus_orders', JSON.stringify(data))
  } catch (e) {
    console.error('Failed to save orders to storage:', e)
  }
}

// 生成唯一订单ID
const generateOrderId = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const random = String(Math.floor(Math.random() * 10000)).padStart(4, '0')
  return `ORD${year}${month}${day}${random}`
}

export const useOrdersStore = defineStore('orders', () => {
  // 从 localStorage 恢复数据
  const savedOrders = loadOrdersFromStorage()
  
  // 订单列表
  const orders = ref(savedOrders || [
    { id: 'ORD20241201001', customer: '张三', product: '连帽衫-定制款', amount: 199.00, status: 'pending', createTime: '2024-12-01 14:30:25', items: 2 },
    { id: 'ORD20241201002', customer: '李四', product: 'T恤-校园款', amount: 99.00, status: 'pending', createTime: '2024-12-01 15:45:12', items: 3 },
    { id: 'ORD20241201003', customer: '王五', product: '文化衫-毕业季', amount: 159.00, status: 'pending', createTime: '2024-12-01 16:20:08', items: 1 },
    { id: 'ORD20241201004', customer: '赵六', product: '卫衣-学院风', amount: 179.00, status: 'pending', createTime: '2024-12-01 17:15:33', items: 2 },
    { id: 'ORD20241201005', customer: '孙七', product: '棒球帽-校徽款', amount: 59.00, status: 'pending', createTime: '2024-12-01 18:00:45', items: 5 },
    { id: 'ORD20241202001', customer: '周八', product: '帆布包-定制', amount: 49.00, status: 'approved', createTime: '2024-12-02 09:30:15', items: 10 },
    { id: 'ORD20241202002', customer: '吴九', product: '笔记本-校园风', amount: 29.00, status: 'approved', createTime: '2024-12-02 10:15:22', items: 20 },
    { id: 'ORD20241202003', customer: '郑十', product: '钥匙扣-文创', amount: 19.00, status: 'rejected', createTime: '2024-12-02 11:00:00', items: 15 }
  ])

  // 监听订单变化，自动保存到 localStorage
  const saveOrders = () => {
    saveOrdersToStorage(orders.value)
  }

  // 统计数据
  const stats = computed(() => ({
    pending: orders.value.filter(o => o.status === 'pending').length,
    approved: orders.value.filter(o => o.status === 'approved').length,
    rejected: orders.value.filter(o => o.status === 'rejected').length,
    total: orders.value.length
  }))

  // 获取当前用户的订单（用户端使用）
  const currentUserOrders = computed(() => {
    const userStore = useUserStore()
    if (!userStore.isLoggedIn) return []
    return orders.value.filter(order => order.customer === userStore.userInfo.username)
  })

  // 审核通过
  const approveOrder = (orderId) => {
    const order = orders.value.find(o => o.id === orderId)
    if (order) {
      order.status = 'approved'
      saveOrders()
    }
  }

  // 拒绝订单
  const rejectOrder = (orderId, reason = '') => {
    const order = orders.value.find(o => o.id === orderId)
    if (order) {
      order.status = 'rejected'
      order.rejectReason = reason
      saveOrders()
    }
  }

  // 更新用户名（当用户修改用户名时，同步更新订单中的客户名）
  const updateCustomerName = (oldName, newName) => {
    orders.value.forEach(order => {
      if (order.customer === oldName) {
        order.customer = newName
      }
    })
    saveOrders()
  }

  // 添加新订单
  const addOrder = (orderData) => {
    const userStore = useUserStore()
    const newOrder = {
      id: generateOrderId(),
      customer: userStore.userInfo.username || '匿名用户',
      product: orderData.product,
      amount: orderData.amount,
      status: 'pending',
      createTime: new Date().toLocaleString('zh-CN'),
      items: orderData.items || 1
    }
    orders.value.unshift(newOrder)
    saveOrders()
    return newOrder
  }

  // 获取订单状态文本
  const getStatusText = (status) => {
    const texts = {
      pending: '待审核',
      approved: '已通过',
      rejected: '已拒绝',
      pending_payment: '待付款',
      pending_shipping: '待发货',
      pending_receipt: '待收货',
      completed: '已完成'
    }
    return texts[status] || status
  }

  // 获取订单状态样式类
  const getStatusClass = (status) => {
    const classes = {
      pending: 'status-pending',
      approved: 'status-approved',
      rejected: 'status-rejected',
      pending_payment: 'status-pending',
      pending_shipping: 'status-pending',
      pending_receipt: 'status-warning',
      completed: 'status-success'
    }
    return classes[status] || ''
  }

  // 将审核状态转换为用户端状态
  const convertStatusForCustomer = (status) => {
    const conversions = {
      pending: 'pending_payment',
      approved: 'pending_shipping',
      rejected: 'completed'
    }
    return conversions[status] || status
  }

  return {
    orders,
    stats,
    currentUserOrders,
    approveOrder,
    rejectOrder,
    updateCustomerName,
    addOrder,
    saveOrders,
    getStatusText,
    getStatusClass,
    convertStatusForCustomer
  }
})