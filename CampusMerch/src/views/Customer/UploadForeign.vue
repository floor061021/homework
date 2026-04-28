<script setup>
import { ref } from 'vue'
import Header from '../../components/headerUser.vue'

// 文件输入引用
const fileInputRef = ref(null)

// 触发文件选择对话框
const triggerFileInput = () => {
  fileInputRef.value?.click()
}

// 允许的文件格式
const allowedExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.psd', '.ai', '.svg']
const allowedMimeTypes = [
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/svg+xml',
  'application/photoshop',
  'application/postscript'
]

// 最大文件大小 10MB
const maxFileSize = 10 * 1024 * 1024

// 表单数据
const designTitle = ref('')
const designDescription = ref('')
const selectedFiles = ref([])
const uploadProgress = ref(0)
const uploadStatus = ref('idle') // idle, uploading, completed, error
const isDragOver = ref(false)

// 错误信息
const errors = ref({
  title: '',
  description: '',
  files: ''
})

// 上传结果
const uploadResults = ref([])

// 验证文件格式
const validateFile = (file) => {
  const ext = '.' + file.name.split('.').pop().toLowerCase()
  const isValidExtension = allowedExtensions.includes(ext)
  const isValidMimeType = allowedMimeTypes.includes(file.type)
  const isWithinSizeLimit = file.size <= maxFileSize
  
  return {
    isValid: isValidExtension && isValidMimeType && isWithinSizeLimit,
    errors: [
      !isValidExtension ? `不支持的文件格式: ${ext}` : '',
      !isWithinSizeLimit ? `文件大小超过限制 (最大10MB)` : ''
    ].filter(Boolean)
  }
}

// 文件选择处理
const handleFileSelect = (event) => {
  const files = Array.from(event.target.files)
  handleFiles(files)
  // 重置input以允许重复选择相同文件
  event.target.value = ''
}

// 格式化文件大小
const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}

// 移除文件
const removeFile = (index) => {
  selectedFiles.value.splice(index, 1)
}

// 验证表单
const validateForm = () => {
  let isValid = true
  errors.value = { title: '', description: '', files: '' }
  
  if (!designTitle.value.trim()) {
    errors.value.title = '请输入设计稿标题'
    isValid = false
  }
  
  if (!designDescription.value.trim()) {
    errors.value.description = '请输入设计描述'
    isValid = false
  }
  
  if (selectedFiles.value.length === 0) {
    errors.value.files = '请选择要上传的设计稿文件'
    isValid = false
  } else {
    const invalidFiles = selectedFiles.value.filter(f => !f.valid)
    if (invalidFiles.length > 0) {
      errors.value.files = `有 ${invalidFiles.length} 个文件格式不符合要求`
      isValid = false
    }
  }
  
  return isValid
}

// 模拟上传
const simulateUpload = async () => {
  uploadStatus.value = 'uploading'
  uploadProgress.value = 0
  
  const validFiles = selectedFiles.value.filter(f => f.valid)
  
  for (let i = 0; i < validFiles.length; i++) {
    const fileItem = validFiles[i]
    fileItem.status = 'uploading'
    
    // 模拟上传进度
    for (let progress = 0; progress <= 100; progress += 5) {
      await new Promise(resolve => setTimeout(resolve, 100))
      fileItem.progress = progress
      uploadProgress.value = Math.round(((i + progress / 100) / validFiles.length) * 100)
    }
    
    fileItem.status = 'completed'
  }
  
  uploadStatus.value = 'completed'
  uploadProgress.value = 100
  
  // 显示上传结果
  uploadResults.value = selectedFiles.value.map(f => ({
    name: f.name,
    status: f.valid ? 'success' : 'failed',
    message: f.valid ? '上传成功' : '文件格式不支持'
  }))
}

// 提交表单
const handleSubmit = async () => {
  if (validateForm()) {
    await simulateUpload()
  }
}

// 重置表单
const resetForm = () => {
  designTitle.value = ''
  designDescription.value = ''
  selectedFiles.value = []
  uploadProgress.value = 0
  uploadStatus.value = 'idle'
  uploadResults.value = []
  errors.value = { title: '', description: '', files: '' }
}

