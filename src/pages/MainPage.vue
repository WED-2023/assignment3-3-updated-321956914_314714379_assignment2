<template>
  <div class="container">

    <b-row>
      <b-col cols="6">
        <RecipeRandomPreviewList title="Random Recipes" class="RandomRecipes center" />
      </b-col>

      <b-col cols="6">
        <MiniLogin v-if="!store.username" />
        <LastViewedRecipesList
          v-else
          title="Last Viewed Recipes"
        />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { getCurrentInstance } from 'vue';
import MiniLogin from "../components/MiniLogin.vue";
import RecipeRandomPreviewList from '../components/RecipeRandomPreviewList.vue';
import LastViewedRecipesList from '../components/LastViewedRecipesList.vue';

export default {
  components: {
    RecipeRandomPreviewList,
    MiniLogin,
    LastViewedRecipesList,
  },
  setup() {
    const internalInstance = getCurrentInstance();
    const store = internalInstance.appContext.config.globalProperties.store;

    return { store };
  }
};
</script>
