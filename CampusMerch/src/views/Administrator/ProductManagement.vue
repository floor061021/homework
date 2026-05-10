<script setup>
import { ref, computed } from 'vue'
import { products, updateProductStatus, deleteProduct, addProduct, categories, getCategoryOptions, getProductStatusOptions, addCategory, removeCategory } from '@/data/products.js'

// 当前激活的标签页
const activeTab = ref('products')

// 当前选中的订单类型（普通订单/定制订单）
const orderType = ref('normal')

// 商品状态选项（从共享数据获取）
const productStatusOptions = computed(() => getProductStatusOptions())

// 订单状态选项
const orderStatusOptions = [
  { value: 'all', label: '全部订单' },
  { value: 'pending_review', label: '待审核' },
  { value: 'approved', label: '已审核' },
  { value: 'shipped', label: '已发货' },
  { value: 'completed', label: '已完成' },
  { value: 'cancelled', label: '已取消' }
]

// 定制订单状态选项
const customOrderStatusOptions = [
  { value: 'all', label: '全部定制' },
  { value: 'pending', label: '待处理' },
  { value: 'producing', label: '制作中' },
  { value: 'completed', label: '已完成' },
  { value: 'cancelled', label: '已取消' }
]

// 当前选中的商品状态
const productStatus = ref('all')

// 消息提示
const toastMessage = ref('')
const toastVisible = ref(false)
const toastType = ref('success') // success, error, info

const showToast = (message, type = 'success', duration = 1000) => {
  toastMessage.value = message
  toastType.value = type
  toastVisible.value = true
  setTimeout(() => {
    toastVisible.value = false
  }, duration)
}

// 当前选中的商品分类
const selectedCategory = ref('all')

// 分类导航栏折叠状态
const categoryNavCollapsed = ref(false)

// 分类搜索关键词
const categorySearchText = ref('')

// 分类选项（从共享数据获取）
const categoryOptionsNew = computed(() => getCategoryOptions())

// 过滤后的分类选项（用于导航栏）
const filteredCategoryNav = computed(() => {
  const allOptions = categoryOptionsNew.value
  if (!categorySearchText.value) {
    return allOptions
  }
  // 搜索时，"全部"选项始终保留在第一位
  const filtered = allOptions.filter(opt => 
    opt.value === 'all' || 
    opt.label.toLowerCase().includes(categorySearchText.value.toLowerCase())
  )
  return filtered
})

// 当前选中的订单状态
const orderStatus = ref('all')

// 当前选中的定制订单状态
const customOrderStatus = ref('all')

// 订单列表数据
const orders = ref([
  {
    id: 'ORD20240115001',
    customer: '张三',
    totalPrice: 398,
    status: 'pending_review',
    createTime: '2024-01-15 14:30:00',
    items: '连帽衫 x2'
  },
  {
    id: 'ORD20240114002',
    customer: '李四',
    totalPrice: 99,
    status: 'approved',
    createTime: '2024-01-14 10:20:00',
    items: 'T恤 x1'
  },
  {
    id: 'ORD20240113003',
    customer: '王五',
    totalPrice: 59,
    status: 'shipped',
    createTime: '2024-01-13 16:45:00',
    items: '帽子 x1'
  },
  {
    id: 'ORD20240112004',
    customer: '赵六',
    totalPrice: 159,
    status: 'completed',
    createTime: '2024-01-12 09:15:00',
    items: '卫衣 x1'
  },
  {
    id: 'ORD20240111005',
    customer: '钱七',
    totalPrice: 499,
    status: 'pending_review',
    createTime: '2024-01-11 20:00:00',
    items: '连帽衫 x2, 帽子 x2'
  }
])

// 定制订单列表数据
const customOrders = ref([
  {
    id: 'CUS20240116001',
    customer: '小明',
    totalPrice: 599,
    status: 'producing',
    createTime: '2024-01-16 09:00:00',
    customInfo: '定制图案：校园LOGO',
    progress: [
      { time: '2024-01-16 09:00:00', status: 'created', desc: '客户小明创建了订单，制作中' }
    ]
  },
  {
    id: 'CUS20240115002',
    customer: '小红',
    totalPrice: 799,
    status: 'pending',
    createTime: '2024-01-15 14:30:00',
    customInfo: '定制图案：班级徽章',
    progress: [
      { time: '2024-01-15 14:30:00', status: 'created', desc: '客户小红创建了订单，待处理' }
    ]
  },
  {
    id: 'CUS20240114003',
    customer: '小刚',
    totalPrice: 459,
    status: 'completed',
    createTime: '2024-01-14 10:00:00',
    customInfo: '定制图案：运动会标志',
    progress: [
      { time: '2024-01-14 10:00:00', status: 'created', desc: '客户小刚创建了订单，制作中' },
      { time: '2024-01-16 11:00:00', status: 'completed', desc: '制作已完成，已完成' }
    ]
  },
  {
    id: 'CUS20240113004',
    customer: '小丽',
    totalPrice: 399,
    status: 'cancelled',
    createTime: '2024-01-13 16:00:00',
    customInfo: '定制图案：社团LOGO',
    progress: [
      { time: '2024-01-13 16:00:00', status: 'created', desc: '客户小丽创建了订单，制作中' },
      { time: '2024-01-14 09:00:00', status: 'cancelled', desc: '客户取消订单，已取消' }
    ]
  }
])

// 过滤后的商品列表
const filteredProducts = computed(() => {
  let result = products.value
  
  // 状态过滤
  if (productStatus.value === 'all') {
    // "全部"状态不显示已下架商品，下架商品只能在"下架"状态中查看
    result = result.filter(p => p.status !== 'inactive')
  } else if (productStatus.value === 'inactive') {
    // "下架"状态只显示已下架商品
    result = result.filter(p => p.status === 'inactive')
  } else {
    result = result.filter(p => p.status === productStatus.value)
  }
  
  // 分类过滤
  if (selectedCategory.value !== 'all') {
    result = result.filter(p => p.category === selectedCategory.value)
  }
  
  return result
})

// 过滤后的订单列表
const filteredOrders = computed(() => {
  if (orderStatus.value === 'all') {
    return orders.value
  }
  return orders.value.filter(o => o.status === orderStatus.value)
})

// 过滤后的定制订单列表
const filteredCustomOrders = computed(() => {
  if (customOrderStatus.value === 'all') {
    return customOrders.value
  }
  return customOrders.value.filter(o => o.status === customOrderStatus.value)
})

// 获取商品状态样式
const getProductStatusStyle = (status) => {
  const styles = {
    draft: { text: '草稿', class: 'status-draft' },
    active: { text: '上架', class: 'status-active' },
    inactive: { text: '下架', class: 'status-inactive' }
  }
  return styles[status] || { text: '未知', class: 'status-unknown' }
}

// 获取订单状态样式
const getOrderStatusStyle = (status) => {
  const styles = {
    pending_review: { text: '待审核', class: 'order-pending' },
    approved: { text: '已审核', class: 'order-approved' },
    shipped: { text: '已发货', class: 'order-shipped' },
    completed: { text: '已完成', class: 'order-completed' },
    cancelled: { text: '已取消', class: 'order-cancelled' }
  }
  return styles[status] || { text: '未知', class: 'order-unknown' }
}

// 获取定制订单状态样式（状态机处理）
const getCustomOrderStatusStyle = (status) => {
  const styles = {
    pending: { text: '待处理', class: 'custom-pending' },
    producing: { text: '制作中', class: 'custom-producing' },
    completed: { text: '已完成', class: 'custom-completed' },
    cancelled: { text: '已取消', class: 'custom-cancelled' }
  }
  return styles[status] || { text: '未知', class: 'custom-unknown' }
}

// 获取进度状态的圆点颜色样式
const getProgressDotClass = (status) => {
  const styles = {
    created: 'progress-dot-orange',
    producing: 'progress-dot-orange',
    completed: 'progress-dot-green',
    cancelled: 'progress-dot-grey'
  }
  return styles[status] || 'progress-dot-grey'
}

// 商品状态机
const productStateMachine = {
  draft: {
    transitions: { publish: 'active', delete: 'deleted' }
  },
  active: {
    transitions: { unpublish: 'inactive', edit: 'active' }
  },
  inactive: {
    transitions: { publish: 'active', delete: 'deleted' }
  }
}

// 订单状态机
const orderStateMachine = {
  pending_review: {
    transitions: { approve: 'approved', reject: 'cancelled' }
  },
  approved: {
    transitions: { ship: 'shipped' }
  },
  shipped: {
    transitions: { complete: 'completed' }
  },
  completed: {
    transitions: {}
  },
  cancelled: {
    transitions: {}
  }
}

// 定制订单状态机
const customOrderStateMachine = {
  pending: {
    transitions: { start: 'producing', cancel: 'cancelled' }
  },
  producing: {
    transitions: { complete: 'completed', cancel: 'cancelled' }
  },
  completed: {
    transitions: {}
  },
  cancelled: {
    transitions: {}
  }
}