// 拖拽事件处理
const handleDragOver = (e) => {
  e.preventDefault()
  isDragOver.value = true
}

const handleDragLeave = (e) => {
  e.preventDefault()
  isDragOver.value = false
}

const handleDrop = (e) => {
  e.preventDefault()
  isDragOver.value = false
  
  const files = Array.from(e.dataTransfer.files)
  handleFiles(files)
}

// 统一处理文件
const handleFiles = (files) => {
  files.forEach(file => {
    const validation = validateFile(file)
    selectedFiles.value.push({
      file,
      name: file.name,
      size: formatFileSize(file.size),
      valid: validation.isValid,
      errors: validation.errors,
      progress: 0,
      status: 'pending'
    })
  })
  
  errors.value.files = ''
}
</script>

<template>
  <div class="upload-page">
    <Header />
    
    <div class="upload-container">
      <!-- 页面标题 -->
      <div class="page-header">
        <h1>上传设计稿</h1>
        <p>请上传您的设计稿文件，支持 PNG、JPG、GIF、PSD、AI、SVG 格式</p>
      </div>

      <!-- 上传表单 -->
      <form @submit.prevent="handleSubmit" class="upload-form">
        <!-- 设计稿标题 -->
        <div class="form-group">
          <label for="title">设计稿标题 *</label>
          <input 
            id="title"
            v-model="designTitle" 
            type="text" 
            placeholder="请输入设计稿标题"
            :class="{ 'error-border': errors.title }"
          />
          <span v-if="errors.title" class="error-message">{{ errors.title }}</span>
        </div>

        <!-- 设计描述 -->
        <div class="form-group">
          <label for="description">设计描述 *</label>
          <textarea 
            id="description"
            v-model="designDescription" 
            rows="4" 
            placeholder="请描述您的设计稿..."
            :class="{ 'error-border': errors.description }"
          ></textarea>
          <span v-if="errors.description" class="error-message">{{ errors.description }}</span>
        </div>

        <!-- 文件上传区域 -->
        <div class="form-group">
          <label>上传设计稿文件 *</label>
          <div 
            class="upload-area"
            :class="{ 'drag-over': isDragOver }"
            @dragover="handleDragOver"
            @dragleave="handleDragLeave"
            @drop="handleDrop"
            @click="triggerFileInput"
          >
            <input 
              ref="fileInputRef"
              type="file" 
              multiple 
              accept="image/png,image/jpeg,image/gif,image/svg+xml,application/photoshop,application/postscript"
              @change="handleFileSelect"
              class="file-input"
            />
            <div class="upload-content">
              <div class="upload-icon">📁</div>
              <p>点击或拖拽文件到此处上传</p>
              <p class="hint">支持格式: PNG, JPG, GIF, PSD, AI, SVG | 单个文件最大 10MB</p>
            </div>
          </div>
          <span v-if="errors.files" class="error-message">{{ errors.files }}</span>
        </div>

        <!-- 已选文件列表 -->
        <div v-if="selectedFiles.length > 0" class="file-list">
          <h3>已选择的文件</h3>
          <div 
            v-for="(file, index) in selectedFiles" 
            :key="index" 
            :class="['file-item', { 'invalid': !file.valid }]"
          >
            <div class="file-info">
              <span class="file-icon">{{ file.valid ? '✓' : '✗' }}</span>
              <div class="file-details">
                <span class="file-name">{{ file.name }}</span>
                <span class="file-size">{{ file.size }}</span>
              </div>
            </div>
            
            <!-- 文件验证错误 -->
            <div v-if="file.errors.length > 0" class="file-errors">
              <span v-for="(error, i) in file.errors" :key="i" class="error-text">{{ error }}</span>
            </div>
            
            <!-- 上传进度 -->
            <div v-if="file.status === 'uploading'" class="file-progress">
              <div class="progress-bar" :style="{ width: file.progress + '%' }"></div>
            </div>
            
            <!-- 上传状态 -->
            <span v-if="file.status === 'completed'" class="status-badge success">✓ 已完成</span>
            
            <!-- 移除按钮 -->
            <button 
              v-if="file.status !== 'uploading'"
              type="button" 
              class="remove-btn" 
              @click="removeFile(index)"
            >
              ×
            </button>
          </div>
        </div>

        <!-- 整体上传进度 -->
        <div v-if="uploadStatus === 'uploading'" class="progress-section">
          <div class="progress-header">
            <span>上传进度</span>
            <span>{{ uploadProgress }}%</span>
          </div>
          <div class="progress-container">
            <div class="progress-bar" :style="{ width: uploadProgress + '%' }"></div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="form-actions">
          <button type="button" class="btn-reset" @click="resetForm">重置</button>
          <button 
            type="submit" 
            class="btn-submit"
            :disabled="uploadStatus === 'uploading'"
          >
            {{ uploadStatus === 'uploading' ? '上传中...' : '提交上传' }}
          </button>
        </div>
      </form>

      <!-- 上传结果 -->
      <div v-if="uploadStatus === 'completed'" class="result-section">
        <div class="result-header">
          <h2>上传完成</h2>
        </div>
        <div class="result-list">
          <div 
            v-for="(result, index) in uploadResults" 
            :key="index"
            :class="['result-item', result.status]"
          >
            <span class="result-icon">{{ result.status === 'success' ? '✓' : '✗' }}</span>
            <span class="result-name">{{ result.name }}</span>
            <span class="result-message">{{ result.message }}</span>
          </div>
        </div>
        <button class="btn-back" @click="resetForm">继续上传</button>
      </div>

      <!-- 格式说明 -->
      <div class="format-guide">
        <h3>支持的文件格式</h3>
        <div class="format-grid">
          <div class="format-item">
            <span class="format-icon">🖼️</span>
            <span class="format-name">PNG / JPG / GIF</span>
            <span class="format-desc">图片格式</span>
          </div>
          <div class="format-item">
            <span class="format-icon">🎨</span>
            <span class="format-name">PSD</span>
            <span class="format-desc">Photoshop 格式</span>
          </div>
          <div class="format-item">
            <span class="format-icon">✏️</span>
            <span class="format-name">AI</span>
            <span class="format-desc">Illustrator 格式</span>
          </div>
          <div class="format-item">
            <span class="format-icon">📐</span>
            <span class="format-name">SVG</span>
            <span class="format-desc">矢量图形格式</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.upload-page {
  font-family: Arial, sans-serif;
  padding-top: 120px;
  min-height: 100vh;
  background-color: #f9f9f9;
}

