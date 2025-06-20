<template>
  <div class="container my-4" v-if="recipe">
    <h2>{{ recipe.name }}</h2>
    <img :src="recipe.image" :alt="recipe.name" class="img-fluid mb-3" />

    <div class="mb-2">
      <b-badge :variant="isViewed ? 'primary' : 'secondary'">
        {{ isViewed ? 'Viewed' : 'Not Viewed' }}
      </b-badge>
      <b-badge :variant="isFavorite ? 'danger' : 'secondary'" class="ms-2">
        {{ isFavorite ? '❤️ Liked' : '🤍 Not Liked' }}
      </b-badge>
    </div>

    <p><strong>Preparation Time:</strong> {{ recipe.preparationTime }} minutes</p>
    <p><strong>Popularity:</strong> 👍 {{ recipe.likes }}</p>
    <p><strong>Servings:</strong> {{ recipe.servingsAmount }}</p>

    <div class="mb-3">
      <b-badge :variant="recipe.isVegan ? 'success' : 'secondary'">
        {{ recipe.isVegan ? 'Vegan' : 'Not Vegan' }}
      </b-badge>
      <b-badge :variant="recipe.isVegetarian ? 'info' : 'secondary'" class="ms-2">
        {{ recipe.isVegetarian ? 'Vegetarian' : 'Not Vegetarian' }}
      </b-badge>
      <b-badge :variant="recipe.isGlutenFree ? 'warning' : 'secondary'" class="ms-2">
        {{ recipe.isGlutenFree ? 'Gluten-Free' : 'Contains Gluten' }}
      </b-badge>
    </div>

    <h5>Ingredients</h5>
    <ul>
      <li v-for="(ing, idx) in recipe.ingredients" :key="idx">{{ ing }}</li>
    </ul>

    <h5>Instructions</h5>
    <ol>
      <li v-for="(step, idx) in recipe.instructions" :key="idx">{{ step }}</li>
    </ol>
  </div>
</template>

<script>
import { ref, onMounted, getCurrentInstance } from 'vue';
import { useRoute } from 'vue-router';

export default {
  name: 'LocalRecipePage',
  setup() {
    const recipe = ref(null);
    const route = useRoute();
    const isViewed = ref(route.query.isViewed === 'true');
    const isFavorite = ref(route.query.isFavorite === 'true');

    const internalInstance = getCurrentInstance();
    const { axios, store } = internalInstance.appContext.config.globalProperties;

    onMounted(async () => {
      try {
        const res = await axios.get(
          `${store.server_domain}/api/recipes/me/${route.params.recipeid}`,
          { withCredentials: true }
        );
        recipe.value = res.data;
      } catch (err) {
        console.error('Failed to fetch local recipe:', err);
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
