<template>
  <div class="container">
    <h3>{{ title }}</h3>
    <div v-if="recipes.length === 0">No recipes found.</div>
    <div v-else class="d-flex flex-column gap-3">
      <div v-for="r in recipes" :key="r.id">
        <RecipePreview :recipe="r" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, getCurrentInstance } from "vue";
import RecipePreview from "./RecipePreview.vue";

export default {
  name: "LastViewedRecipes",
  components: { RecipePreview },
  props: {
    title: {
      type: String,
      default: "Last Viewed Recipes",
    },
  },
  setup() {
    const recipes = ref([]);

    const internalInstance = getCurrentInstance();
    const { axios, store } = internalInstance.appContext.config.globalProperties;

    const getLastRecipes = async () => {
      try {
        console.log("API base URL:", store.server_domain);
        const response = await axios.get(store.server_domain + "/api/users/lastviewed", {
          withCredentials: true,
        });
        recipes.value = response.data;
      } catch (error) {
        console.error("Failed to fetch last viewed recipes:", error);
      }
    };

    onMounted(() => {
      getLastRecipes();
    });

    return { recipes };
  },
};
</script>

<style scoped>
.container {
  min-height: 400px;
}
</style>
