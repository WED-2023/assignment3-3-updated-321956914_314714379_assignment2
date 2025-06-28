<template>
  <div class="container">
    <h3>{{ title }}</h3>

    <div class="d-flex flex-column gap-3">
      <div v-for="r in recipes" :key="r.id">
        <RecipePreview class="recipePreview" :recipe="r" />
      </div>
    </div>

    <div class="mt-4 text-left">
      <button class="btn btn-primary w-50" @click="updateRecipes">
        Refresh Recipes
      </button>
    </div>
  </div>
</template>

<script>
import RecipePreview from "./RecipePreview.vue";
export default {
  name: "RecipePreviewList",
  components: {
    RecipePreview,
  },
  props: {
    title: {
      type: String,
      required: true,
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
          this.$root.store.server_domain + "/api/recipes/random"
        );
        this.recipes = response.data;
      } catch (error) {
        console.log(error);
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
