<template>
  <div class="container my-4">
    <h2>My Favorite Recipes</h2>

    <div v-if="loading" class="text-center my-5">
      <b-spinner label="Loading..."></b-spinner>
    </div>

    <div v-else-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>

    <div v-else>
      <div v-if="recipes.length === 0" class="text-muted">
        You have no favorite recipes yet.
      </div>

      <div class="d-flex flex-wrap gap-3">
        <RecipePreview
          v-for="recipe in recipes"
          :key="recipe.id"
          :recipe="recipe"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, getCurrentInstance } from "vue";
import RecipePreview from "../components/RecipePreview.vue";

export default {
  name: "FavoriteRecipesPage",
  components: { RecipePreview },
  setup() {
    const recipes = ref([]);
    const loading = ref(false);
    const error = ref(null);

    const internalInstance = getCurrentInstance();
    const { axios, store } = internalInstance.appContext.config.globalProperties;

    const fetchFavorites = async () => {
      loading.value = true;
      error.value = null;
      try {
        const res = await axios.get(store.server_domain + "/api/users/favorites", {
          withCredentials: true,
        });
        recipes.value = res.data;
      } catch (err) {
        error.value = "Failed to load favorite recipes.";
        console.error("Error fetching favorites:", err);
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      fetchFavorites();
    });

    return {
      recipes,
      loading,
      error,
    };
  },
};
</script>

<style scoped>
.container {
  min-height: 400px;
}

.d-flex.flex-wrap.gap-3 {
  gap: 1rem;
}
</style>
