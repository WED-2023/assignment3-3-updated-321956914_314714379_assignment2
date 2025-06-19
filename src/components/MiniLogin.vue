<template>
  <div class="mini-login p-3 rounded shadow-sm bg-light" style="max-width: 350px; margin: auto;">
    <h4 class="mb-3 text-center">Login</h4>

    <b-form @submit.prevent="login">
      <b-form-group label="Username" label-for="username" class="mb-2">
        <b-form-input
          id="username"
          size="sm"
          v-model="state.username"
          :state="getValidationState(v$.username)"
          autocomplete="username"
        />
        <b-form-invalid-feedback v-if="v$.username.$error">
          Username is required.
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group label="Password" label-for="password" class="mb-2">
        <b-form-input
          id="password"
          type="password"
          size="sm"
          v-model="state.password"
          :state="getValidationState(v$.password)"
          autocomplete="current-password"
        />
        <b-form-invalid-feedback v-if="v$.password.$error">
          Password is required.
        </b-form-invalid-feedback>
      </b-form-group>

      <b-button type="submit" size="sm" variant="primary" class="w-100 mb-2">
        Login
      </b-button>

      <b-alert
        variant="danger"
        dismissible
        v-if="state.submitError"
        show
        class="mb-2"
      >
        {{ state.submitError }}
      </b-alert>

      <div class="text-center small">
        Don’t have an account?
        <router-link to="/register">Register here</router-link>
      </div>
    </b-form>
  </div>
</template>

<script>
import { reactive, getCurrentInstance } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';

export default {
  name: 'MiniLogin',
  setup() {
    const state = reactive({
      username: '',
      password: '',
      submitError: null,
    });

    const rules = {
      username: { required },
      password: { required },
    };

    const v$ = useVuelidate(rules, state);

    const getValidationState = (field) => {
      return field.$dirty ? !field.$invalid : null;
    };

    const internalInstance = getCurrentInstance();
    const { axios, store, $router } = internalInstance.appContext.config.globalProperties;
    const toast = internalInstance.appContext.config.globalProperties.toast;

    const login = async () => {
      const valid = await v$.value.$validate();
      if (!valid) return;

      try {
        await axios.post(store.server_domain + "/api/login", {
          username: state.username,
          password: state.password,
        }, { withCredentials: true });
        store.login(state.username);
        toast("Login", "User logged in successfully", "success");
        $router.push('/');
      } catch (err) {
        state.submitError = err.response?.data?.message || 'Unexpected error.';
      }
    };

    return { state, v$, login, getValidationState };
  },
};
</script>

<style scoped>
.mini-login {
  /* smaller padding and subtle background */
  background-color: #f9f9f9;
}
</style>
