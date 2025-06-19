<template>
  <b-navbar toggleable="lg" type="light" variant="light">
    <b-container>
      <b-navbar-brand :to="{ name: 'main' }" tag="router-link">Vue Recipes</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse" />

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item :to="{ name: 'search' }" tag="router-link">Search</b-nav-item>
          <b-nav-item :to="{ name: 'about' }" tag="router-link">About</b-nav-item>
        </b-navbar-nav>

        <b-navbar-nav class="ms-auto align-items-center">
          <template v-if="store.username">
            <span class="me-3">Hello, {{ store.username }}</span>

            <!-- Manual dropdown with ref -->
            <div
              class="nav-item dropdown"
              style="position: relative;"
              ref="dropdownRef"
            >
              <a
                href="#"
                class="nav-link dropdown-toggle"
                @click.prevent="toggleDropdown"
                :class="{ active: isDropdownOpen }"
                role="button"
                aria-expanded="isDropdownOpen ? 'true' : 'false'"
              >
                Personal Space
              </a>

              <ul
                class="dropdown-menu"
                :class="{ show: isDropdownOpen }"
                style="position: absolute; right: 0; min-width: 10rem;"
              >
                <li>
                  <router-link
                    class="dropdown-item"
                    :to="{ name: 'favorites' }"
                    @click="closeDropdown"
                  >
                    My Favorite Recipes
                  </router-link>
                </li>
                <li>
                  <router-link
                    class="dropdown-item"
                    :to="{ name: 'myrecipes' }"
                    @click="closeDropdown"
                  >
                    My Recipes
                  </router-link>
                </li>
                <li>
                  <router-link
                    class="dropdown-item"
                    :to="{ name: 'familyrecipes' }"
                    @click="closeDropdown"
                  >
                    My Family Recipes
                  </router-link>
                </li>
              </ul>
            </div>

            <b-nav-item :to="{ name: 'createrecipe' }" tag="router-link" class="ms-3">
              Create Recipe
            </b-nav-item>

            <b-nav-item
              class="ms-3"
              role="button"
              style="cursor:pointer;"
              @click.prevent="logout"
            >
              Logout
            </b-nav-item>
          </template>

          <template v-else>
            <span class="me-3">Hello Guest!</span>
            <b-nav-item :to="{ name: 'login' }" tag="router-link">Login</b-nav-item>
            <b-nav-item :to="{ name: 'register' }" tag="router-link" class="ms-2">
              Register
            </b-nav-item>
          </template>
        </b-navbar-nav>
      </b-collapse>
    </b-container>
  </b-navbar>
</template>

<script>
import { ref, getCurrentInstance, onMounted, onBeforeUnmount } from "vue";

export default {
  name: "NavBar",
  setup() {
    const isDropdownOpen = ref(false);
    const dropdownRef = ref(null);

    const internalInstance = getCurrentInstance();
    const store = internalInstance.appContext.config.globalProperties.store;
    const toast = internalInstance.appContext.config.globalProperties.toast;
    const router = internalInstance.appContext.config.globalProperties.$router;
    const axios = internalInstance.appContext.config.globalProperties.axios;

    function toggleDropdown() {
      isDropdownOpen.value = !isDropdownOpen.value;
    }
    function closeDropdown() {
      isDropdownOpen.value = false;
    }

    async function logout() {
      closeDropdown();
      try {
        await axios.post(store.server_domain + "/api/logout", {}, { withCredentials: true });
        store.logout();
        toast("Logout", "User logged out successfully", "success");
        router.push("/").catch(() => {});
      } catch (error) {
        toast("Logout Error", "Failed to contact logout endpoint", "danger");
      }
    }

    function onClickOutside(event) {
      if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
        closeDropdown();
      }
    }

    onMounted(() => {
      document.addEventListener("click", onClickOutside);
    });

    onBeforeUnmount(() => {
      document.removeEventListener("click", onClickOutside);
    });

    return { store, isDropdownOpen, toggleDropdown, closeDropdown, logout, dropdownRef };
  },
};
</script>

<style scoped>
.navbar-brand {
  font-weight: 700;
  font-size: 1.5rem;
}

.me-3 {
  margin-right: 1rem !important;
}

.ms-3 {
  margin-left: 1rem !important;
}

/* Bootstrap-like dropdown styles */
.dropdown-menu {
  display: none;
  min-width: 10rem;
  margin-top: 0.125rem;
  padding: 0.5rem 0;
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 0.25rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.175);
  z-index: 1000;
}

.dropdown-menu.show {
  display: block;
}

.dropdown-item {
  padding: 0.25rem 1.5rem;
  color: #212529;
  text-decoration: none;
  display: block;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
  color: #0d6efd;
}
</style>