// 操作商品
const handleProductAction = (action, product) => {
  const currentState = product.status
  
  switch (action) {
    case 'edit':
      showToast(`编辑商品: ${product.name}`, 'info')
      break
    case 'toggle':
      // 上架/下架操作：草稿状态可以直接上架，上架状态可以下架，下架状态可以重新上架
      if (currentState === 'draft' || currentState === 'active' || currentState === 'inactive') {
        const targetState = currentState === 'active' ? 'inactive' : 'active'
        const actionText = currentState === 'active' ? '下架' : '上架'
        
        // 使用自定义弹窗
        openConfirmModal(
          `${actionText}确认`,
          `确定要${actionText}商品 "${product.name}" 吗？`,
          () => {
            // 确认回调：更新商品状态
            updateProductStatus(product.id, targetState)
            showToast(`商品 "${product.name}" 已${actionText}！`, 'success')
          },
          'toggle',
          product
        )
      } else {
        showToast(`无法执行此操作: ${action}`, 'error')
      }
      break
    case 'delete':
      // 使用自定义弹窗
      openConfirmModal(
        '删除确认',
        `确定要删除商品 "${product.name}" 吗？此操作不可恢复。`,
        () => {
          // 确认回调：删除商品
          deleteProduct(product.id)
          showToast(`商品 "${product.name}" 已删除！`, 'success')
        },
        'delete',
        product
      )
      break
    default:
      // 其他操作使用状态机检查
      const machine = productStateMachine[currentState]
      if (!machine || !machine.transitions[action]) {
        showToast(`无法执行此操作: ${action}`, 'error')
        return
      }
  }
}

// 审核订单
const handleOrderReview = (orderId, approve) => {
  const order = orders.value.find(o => o.id === orderId)
  if (!order) return

  const action = approve ? 'approve' : 'reject'
  const machine = orderStateMachine[order.status]
  
  if (!machine || !machine.transitions[action]) {
    showToast(`无法执行此操作`, 'error')
    return
  }

  if (approve) {
    order.status = 'approved'
    showToast(`订单 ${orderId} 已审核通过`, 'success')
  } else {
    order.status = 'cancelled'
    showToast(`订单 ${orderId} 已拒绝`, 'error')
  }
}

// 发货
const handleShipOrder = (orderId) => {
  const order = orders.value.find(o => o.id === orderId)
  if (!order) return

  const machine = orderStateMachine[order.status]
  
  if (!machine || !machine.transitions['ship']) {
    showToast(`无法执行发货操作`, 'error')
    return
  }

  if (order.status === 'approved') {
    order.status = 'shipped'
    showToast(`订单 ${orderId} 已发货`, 'success')
  }
}

// 查看定制订单详情
const viewCustomOrder = (order) => {
  showToast(`查看定制订单详情: ${order.id}`, 'info')
}

// 编辑定制订单
const editCustomOrder = (order) => {
  showToast(`编辑定制订单: ${order.id}`, 'info')
}

// 取消定制订单
const cancelCustomOrder = (orderId) => {
  const order = customOrders.value.find(o => o.id === orderId)
  if (!order) return

  const machine = customOrderStateMachine[order.status]
  
  if (!machine || !machine.transitions['cancel']) {
    showToast(`无法取消此订单`, 'error')
    return
  }

  order.status = 'cancelled'
  order.progress.push({
    time: new Date().toLocaleString(),
    status: 'cancelled',
    desc: '客户取消订单，已取消'
  })
  showToast(`定制订单 ${orderId} 已取消`, 'success')
}

// 完成定制订单
const completeCustomOrder = (orderId) => {
  const order = customOrders.value.find(o => o.id === orderId)
  if (!order) return

  const machine = customOrderStateMachine[order.status]
  
  if (!machine || !machine.transitions['complete']) {
    showToast(`无法完成此订单`, 'error')
    return
  }

  order.status = 'completed'
  order.progress.push({
    time: new Date().toLocaleString(),
    status: 'completed',
    desc: '制作已完成，已完成'
  })
  showToast(`定制订单 ${orderId} 已完成`, 'success')
}

// 开始制作定制订单
const startCustomOrder = (orderId) => {
  const order = customOrders.value.find(o => o.id === orderId)
  if (!order) return

  const machine = customOrderStateMachine[order.status]
  
  if (!machine || !machine.transitions['start']) {
    showToast(`无法开始制作此订单`, 'error')
    return
  }

  order.status = 'producing'
  order.progress[0].desc = order.progress[0].desc.replace('待处理', '制作中')
  showToast(`定制订单 ${orderId} 已开始制作`, 'success')
}

// 显示进度跟踪弹窗
const showProgressModal = ref(false)
const currentOrderProgress = ref(null)

const openProgressTrack = (order) => {
  currentOrderProgress.value = order
  showProgressModal.value = true
}

const closeProgressModal = () => {
  showProgressModal.value = false
  currentOrderProgress.value = null
}

// 确认弹窗状态
const showConfirmModal = ref(false)
const confirmModalTitle = ref('')
const confirmModalMessage = ref('')
const confirmModalCallback = ref(null)
const confirmModalType = ref('') // 'toggle', 'delete'
const confirmModalProduct = ref(null)

const openConfirmModal = (title, message, callback, type, product = null) => {
  confirmModalTitle.value = title
  confirmModalMessage.value = message
  confirmModalCallback.value = callback
  confirmModalType.value = type
  confirmModalProduct.value = product
  showConfirmModal.value = true
}

const closeConfirmModal = () => {
  showConfirmModal.value = false
  confirmModalCallback.value = null
  confirmModalProduct.value = null
}

const handleConfirm = () => {
  if (confirmModalCallback.value) {
    confirmModalCallback.value()
  }
  closeConfirmModal()
}

// 商品添加弹窗
const showAddProductModal = ref(false)
const showCategorySelectModal = ref(false) // 先显示分类选择弹窗
const newProductCategory = ref('') // 用于添加商品时选择的分类
const imageUploadRef = ref(null) // 图片上传input引用

// 商品编辑弹窗
const showEditProductModal = ref(false)
const editingProduct = ref(null)

const openAddProductModal = () => {
  showCategorySelectModal.value = true // 先显示分类选择
}

const openEditProductModal = (product) => {
  editingProduct.value = { 
    ...product, 
    code: product.id,
    colors: product.colors || [],
    sizes: product.sizes || []
  }
  showEditProductModal.value = true
}

const closeEditProductModal = () => {
  showEditProductModal.value = false
  editingProduct.value = null
}

// 更新商品信息
const updateProduct = () => {
  if (!editingProduct.value) return

  // 验证尺码库存总和是否等于商品库存
  const stockTotal = parseInt(editingProduct.value.stock) || 0
  const sizesTotal = editingProductSizesTotal.value
  if (editingProduct.value.sizes.length > 0 && !validateStockMatch(editingProduct.value.stock, sizesTotal)) {
    showToast(`库存验证失败！商品库存设置为 ${stockTotal}，但所有尺码库存总和为 ${sizesTotal}。请确保每个尺码的库存数量之和等于商品库存总量。`, 'error', 2000)
    return
  }
  
  const index = products.value.findIndex(p => p.id === editingProduct.value.id)
  if (index !== -1) {
    products.value[index] = { ...editingProduct.value }
    showToast(`商品 "${editingProduct.value.name}" 已更新！`, 'success')
    closeEditProductModal()
  }
}

// 颜色选择器相关状态
const showColorPicker = ref(false)
const selectedColorIndex = ref(-1)
const customColorHex = ref('#000000')
const colorPickerPosition = ref({ x: 0, y: 0 })

// 预设颜色
const presetColors = [
  '#000000', '#ffffff', '#808080', '#ff0000', '#ff6b6b', '#ffa500', '#ffcc00', '#4caf50',
  '#00bcd4', '#2196f3', '#3f51b5', '#9c27b0', '#e91e63', '#f44336', '#ff4081', '#795548'
]

// 关闭颜色选择器
const closeColorPicker = () => {
  showColorPicker.value = false
  selectedColorIndex.value = -1
}

// 选择预设颜色
const selectPresetColor = (hex) => {
  customColorHex.value = hex
}

// 应用颜色（编辑商品弹窗）
const applyColor = () => {
  if (!editingProduct.value) return
  
  const colorName = getColorName(customColorHex.value)
  
  if (selectedColorIndex.value >= 0) {
    // 编辑现有颜色
    editingProduct.value.colors[selectedColorIndex.value] = {
      id: `color_${Date.now()}`,
      name: colorName,
      hex: customColorHex.value
    }
  } else {
    // 添加新颜色
    editingProduct.value.colors.push({
      id: `color_${Date.now()}`,
      name: colorName,
      hex: customColorHex.value
    })
  }
  
  closeColorPicker()
}

// 判断当前是添加还是编辑模式
const isAddingProduct = ref(false)

// 打开颜色选择器（编辑商品）
const openColorPicker = (index, event) => {
  isAddingProduct.value = false
  selectedColorIndex.value = index
  const rect = event.target.getBoundingClientRect()
  colorPickerPosition.value = {
    x: rect.left,
    y: rect.bottom + 5
  }
  showColorPicker.value = true
  
  if (index >= 0 && editingProduct.value && editingProduct.value.colors[index]) {
    customColorHex.value = editingProduct.value.colors[index].hex
  } else {
    customColorHex.value = '#000000'
  }
}

// 添加商品弹窗 - 打开颜色选择器
const openColorPickerForAdd = (index, event) => {
  isAddingProduct.value = true
  selectedColorIndex.value = index
  const rect = event.target.getBoundingClientRect()
  colorPickerPosition.value = {
    x: rect.left,
    y: rect.bottom + 5
  }
  showColorPicker.value = true
  
  if (index >= 0 && newProduct.value.colors[index]) {
    customColorHex.value = newProduct.value.colors[index].hex
  } else {
    customColorHex.value = '#000000'
  }
}

// 添加商品弹窗 - 应用颜色
const applyColorForAdd = () => {
  const colorName = getColorName(customColorHex.value)
  
  if (selectedColorIndex.value >= 0) {
    // 编辑现有颜色
    newProduct.value.colors[selectedColorIndex.value] = {
      id: `color_${Date.now()}`,
      name: colorName,
      hex: customColorHex.value
    }
  } else {
    // 添加新颜色
    newProduct.value.colors.push({
      id: `color_${Date.now()}`,
      name: colorName,
      hex: customColorHex.value
    })
  }
  
  closeColorPicker()
}

