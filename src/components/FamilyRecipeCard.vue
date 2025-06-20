<template>
  <b-card
    class="shadow-sm"
    :img-src="recipe.image"
    img-alt="Recipe image"
    img-top
    style="max-width: 100%;"
  >
    <h4 class="mt-2 mb-1 text-truncate">{{ recipe.name }}</h4>

    <div class="mb-2 text-muted">
      <div>🕒 {{ recipe.preparationTime }} minutes</div>
      <div>🍽️ Servings: {{ recipe.servingsAmount }}</div>
    </div>

    <b-card-text class="mb-2">
      {{ recipe.summary }}
    </b-card-text>

    <!-- Family context -->
    <div class="family-context bg-light p-3 mb-3 rounded border">
    <p class="mb-1"><strong>Owner of the recipe:</strong> {{ recipe.familyowner }}</p>
    <p class="mb-0"><strong>Used to do it on:</strong> {{ recipe.whenmade }}</p>
    </div>


    <!-- Ingredients -->
    <div v-if="recipe.ingredients?.length" class="mb-3">
      <h6>🧂 Ingredients:</h6>
      <ul class="mb-0">
        <li v-for="(item, index) in recipe.ingredients" :key="index">{{ item }}</li>
      </ul>
    </div>

    <!-- Instructions -->
    <div v-if="recipe.instructions?.length">
      <h6>📋 Instructions:</h6>
      <ol>
        <li v-for="(step, index) in recipe.instructions" :key="index">{{ step }}</li>
      </ol>
    </div>

    <!-- Diet badges -->
    <div class="mt-3 d-flex flex-wrap gap-2">
      <b-badge :variant="recipe.isVegan ? 'success' : 'secondary'">
        {{ recipe.isVegan ? 'Vegan' : 'Not Vegan' }}
      </b-badge>
      <b-badge :variant="recipe.isVegetarian ? 'info' : 'secondary'">
        {{ recipe.isVegetarian ? 'Vegetarian' : 'Not Vegetarian' }}
      </b-badge>
      <b-badge :variant="recipe.isGlutenFree ? 'warning' : 'secondary'">
        {{ recipe.isGlutenFree ? 'Gluten-Free' : 'Contains Gluten' }}
      </b-badge>
    </div>
  </b-card>
</template>

<script>
export default {
  name: "FamilyRecipeCard",
  props: {
    recipe: {
      type: Object,
      required: true,
    },
  },
};

</script>

<style scoped>
.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
