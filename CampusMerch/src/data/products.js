import { ref, watch, computed } from 'vue'

// 预设分类列表（作为基础分类）
const defaultCategories = [
  '上衣', '裤子', '帽子', '其他'
]

// 从localStorage读取分类，如果没有则使用默认分类
const loadCategories = () => {
  const stored = localStorage.getItem('campus_categories')
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return defaultCategories
    }
  }
  // 首次加载，初始化localStorage
  localStorage.setItem('campus_categories', JSON.stringify(defaultCategories))
  return defaultCategories
}

// 响应式分类数据
export const categories = ref(loadCategories())

// 监听分类变化，自动保存到localStorage
watch(categories, (newValue) => {
  localStorage.setItem('campus_categories', JSON.stringify(newValue))
}, { deep: true })

// 添加分类
export const addCategory = (categoryName) => {
  if (categoryName && !categories.value.includes(categoryName)) {
    categories.value.push(categoryName)
    return true
  }
  return false
}

// 删除分类（如果该分类下没有商品）
export const removeCategory = (categoryName) => {
  if (categoryName === '全部') return false
  
  // 检查是否有商品使用该分类
  const hasProducts = products.value.some(p => p.category === categoryName)
  if (hasProducts) {
    return false // 有商品使用该分类，不能删除
  }
  
  const index = categories.value.indexOf(categoryName)
  if (index !== -1) {
    categories.value.splice(index, 1)
    return true
  }
  return false
}

// 获取分类选项（包含全部选项）
export const getCategoryOptions = () => {
  return [{ value: 'all', label: '全部' }, ...categories.value.map(c => ({ value: c, label: c }))]
}

// 预设商品状态列表
const defaultProductStatuses = [
  { value: 'draft', label: '草稿' },
  { value: 'active', label: '上架' },
  { value: 'inactive', label: '下架' }
]

// 从localStorage读取状态，如果没有则使用默认状态
const loadProductStatuses = () => {
  const stored = localStorage.getItem('campus_product_statuses')
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return defaultProductStatuses
    }
  }
  // 首次加载，初始化localStorage
  localStorage.setItem('campus_product_statuses', JSON.stringify(defaultProductStatuses))
  return defaultProductStatuses
}

// 响应式商品状态数据
export const productStatuses = ref(loadProductStatuses())

// 监听状态变化，自动保存到localStorage
watch(productStatuses, (newValue) => {
  localStorage.setItem('campus_product_statuses', JSON.stringify(newValue))
}, { deep: true })

// 添加商品状态
export const addProductStatus = (statusValue, statusLabel) => {
  if (statusValue && statusLabel && !productStatuses.value.some(s => s.value === statusValue)) {
    productStatuses.value.push({ value: statusValue, label: statusLabel })
    return true
  }
  return false
}

// 删除商品状态（如果没有商品使用该状态）
export const removeProductStatus = (statusValue) => {
  // 不能删除核心状态
  const coreStatuses = ['draft', 'active', 'inactive']
  if (coreStatuses.includes(statusValue)) return false
  
  // 检查是否有商品使用该状态
  const hasProducts = products.value.some(p => p.status === statusValue)
  if (hasProducts) {
    return false // 有商品使用该状态，不能删除
  }
  
  const index = productStatuses.value.findIndex(s => s.value === statusValue)
  if (index !== -1) {
    productStatuses.value.splice(index, 1)
    return true
  }
  return false
}

// 获取商品状态选项（包含全部选项）
export const getProductStatusOptions = () => {
  return [{ value: 'all', label: '全部' }, ...productStatuses.value]
}

// 尺码模板
const sizeTemplates = {
  '上衣': [
    { id: 's', name: 'S', stock: 20 },
    { id: 'm', name: 'M', stock: 40 },
    { id: 'l', name: 'L', stock: 40 },
    { id: 'xl', name: 'XL', stock: 30 },
    { id: 'xxl', name: 'XXL', stock: 20 }
  ],
  '帽子': [
    { id: 's', name: 'S (54-56cm)', stock: 40 },
    { id: 'm', name: 'M (56-58cm)', stock: 50 },
    { id: 'l', name: 'L (58-60cm)', stock: 40 }
  ],
  '裤子': [
    { id: '28', name: '28码', stock: 12 },
    { id: '30', name: '30码', stock: 16 },
    { id: '32', name: '32码', stock: 16 },
    { id: '34', name: '34码', stock: 12 },
    { id: '36', name: '36码', stock: 8 }
  ],
  '其他': [
    { id: 's', name: '小号', stock: 50 },
    { id: 'm', name: '中号', stock: 60 },
    { id: 'l', name: '大号', stock: 50 }
  ]
}

