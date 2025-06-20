<template>
  <div class="container my-4">
    <h2>Search Recipes</h2>

    <b-form @submit.prevent="searchRecipes">
      <b-form-group label="Search for a recipe">
        <b-input-group>
          <b-form-input
            v-model="query"
            placeholder="Type recipe name (e.g. 'Falafel')"
          />
          <b-input-group-append>
            <b-button type="submit" variant="primary">Search</b-button>
          </b-input-group-append>
        </b-input-group>
      </b-form-group>

      <b-row>
        <b-col md="4">
          <b-form-group label="Cuisine">
            <b-form-select v-model="filters.cuisine" :options="cuisineOptions" />
          </b-form-group>
        </b-col>
        <b-col md="4">
          <b-form-group label="Diet">
            <b-form-select v-model="filters.diet" :options="dietOptions" />
          </b-form-group>
        </b-col>
        <b-col md="4">
          <b-form-group label="Intolerance">
            <b-form-select v-model="filters.intolerance" :options="intoleranceOptions" />
          </b-form-group>
        </b-col>
      </b-row>

      <b-row>
        <b-col md="4">
          <b-form-group label="Results per page">
            <b-form-select v-model="filters.numresults" :options="[5, 10, 15]" />
          </b-form-group>
        </b-col>
        <b-col md="4">
          <b-form-group label="Sort By">
            <b-form-select v-model="filters.sortBy" :options="sortOptions" />
          </b-form-group>
        </b-col>
      </b-row>
    </b-form>

    <div v-if="loading" class="text-center my-4">
      <b-spinner label="Loading..." />
    </div>

    <div v-if="!loading && recipes.length === 0 && hasSearched" class="text-center my-4">
      <b-alert variant="warning">No results found.</b-alert>
    </div>

    <div class="d-flex flex-wrap gap-3 mt-4">
      <RecipePreview v-for="recipe in recipes" :key="recipe.id" :recipe="recipe" />
    </div>

    <div v-if="userLastSearch && !hasSearched && isLoggedIn" class="mt-5">
      <h5>Your Last Search</h5>
      <div class="d-flex flex-wrap gap-3 mt-3">
        <RecipePreview v-for="r in userLastSearch" :key="r.id" :recipe="r" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, getCurrentInstance, onMounted } from 'vue';
import RecipePreview from '../components/RecipePreview.vue';

export default {
  name: 'SearchRecipesPage',
  components: { RecipePreview },
  setup() {
    const query = ref('');
    const filters = ref({
      cuisine: '',
      diet: '',
      intolerance: '',
      numresults: 5,
      sortBy: '',
    });
    const recipes = ref([]);
    const userLastSearch = ref(null);
    const loading = ref(false);
    const hasSearched = ref(false);

    const instance = getCurrentInstance();
    const { axios, store, toast } = instance.appContext.config.globalProperties;
    const isLoggedIn = !!store.username;

    const cuisineOptions = ['','African','Asian','American','British','Cajun','Caribbean','Chinese', 'Eastern European','European','French','German','Greek',
     'Indian','Irish','Italian','Japanese','Jewish','Korean','Latin American', 'Mediterranean', 'Mexican', 'Middle Eastern','Nordic','Southern','Spanish','Thai','Vietnamese'];
    const dietOptions = ['','Gluten Free', 'Ketogenic', 'Vegan', 'Vegetarian','Lacto-Vegetarian','Ovo-Vegetarian','Pescetarian', 'Paleo','Primal','Low FODMAP','Whole30'];
    const intoleranceOptions = ['','Dairy', 'Egg', 'Gluten','Grain','Peanut', 'Seafood', 'Sesame','Shellfish', 'Soy', 'Sulfite', 'Tree Nut', 'Wheat'];
    const sortOptions = [
      { value: '', text: 'Default' },
      { value: 'time', text: 'Preparation Time' },
      { value: 'likes', text: 'Likes' },
    ];

    async function fetchLastSearch() {
      console.log(isLoggedIn)
      if (!isLoggedIn) return;
      try {
        const res = await axios.get(store.server_domain + '/api/users/lastsearch', {
          withCredentials: true,
        });
        userLastSearch.value = res.data;
      } catch (err) {
        console.error('Failed to fetch last search:', err);
      }
    }

    async function searchRecipes() {
      loading.value = true;
      hasSearched.value = true;
      recipes.value = [];

      try {
        const params = {
          search: query.value,
          cuisine: filters.value.cuisine,
          diet: filters.value.diet,
          intolerance: filters.value.intolerance,
          numresults: filters.value.numresults,
        };

        const res = await axios.get(store.server_domain + '/api/recipes/search', {
          withCredentials: true,
          params,
          validateStatus: () => true, // allows handling non-200 responses manually
        });

        if (res.status === 404) {
          toast('No results found', 'Please try a different search', 'warning');
          return;
        }

        if (res.status !== 200) {
          throw new Error(`Unexpected status: ${res.status}`);
        }

        let data = res.data;

        if (filters.value.sortBy === 'time') {
          data.sort((a, b) => a.preparationTime - b.preparationTime);
        } else if (filters.value.sortBy === 'likes') {
          data.sort((a, b) => b.popularity - a.popularity);
        }

        recipes.value = data;
      } catch (err) {
        toast('Search failed', 'Please try again later', 'danger');
        console.error('Search failed:', err);
      } finally {
        loading.value = false;
      }
    }

    onMounted(fetchLastSearch);

    return {
      query,
      filters,
      cuisineOptions,
      dietOptions,
      intoleranceOptions,
      sortOptions,
      recipes,
      loading,
      userLastSearch,
      isLoggedIn,
      hasSearched,
      searchRecipes,
    };
  },
};
</script>

<style scoped>
.container {
  min-height: 600px;
}
.d-flex.flex-wrap.gap-3 {
  gap: 1rem;
}
</style>
