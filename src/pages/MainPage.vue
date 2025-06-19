<template>
  <div class="container">
    <h1 class="title">Main Page</h1>

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
import { getCurrentInstance, ref, onMounted } from 'vue';
import axios from 'axios';
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

    const lastViewedRecipes = ref([]);

    onMounted(async () => {
      if (store.username) {
        try {
          const { data } = await axios.get('/api/users/lastviewed');
          lastViewedRecipes.value = data.slice(0, 3);
        } catch (error) {
          console.error('Failed to fetch last viewed recipes:', error);
        }
      }
    });

    return { store, lastViewedRecipes };
  }
};
</script>