// 确认颜色选择（根据模式调用不同方法）
const confirmColorSelection = () => {
  if (isAddingProduct.value) {
    applyColorForAdd()
  } else {
    applyColor()
  }
}

// 获取颜色名称
const getColorName = (hex) => {
  const colorNames = {
    '#000000': '黑色', '#ffffff': '白色', '#808080': '灰色',
    '#ff0000': '红色', '#ff6b6b': '珊瑚红', '#ffa500': '橙色',
    '#ffcc00': '黄色', '#4caf50': '绿色', '#00bcd4': '青色',
    '#2196f3': '蓝色', '#3f51b5': '靛蓝', '#9c27b0': '紫色',
    '#e91e63': '粉色', '#f44336': '玫红', '#ff4081': '洋红',
    '#795548': '棕色'
  }
  return colorNames[hex] || '自定义颜色'
}

// 删除颜色
const removeColor = (index) => {
  if (!editingProduct.value) return
  editingProduct.value.colors.splice(index, 1)
}



// 添加商品弹窗 - 删除颜色
const removeColorFromAdd = (index) => {
  newProduct.value.colors.splice(index, 1)
}

// 添加商品弹窗 - 删除尺码
const removeSizeFromAdd = (index) => {
  newProduct.value.sizes.splice(index, 1)
}

// 根据分类自动生成尺码
const autoGenerateSizes = () => {
  const category = newProduct.value.category
  const sizeTemplates = {
    '上衣': [
      { id: 's', name: 'S', stock: 20 },
      { id: 'm', name: 'M', stock: 40 },
      { id: 'l', name: 'L', stock: 40 },
      { id: 'xl', name: 'XL', stock: 30 },
      { id: 'xxl', name: 'XXL', stock: 20 }
    ],
    '裤子': [
      { id: '28', name: '28码', stock: 12 },
      { id: '30', name: '30码', stock: 16 },
      { id: '32', name: '32码', stock: 16 },
      { id: '34', name: '34码', stock: 12 },
      { id: '36', name: '36码', stock: 8 }
    ],
    '帽子': [
      { id: 's', name: 'S (54-56cm)', stock: 40 },
      { id: 'm', name: 'M (56-58cm)', stock: 50 },
      { id: 'l', name: 'L (58-60cm)', stock: 40 }
    ],
    '其他': [
      { id: 's', name: '小号', stock: 50 },
      { id: 'm', name: '中号', stock: 60 },
      { id: 'l', name: '大号', stock: 50 }
    ]
  }
  
  if (sizeTemplates[category]) {
    newProduct.value.sizes = sizeTemplates[category].map(s => ({ ...s, id: `size_${Date.now()}_${s.id}` }))
  }
}

// 尺码相关状态
const showSizeManager = ref(false)
const selectedSizeIndex = ref(-1)

// 根据商品类别生成默认尺码
const generateDefaultSizes = (category) => {
  const sizeTemplates = {
    '衣服': [
      { id: 's', name: 'S', stock: 10 },
      { id: 'm', name: 'M', stock: 20 },
      { id: 'l', name: 'L', stock: 20 },
      { id: 'xl', name: 'XL', stock: 15 },
      { id: 'xxl', name: 'XXL', stock: 10 }
    ],
    '帽子': [
      { id: 's', name: 'S (54-56cm)', stock: 15 },
      { id: 'm', name: 'M (56-58cm)', stock: 20 },
      { id: 'l', name: 'L (58-60cm)', stock: 15 }
    ],
    '裤子': [
      { id: '28', name: '28码', stock: 15 },
      { id: '30', name: '30码', stock: 20 },
      { id: '32', name: '32码', stock: 20 },
      { id: '34', name: '34码', stock: 15 },
      { id: '36', name: '36码', stock: 10 }
    ],
    '帆布包': [
      { id: 's', name: '小号', stock: 20 },
      { id: 'm', name: '中号', stock: 25 },
      { id: 'l', name: '大号', stock: 20 }
    ],
    '徽章': [],
    '其他': []
  }
  
  return sizeTemplates[category] || []
}

// 添加尺码
const addSize = () => {
  if (!editingProduct.value) return
  
  const newSize = {
    id: `size_${Date.now()}`,
    name: '新尺码',
    stock: 10
  }
  
  if (selectedSizeIndex.value >= 0) {
    editingProduct.value.sizes[selectedSizeIndex.value] = { ...newSize, ...editingProduct.value.sizes[selectedSizeIndex.value] }
  } else {
    editingProduct.value.sizes.push(newSize)
  }
  
  showSizeManager.value = false
  selectedSizeIndex.value = -1
}

// 编辑尺码
const editSize = (index) => {
  selectedSizeIndex.value = index
  showSizeManager.value = true
}

// 删除尺码
const removeSize = (index) => {
  if (!editingProduct.value) return
  editingProduct.value.sizes.splice(index, 1)
}

// 关闭尺码管理器
const closeSizeManager = () => {
  showSizeManager.value = false
  selectedSizeIndex.value = -1
}

const closeAddProductModal = () => {
  showAddProductModal.value = false
  resetProductForm()
}

// 图片上传相关方法
const triggerImageUpload = () => {
  imageUploadRef.value?.click()
}

const handleImageUpload = (event) => {
  const file = event.target.files?.[0]
  if (!file) return
  
  // 检查文件类型
  if (!file.type.startsWith('image/')) {
    showToast('请选择图片文件', 'error')
    return
  }
  
  // 检查文件大小（5MB）
  if (file.size > 5 * 1024 * 1024) {
    showToast('图片大小不能超过5MB', 'error')
    return
  }
  
  // 读取文件并显示预览
  const reader = new FileReader()
  reader.onload = (e) => {
    newProduct.value.image = e.target?.result
  }
  reader.readAsDataURL(file)
}

const removeImage = () => {
  newProduct.value.image = ''
  if (imageUploadRef.value) {
    imageUploadRef.value.value = ''
  }
}

const closeCategorySelectModal = () => {
  showCategorySelectModal.value = false
  newProductCategory.value = ''
}

// 选择分类后打开商品添加弹窗
const selectCategory = (category) => {
  newProductCategory.value = category
  newProduct.value.category = category
  showCategorySelectModal.value = false
  showAddProductModal.value = true
}

// 更改分类弹窗
const showAddCategoryModal = ref(false)
const newCategoryName = ref('')
const searchCategory = ref('')
const expandedCategories = ref(true)

// 过滤后的分类列表
const filteredCategories = computed(() => {
  if (!searchCategory.value) {
    return categories.value
  }
  return categories.value.filter(c => c.includes(searchCategory.value))
})

const openAddCategoryModal = () => {
  showAddCategoryModal.value = true
  newCategoryName.value = ''
  searchCategory.value = ''
}

const closeAddCategoryModal = () => {
  showAddCategoryModal.value = false
  newCategoryName.value = ''
  searchCategory.value = ''
}

const confirmAddCategory = () => {
  if (!newCategoryName.value.trim()) {
    showToast('请输入分类名称', 'error')
    return
  }
  
  const success = addCategory(newCategoryName.value.trim())
  if (success) {
    showToast('分类添加成功', 'success')
    newCategoryName.value = ''
  } else {
    showToast('分类已存在', 'error')
  }
}

const confirmDeleteCategory = (categoryName) => {
  const hasProducts = products.value.some(p => p.category === categoryName)
  if (hasProducts) {
    showToast(`无法删除分类 "${categoryName}"，该分类下存在商品。`, 'error')
    return
  }
  
  openConfirmModal(
    '删除确认',
    `确定要删除分类 "${categoryName}" 吗？此操作不可恢复。`,
    () => {
      const success = removeCategory(categoryName)
      if (success) {
        showToast(`分类 "${categoryName}" 已删除！`, 'success')
      }
    },
    'delete'
  )
}

// 商品表单数据
const newProduct = ref({
  name: '',
  code: '',
  description: '',
  price: '',
  stock: '',
  category: '',
  image: '',
  coverImage: '',
  allowCustom: false,
  status: 'draft',
  colors: [],
  sizes: [],
  // 服饰类属性
  size: '',
  color: '',
  material: '',
  fitType: '',
  collarType: '',
  sleeveLength: '',
  season: '',
  targetAudience: '',
  // 裤子专属属性
  pantLength: '',
  // 箱包类属性
  style: '',
  capacity: '',
  // 文具类属性
  brand: '',
  specification: '',
  suitableAge: '',
  // 饰品类属性
  gender: '',
  occasion: ''
})

// 计算添加商品时尺码库存总和
const newProductSizesTotal = computed(() => {
  return newProduct.value.sizes.reduce((sum, size) => sum + (parseInt(size.stock) || 0), 0)
})

// 计算编辑商品时尺码库存总和
const editingProductSizesTotal = computed(() => {
  if (!editingProduct.value) return 0
  return editingProduct.value.sizes.reduce((sum, size) => sum + (parseInt(size.stock) || 0), 0)
})

// 验证库存总和是否匹配
const validateStockMatch = (productStock, sizesTotal) => {
  const totalStock = parseInt(productStock) || 0
  return totalStock === sizesTotal
}

