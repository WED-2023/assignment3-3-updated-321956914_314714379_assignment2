<template>
  <b-form @submit.prevent="handleSubmit" novalidate>
    <b-form-group label="Recipe Name" label-for="recipename" :state="validation.recipename === null ? null : validation.recipename">
      <b-form-input
        id="recipename"
        v-model="form.recipename"
        :state="validation.recipename === null ? null : validation.recipename"
        required
        placeholder="Enter recipe name"
      />
      <b-form-invalid-feedback v-if="hasSubmitted && !validation.recipename">
        Name is required
      </b-form-invalid-feedback>
    </b-form-group>

    <b-form-group label="Image URL" label-for="image" :state="validation.image === null ? null : validation.image">
      <b-form-input
        id="image"
        v-model="form.image"
        :state="validation.image === null ? null : validation.image"
        type="url"
        placeholder="https://example.com/image.jpg"
      />
      <b-form-invalid-feedback v-if="hasSubmitted && !validation.image">
        Please enter a valid URL
      </b-form-invalid-feedback>
    </b-form-group>

    <b-form-group label="Preparation Time (minutes)" label-for="preparationTime" :state="validation.preparationTime === null ? null : validation.preparationTime">
      <b-form-input
        id="preparationTime"
        v-model.number="form.preparationTime"
        type="number"
        min="1"
        :state="validation.preparationTime === null ? null : validation.preparationTime"
        required
        placeholder="e.g. 30"
      />
      <b-form-invalid-feedback v-if="hasSubmitted && !validation.preparationTime">
        Preparation time must be a positive number
      </b-form-invalid-feedback>
    </b-form-group>

    <b-form-group label="Servings Amount" label-for="servingsAmount" :state="validation.servingsAmount === null ? null : validation.servingsAmount">
      <b-form-input
        id="servingsAmount"
        v-model.number="form.servingsAmount"
        type="number"
        min="1"
        :state="validation.servingsAmount === null ? null : validation.servingsAmount"
        required
        placeholder="e.g. 4"
      />
      <b-form-invalid-feedback v-if="hasSubmitted && !validation.servingsAmount">
        Servings must be a positive number
      </b-form-invalid-feedback>
    </b-form-group>

    <b-form-group label="Summary" label-for="summary" :state="validation.summary === null ? null : validation.summary">
      <b-form-textarea
        id="summary"
        v-model="form.summary"
        :state="validation.summary === null ? null : validation.summary"
        rows="3"
        required
        placeholder="Brief description of the recipe"
      />
      <b-form-invalid-feedback v-if="hasSubmitted && !validation.summary">
        Summary is required
      </b-form-invalid-feedback>
    </b-form-group>

    <b-form-group
      label="Ingredients"
      :state="!hasSubmitted || validation.ingredients.length > 0 ? null : false"
      invalid-feedback="At least one ingredient is required"
    >
      <div v-for="(ingredient, idx) in form.ingredients" :key="idx" class="d-flex mb-2">
        <b-form-input
          v-model="form.ingredients[idx]"
          placeholder="Ingredient"
          :state="!hasSubmitted || form.ingredients[idx].trim().length > 0 ? null : false"
          required
        />
        <b-button
          variant="danger"
          size="sm"
          class="ms-2"
          @click.prevent="removeIngredient(idx)"
          aria-label="Remove ingredient"
        >
          &times;
        </b-button>
      </div>
      <b-button variant="secondary" size="sm" @click.prevent="addIngredient">+ Add Ingredient</b-button>
      <b-form-invalid-feedback v-if="hasSubmitted && validation.ingredients.length === 0">
        At least one ingredient is required
      </b-form-invalid-feedback>
    </b-form-group>

    <b-form-group
      label="Instructions"
      :state="!hasSubmitted || validation.instructions.length > 0 ? null : false"
      invalid-feedback="At least one instruction is required"
    >
      <div v-for="(instruction, idx) in form.instructions" :key="idx" class="d-flex mb-2">
        <b-form-textarea
          v-model="form.instructions[idx]"
          rows="2"
          placeholder="Instruction"
          :state="!hasSubmitted || form.instructions[idx].trim().length > 0 ? null : false"
          required
        />
        <b-button
          variant="danger"
          size="sm"
          class="ms-2"
          @click.prevent="removeInstruction(idx)"
          aria-label="Remove instruction"
        >
          &times;
        </b-button>
      </div>
      <b-button variant="secondary" size="sm" @click.prevent="addInstruction">+ Add Instruction</b-button>
      <b-form-invalid-feedback v-if="hasSubmitted && validation.instructions.length === 0">
        At least one instruction is required
      </b-form-invalid-feedback>
    </b-form-group>
    <!-- Dietary information -->
    <b-form-group label="Dietary information">
      <b-form-checkbox v-model="form.isVegetarian">
        Vegetarian
      </b-form-checkbox>
      <b-form-checkbox v-model="form.isVegan">
        Vegan
      </b-form-checkbox>
      <b-form-checkbox v-model="form.isGlutenFree">
        Gluten-Free
      </b-form-checkbox>
    </b-form-group>

    <b-form-group label="Family Recipe" label-for="familyrecipe" :state="validation.familyrecipe === null ? null : validation.familyrecipe">
      <b-form-select
        id="familyrecipe"
        v-model="form.familyrecipe"
        :options="['yes', 'no']"
        required
      />
      <b-form-invalid-feedback v-if="hasSubmitted && !validation.familyrecipe">
        Please select yes or no
      </b-form-invalid-feedback>
    </b-form-group>

    <b-form-group
      label="Family Owner"
      label-for="familyowner"
      :state="validation.familyowner === null ? null : validation.familyowner"
      v-if="form.familyrecipe === 'yes'"
    >
      <b-form-input
        id="familyowner"
        v-model="form.familyowner"
        placeholder="Name of family owner"
        required
        :state="validation.familyowner === null ? null : validation.familyowner"
      />
      <b-form-invalid-feedback v-if="hasSubmitted && !validation.familyowner">
        Family owner is required when family recipe is yes
      </b-form-invalid-feedback>
    </b-form-group>

    <b-form-group
      label="When Made"
      label-for="whenmade"
      :state="validation.whenmade === null ? null : validation.whenmade"
      v-if="form.familyrecipe === 'yes'"
    >
      <b-form-input
        id="whenmade"
        v-model="form.whenmade"
        placeholder="e.g. Pesach holiday"
        required
        :state="validation.whenmade === null ? null : validation.whenmade"
      />
      <b-form-invalid-feedback v-if="hasSubmitted && !validation.whenmade">
        When made is required when family recipe is yes
      </b-form-invalid-feedback>
    </b-form-group>

    <b-button
      type="submit"
      variant="primary"
      :disabled="isSubmitting"
      class="mt-3"
    >
      {{ isSubmitting ? "Creating..." : "Create Recipe" }}
    </b-button>
  </b-form>
