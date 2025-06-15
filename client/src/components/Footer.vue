/* eslint-disable eol-last */

<template>
  <footer class="site-footer">
    <div class="container footer-content">
      <div class="footer-links">
        <a href="#">About</a>
        <a href="#">Contact</a>
        <a href="#">Privacy Policy</a>
      </div>
      <div class="footer-social">
        <!-- Replace with actual icons later -->
        <a href="#" class="social-icon"></a>
        <a href="#" class="social-icon"></a>
        <a href="#" class="social-icon"></a>
      </div>
    </div>
    <div class="container footer-bottom">
      <p>&copy;2024 Pizza Evaluator. All rights reserved.</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'SiteFooter'
}
</script>

<style scoped>
.site-footer {
  background-color: #fff;
  padding: 40px 0 20px;
  border-top: 1px solid #EAEAEA;
  font-size: 14px;
  color: var(--text-color-body, #5F5F5F);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.footer-links a {
  color: var(--text-color-body, #5F5F5F);
  margin-right: 20px;
  text-decoration: none;
  transition: color 0.3s;
  font-weight: 500;
}

.footer-links a:hover {
  color: var(--text-color-heading, #000);
}

.footer-links a:last-child {
  margin-right: 0;
}

.footer-social {
  display: flex;
  align-items: center;
}

.social-icon {
  display: inline-block;
  width: 24px;
  height: 24px;
  border: 1px solid #EAEAEA;
  border-radius: 50%;
  margin-left: 10px;
  cursor: pointer;
  background-color: #f0f0f0; /* Placeholder color */
  transition: background-color 0.3s;
}

.social-icon:hover {
  background-color: #e0e0e0;
}

.footer-bottom {
  text-align: center;
  border-top: 1px solid #EAEAEA;
  padding-top: 20px;
  margin-top: 20px;
}

.footer-bottom p {
  margin: 0;
}
</style>