// 分类属性配置（与数据文件中的分类对应）
const categoryAttributes = {
  '上衣': [
    { key: 'size', label: '尺码', type: 'select', options: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'] },
    { key: 'color', label: '颜色', type: 'select', options: ['白色', '黑色', '灰色', '蓝色', '红色', '黄色', '绿色', '粉色', '橙色', '紫色'] },
    { key: 'material', label: '材质', type: 'select', options: ['纯棉', '涤纶', '棉混纺', '针织', '羊毛', '加绒', '冰丝', '竹纤维'] },
    { key: 'fitType', label: '版型', type: 'select', options: ['修身', '宽松', '合身', '紧身', 'oversize'] },
    { key: 'collarType', label: '领型', type: 'select', options: ['圆领', 'V领', '翻领', '高领', '连帽', '半高领', 'POLO领'] },
    { key: 'sleeveLength', label: '袖长', type: 'select', options: ['短袖', '长袖', '七分袖', '五分袖', '无袖'] },
    { key: 'season', label: '适用季节', type: 'select', options: ['春', '夏', '秋', '冬', '四季'] },
    { key: 'targetAudience', label: '适用人群', type: 'select', options: ['男', '女', '中性', '儿童'] }
  ],
  '裤子': [
    { key: 'size', label: '尺码', type: 'select', options: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'] },
    { key: 'color', label: '颜色', type: 'select', options: ['黑色', '白色', '灰色', '蓝色', '卡其', '棕色', '军绿'] },
    { key: 'material', label: '材质', type: 'select', options: ['纯棉', '涤纶', '牛仔布', '运动面料', '灯芯绒'] },
    { key: 'fitType', label: '版型', type: 'select', options: ['修身', '宽松', '直筒', '阔腿', '紧身'] },
    { key: 'pantLength', label: '裤长', type: 'select', options: ['九分裤', '长裤', '七分裤', '短裤'] },
    { key: 'season', label: '适用季节', type: 'select', options: ['春', '夏', '秋', '冬', '四季'] },
    { key: 'targetAudience', label: '适用人群', type: 'select', options: ['男', '女', '中性', '儿童'] }
  ],
  '帽子': [
    { key: 'size', label: '尺码', type: 'select', options: ['均码', 'S', 'M', 'L', 'XL'] },
    { key: 'color', label: '颜色', type: 'select', options: ['黑色', '白色', '灰色', '蓝色', '红色', '米色', '卡其', '绿色', '粉色'] },
    { key: 'material', label: '材质', type: 'select', options: ['纯棉', '羊毛', '涤纶', '皮革', '针织', '帆布'] },
    { key: 'style', label: '风格', type: 'select', options: ['休闲', '运动', '时尚', '复古', '文艺'] },
    { key: 'season', label: '适用季节', type: 'select', options: ['春', '夏', '秋', '冬'] },
    { key: 'targetAudience', label: '适用人群', type: 'select', options: ['男', '女', '中性', '儿童'] }
  ],
  '其他': [
    { key: 'color', label: '颜色', type: 'select', options: ['黑色', '白色', '灰色', '蓝色', '红色', '黄色', '绿色', '粉色'] },
    { key: 'material', label: '材质', type: 'select', options: ['帆布', '牛津布', '棉布', 'PU皮', '塑料', '金属', '木质'] },
    { key: 'style', label: '款式', type: 'select', options: ['单肩', '双肩', '手提', '斜挎', '简约', '复古', '时尚'] },
    { key: 'capacity', label: '容量', type: 'select', options: ['小号', '中号', '大号'] },
    { key: 'occasion', label: '适用场景', type: 'select', options: ['日常', '校园', '旅行', '通勤', '礼品'] }
  ]
}

// 获取当前分类的属性列表
const currentCategoryAttributes = computed(() => {
  return categoryAttributes[newProductCategory.value] || []
})

// 分类选项（从共享数据获取，不包含"全部"）
const categoryOptions = computed(() => categories.value.map(c => ({ value: c, label: c })))

// 重置表单
const resetProductForm = () => {
  newProduct.value = {
    name: '',
    code: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image: '',
    coverImage: '',
    allowCustom: false,
    status: 'draft',
    colors: [],
    sizes: [],
    // 服饰类属性
    size: '',
    color: '',
    material: '',
    fitType: '',
    collarType: '',
    sleeveLength: '',
    season: '',
    targetAudience: '',
    // 裤子专属属性
    pantLength: '',
    // 箱包类属性
    style: '',
    capacity: '',
    // 文具类属性
    brand: '',
    specification: '',
    suitableAge: '',
    // 饰品类属性
    gender: '',
    occasion: ''
  }
}

// 提交商品
const submitProduct = () => {
  if (!newProduct.value.name) {
    showToast('请输入商品名称', 'error')
    return
  }
  if (!newProduct.value.price) {
    showToast('请输入商品价格', 'error')
    return
  }
  if (!newProduct.value.stock) {
    showToast('请输入商品库存', 'error')
    return
  }
  if (!newProduct.value.category) {
    showToast('请选择商品分类', 'error')
    return
  }

  // 验证尺码库存总和是否等于商品库存
  const stockTotal = parseInt(newProduct.value.stock) || 0
  const sizesTotal = newProductSizesTotal.value
  if (newProduct.value.sizes.length > 0 && !validateStockMatch(newProduct.value.stock, sizesTotal)) {
    showToast(`库存验证失败！商品库存设置为 ${stockTotal}，但所有尺码库存总和为 ${sizesTotal}。请确保每个尺码的库存数量之和等于商品库存总量。`, 'error', 2000)
    return
  }

  const product = {
    name: newProduct.value.name,
    price: parseFloat(newProduct.value.price),
    stock: parseInt(newProduct.value.stock),
    status: newProduct.value.status,
    category: newProduct.value.category,
    originalPrice: parseFloat(newProduct.value.price),
    discount: 0,
    image: newProduct.value.image || '',
    description: newProduct.value.description || '',
    colors: newProduct.value.colors.length > 0 ? [...newProduct.value.colors] : [],
    sizes: newProduct.value.sizes.length > 0 ? [...newProduct.value.sizes] : [],
    // 分类属性
    size: newProduct.value.size || '',
    color: newProduct.value.color || '',
    material: newProduct.value.material || '',
    fitType: newProduct.value.fitType || '',
    collarType: newProduct.value.collarType || '',
    sleeveLength: newProduct.value.sleeveLength || '',
    season: newProduct.value.season || '',
    targetAudience: newProduct.value.targetAudience || '',
    pantLength: newProduct.value.pantLength || '',
    style: newProduct.value.style || '',
    capacity: newProduct.value.capacity || '',
    brand: newProduct.value.brand || '',
    specification: newProduct.value.specification || '',
    suitableAge: newProduct.value.suitableAge || '',
    gender: newProduct.value.gender || '',
    occasion: newProduct.value.occasion || ''
  }

  addProduct(product)
  showToast(`商品 "${product.name}" 添加成功！`, 'success')
  closeAddProductModal()
}
</script>

<template>
  <div class="admin-page">
    <!-- 主内容区 -->
    <main class="main-content">
      <!-- 商品管理 -->
      <div>
          <div class="section-header">
            <h1>商品管理</h1>
            <button class="add-btn" @click="openAddProductModal">+ 添加商品</button>
          </div>
          
          <!-- 状态筛选 -->
          <div class="filter-bar">
            <span class="filter-label">状态：</span>
            <div 
              v-for="option in productStatusOptions" 
              :key="option.value"
              :class="['filter-item', { active: productStatus === option.value }]"
              @click="productStatus = option.value"
            >
              {{ option.label }}
            </div>
          </div>
          
          <!-- 分类筛选导航栏 -->
          <div class="category-nav-bar">
            <div class="category-nav-header">
              <span class="filter-label">分类：</span>
              <div class="category-nav-controls">
                <input 
                  type="text" 
                  v-model="categorySearchText" 
                  class="category-search-input" 
                  placeholder="搜索分类..."
                />
                <button 
                  class="toggle-category-btn" 
                  @click="categoryNavCollapsed = !categoryNavCollapsed"
                >
                  {{ categoryNavCollapsed ? '展开' : '收起' }}
                </button>
                <button class="add-btn-small" @click="openAddCategoryModal">⚙ 更改分类</button>
              </div>
            </div>
            <div 
              v-if="!categoryNavCollapsed" 
              class="category-nav-content"
            >
              <div 
                v-for="option in filteredCategoryNav" 
                :key="option.value"
                :class="['category-nav-item', { active: selectedCategory === option.value }]"
                @click="selectedCategory = option.value"
              >
                {{ option.label }}
              </div>
            </div>
          </div>
          
          <!-- 商品列表 -->
          <div class="data-table">
            <table>
              <thead>
                <tr>
                  <th>商品ID</th>
                  <th>商品名称</th>
                  <th>分类</th>
                  <th>价格</th>
                  <th>库存</th>
                  <th>状态</th>
                  <th>创建时间</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="product in filteredProducts" :key="product.id">
                  <td>{{ product.id }}</td>
                  <td>{{ product.name }}</td>
                  <td>{{ product.category }}</td>
                  <td>¥{{ product.price.toFixed(2) }}</td>
                  <td :class="{ 'low-stock': product.stock < 10 }">
                    {{ product.stock }}
                  </td>
                  <td>
                    <span :class="['status-tag', getProductStatusStyle(product.status).class]">
                      {{ getProductStatusStyle(product.status).text }}
                    </span>
                  </td>
                  <td>{{ product.createTime }}</td>
                  <td class="actions">
                    <button class="action-btn edit" @click="openEditProductModal(product)">
                      编辑
                    </button>
                    <button 
                      class="action-btn toggle" 
                      @click="handleProductAction('toggle', product)"
                    >
                      {{ product.status === 'active' ? '下架' : '上架' }}
                    </button>
                    <button class="action-btn delete" @click="handleProductAction('delete', product)">
                      删除
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            
            <div v-if="filteredProducts.length === 0" class="empty-state">
              <p>暂无商品</p>
            </div>
          </div>
        </div>
    </main>
  </div>

  <!-- 分类选择弹窗 -->
  <div v-if="showCategorySelectModal" class="category-select-modal-overlay" @click.self="closeCategorySelectModal">
    <div class="category-select-modal">
      <div class="category-select-header">
        <h2>请选择商品分类</h2>
        <button class="close-modal-btn" @click="closeCategorySelectModal">×</button>
      </div>
      <div class="category-select-body">
        <div class="category-grid">
          <button 
            v-for="cat in categoryOptions" 
            :key="cat.value" 
            :class="['category-btn', { selected: newProductCategory === cat.value }]"
            @click="selectCategory(cat.value)"
          >
            <span class="category-name">{{ cat.label }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- 商品添加弹窗 -->
  <div v-if="showAddProductModal" class="add-product-modal-overlay" @click.self="closeAddProductModal">
    <div :class="['add-product-modal', newProductCategory]">
      <div :class="['add-product-modal-header', newProductCategory]">
        <h2>添加{{ newProductCategory }}</h2>
        <button class="close-modal-btn" @click="closeAddProductModal">×</button>
      </div>
      <div class="add-product-modal-body">
        <div class="form-grid">
          <div class="form-group full-width">
            <label>商品名称 <span class="required">*</span></label>
            <input type="text" v-model="newProduct.name" class="form-input" placeholder="请输入商品名称" />
          </div>
          <div class="form-group">
            <label>商品编码</label>
            <input type="text" v-model="newProduct.code" class="form-input" placeholder="系统自动生成" />
          </div>
          <div class="form-group">
            <label>商品价格 <span class="required">*</span></label>
            <input type="number" v-model="newProduct.price" class="form-input" placeholder="0.00" step="0.01" />
          </div>
          <div class="form-group">
            <label>商品库存 <span class="required">*</span></label>
            <input type="number" v-model="newProduct.stock" class="form-input" placeholder="0" />
          </div>
          <div class="form-group">
            <label>商品状态</label>
            <div class="status-options">
              <label :class="['status-option', { selected: newProduct.status === 'draft' }]">
                <input type="radio" v-model="newProduct.status" value="draft" />
                <span class="status-dot draft"></span>
                <span>草稿</span>
              </label>
              <label :class="['status-option', { selected: newProduct.status === 'active' }]">
                <input type="radio" v-model="newProduct.status" value="active" />
                <span class="status-dot active"></span>
                <span>上架</span>
              </label>
              <label :class="['status-option', { selected: newProduct.status === 'inactive' }]">
                <input type="radio" v-model="newProduct.status" value="inactive" />
                <span class="status-dot inactive"></span>
                <span>下架</span>
              </label>
            </div>
          </div>
          <div class="form-group full-width">
            <label>商品描述</label>
            <textarea v-model="newProduct.description" class="form-textarea" placeholder="请输入商品描述..."></textarea>
          </div>
          <div class="form-group full-width">
            <label>封面图片</label>
            <div class="image-upload-area" @click="triggerImageUpload">
              <input type="file" ref="imageUploadRef" class="image-upload-input" accept="image/jpeg,image/png" @change="handleImageUpload" />
              <div v-if="newProduct.image" class="image-preview">
                <img :src="newProduct.image" alt="预览" class="preview-img" />
                <button class="remove-img-btn" @click.stop="removeImage">×</button>
              </div>
              <div v-else class="image-upload-content">
                <div class="image-upload-icon">📷</div>
                <div class="image-upload-text">点击上传图片</div>
                <div class="image-upload-hint">支持 JPG、PNG 格式，文件小于 5MB</div>
              </div>
            </div>
          </div>
          <div class="form-group">
            <div class="checkbox-group">
              <label class="checkbox-wrapper">
                <input type="checkbox" v-model="newProduct.allowCustom" />
                <span class="checkbox-mark"></span>
              </label>
              <span class="checkbox-label">允许定制</span>
            </div>
          </div>
          
          <!-- 颜色管理 -->
          <div class="form-group full-width">
            <label>商品颜色</label>
            <div class="color-management">
              <div class="color-list">
                <div 
                  v-for="(color, index) in newProduct.colors" 
                  :key="color.id"
                  class="color-item"
                >
                  <div 
                    class="color-preview" 
                    :style="{ backgroundColor: color.hex }"
                    @click="openColorPickerForAdd(index, $event)"
                  ></div>
                  <span class="color-name">{{ color.name }}</span>
                  <button class="remove-color-btn" @click="removeColorFromAdd(index)">×</button>
                </div>
              </div>
              <button 
                class="add-color-btn" 
                @click="openColorPickerForAdd(-1, $event)"
              >
                + 添加颜色
              </button>
            </div>
          </div>
          
          <!-- 尺码管理 -->
          <div class="form-group full-width">
            <label>商品尺码</label>
            <div class="size-management">
              <table class="size-table">
                <thead>
                  <tr>
                    <th>尺码名称</th>
                    <th>库存数量</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(size, index) in newProduct.sizes" :key="size.id">
                    <td><input type="text" v-model="size.name" class="size-name-input" /></td>
                    <td><input type="number" v-model="size.stock" class="size-stock-input" min="0" /></td>
                    <td>
                      <button class="remove-size-btn" @click="removeSizeFromAdd(index)">删除</button>
                    </td>
                  </tr>
                  <tr v-if="newProduct.sizes.length === 0">
                    <td colspan="3" class="no-sizes">暂无尺码</td>
                  </tr>
                </tbody>
              </table>
              <!-- 尺码库存总和显示 -->
              <div class="size-total" v-if="newProduct.sizes.length > 0">
                <div class="total-info">
                  <span class="label">尺码库存总和：</span>
                  <span class="value" :class="{ 'mismatch': parseInt(newProduct.stock) !== newProductSizesTotal }">{{ newProductSizesTotal }}</span>
                  <span class="separator">/</span>
                  <span class="target">商品库存：{{ newProduct.stock || 0 }}</span>
                </div>
              </div>
              <div class="size-actions">
                <button class="add-size-btn" @click="newProduct.sizes.push({ id: `size_${Date.now()}`, name: '新尺码', stock: 10 })">
                  + 添加尺码
                </button>
                <button class="add-size-btn auto" @click="autoGenerateSizes()">
                  根据分类生成尺码
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="add-product-modal-footer">
        <button class="cancel-btn" @click="closeAddProductModal">取消</button>
        <button class="submit-btn" @click="submitProduct">添加商品</button>
      </div>
    </div>
  </div>

  <!-- 商品编辑弹窗 -->
  <div v-if="showEditProductModal" class="add-product-modal-overlay" @click.self="closeEditProductModal">
    <div class="add-product-modal">
      <div class="add-product-modal-header">
        <h2>编辑商品</h2>
        <button class="close-modal-btn" @click="closeEditProductModal">×</button>
      </div>
      <div class="add-product-modal-body">
        <div class="form-grid">
          <div class="form-group">
            <label>商品名称 <span class="required">*</span></label>
            <input type="text" v-model="editingProduct.name" class="form-input" placeholder="请输入商品名称" />
          </div>
          <div class="form-group">
            <label>商品编码</label>
            <input type="text" :value="editingProduct.code" class="form-input" readonly />
          </div>
          <div class="form-group">
            <label>商品价格 <span class="required">*</span></label>
            <input type="number" v-model="editingProduct.price" class="form-input" placeholder="0.00" step="0.01" />
          </div>
          <div class="form-group">
            <label>商品库存 <span class="required">*</span></label>
            <input type="number" v-model="editingProduct.stock" class="form-input" placeholder="0" />
          </div>
          <div class="form-group">
            <label>商品状态</label>
            <div class="status-options">
              <label :class="['status-option', { selected: editingProduct.status === 'draft' }]">
                <input type="radio" v-model="editingProduct.status" value="draft" />
                <span class="status-dot draft"></span>
                <span>草稿</span>
              </label>
              <label :class="['status-option', { selected: editingProduct.status === 'active' }]">
                <input type="radio" v-model="editingProduct.status" value="active" />
                <span class="status-dot active"></span>
                <span>上架</span>
              </label>
              <label :class="['status-option', { selected: editingProduct.status === 'inactive' }]">
                <input type="radio" v-model="editingProduct.status" value="inactive" />
                <span class="status-dot inactive"></span>
                <span>下架</span>
              </label>
            </div>
          </div>
          <div class="form-group full-width">
            <label>商品描述</label>
            <textarea v-model="editingProduct.description" class="form-textarea" placeholder="请输入商品描述..."></textarea>
          </div>
          
          <!-- 颜色管理 -->
          <div class="form-group full-width">
            <label>商品颜色</label>
            <div class="color-management">
              <div class="color-list">
                <div 
                  v-for="(color, index) in editingProduct.colors" 
                  :key="color.id"
                  class="color-item"
                >
                  <div 
                    class="color-preview" 
                    :style="{ backgroundColor: color.hex }"
                    @click="openColorPicker(index, $event)"
                  ></div>
                  <span class="color-name">{{ color.name }}</span>
                  <button class="remove-color-btn" @click="removeColor(index)">×</button>
                </div>
              </div>
              <button 
                class="add-color-btn" 
                @click="openColorPicker(-1, $event)"
              >
                + 添加颜色
              </button>
            </div>
          </div>
          
          <!-- 尺码管理 -->
          <div class="form-group full-width">
            <label>商品尺码</label>
            <div class="size-management">
              <table class="size-table">
                <thead>
                  <tr>
                    <th>尺码名称</th>
                    <th>库存数量</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(size, index) in editingProduct.sizes" :key="size.id">
                    <td><input type="text" v-model="size.name" class="size-name-input" /></td>
                    <td><input type="number" v-model="size.stock" class="size-stock-input" min="0" /></td>
                    <td>
                      <button class="remove-size-btn" @click="removeSize(index)">删除</button>
                    </td>
                  </tr>
                  <tr v-if="editingProduct.sizes.length === 0">
                    <td colspan="3" class="no-sizes">暂无尺码</td>
                  </tr>
                </tbody>
              </table>
              <!-- 尺码库存总和显示 -->
              <div class="size-total" v-if="editingProduct.sizes.length > 0">
                <div class="total-info">
                  <span class="label">尺码库存总和：</span>
                  <span class="value" :class="{ 'mismatch': parseInt(editingProduct.stock) !== editingProductSizesTotal }">{{ editingProductSizesTotal }}</span>
                  <span class="separator">/</span>
                  <span class="target">商品库存：{{ editingProduct.stock || 0 }}</span>
                </div>
              </div>
              <div class="size-actions">
                <button class="add-size-btn" @click="editingProduct.sizes.push({ id: `size_${Date.now()}`, name: '新尺码', stock: 10 })">
                  + 添加尺码
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="add-product-modal-footer">
        <button class="cancel-btn" @click="closeEditProductModal">取消</button>
        <button class="submit-btn" @click="updateProduct">保存修改</button>
      </div>
    </div>
  </div>
  
  <!-- 颜色选择器弹窗 -->
  <div v-if="showColorPicker" class="color-picker-overlay" @click="closeColorPicker">
    <div class="color-picker" @click.stop>
      <div class="color-picker-header">
        <h4>选择颜色</h4>
        <button class="close-picker-btn" @click="closeColorPicker">×</button>
      </div>
      <div class="color-picker-body">
        <!-- 预设颜色 -->
        <div class="preset-colors">
          <div 
            v-for="color in presetColors" 
            :key="color"
            class="preset-color"
            :style="{ backgroundColor: color }"
            @click="selectPresetColor(color)"
          ></div>
        </div>
        
        <!-- 自定义颜色输入 -->
        <div class="custom-color-input">
          <label>颜色代码：</label>
          <input 
            type="color" 
            v-model="customColorHex" 
            class="color-input"
          />
          <input 
            type="text" 
            v-model="customColorHex" 
            class="hex-input"
            placeholder="#000000"
          />
        </div>
        
        <!-- 颜色预览 -->
        <div class="color-preview-box">
          <div class="preview-label">当前颜色：</div>
          <div class="preview-color" :style="{ backgroundColor: customColorHex }"></div>
          <div class="preview-hex">{{ customColorHex }}</div>
        </div>
      </div>
      <div class="color-picker-footer">
        <button class="cancel-color-btn" @click="closeColorPicker">取消</button>
        <button class="confirm-color-btn" @click="confirmColorSelection">确认</button>
      </div>
    </div>
  </div>

  <!-- 更改分类弹窗 -->
  <div v-if="showAddCategoryModal" class="modal-overlay" @click.self="closeAddCategoryModal">
    <div class="modal-content category-modal">
      <div class="modal-header">
        <h3>更改分类</h3>
        <button class="close-btn" @click="closeAddCategoryModal">×</button>
      </div>
      <div class="modal-body">
        <!-- 添加新分类 -->
        <div class="section">
          <h4>添加新分类</h4>
          <div class="form-group">
            <label>分类名称：</label>
            <input type="text" v-model="newCategoryName" class="form-input" placeholder="如：新品" />
          </div>
          <button class="submit-btn small" @click="confirmAddCategory">添加分类</button>
        </div>

        <!-- 已有分类列表 -->
        <div class="section">
          <div class="section-header">
            <h4>已有分类</h4>
            <button class="toggle-btn" @click="expandedCategories = !expandedCategories">
              {{ expandedCategories ? '收起' : '展开' }}
            </button>
          </div>
          
          <!-- 搜索框 -->
          <div class="search-box" v-if="categories.length > 5">
            <input type="text" v-model="searchCategory" class="search-input" placeholder="搜索分类..." />
          </div>

          <div v-if="expandedCategories" class="category-list">
            <div v-if="filteredCategories.length === 0" class="empty-state">
              <p>{{ searchCategory ? '未找到匹配的分类' : '暂无分类' }}</p>
            </div>
            <div 
              v-for="category in filteredCategories" 
              :key="category"
              class="category-item"
            >
              <span class="category-name">{{ category }}</span>
              <div class="category-actions">
                <button class="delete-btn" @click="confirmDeleteCategory(category)">
                  删除
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="cancel-btn" @click="closeAddCategoryModal">关闭</button>
      </div>
    </div>
  </div>

  <!-- 确认弹窗 -->
  <div v-if="showConfirmModal" class="confirm-modal-overlay" @click.self="closeConfirmModal">
    <div class="confirm-modal">
      <div class="confirm-modal-header">
        <h3>{{ confirmModalTitle }}</h3>
        <button class="close-btn" @click="closeConfirmModal">×</button>
      </div>
      <div class="confirm-modal-body">
        <p>{{ confirmModalMessage }}</p>
      </div>
      <div class="confirm-modal-footer">
        <button class="cancel-btn" @click="closeConfirmModal">取消</button>
        <button :class="['confirm-btn', confirmModalType]" @click="handleConfirm">
          {{ confirmModalType === 'delete' ? '删除' : '确认' }}
        </button>
      </div>
    </div>
  </div>

  <!-- 消息提示弹窗 -->
  <Transition name="toast">
    <div v-if="toastVisible" :class="['toast-container', toastType]">
      <div class="toast-content">
        <span class="toast-icon">{{ toastType === 'success' ? '✓' : toastType === 'error' ? '✗' : 'ℹ' }}</span>
        <span class="toast-message">{{ toastMessage }}</span>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.admin-page {
  font-family: Arial, sans-serif;
  padding-top: 20px;
  min-height: 100vh;
  background-color: #f8f8f8;
}

/* 主内容区 */
.main-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h1 {
  font-size: 24px;
  color: #333;
  margin: 0;
}

.add-btn {
  padding: 10px 20px;
  background-color: #ffcc00;
  color: #1a1a1a;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-btn:hover {
  background-color: #e6b800;
}

.pending-count {
  padding: 8px 16px;
  background-color: #ff3b30;
  color: white;
  border-radius: 20px;
  font-size: 13px;
  font-weight: bold;
}

/* 筛选栏 */
.filter-bar {
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 8px;
  padding: 10px 15px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  flex-wrap: wrap;
  gap: 10px;
}

.filter-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
  margin-right: 5px;
}

.filter-item {
  padding: 10px 20px;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;
}

.filter-item:hover {
  background-color: #f5f5f5;
}

.filter-item.active {
  background-color: #ffcc00;
  color: #1a1a1a;
  font-weight: bold;
}

/* 数据表格 */
.data-table {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  overflow: hidden;
}

.data-table table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
}

.data-table th {
  background-color: #f8f8f8;
  font-weight: bold;
  color: #666;
  font-size: 14px;
}

.data-table tbody tr:hover {
  background-color: #fafafa;
}

.data-table tbody tr:last-child td {
  border-bottom: none;
}

/* 状态标签 */
.status-tag {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}

.status-draft {
  background-color: #f5f5f5;
  color: #666;
}

.status-active {
  background-color: #e8f5e9;
  color: #4caf50;
}

.status-inactive {
  background-color: #ffebee;
  color: #f44336;
}

.order-pending {
  background-color: #fff3e0;
  color: #ff9800;
}

.order-approved {
  background-color: #e3f2fd;
  color: #2196f3;
}

.order-shipped {
  background-color: #e8f5e9;
  color: #4caf50;
}

.order-completed {
  background-color: #f3e5f5;
  color: #9c27b0;
}

.order-cancelled {
  background-color: #f5f5f5;
  color: #9e9e9e;
}

/* 库存警告 */
.low-stock {
  color: #ff3b30;
  font-weight: bold;
}

/* 订单价格 */
.order-price {
  font-weight: bold;
  color: #ff3b30;
}

.item-info {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 操作按钮 */
.actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 6px 14px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.action-btn.edit {
  background-color: #2196f3;
  color: white;
}

.action-btn.edit:hover {
  background-color: #1976d2;
}

.action-btn.toggle {
  background-color: #ffcc00;
  color: #1a1a1a;
}

.action-btn.toggle:hover {
  background-color: #e6b800;
}

.action-btn.delete {
  background-color: #f44336;
  color: white;
}

.action-btn.delete:hover {
  background-color: #d32f2f;
}

.action-btn.approve {
  background-color: #4caf50;
  color: white;
}

.action-btn.approve:hover {
  background-color: #388e3c;
}

.action-btn.reject {
  background-color: #f44336;
  color: white;
}

.action-btn.reject:hover {
  background-color: #d32f2f;
}

.action-btn.ship {
  background-color: #ffcc00;
  color: #1a1a1a;
}

.action-btn.ship:hover {
  background-color: #e6b800;
}

.action-btn.view {
  background-color: #f5f5f5;
  color: #666;
  border: 1px solid #ddd;
}

.action-btn.view:hover {
  background-color: #eee;
}

/* 空状态 */
.empty-state {
  padding: 60px 20px;
  text-align: center;
  color: #999;
}

.empty-state p {
  margin: 0;
}

/* 定制订单状态标签 */
.custom-pending {
  background-color: #fff3e0;
  color: #ff9800;
}

.custom-producing {
  background-color: #fff3e0;
  color: #ff9800;
}

.custom-completed {
  background-color: #e8f5e9;
  color: #4caf50;
}

.custom-cancelled {
  background-color: #f5f5f5;
  color: #9e9e9e;
}

/* 定制订单操作按钮 */
.action-btn.view-white {
  background-color: white;
  color: #333;
  border: 1px solid #ddd;
}

.action-btn.view-white:hover {
  background-color: #f5f5f5;
}

.action-btn.edit-blue {
  background-color: #2196f3;
  color: white;
}

.action-btn.edit-blue:hover {
  background-color: #1976d2;
}

.action-btn.cancel-grey {
  background-color: #f5f5f5;
  color: #666;
  border: 1px solid #ddd;
}

.action-btn.cancel-grey:hover:not(:disabled) {
  background-color: #e8e8e8;
}

.action-btn.cancel-grey:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-btn.complete-green {
  background-color: #4caf50;
  color: white;
}

.action-btn.complete-green:hover {
  background-color: #388e3c;
}

.action-btn.track-orange {
  background-color: #ff9800;
  color: white;
}

.action-btn.track-orange:hover {
  background-color: #f57c00;
}

/* 进度跟踪弹窗 */
.progress-modal-overlay {
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
}

.progress-modal {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.progress-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  background-color: #f8f8f8;
}

.progress-modal-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.progress-modal-header .close-btn {
  width: 30px;
  height: 30px;
  border: none;
  background-color: transparent;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  line-height: 1;
}

.progress-modal-header .close-btn:hover {
  color: #333;
}

.progress-modal-body {
  padding: 20px;
  overflow-y: auto;
  max-height: calc(80vh - 80px);
}

.progress-info {
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.info-row {
  display: flex;
  margin-bottom: 12px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-row .label {
  width: 100px;
  color: #999;
  font-size: 14px;
}

.info-row .value {
  flex: 1;
  color: #333;
  font-size: 14px;
}

.progress-timeline h4 {
  margin: 0 0 15px 0;
  font-size: 16px;
  color: #333;
}

.timeline-list {
  position: relative;
  padding-left: 20px;
}

.timeline-list::before {
  content: '';
  position: absolute;
  left: 8px;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: #e0e0e0;
}

.timeline-item {
  position: relative;
  padding-left: 25px;
  margin-bottom: 20px;
}

.timeline-item:last-child {
  margin-bottom: 0;
}

.timeline-dot {
  position: absolute;
  left: -20px;
  top: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
}

.progress-dot-orange {
  background-color: #ff9800;
}

.progress-dot-green {
  background-color: #4caf50;
}

.progress-dot-grey {
  background-color: #9e9e9e;
}

.timeline-content {
  background-color: #fafafa;
  padding: 12px 15px;
  border-radius: 6px;
}

.timeline-desc {
  margin: 0 0 5px 0;
  font-size: 14px;
  color: #333;
}

.timeline-time {
  margin: 0;
  font-size: 12px;
  color: #999;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .admin-container {
    flex-direction: column;
  }
  
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
  }
  
  .data-table {
    overflow-x: auto;
  }
  
  .data-table table {
    min-width: 800px;
  }
  
  .actions {
    flex-direction: column;
  }
  
  .action-btn {
    width: 100%;
  }
}

/* 分类选择弹窗样式 */
.category-select-modal-overlay {
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
}

.category-select-modal {
  background-color: white;
  border-radius: 16px;
  width: 90%;
  max-width: 600px;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
}

.category-select-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.category-select-header h2 {
  margin: 0;
  font-size: 22px;
  font-weight: bold;
}

.category-select-body {
  padding: 24px;
  max-height: 400px;
  overflow-y: auto;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.category-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 12px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.category-btn:active {
  transform: translateY(-2px);
}

.category-icon {
  font-size: 36px;
  margin-bottom: 8px;
}

.category-name {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

/* 不同分类的按钮样式 */
.category-btn.上衣 {
  border-color: #ff9500;
  background: linear-gradient(135deg, #fff8f0 0%, #fff 100%);
}
.category-btn.上衣:hover {
  background: linear-gradient(135deg, #ff9500 0%, #ffcc00 100%);
  color: white;
}
.category-btn.上衣:hover .category-name {
  color: white;
}

.category-btn.裤子 {
  border-color: #007aff;
  background: linear-gradient(135deg, #f0f7ff 0%, #fff 100%);
}
.category-btn.裤子:hover {
  background: linear-gradient(135deg, #007aff 0%, #0066cc 100%);
  color: white;
}
.category-btn.裤子:hover .category-name {
  color: white;
}

.category-btn.帽子 {
  border-color: #ff2d55;
  background: linear-gradient(135deg, #fff0f3 0%, #fff 100%);
}
.category-btn.帽子:hover {
  background: linear-gradient(135deg, #ff2d55 0%, #cc0033 100%);
  color: white;
}
.category-btn.帽子:hover .category-name {
  color: white;
}

.category-btn.其他 {
  border-color: #5856d6;
  background: linear-gradient(135deg, #f0f0ff 0%, #fff 100%);
}
.category-btn.其他:hover {
  background: linear-gradient(135deg, #5856d6 0%, #4442c0 100%);
  color: white;
}
.category-btn.其他:hover .category-name {
  color: white;
}

/* 商品添加弹窗样式 */
.add-product-modal-overlay {
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
}

.add-product-modal {
  background-color: white;
  border-radius: 12px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
}

.add-product-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: linear-gradient(135deg, #ffcc00 0%, #ff9500 100%);
  color: #1a1a1a;
}

.header-icon {
  font-size: 28px;
  margin-right: 12px;
}

.add-product-modal-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: bold;
  flex: 1;
}

.category-badge {
  display: inline-block;
  padding: 6px 16px;
  border-radius: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 14px;
  font-weight: 500;
}

/* 不同分类的弹窗头部样式 */
.add-product-modal-header.上衣 {
  background: linear-gradient(135deg, #ff9500 0%, #ffcc00 100%);
}
.add-product-modal-header.裤子 {
  background: linear-gradient(135deg, #007aff 0%, #0066cc 100%);
}
.add-product-modal-header.帽子 {
  background: linear-gradient(135deg, #ff2d55 0%, #cc0033 100%);
}
.add-product-modal-header.其他 {
  background: linear-gradient(135deg, #5856d6 0%, #4442c0 100%);
}

/* 不同分类的提交按钮样式 */
.add-product-modal.上衣 .submit-btn {
  background: linear-gradient(135deg, #ff9500 0%, #ffcc00 100%);
}
.add-product-modal.裤子 .submit-btn {
  background: linear-gradient(135deg, #007aff 0%, #0066cc 100%);
}
.add-product-modal.帽子 .submit-btn {
  background: linear-gradient(135deg, #ff2d55 0%, #cc0033 100%);
}
.add-product-modal.其他 .submit-btn {
  background: linear-gradient(135deg, #5856d6 0%, #4442c0 100%);
}

.close-modal-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.close-modal-btn:hover {
  background: rgba(0, 0, 0, 0.2);
  transform: rotate(90deg);
}

.add-product-modal-body {
  padding: 24px;
  flex: 1;
  overflow-y: auto;
}

.add-product-modal-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.form-group label .required {
  color: #ff3b30;
  margin-left: 2px;
}

.form-input,
.form-textarea,
.form-select {
  padding: 10px 14px;
  border: 2px solid #e8e8e8;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s;
  background: white;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #ffcc00;
  box-shadow: 0 0 0 3px rgba(255, 204, 0, 0.2);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
}

.form-select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  padding-right: 40px;
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 0;
}

.image-upload-area {
  position: relative;
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  background: #fafafa;
}

.image-upload-area:hover {
  border-color: #ffcc00;
  background: #fffbe6;
}

.image-upload-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.image-upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.image-upload-icon {
  font-size: 48px;
}

.image-upload-text {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.image-upload-hint {
  font-size: 12px;
  color: #999;
}

.image-preview {
  position: relative;
  width: 100%;
  max-height: 200px;
  overflow: hidden;
  border-radius: 8px;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.remove-img-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  color: white;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.remove-img-btn:hover {
  background: rgba(244, 67, 54, 0.8);
  transform: scale(1.1);
}

.checkbox-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.checkbox-wrapper input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkbox-mark {
  width: 22px;
  height: 22px;
  background: white;
  border: 2px solid #ddd;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.checkbox-mark::after {
  content: '✓';
  font-size: 14px;
  color: white;
  opacity: 0;
  transform: scale(0);
  transition: all 0.2s;
}

.checkbox-wrapper input:checked ~ .checkbox-mark {
  background: #ffcc00;
  border-color: #ffcc00;
}

.checkbox-wrapper input:checked ~ .checkbox-mark::after {
  opacity: 1;
  transform: scale(1);
}

.checkbox-label {
  font-size: 14px;
  color: #666;
  user-select: none;
}

.image-upload-area {
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  background: #fafafa;
}

.image-upload-area:hover {
  border-color: #ffcc00;
  background: #fffef5;
}

.image-upload-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.image-upload-text {
  font-size: 14px;
  color: #666;
}

.image-upload-hint {
  font-size: 12px;
  color: #999;
  margin-top: 8px;
}

.status-options {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.status-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: 2px solid #e8e8e8;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.status-option:hover {
  border-color: #ffcc00;
}

.status-option input[type="radio"] {
  display: none;
}

.status-option.selected {
  border-color: #ffcc00;
  background: #fffef5;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.status-dot.draft {
  background: #999;
}

.status-dot.active {
  background: #4caf50;
}

.status-dot.inactive {
  background: #f44336;
}

.status-option span:last-child {
  font-size: 14px;
  color: #333;
}

.add-product-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #f0f0f0;
  background: #fafafa;
}

.cancel-btn {
  padding: 12px 24px;
  background: white;
  color: #666;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.cancel-btn:hover {
  border-color: #999;
  color: #333;
}

.submit-btn {
  padding: 12px 32px;
  background: linear-gradient(135deg, #ffcc00 0%, #ff9500 100%);
  color: #1a1a1a;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(255, 153, 0, 0.3);
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(255, 153, 0, 0.4);
}

.submit-btn:active {
  transform: translateY(0);
}

/* 小添加按钮 */
.add-btn-small {
  padding: 6px 14px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  margin-left: auto;
}

.add-btn-small:hover {
  background-color: #388e3c;
  transform: translateY(-1px);
}

/* 通用弹窗样式 */
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
}

.modal-content {
  background-color: white;
  border-radius: 12px;
  width: 90%;
  max-width: 450px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: linear-gradient(135deg, #ffcc00 0%, #ff9500 100%);
  color: #1a1a1a;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
}

.modal-header .close-btn {
  width: 30px;
  height: 30px;
  border: none;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  font-size: 18px;
  cursor: pointer;
  color: #1a1a1a;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-header .close-btn:hover {
  background: rgba(0, 0, 0, 0.2);
}

.modal-body {
  padding: 24px;
}

.modal-body .form-group {
  margin-bottom: 20px;
}

.modal-body .form-group:last-child {
  margin-bottom: 0;
}

.modal-body label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.modal-body .form-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e8e8e8;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

.modal-body .form-input:focus {
  outline: none;
  border-color: #ffcc00;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #f0f0f0;
  background: #fafafa;
}

/* 确认弹窗样式 */
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
  z-index: 1000;
}

.confirm-modal {
  background-color: white;
  border-radius: 12px;
  width: 90%;
  max-width: 450px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.confirm-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: #f8f8f8;
  border-bottom: 1px solid #e8e8e8;
}

.confirm-modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.confirm-modal-header .close-btn {
  width: 30px;
  height: 30px;
  border: none;
  background: transparent;
  border-radius: 50%;
  font-size: 18px;
  cursor: pointer;
  color: #999;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.confirm-modal-header .close-btn:hover {
  background: #eee;
  color: #333;
}

.confirm-modal-body {
  padding: 24px;
}

.confirm-modal-body p {
  margin: 0;
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

.confirm-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #f0f0f0;
  background: #fafafa;
}

.confirm-btn {
  padding: 12px 32px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.confirm-btn.toggle {
  background: linear-gradient(135deg, #ffcc00 0%, #ff9500 100%);
  color: #1a1a1a;
  box-shadow: 0 4px 12px rgba(255, 153, 0, 0.3);
}

.confirm-btn.toggle:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(255, 153, 0, 0.4);
}

.confirm-btn.delete {
  background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3);
}

.confirm-btn.delete:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(244, 67, 54, 0.4);
}

/* 颜色管理样式 */
.color-management {
  margin-top: 8px;
}

.color-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
}

.color-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: #fafafa;
  border-radius: 6px;
  border: 1px solid #e8e8e8;
}

.color-preview {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid #ddd;
  transition: all 0.3s;
}

.color-preview:hover {
  transform: scale(1.1);
  border-color: #ffcc00;
}

.color-name {
  font-size: 14px;
  color: #333;
}

.remove-color-btn {
  width: 20px;
  height: 20px;
  border: none;
  background: #f44336;
  color: white;
  border-radius: 50%;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.remove-color-btn:hover {
  background: #d32f2f;
}

.add-color-btn {
  padding: 10px 20px;
  background: #f5f5f5;
  border: 2px dashed #ddd;
  border-radius: 8px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
}

.add-color-btn:hover {
  border-color: #ffcc00;
  color: #ff9500;
}

/* 尺码管理样式 */
.size-management {
  margin-top: 8px;
}

.size-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 8px;
}

.size-table th,
.size-table td {
  padding: 6px 8px;
  text-align: left;
  border-bottom: 1px solid #e8e8e8;
  font-size: 13px;
}

.size-table th {
  background: #fafafa;
  font-weight: 600;
  color: #666;
  font-size: 13px;
}

.size-name-input,
.size-stock-input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;
}

.size-name-input:focus,
.size-stock-input:focus {
  outline: none;
  border-color: #ffcc00;
}

.remove-size-btn {
  padding: 6px 12px;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.remove-size-btn:hover {
  background: #d32f2f;
}

.no-sizes {
  text-align: center;
  color: #999;
  font-style: italic;
}

.size-total {
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 12px;
}

.size-total .total-info {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
}

.size-total .label {
  font-size: 13px;
  color: #666;
}

.size-total .value {
  font-size: 18px;
  font-weight: 700;
  color: #4caf50;
  min-width: 60px;
  text-align: right;
}

.size-total .value.mismatch {
  color: #ff3b30;
}

.size-total .separator {
  font-size: 14px;
  color: #999;
}

.size-total .target {
  font-size: 14px;
  color: #333;
}

.size-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.add-size-btn {
  padding: 10px 20px;
  background: linear-gradient(135deg, #ffcc00 0%, #ff9500 100%);
  color: #1a1a1a;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.add-size-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 153, 0, 0.3);
}

/* 颜色选择器弹窗样式 */
.color-picker-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.color-picker {
  background: white;
  border-radius: 16px;
  width: 480px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.color-picker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
}

.color-picker-header h4 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.close-picker-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.close-picker-btn:hover {
  background: rgba(0, 0, 0, 0.2);
}

.color-picker-body {
  padding: 24px;
}

.preset-colors {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-bottom: 24px;
  justify-content: flex-start;
}

.preset-color {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  cursor: pointer;
  border: 2px solid #e0e0e0;
  transition: all 0.3s;
  flex-shrink: 0;
  box-sizing: border-box;
}

.preset-color:hover {
  transform: scale(1.15);
  border-color: #ffcc00;
}

.custom-color-input {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.custom-color-input label {
  font-size: 15px;
  color: #555;
  width: 80px;
  flex-shrink: 0;
}

.color-input {
  width: 50px;
  height: 44px;
  border: 2px solid #e8e8e8;
  border-radius: 10px;
  cursor: pointer;
}

.hex-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  font-family: monospace;
}

.color-preview-box {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e8e8e8;
}

.preview-label {
  font-size: 15px;
  color: #555;
  width: 80px;
  flex-shrink: 0;
}

.preview-color {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  border: 3px solid #e8e8e8;
}

.preview-hex {
  font-size: 16px;
  font-family: 'Courier New', monospace;
  color: #333;
  font-weight: 600;
}

.color-picker-footer {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  padding: 20px 24px;
  border-top: 1px solid #f0f0f0;
  background: #fafafa;
}

.cancel-color-btn {
  padding: 12px 28px;
  background: white;
  color: #555;
  border: 2px solid #ddd;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.cancel-color-btn:hover {
  border-color: #999;
  background: #fafafa;
}

.confirm-color-btn {
  padding: 12px 36px;
  background: linear-gradient(135deg, #ffcc00 0%, #ff9500 100%);
  color: #1a1a1a;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.confirm-color-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(255, 153, 0, 0.4);
}

/* 分类管理弹窗样式 */
.category-modal {
  width: 90%;
  max-width: 700px;
  max-height: 85vh;
}

.category-modal .modal-body {
  max-height: calc(85vh - 120px);
  overflow-y: auto;
}

.category-modal .section {
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #f0f0f0;
}

.category-modal .section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.category-modal .section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.category-modal .section-header h4 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.category-modal .toggle-btn {
  padding: 6px 12px;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s;
}

.category-modal .toggle-btn:hover {
  background: #eee;
}

.category-modal .search-box {
  margin-bottom: 12px;
}

.category-modal .search-input {
  width: 100%;
  padding: 10px 14px;
  border: 2px solid #e8e8e8;
  border-radius: 8px;
  font-size: 14px;
  box-sizing: border-box;
}

.category-modal .search-input:focus {
  outline: none;
  border-color: #ffcc00;
}

.category-modal .custom-svg-btn:hover {
  background: #eee;
  border-style: solid;
}

.category-modal .category-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.category-modal .category-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #fafafa;
  border-radius: 8px;
}

.category-modal .category-name {
  flex: 1;
  font-size: 14px;
  color: #333;
}

.category-modal .category-actions {
  display: flex;
  gap: 8px;
}

.category-modal .delete-btn {
  padding: 6px 12px;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.category-modal .delete-btn:hover {
  background: #d32f2f;
}

.category-modal .empty-state {
  text-align: center;
  padding: 24px;
  color: #999;
}

.category-modal .submit-btn.small {
  padding: 10px 20px;
  font-size: 14px;
}

/* 分类导航栏样式 */
.category-nav-bar {
  background: white;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.category-nav-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.category-nav-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.category-search-input {
  padding: 8px 12px;
  border: 2px solid #e8e8e8;
  border-radius: 6px;
  font-size: 14px;
  min-width: 180px;
  transition: all 0.3s;
}

.category-search-input:focus {
  outline: none;
  border-color: #ffcc00;
  box-shadow: 0 0 0 3px rgba(255, 204, 0, 0.1);
}

.toggle-category-btn {
  padding: 8px 16px;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.toggle-category-btn:hover {
  background: #eee;
  border-color: #ccc;
}

.category-nav-content {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.category-nav-item {
  padding: 8px 14px;
  background: #f8f9fa;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.category-nav-item:hover {
  background: #fffbe6;
  border-color: #ffe066;
}

.category-nav-item.active {
  background: linear-gradient(135deg, #ffcc00 0%, #ffb700 100%);
  color: #333;
  border-color: #ffcc00;
  font-weight: 600;
}

/* 消息提示弹窗 */
.toast-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
  padding: 16px 24px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  min-width: 200px;
  max-width: 400px;
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toast-icon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 16px;
}

.toast-container.success .toast-icon {
  background: #d4edda;
  color: #155724;
}

.toast-container.error .toast-icon {
  background: #f8d7da;
  color: #721c24;
}

.toast-container.info .toast-icon {
  background: #d1ecf1;
  color: #0c5460;
}

.toast-message {
  font-size: 14px;
  color: #333;
}

/* 消息提示动画 */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.8);
}

.toast-enter-to,
.toast-leave-from {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}
</style>