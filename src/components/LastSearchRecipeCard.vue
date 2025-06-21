<template>
  <b-card
    class="h-100 shadow-sm d-flex flex-column position-relative"
    :img-src="recipe.image"
    img-alt="Recipe image"
    img-top
    style="max-width: 350px;"
  >
    <!-- Clickable overlay -->
    <div
      class="click-overlay"
      @click.stop="handleCardClick"
      role="button"
      tabindex="0"
      @keydown.enter="handleCardClick"
      aria-label="View full recipe"
    ></div>

    <!-- Title -->
    <h5 class="mb-1 text-truncate" style="max-width: 100%;">
      {{ recipe.name }}
    </h5>
  </b-card>
</template>

<script>
import { ref, onMounted, getCurrentInstance } from "vue";

export default {
  name: "RecipePreview",
  props: {
    recipe: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const isFavorite = ref(false);
    const instance = getCurrentInstance();
    const { axios, store, $router } = instance.appContext.config.globalProperties;

    onMounted(async () => {
      try {
        const res = await axios.get(`${store.server_domain}/api/users/favorites`, {
          withCredentials: true,
        });
        isFavorite.value = res.data.some(
          (fav) => fav.id === props.recipe.id && fav.source === 'spoon'
        );
      } catch (err) {
        console.error("Failed to check if recipe is favorite:", err);
        isFavorite.value = false;
      }
    });

    const handleCardClick = () => {
      $router.push({
        name: "recipe",
        params: { recipeid: props.recipe.id },
        query: {
          isViewed: true,
          isFavorite: isFavorite.value,
        },
      });
    };

    return {
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

::v-deep(.card-img-top) {
  height: 200px;
  object-fit: cover;
  cursor: default;
}

.click-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 200px;
  cursor: pointer;
  z-index: 10;
}
</style>
