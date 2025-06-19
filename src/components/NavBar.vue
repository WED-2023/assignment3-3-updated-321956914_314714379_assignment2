<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container">
      <router-link class="navbar-brand" :to="{ name: 'main' }">Vue Recipes</router-link>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'main' }">Main</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'search' }">Search</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'about' }">About</router-link>
          </li>
        </ul>

        <div class="d-flex align-items-center">
          <template v-if="store.username">
            <span class="me-3">Hello, {{ store.username }}</span>

            <ul class="navbar-nav me-3">
              <li class="nav-item dropdown">
                <a
                  class="nav-link dropdown-toggle"
                  href="#"
                  id="personalDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Personal
                </a>
                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="personalDropdown">
                  <li>
                    <router-link class="dropdown-item" :to="{ name: 'favorites' }">My Favorite Recipes</router-link>
                  </li>
                  <li>
                    <router-link class="dropdown-item" :to="{ name: 'myrecipes' }">My Recipes</router-link>
                  </li>
                  <li>
                    <router-link class="dropdown-item" :to="{ name: 'familyrecipes' }">My Family Recipes</router-link>
                  </li>
                </ul>
              </li>
            </ul>

            <button class="btn btn-primary me-3" @click="navigateToCreateRecipe">
              Create Recipe
            </button>

            <button class="btn btn-outline-danger" @click="logout">Logout</button>
          </template>

          <template v-else>
            <span class="me-3">Hello Guest!</span>
            <router-link class="btn btn-outline-primary me-2" :to="{ name: 'login' }">Login</router-link>
            <router-link class="btn btn-primary" :to="{ name: 'register' }">Register</router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { getCurrentInstance } from 'vue';

export default {
  name: "NavBar",
  setup() {
    const internalInstance = getCurrentInstance();
    const store = internalInstance.appContext.config.globalProperties.store;
    const toast = internalInstance.appContext.config.globalProperties.toast;
    const router = internalInstance.appContext.config.globalProperties.$router;
    const axios = internalInstance.appContext.config.globalProperties.axios;

    const logout = async () => {
      try {
        await axios.post(store.server_domain + "/api/logout", {}, { withCredentials: true });
        store.logout();
        toast("Logout", "User logged out successfully", "success");
        router.push("/").catch(() => {});
      } catch (error) {
        toast("Logout Error", "Failed to contact logout endpoint", "danger");
      }
    };

    const navigateToCreateRecipe = () => {
      router.push({ name: "createrecipe" });
    };

    return { store, logout, navigateToCreateRecipe };
  }
};
</script>
