<script setup>
// 管理员顶部样式组件
</script>

<template>
  <!-- 管理员顶部动态黄白渐变样式 -->
  <header class="manager-header">
    <!-- 动态渐变背景层 -->
    <div class="gradient-layer"></div>
    <!-- 闪光效果层 -->
    <div class="shine-layer"></div>
    
    <div class="header-content">
      <div class="header-left">
        <h1 class="logo">校园物料</h1>
        <span class="subtitle">管理后台</span>
      </div>
    </div>
  </header>
</template>

<style scoped>
.manager-header {
  width: 100%;
  padding: 16px 24px;
  box-shadow: 0 4px 15px rgba(255, 153, 0, 0.25);
  position: relative;
  overflow: hidden;
  z-index: 100;
  min-height: 70px;
}

/* 动态渐变背景 */
.gradient-layer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #fffef5 0%, #fff8e1 25%, #ffecb3 50%, #ffd54f 75%, #ffeb3b 100%);
  background-size: 400% 400%;
  animation: gradientShift 8s ease infinite;
  z-index: 0;
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* 闪光效果 */
.shine-layer {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.4) 50%,
    transparent 100%
  );
  animation: shineMove 3s ease-in-out infinite;
  z-index: 1;
}

@keyframes shineMove {
  0% {
    left: -100%;
  }
  50%, 100% {
    left: 100%;
  }
}

.header-content {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  z-index: 2;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  font-size: 26px;
  font-weight: bold;
  color: #333;
  margin: 0;
  text-shadow: 0 2px 4px rgba(255, 255, 255, 0.5);
  transition: transform 0.3s ease;
}

.logo:hover {
  transform: scale(1.02);
}

.subtitle {
  font-size: 14px;
  color: rgba(51, 51, 51, 0.75);
  padding: 5px 14px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.subtitle:hover {
  background: rgba(255, 255, 255, 0.9);
  transform: translateY(-1px);
}
</style>