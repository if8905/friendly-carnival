<template>
  <footer class="footer-section">
    <div class="footer-container">
      <!-- 平台简介 -->
      <div class="footer-info">
        <h3>椰风纸语</h3>
        <p>海口秀英剪纸数字化传承平台，致力于非遗文化的保护、传承与创新，为游客、学员和消费者提供丰富的剪纸文化体验。</p>
      </div>
      
      <!-- 快速链接 -->
      <div class="footer-links">
        <h4>快速链接</h4>
        <ul>
          <li><router-link to="/">首页</router-link></li>
          <li><router-link to="/courses">课程</router-link></li>
          <li><router-link to="/shop">商城</router-link></li>
          <li><router-link to="/support">助农</router-link></li>
          <li><router-link to="/profile">个人中心</router-link></li>
        </ul>
      </div>
      
      <!-- 联系方式 -->
      <div class="footer-contact">
        <h4>联系方式</h4>
        <p>电话：400-123-4567</p>
        <p>邮箱：contact@yefengzhiyu.com</p>
        <p>地址：海南省海口市秀英区</p>
      </div>
      
      <!-- 友情链接 -->
      <div class="footer-friends">
        <h4>友情链接</h4>
        <ul>
          <li><a href="#">海口旅游局</a></li>
          <li><a href="#">秀英区政府</a></li>
          <li><a href="#">非遗保护中心</a></li>
          <li><a href="#">文化和旅游部</a></li>
        </ul>
      </div>
    </div>
    
    <!-- 备案信息 -->
    <div class="footer-bottom">
      <p>© 2026 椰风纸语 版权所有 | 琼ICP备12345678号</p>
    </div>
  </footer>
</template>

<script setup>
// 底部组件
</script>

<style scoped>
.footer-section {
  background-color: #f5f5f5;
  padding: 40px 0;
  margin-top: 60px;
}

.footer-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
}

.footer-info h3 {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
}

.footer-info p {
  color: #666;
  line-height: 1.6;
}

.footer-links h4,
.footer-contact h4,
.footer-friends h4 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 15px;
  color: #333;
}

.footer-links ul,
.footer-friends ul {
  list-style: none;
  padding: 0;
}

.footer-links li,
.footer-friends li {
  margin-bottom: 10px;
}

.footer-links a,
.footer-friends a {
  color: #666;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-links a:hover,
.footer-friends a:hover {
  color: #409eff;
}

.footer-contact p {
  color: #666;
  margin-bottom: 10px;
}

.footer-bottom {
  text-align: center;
  padding-top: 30px;
  margin-top: 30px;
  border-top: 1px solid #e0e0e0;
  color: #999;
  font-size: 14px;
}
</style>