</template>

<script>
import { reactive, ref, getCurrentInstance } from "vue";

export default {
  name: "NewRecipeForm",
  emits: ["created"],
  setup(_, { emit, expose }) {
    const form = reactive({
      recipename: "",
      image: "",
      preparationTime: null,
      servingsAmount: null,
      summary: "",
      ingredients: [""],
      instructions: [""],
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
      familyrecipe: "no",
      familyowner: "",
      whenmade: "",
    });

    const isSubmitting = ref(false);
    const hasSubmitted = ref(false);

    const validation = reactive({
      recipename: null,
      image: null,
      preparationTime: null,
      servingsAmount: null,
      summary: null,
      ingredients: [],
      instructions: [],
      familyrecipe: null,
      familyowner: null,
      whenmade: null,
    });

    const internalInstance = getCurrentInstance();
    const axios = internalInstance.appContext.config.globalProperties.axios;
    const store = internalInstance.appContext.config.globalProperties.store;

    function validate() {
      validation.recipename = form.recipename.trim().length > 0;
      validation.image = form.image.trim().length > 0 && isValidUrl(form.image);
      validation.preparationTime = form.preparationTime > 0;
      validation.servingsAmount = form.servingsAmount > 0;
      validation.summary = form.summary.trim().length > 0;
      validation.ingredients = form.ingredients.filter((i) => i.trim().length > 0);
      validation.instructions = form.instructions.filter((i) => i.trim().length > 0);
      validation.familyrecipe = ["yes", "no"].includes(form.familyrecipe);

      if (form.familyrecipe === "yes") {
        validation.familyowner = form.familyowner.trim().length > 0;
        validation.whenmade = form.whenmade.trim().length > 0;
      } else {
        validation.familyowner = true;
        validation.whenmade = true;
      }

      return (
        validation.recipename &&
        validation.image &&
        validation.preparationTime &&
        validation.servingsAmount &&
        validation.summary &&
        validation.ingredients.length > 0 &&
        validation.instructions.length > 0 &&
        validation.familyrecipe &&
        validation.familyowner &&
        validation.whenmade
      );
    }

    function isValidUrl(string) {
      try {
        new URL(string);
        return true;
      } catch (_) {
        return false;
      }
    }

    function addIngredient() {
      form.ingredients.push("");
    }

    function removeIngredient(index) {
      form.ingredients.splice(index, 1);
    }

    function addInstruction() {
      form.instructions.push("");
    }

    function removeInstruction(index) {
      form.instructions.splice(index, 1);
    }

    function resetForm() {
      form.recipename = "";
      form.image = "";
      form.preparationTime = null;
      form.servingsAmount = null;
      form.summary = "";
      form.ingredients = [""];
      form.instructions = [""];
      form.isVegetarian = false;
      form.isVegan = false;
      form.isGlutenFree = false;
      form.familyrecipe = "no";
      form.familyowner = "";
      form.whenmade = "";

      validation.recipename = null;
      validation.image = null;
      validation.preparationTime = null;
      validation.servingsAmount = null;
      validation.summary = null;
      validation.ingredients = [];
      validation.instructions = [];
      validation.familyrecipe = null;
      validation.familyowner = null;
      validation.whenmade = null;

      hasSubmitted.value = false;
    }

    async function handleSubmit() {
      hasSubmitted.value = true;
      if (!validate()) return;

      isSubmitting.value = true;
      try {
        const payload = {
          recipename: form.recipename,
          image: form.image,
          preparationTime: form.preparationTime,
          servingsAmount: form.servingsAmount,
          summary: form.summary,
          ingredients: form.ingredients.filter((i) => i.trim().length > 0),
          instructions: form.instructions.filter((i) => i.trim().length > 0),
          isVegetarian: form.isVegetarian,
          isVegan: form.isVegan,
          isGlutenFree: form.isGlutenFree,
          familyrecipe: form.familyrecipe,
          familyowner: form.familyowner,
          whenmade: form.whenmade,
        };

        await axios.post(store.server_domain + "/api/recipes", payload, { withCredentials: true });
        emit("created", payload);
        resetForm();
      } catch (error) {
        console.error("Failed to create recipe:", error);
      } finally {
        isSubmitting.value = false;
      }
    }

    // Expose resetForm for parent (modal close reset)
    expose({ resetForm });

    return {
      form,
      validation,
      isSubmitting,
      hasSubmitted,
      addIngredient,
      removeIngredient,
      addInstruction,
      removeInstruction,
      handleSubmit,
      resetForm,
    };
  },
};
</script>

<style scoped>
/* Spacing tweaks */
.mb-2 {
  margin-bottom: 0.5rem !important;
}
.ms-2 {
  margin-left: 0.5rem !important;
}
</style>
