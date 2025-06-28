<template>
  <div class="d-flex flex-column align-items-center justify-content-center vh-100 text-center bg-light px-4">
    <h1 class="display-1 fw-bold text-primary mb-3">404</h1>
    <h2 class="mb-3">Page Not Found</h2>
    <p class="text-muted mb-4">
      Sorry, the page you're looking for doesn't exist or has been moved.
    </p>
    <router-link to="/" class="btn btn-primary btn-lg">
      Go Back Home
    </router-link>
  </div>
</template>

<style scoped>
.vh-100 {
  height: 100vh;
}
</style>
