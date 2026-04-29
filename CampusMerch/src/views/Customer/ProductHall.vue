<script setup>
</script>

<template>
  <div class="product-hall">
    <!-- 主横幅 -->
    <section class="hero-banner">
      <div class="banner-content">
        <div class="banner-text">
          <h1>校园物料</h1>
          <h2>Campus Merch</h2>
        </div>
        <div class="banner-cta">
          <button class="shop-now-btn">立即购买</button>
        </div>
      </div>
    </section>
    
    <!-- 产品展示区 -->
    <section class="product-section">
      <h2 class="section-title">热门商品</h2>
      <div class="product-grid">
        <div class="product-card">
          <div class="product-image">
            <div class="discount-tag">-48%</div>
          </div>
          <h3>连帽衫</h3>
          <p class="price">¥199.00</p>
          <p class="original-price">¥399.00</p>
        </div>
        <div class="product-card">
          <div class="product-image">
            <div class="discount-tag">-60%</div>
          </div>
          <h3>T恤</h3>
          <p class="price">¥99.00</p>
          <p class="original-price">¥249.00</p>
        </div>
        <div class="product-card">
          <div class="product-image">
            <div class="discount-tag">-55%</div>
          </div>
          <h3>帽子</h3>
          <p class="price">¥59.00</p>
          <p class="original-price">¥129.00</p>
        </div>
        <div class="product-card">
          <div class="product-image">
            <div class="discount-tag">-55%</div>
          </div>
          <h3>卫衣</h3>
          <p class="price">¥159.00</p>
          <p class="original-price">¥359.00</p>
        </div>
        <div class="product-card">
          <div class="product-image">
            <div class="discount-tag">-45%</div>
          </div>
          <h3>连帽衫</h3>
          <p class="price">¥199.00</p>
          <p class="original-price">¥369.00</p>
        </div>
        <div class="product-card">
          <div class="product-image">
            <div class="discount-tag">-60%</div>
          </div>
          <h3>连帽衫</h3>
          <p class="price">¥199.00</p>
          <p class="original-price">¥499.00</p>
        </div>
        <div class="product-card">
          <div class="product-image">
            <div class="discount-tag">-42%</div>
          </div>
          <h3>连帽衫</h3>
          <p class="price">¥199.00</p>
          <p class="original-price">¥349.00</p>
        </div>
        <div class="product-card">
          <div class="product-image">
            <div class="discount-tag">-42%</div>
          </div>
          <h3>连帽衫</h3>
          <p class="price">¥199.00</p>
          <p class="original-price">¥349.00</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.product-hall {
  min-height: 100%;
}

/* 主横幅 */
.hero-banner {
  background-color: #1a1a1a;
  background-image: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZjYzMwIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDVMNSAwWk02IDRMNCA2Wk0tMSAxTDEgLTFaIiBzdHJva2U9IiNmZmNjMzAiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=');
  background-size: cover;
  background-position: center;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.banner-content {
  text-align: center;
  color: white;
  z-index: 2;
}

.banner-text h1 {
  font-size: 80px;
  font-weight: bold;
  color: #ffcc00;
  margin: 0;
  line-height: 1;
}

.banner-text h2 {
  font-size: 30px;
  font-weight: normal;
  color: white;
  margin: 10px 0 40px 0;
}

.shop-now-btn {
  padding: 15px 40px;
  background-color: transparent;
  border: 2px solid white;
  color: white;
  font-size: 16px;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.shop-now-btn:hover {
  background-color: white;
  color: #1a1a1a;
}

/* 产品展示区 */
.product-section {
  padding: 60px 20px;
  background-color: white;
}

.section-title {
  text-align: center;
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-bottom: 40px;
}

.product-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.product-card {
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  position: relative;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.15);
}

.product-image {
  height: 300px;
  background-color: white;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #e0e0e0;
}

.discount-tag {
  position: absolute;
  top: 15px;
  left: 15px;
  background-color: #ff3b30;
  color: white;
  font-size: 12px;
  font-weight: bold;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  z-index: 2;
}

.product-card h3 {
  padding: 15px 15px 5px;
  margin: 0;
  font-size: 16px;
  color: #333;
  font-weight: normal;
}

.price {
  padding: 0 15px 5px;
  margin: 0;
  font-size: 18px;
  font-weight: bold;
  color: #ff3b30;
}

.original-price {
  padding: 0 15px 15px;
  margin: 0;
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .banner-text h1 {
    font-size: 50px;
  }
  
  .banner-text h2 {
    font-size: 20px;
  }
  
  .product-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
  }
  
  .product-image {
    height: 250px;
  }
}
</style>