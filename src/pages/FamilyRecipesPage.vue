<template>
  <div class="container my-4">
    <h2>My Family Recipes</h2>

    <div v-if="loading" class="text-center my-4">
      <b-spinner label="Loading..." />
    </div>

    <div v-if="!loading && recipes.length === 0" class="text-center my-4">
      <b-alert variant="warning">No family recipes found.</b-alert>
    </div>

    <div class="d-flex flex-wrap gap-3 mt-4">
      <FamilyRecipeCard
        v-for="r in recipes"
        :key="r.recipe_id"
        :recipe="r"
      />
    </div>
  </div>
</template>

<script>
import { ref, getCurrentInstance, onMounted } from "vue";
import FamilyRecipeCard from "../components/FamilyRecipeCard.vue";

export default {
  name: "FamilyRecipesPage",
  components: { FamilyRecipeCard },
  setup() {
    const recipes = ref([]);
    const loading = ref(true);

    const internalInstance = getCurrentInstance();
    const { axios, store, toast } = internalInstance.appContext.config.globalProperties;

    async function fetchFamilyRecipes() {
      try {
        const res = await axios.get(store.server_domain + "/api/users/familyrecipes", {
          withCredentials: true,
        });

        const enriched = await Promise.all(
          res.data.map(async (entry) => {
            try {
              const recipeRes = await axios.get(
                `${store.server_domain}/api/recipes/me/${entry.recipe_id}`,
                { withCredentials: true }
              );
              return {
                ...recipeRes.data,
                familyowner: entry.familyowner,
                whenmade: entry.whenmade,
              };
            } catch (err) {
              console.error("Failed to fetch full family recipe:", err);
              return null;
            }
          })
        );

        recipes.value = enriched.filter(Boolean);
      } catch (err) {
        toast("Error", "Failed to load family recipes", "danger");
        console.error("Error loading family recipes:", err);
      } finally {
        loading.value = false;
      }
    }

    onMounted(fetchFamilyRecipes);

    return {
      recipes,
      loading,
    };
  },
};
</script>

<style scoped>
.container {
  min-height: 600px;
}
.d-flex.flex-wrap.gap-3 {
  gap: 0;
}
</style>