.upload-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

/* 页面标题 */
.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-header h1 {
  font-size: 32px;
  color: #333;
  margin: 0 0 15px 0;
}

.page-header p {
  font-size: 14px;
  color: #666;
  margin: 0;
}

/* 上传表单 */
.upload-form {
  background-color: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 30px;
}

/* 表单组 */
.form-group {
  margin-bottom: 25px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
  transition: all 0.3s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #ffcc00;
}

.form-group input.error-border,
.form-group textarea.error-border {
  border-color: #ff3b30;
}

.form-group textarea {
  resize: vertical;
}

.error-message {
  display: block;
  font-size: 12px;
  color: #ff3b30;
  margin-top: 5px;
}

/* 上传区域 */
.upload-area {
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.upload-area:hover {
  border-color: #ffcc00;
  background-color: #fffef5;
}

.upload-area.drag-over {
  border-color: #ff3b30;
  background-color: #fff5f5;
}

.file-input {
  display: none;
}

.upload-content {
  pointer-events: none;
}

.upload-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.upload-content p {
  margin: 0 0 10px 0;
  font-size: 16px;
  color: #333;
}

.upload-content .hint {
  font-size: 13px;
  color: #999;
  margin: 0;
}

/* 文件列表 */
.file-list {
  margin-top: 20px;
}

.file-list h3 {
  font-size: 14px;
  color: #333;
  margin: 0 0 15px 0;
}

.file-item {
  display: flex;
  align-items: center;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 6px;
  margin-bottom: 10px;
  transition: all 0.3s;
}

.file-item:hover {
  border-color: #ffcc00;
}

.file-item.invalid {
  border-color: #ff3b30;
  background-color: #fff8f8;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.file-icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
}

.file-item:not(.invalid) .file-icon {
  background-color: #e8f5e9;
  color: #4caf50;
}

.file-item.invalid .file-icon {
  background-color: #ffebee;
  color: #ff3b30;
}

.file-details {
  display: flex;
  flex-direction: column;
}

.file-name {
  font-size: 14px;
  color: #333;
}

.file-size {
  font-size: 12px;
  color: #999;
}

.file-errors {
  flex: 1;
  text-align: right;
}

.error-text {
  font-size: 12px;
  color: #ff3b30;
}

.file-progress {
  flex: 1;
  height: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  margin: 0 15px;
}

.progress-bar {
  height: 100%;
  background-color: #ffcc00;
  border-radius: 4px;
  transition: width 0.3s;
}

.status-badge {
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 20px;
  margin-right: 15px;
}

.status-badge.success {
  background-color: #e8f5e9;
  color: #4caf50;
}

.remove-btn {
  width: 30px;
  height: 30px;
  border: none;
  background-color: #f5f5f5;
  color: #666;
  font-size: 20px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s;
}

.remove-btn:hover {
  background-color: #ff3b30;
  color: white;
}

/* 整体进度 */
.progress-section {
  margin-top: 20px;
  padding: 20px;
  background-color: #f8f8f8;
  border-radius: 6px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;
  color: #333;
}

.progress-container {
  height: 12px;
  background-color: #e0e0e0;
  border-radius: 6px;
  overflow: hidden;
}

/* 操作按钮 */
.form-actions {
  display: flex;
  gap: 15px;
  margin-top: 30px;
}

.btn-reset,
.btn-submit {
  flex: 1;
  padding: 15px 20px;
  font-size: 14px;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-reset {
  background-color: #f5f5f5;
  color: #666;
}

.btn-reset:hover {
  background-color: #e0e0e0;
}

.btn-submit {
  background-color: #ff3b30;
  color: white;
}

.btn-submit:hover:not(:disabled) {
  background-color: #e03024;
}

.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 上传结果 */
.result-section {
  background-color: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 30px;
}

.result-header {
  text-align: center;
  margin-bottom: 25px;
}

.result-header h2 {
  font-size: 24px;
  color: #333;
  margin: 0;
}

.result-list {
  margin-bottom: 25px;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 15px;
  border-radius: 6px;
  margin-bottom: 10px;
}

.result-item.success {
  background-color: #e8f5e9;
}

.result-item.failed {
  background-color: #ffebee;
}

.result-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

.result-item.success .result-icon {
  background-color: #4caf50;
  color: white;
}

.result-item.failed .result-icon {
  background-color: #ff3b30;
  color: white;
}

.result-name {
  flex: 1;
  font-size: 14px;
  color: #333;
}

.result-message {
  font-size: 12px;
}

.result-item.success .result-message {
  color: #4caf50;
}

.result-item.failed .result-message {
  color: #ff3b30;
}

.btn-back {
  width: 100%;
  padding: 15px;
  font-size: 14px;
  font-weight: bold;
  background-color: #ffcc00;
  color: #1a1a1a;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-back:hover {
  background-color: #e6b800;
}

/* 格式说明 */
.format-guide {
  background-color: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.format-guide h3 {
  font-size: 18px;
  color: #333;
  margin: 0 0 20px 0;
}

.format-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.format-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  transition: all 0.3s;
}

.format-item:hover {
  border-color: #ffcc00;
  background-color: #fffef5;
}

.format-icon {
  font-size: 24px;
}

.format-name {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.format-desc {
  font-size: 12px;
  color: #999;
}

/* 响应式设计 */
@media (max-width: 600px) {
  .format-grid {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .file-item {
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .file-progress {
    width: 100%;
    margin: 10px 0;
  }
}
</style>
