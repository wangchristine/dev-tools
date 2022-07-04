<template>
  <div class="container">
    <h1>404</h1>
    <h2>Page Not Found</h2>
    <div class="redirect">
      <RouterLink :to="{ name: 'home' }">Go To Home</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  height: 100%;
  flex-direction: column;
  text-align: center;
  justify-content: center;
}

.container h1 {
  font-size: 40px;
  letter-spacing: 10px;
}

.container h2 {
  font-size: 32px;
  letter-spacing: 5px;
}

.redirect {
  padding: 20px;
}
.redirect a {
  text-decoration: underline;
  font-size: 18px;
  color: #53b79b;
  font-weight: bold;
}
</style>