// 初始商品数据
const defaultProducts = [
  {
    id: 'P001',
    name: '连帽衫',
    price: 199,
    originalPrice: 259,
    discount: 23,
    stock: 100,
    status: 'active',
    category: '上衣',
    createTime: '2024-01-10',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=black%20hoodie%20sweatshirt%20product%20photo%20white%20background&image_size=square_hd',
    colors: [
      { id: 'black', name: '黑色', hex: '#000000' },
      { id: 'gray', name: '灰色', hex: '#808080' },
      { id: 'navy', name: '深蓝', hex: '#1a1a4e' }
    ],
    sizes: [...sizeTemplates['上衣']]
  },
  {
    id: 'P002',
    name: 'T恤',
    price: 99,
    originalPrice: 129,
    discount: 23,
    stock: 200,
    status: 'active',
    category: '上衣',
    createTime: '2024-01-11',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=white%20cotton%20t-shirt%20product%20photo%20white%20background&image_size=square_hd',
    colors: [
      { id: 'white', name: '白色', hex: '#FFFFFF' },
      { id: 'black', name: '黑色', hex: '#000000' },
      { id: 'gray', name: '灰色', hex: '#808080' },
      { id: 'blue', name: '蓝色', hex: '#4169E1' }
    ],
    sizes: [...sizeTemplates['上衣']]
  },
  {
    id: 'P003',
    name: '帽子',
    price: 59,
    originalPrice: 79,
    discount: 25,
    stock: 50,
    status: 'inactive',
    category: '帽子',
    createTime: '2024-01-12',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=baseball%20cap%20hat%20product%20photo%20white%20background&image_size=square_hd',
    colors: [
      { id: 'black', name: '黑色', hex: '#000000' },
      { id: 'gray', name: '灰色', hex: '#808080' },
      { id: 'white', name: '白色', hex: '#FFFFFF' }
    ],
    sizes: [...sizeTemplates['帽子']]
  },
  {
    id: 'P004',
    name: '卫衣',
    price: 159,
    originalPrice: 199,
    discount: 20,
    stock: 80,
    status: 'active',
    category: '上衣',
    createTime: '2024-01-13',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=gray%20crewneck%20sweatshirt%20product%20photo%20white%20background&image_size=square_hd',
    colors: [
      { id: 'gray', name: '灰色', hex: '#808080' },
      { id: 'black', name: '黑色', hex: '#000000' },
      { id: 'white', name: '白色', hex: '#FFFFFF' }
    ],
    sizes: [...sizeTemplates['上衣']]
  },
  {
    id: 'P005',
    name: '长裤',
    price: 179,
    originalPrice: 219,
    discount: 18,
    stock: 60,
    status: 'active',
    category: '裤子',
    createTime: '2024-01-14',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=black%20cotton%20pants%20trousers%20product%20photo%20white%20background&image_size=square_hd',
    colors: [
      { id: 'black', name: '黑色', hex: '#000000' },
      { id: 'gray', name: '灰色', hex: '#808080' },
      { id: 'khaki', name: '卡其', hex: '#C3B091' }
    ],
    sizes: [...sizeTemplates['裤子']]
  },
  {
    id: 'P006',
    name: '运动裤',
    price: 199,
    originalPrice: 249,
    discount: 20,
    stock: 45,
    status: 'active',
    category: '裤子',
    createTime: '2024-01-15',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=black%20athletic%20jogger%20pants%20product%20photo%20white%20background&image_size=square_hd',
    colors: [
      { id: 'black', name: '黑色', hex: '#000000' },
      { id: 'gray', name: '灰色', hex: '#808080' },
      { id: 'navy', name: '深蓝', hex: '#1a1a4e' }
    ],
    sizes: [...sizeTemplates['裤子']]
  },
  {
    id: 'P007',
    name: '棒球帽',
    price: 69,
    originalPrice: 89,
    discount: 22,
    stock: 120,
    status: 'active',
    category: '帽子',
    createTime: '2024-01-16',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=navy%20blue%20baseball%20cap%20product%20photo%20white%20background&image_size=square_hd',
    colors: [
      { id: 'navy', name: '藏蓝', hex: '#1a1a4e' },
      { id: 'black', name: '黑色', hex: '#000000' },
      { id: 'white', name: '白色', hex: '#FFFFFF' },
      { id: 'red', name: '红色', hex: '#DC143C' }
    ],
    sizes: [...sizeTemplates['帽子']]
  },
  {
    id: 'P008',
    name: '帆布包',
    price: 49,
    originalPrice: 69,
    discount: 29,
    stock: 150,
    status: 'active',
    category: '其他',
    createTime: '2024-01-17',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=canvas%20tote%20bag%20product%20photo%20white%20background&image_size=square_hd',
    colors: [
      { id: 'beige', name: '米白', hex: '#F5F5DC' },
      { id: 'black', name: '黑色', hex: '#000000' },
      { id: 'brown', name: '棕色', hex: '#8B4513' }
    ],
    sizes: [...sizeTemplates['其他']]
  }
]

