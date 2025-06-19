<template>
  <div class="container">
    <h3>{{ title }}</h3>

    <div class="d-flex flex-column gap-3">
      <div v-for="r in recipes" :key="r.id">
        <RecipePreview class="recipePreview" :recipe="r" />
      </div>
    </div>
  </div>
</template>

<script>
import RecipePreview from "./RecipePreview.vue";

export default {
  name: "LastViewedRecipes",
  components: {
    RecipePreview,
  },
  props: {
    title: {
      type: String,
      default: "Last Viewed Recipes",
    },
  },
  data() {
    return {
      recipes: [],
    };
  },
  mounted() {
    this.updateRecipes();
  },
  methods: {
    async updateRecipes() {
      try {
        const response = await this.axios.get(
          this.$root.store.server_domain + "/api/users/lastviewed"
        , { withCredentials: true });
        // Limit to 3 last viewed recipes
        this.recipes = response.data.slice(0, 3);
      } catch (error) {
        console.error("Failed to fetch last viewed recipes:", error);
      }
    },
  },
};
</script>

<style scoped>
.container {
  min-height: 400px;
}
</style>
