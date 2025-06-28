<template>
  <b-card v-if="recipe" class="family-recipe-card shadow-sm">
    <img
      :src="recipe.image || ''"
      :alt="recipe.name || 'Recipe image'"
      class="recipe-image mb-3"
    />

    <h4 class="mt-2 mb-1 text-truncate">{{ recipe.name || 'Untitled Recipe' }}</h4>

    <div class="mb-2 text-muted info-row">
      <div>🕒 {{ recipe.preparationTime ?? 'N/A' }} minutes</div>
      <div>🍽️ Servings: {{ recipe.servingsAmount ?? 'N/A' }}</div>
    </div>

    <div class="card-content">
      <b-card-text class="summary-text mb-2">
        {{ recipe.summary || 'No summary available.' }}
      </b-card-text>

      <!-- Family context -->
      <div class="family-context bg-light p-3 mb-3 rounded border">
        <p class="mb-1"><strong>Owner of the recipe:</strong> {{ recipe.familyowner || '-' }}</p>
        <p class="mb-0"><strong>Used to do it on:</strong> {{ recipe.whenmade || '-' }}</p>
      </div>

      <!-- Ingredients -->
      <div v-if="recipe.ingredients?.length" class="ingredients-section mb-3">
        <h6>🧂 Ingredients:</h6>
        <ul class="ingredient-list mb-0">
          <li v-for="(item, index) in recipe.ingredients" :key="index">{{ item }}</li>
        </ul>
      </div>

      <!-- Instructions -->
      <div v-if="recipe.instructions?.length" class="instructions-section">
        <h6>📋 Instructions:</h6>
        <ol class="instruction-list">
          <li v-for="(step, index) in recipe.instructions" :key="index">{{ step }}</li>
        </ol>
      </div>
    </div>

    <!-- Diet badges -->
    <div class="diet-badges mt-3 d-flex flex-wrap gap-2">
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
.family-recipe-card {
  max-width: 400px;
  width: 100%;

  display: flex !important;
  flex-direction: column !important;
  box-sizing: border-box;
  min-height: 1800px;
}

.family-recipe-card > .card-body {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
}

.card-content {
  flex: 1 1 auto;
  overflow-y: auto;
  margin-bottom: 1rem;
  padding-right: 8px;
}

.recipe-image {
  width: 350px;
  height: 350px;
  object-fit: cover;
  display: block;
  margin: 0 auto 1rem;
  border-radius: 8px;
}


.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.info-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
}

.family-context {
  background-color: #f8f9fa;
  padding: 0.75rem 1rem;
  border-radius: 0.25rem;
  margin-bottom: 1rem;
  border: 1px solid #dee2e6;
}

.ingredient-list {
  padding-left: 1.25rem;
  margin: 0;
}

.instructions-section {
  margin-bottom: 1rem;
}

.instruction-list {
  padding-left: 1.25rem;
  margin: 0;
}

.diet-badges {
  justify-content: flex-start;
  gap: 0.5rem;
}
</style>