// 商品数据迁移：确保所有商品都有colors和sizes
const migrateProductData = (products) => {
  return products.map(product => {
    if (!product.colors || !product.colors.length) {
      product.colors = getDefaultColors(product.category)
    }
    if (!product.sizes || !product.sizes.length) {
      product.sizes = getDefaultSizes(product.category)
    }
    return product
  })
}

// 根据商品类别获取默认颜色
const getDefaultColors = (category) => {
  const colorMap = {
    '上衣': [
      { id: 'black', name: '黑色', hex: '#000000' },
      { id: 'white', name: '白色', hex: '#FFFFFF' },
      { id: 'gray', name: '灰色', hex: '#808080' }
    ],
    '裤子': [
      { id: 'black', name: '黑色', hex: '#000000' },
      { id: 'gray', name: '灰色', hex: '#808080' }
    ],
    '帽子': [
      { id: 'black', name: '黑色', hex: '#000000' },
      { id: 'gray', name: '灰色', hex: '#808080' }
    ],
    '其他': [
      { id: 'black', name: '黑色', hex: '#000000' },
      { id: 'white', name: '白色', hex: '#FFFFFF' }
    ]
  }
  return colorMap[category] || colorMap['其他']
}

// 根据商品类别获取默认尺码
const getDefaultSizes = (category) => {
  const categorySizes = {
    '上衣': [
      { id: 's', name: 'S', stock: 20 },
      { id: 'm', name: 'M', stock: 40 },
      { id: 'l', name: 'L', stock: 40 },
      { id: 'xl', name: 'XL', stock: 30 },
      { id: 'xxl', name: 'XXL', stock: 20 }
    ],
    '帽子': [
      { id: 's', name: 'S (54-56cm)', stock: 40 },
      { id: 'm', name: 'M (56-58cm)', stock: 50 },
      { id: 'l', name: 'L (58-60cm)', stock: 40 }
    ],
    '裤子': [
      { id: '28', name: '28码', stock: 12 },
      { id: '30', name: '30码', stock: 16 },
      { id: '32', name: '32码', stock: 16 },
      { id: '34', name: '34码', stock: 12 },
      { id: '36', name: '36码', stock: 8 }
    ],
    '其他': [
      { id: 's', name: '小号', stock: 50 },
      { id: 'm', name: '中号', stock: 60 },
      { id: 'l', name: '大号', stock: 50 }
    ]
  }
  return categorySizes[category] || categorySizes['其他']
}

// 从localStorage读取数据，如果没有则使用默认数据
const loadProducts = () => {
  const stored = localStorage.getItem('campus_products')
  if (stored) {
    try {
      const parsed = JSON.parse(stored)
      return migrateProductData(parsed)
    } catch {
      return defaultProducts
    }
  }
  // 首次加载，初始化localStorage
  localStorage.setItem('campus_products', JSON.stringify(defaultProducts))
  return defaultProducts
}

// 响应式商品数据
export const products = ref(loadProducts())

// 监听数据变化，自动保存到localStorage
watch(products, (newValue) => {
  localStorage.setItem('campus_products', JSON.stringify(newValue))
}, { deep: true })

// 获取商品列表（仅上架商品）
export const getActiveProducts = () => {
  return products.value.filter(p => p.status === 'active')
}

// 根据ID获取商品
export const getProductById = (id) => {
  return products.value.find(p => p.id === parseInt(id) || p.id === id)
}

// 添加商品
export const addProduct = (product) => {
  const newId = 'P' + String(products.value.length + 1).padStart(3, '0')
  const newProduct = {
    ...product,
    id: newId,
    originalPrice: product.originalPrice || product.price,
    discount: product.discount || 0,
    createTime: new Date().toISOString().split('T')[0],
    image: product.image || `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(product.name + ' product photo white background')}&image_size=square_hd`
  }
  products.value.unshift(newProduct)
  return newProduct
}

// 更新商品状态（上架/下架）
export const updateProductStatus = (productId, status) => {
  const index = products.value.findIndex(p => p.id === productId)
  if (index !== -1) {
    products.value[index].status = status
    return true
  }
  return false
}

// 删除商品
export const deleteProduct = (productId) => {
  const index = products.value.findIndex(p => p.id === productId)
  if (index !== -1) {
    products.value.splice(index, 1)
    return true
  }
  return false
}

// 更新商品信息
export const updateProduct = (productId, updates) => {
  const index = products.value.findIndex(p => p.id === productId)
  if (index !== -1) {
    products.value[index] = { ...products.value[index], ...updates }
    return true
  }
  return false
}

// 获取分类列表
export const getCategories = () => {
  const categories = [...new Set(products.value.map(p => p.category))]
  return ['全部', ...categories]
}

// 根据分类筛选商品
export const getProductsByCategory = (category) => {
  if (category === '全部') {
    return products.value.filter(p => p.status === 'active')
  }
  return products.value.filter(p => p.status === 'active' && p.category === category)
}
