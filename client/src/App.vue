<template>
  <div id="app">
    <Nav />
    <main>
    <router-view/>
    </main>
    <Footer />
  </div>
</template>

<script>
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export default {
  components: {
    Nav,
    Footer
  }
}
</script>

<style lang='scss'>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700;800&display=swap');

:root {
  --primary-red: #E12E2E;
  --light-grey: #EAEAEA;
  --text-color-body: #5F5F5F;
  --text-color-heading: #000000;
  --background-color: #FFFFFF;
  --font-family-main: 'Manrope', sans-serif;
}

body {
  font-family: var(--font-family-main);
  color: var(--text-color-body);
  background-color: var(--background-color);
  margin: 0;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
  padding-top: 80px; /* To offset sticky nav, will enable later */
}

h1, h2, h3, h4, h5, h6 {
  color: var(--text-color-heading);
  font-weight: 800;
}

a {
  font-weight: 500;
  color: var(--text-color-heading);
  text-decoration: none;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}
</style>
