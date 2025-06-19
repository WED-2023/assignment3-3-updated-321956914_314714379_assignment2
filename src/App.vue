<template>
  <div id="app">
    <b-navbar toggleable="lg" type="light" variant="light">
      <b-navbar-brand :to="{ name: 'main' }" tag="router-link">Vue Recipes</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item :to="{ name: 'main' }" tag="router-link">Main</b-nav-item>
          <b-nav-item :to="{ name: 'search' }" tag="router-link">Search</b-nav-item>
          <b-nav-item :to="{ name: 'about' }" tag="router-link">About</b-nav-item>
        </b-navbar-nav>

        <b-navbar-nav class="ms-auto">
          <template v-if="!store.username">
            <b-navbar-text>Hello Guest!</b-navbar-text>
            <b-nav-item :to="{ name: 'login' }" tag="router-link">Login</b-nav-item>
            <b-nav-item :to="{ name: 'register' }" tag="router-link">Register</b-nav-item>
          </template>
          <template v-else>
            <b-navbar-text>Hello {{ store.username }}!</b-navbar-text>

            <b-nav-item-dropdown text="Personal Space" right>
              <b-dropdown-item :to="{ name: 'favorites' }" tag="router-link">My Favorite Recipes</b-dropdown-item>
              <b-dropdown-item :to="{ name: 'myrecipes' }" tag="router-link">My Recipes</b-dropdown-item>
              <b-dropdown-item :to="{ name: 'familyrecipes' }" tag="router-link">My Family Recipes</b-dropdown-item>
            </b-nav-item-dropdown>

            <b-nav-item :to="{ name: 'createrecipe' }" tag="router-link">Create Recipe</b-nav-item>

            <b-button variant="outline-danger" size="sm" class="ms-2" @click="logout">
              Logout
            </b-button>
          </template>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <router-view />
    <b-toast-container />
  </div>
</template>

<script>
import { getCurrentInstance } from 'vue';

export default {
  name: "App",
  setup() {
    const internalInstance = getCurrentInstance();
    const store = internalInstance.appContext.config.globalProperties.store;
    const toast = internalInstance.appContext.config.globalProperties.toast;
    const router = internalInstance.appContext.config.globalProperties.$router;
    const axios = internalInstance.appContext.config.globalProperties.axios;

    const logout = async () => {
      try {
        await axios.post(store.server_domain + "/api/logout", {}, { withCredentials: true}); //
        store.logout();
        toast("Logout", "User logged out successfully", "success");
        router.push("/").catch(() => {});
      } catch (error) {
          toast("Logout Error", "Failed to contact logout endpoint", "danger");
      }
    };

    return { store, logout };
  }
}
</script>

<style lang="scss">
@use "@/scss/form-style.scss" as *;


#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
