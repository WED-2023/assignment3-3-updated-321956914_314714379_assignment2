<template>
  <b-card
    class="h-100 shadow-sm d-flex flex-column position-relative"
    :img-src="recipe.image"
    img-alt="Recipe image"
    img-top
    style="max-width: 350px;"
  >
    <!-- Clickable overlay covering the image -->
    <div
      class="click-overlay"
      @click.stop="handleCardClick"
      role="button"
      tabindex="0"
      @keydown.enter="handleCardClick"
      aria-label="View full recipe"
    ></div>

    <!-- Title row -->
    <h5 class="mb-1 text-truncate" style="max-width: 100%;">
      {{ recipe.name }}
    </h5>

    <!-- Badges row below title -->
    <div
      class="d-flex align-items-center gap-2 mb-2"
      style="min-height: 48px; justify-content: flex-start;"
    >
      <b-badge :variant="recipe.isViewed ? 'primary' : 'secondary'">
        {{ recipe.isViewed ? 'Viewed' : 'Not Viewed' }}
      </b-badge>

      <b-badge
        :variant="isFavoriteLocal ? 'danger' : 'secondary'"
        class="cursor-pointer"
        @click="!isFavoriteLocal && addFavorite()"
        :title="isFavoriteLocal ? 'Already liked' : 'Add to favorites'"
      >
        ❤️ {{ isFavoriteLocal ? 'Liked' : 'Like' }}
      </b-badge>
    </div>

    <!-- Prep time and popularity -->
    <div class="mb-3" style="min-height: 48px;">
      <b-card-text class="text-muted mb-1">
        🕒 {{ recipe.preparationTime }} minutes
      </b-card-text>
      <b-card-text class="text-muted">
        👍
        {{
          recipe.popularity + (isFavoriteLocal && !recipe.isFavorite ? 1 : 0)
        }}
        likes
      </b-card-text>
    </div>

    <!-- Diet badges pinned at bottom -->
    <div class="mt-auto d-flex flex-wrap gap-1">
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
import { ref, getCurrentInstance } from "vue";

export default {
  name: "RecipePreview",
  props: {
    recipe: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const internalInstance = getCurrentInstance();
    const { axios, store, toast, $router } =
      internalInstance.appContext.config.globalProperties;

    const isFavoriteLocal = ref(props.recipe.isFavorite);
    const isLoading = ref(false);

    const addFavorite = async () => {
      if (isLoading.value) return;
      isLoading.value = true;

      try {
        await axios.post(
          store.server_domain + "/api/users/favorite",
          {
            recipeid: String(props.recipe.id),
            source: props.recipe.source,
          },
          { withCredentials: true }
        );
        if (!props.recipe.isFavorite && !isFavoriteLocal.value) {
          // Locally update popularity if needed
        }
        isFavoriteLocal.value = true;
      } catch (error) {
        if (error.response && error.response.status === 401) {
          toast("User not logged in", "To like a recipe you must log in", "warning");
        } else {
          console.error("Failed to add favorite:", error);
        }
      } finally {
        isLoading.value = false;
      }
    };

    const handleCardClick = () => {
      if (props.recipe.source === "local") {
        $router.push({
          name: "merecipe",
          params: { recipeid: props.recipe.id },
          path: `/recipe/me/${props.recipe.id}`,
        });
      } else {
        $router.push({
          name: "recipe",
          params: { recipeid: props.recipe.id },
          path: `/recipe/${props.recipe.id}`,
        });
      }
    };

    return {
      isFavoriteLocal,
      isLoading,
      addFavorite,
      handleCardClick,
    };
  },
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Keep the image styling from bootstrap-vue */
::v-deep(.card-img-top) {
  height: 200px;
  object-fit: cover;
  cursor: default; /* cursor will be pointer only on overlay */
}

/* The transparent clickable overlay on top of the image */
.click-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 200px; /* must match card-img-top height */
  cursor: pointer;
  z-index: 10;
}
</style>
