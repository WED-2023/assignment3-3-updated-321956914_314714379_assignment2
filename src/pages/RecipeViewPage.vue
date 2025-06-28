<template>
  <div class="container my-4" v-if="recipe">
    <h2>{{ recipe.title }}</h2>
    <img
      :src="recipe.image"
      :alt="recipe.title"
      class="img-fluid mb-3 recipe-image"
    />

    <div class="mb-2">
      <b-badge :variant="isViewed ? 'primary' : 'secondary'">
        {{ isViewed ? 'Viewed' : 'Not Viewed' }}
      </b-badge>
      <b-badge :variant="isFavorite ? 'danger' : 'secondary'" class="ms-2">
        {{ isFavorite ? '❤️ Liked' : '🤍 Not Liked' }}
      </b-badge>
    </div>

    <p><strong>Preparation Time:</strong> {{ recipe.readyInMinutes }} minutes</p>
    <p><strong>Popularity:</strong> 👍 {{ recipe.aggregateLikes }}</p>
    <p><strong>Servings:</strong> {{ recipe.servings }}</p>

    <div class="mb-3">
      <b-badge :variant="recipe.vegan ? 'success' : 'secondary'">
        {{ recipe.vegan ? 'Vegan' : 'Not Vegan' }}
      </b-badge>
      <b-badge :variant="recipe.vegetarian ? 'info' : 'secondary'" class="ms-2">
        {{ recipe.vegetarian ? 'Vegetarian' : 'Not Vegetarian' }}
      </b-badge>
      <b-badge :variant="recipe.glutenFree ? 'warning' : 'secondary'" class="ms-2">
        {{ recipe.glutenFree ? 'Gluten-Free' : 'Contains Gluten' }}
      </b-badge>
    </div>

    <h5>Ingredients</h5>
    <ul>
      <li v-for="i in recipe.extendedIngredients" :key="i.id">{{ i.original }}</li>
    </ul>

    <h5>Instructions</h5>
    <p v-if="recipe.instructions">{{ recipe.instructions }}</p>
    <p v-else class="text-muted">No instructions provided.</p>
  </div>
</template>

<script>
import { ref, onMounted, getCurrentInstance } from "vue";
import { useRoute } from "vue-router";

export default {
  name: "ExternalRecipePage",
  setup() {
    const recipe = ref(null);
    const route = useRoute();
    const isViewed = ref(route.query.isViewed === "true");
    const isFavorite = ref(route.query.isFavorite === "true");

    const internalInstance = getCurrentInstance();
    const { axios, store } = internalInstance.appContext.config.globalProperties;

    onMounted(async () => {
      try {
        const res = await axios.get(
          `${store.server_domain}/api/recipes/${route.params.recipeid}`,
          { withCredentials: true }
        );
        recipe.value = res.data;
      } catch (err) {
        console.error("Failed to fetch external recipe:", err);
      }
    });

    return {
      recipe,
      isViewed,
      isFavorite,
    };
  },
};
</script>

<style scoped>
.recipe-image {
  max-width: 600px;
  max-height: 400px;
  object-fit: contain;
  display: block;
  margin-bottom: 1rem;
}
</style>
