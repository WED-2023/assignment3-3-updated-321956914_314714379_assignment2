<template>
  <div class="container mt-5">
    <b-card class="shadow-sm p-4 mx-auto" style="max-width: 600px;">
      <h3 class="mb-4 text-center">Create Your Account</h3>
      <b-form @submit.prevent="register" novalidate>
        <b-row>
          <b-col md="6" class="mb-3">
            <label class="form-label">Username</label>
            <b-form-input
              v-model="state.username"
              :state="getValidationState(v$.username)"
              @input="v$.username.$touch()"
              @blur="focusedField = null"
              @focus="focusedField = 'username'"
            />
            <small v-if="focusedField === 'username'" class="text-muted">3–8 letters only</small>
            <b-form-invalid-feedback v-if="v$.username.$error">
              <div v-if="!v$.username.required">Username is required.</div>
              <div v-else-if="!v$.username.minLength || !v$.username.maxLength">3–8 characters only.</div>
              <div v-else-if="!v$.username.alpha">Letters only.</div>
            </b-form-invalid-feedback>
          </b-col>

          <b-col md="6" class="mb-3">
            <label class="form-label">Email</label>
            <b-form-input
              type="email"
              v-model="state.email"
              :state="getValidationState(v$.email)"
              @input="v$.email.$touch()"
              @blur="focusedField = null"
              @focus="focusedField = 'email'"
              placeholder="example@mail.com"
            />
            <small v-if="focusedField === 'email'" class="text-muted">Must be valid</small>
            <b-form-invalid-feedback v-if="v$.email.$error">
              <div v-if="!v$.email.required">Email is required.</div>
              <div v-else-if="!v$.email.email">Email must be valid.</div>
            </b-form-invalid-feedback>
          </b-col>

          <b-col md="6" class="mb-3">
            <label class="form-label">First Name</label>
            <b-form-input
              v-model="state.firstName"
              :state="getValidationState(v$.firstName)"
              @input="v$.firstName.$touch()"
              @blur="focusedField = null"
              @focus="focusedField = 'firstName'"
            />
            <b-form-invalid-feedback v-if="v$.firstName.$error">
              <div v-if="!v$.firstName.required">Required.</div>
              <div v-else-if="!v$.firstName.alpha">Letters only.</div>
            </b-form-invalid-feedback>
          </b-col>

          <b-col md="6" class="mb-3">
            <label class="form-label">Last Name</label>
            <b-form-input
              v-model="state.lastName"
              :state="getValidationState(v$.lastName)"
              @input="v$.lastName.$touch()"
              @blur="focusedField = null"
              @focus="focusedField = 'lastName'"
            />
            <b-form-invalid-feedback v-if="v$.lastName.$error">
              <div v-if="!v$.lastName.required">Required.</div>
              <div v-else-if="!v$.lastName.alpha">Letters only.</div>
            </b-form-invalid-feedback>
          </b-col>

          <b-col md="6" class="mb-3">
            <label class="form-label">Country</label>
            <b-form-select
              v-model="state.country"
              :options="countries"
              :state="getValidationState(v$.country)"
              @change="v$.country.$touch()"
            />
            <b-form-invalid-feedback v-if="v$.country.$error">Country is required.</b-form-invalid-feedback>
          </b-col>

          <b-col md="6" class="mb-3">
            <label class="form-label">Password</label>
            <b-form-input
              type="password"
              v-model="state.password"
              :state="getValidationState(v$.password)"
              @input="v$.password.$touch()"
              @blur="focusedField = null"
              @focus="focusedField = 'password'"
            />
            <small v-if="focusedField === 'password'" class="text-muted">5–10 chars, 1 digit + special</small>
            <b-form-invalid-feedback v-if="v$.password.$error">
              <div v-if="!v$.password.required">Required.</div>
              <div v-else-if="!v$.password.minLength || !v$.password.maxLength">5–10 characters.</div>
              <div v-else-if="!v$.password.passwordComplex">Digit and special character needed.</div>
            </b-form-invalid-feedback>
          </b-col>

          <b-col md="6" class="mb-3">
            <label class="form-label">Confirm Password</label>
            <b-form-input
              type="password"
              v-model="state.confirmedPassword"
              :state="getValidationState(v$.confirmedPassword)"
              @input="v$.confirmedPassword.$touch()"
            />
            <b-form-invalid-feedback v-if="v$.confirmedPassword.$error">
              <div v-if="!v$.confirmedPassword.required">Confirmation required.</div>
              <div v-else-if="!v$.confirmedPassword.matchesPassword">Passwords must match.</div>
            </b-form-invalid-feedback>
          </b-col>
        </b-row>

        <b-button type="submit" variant="primary" class="w-100 mt-3" :disabled="v$.$invalid">
          Register
        </b-button>

        <b-alert variant="danger" show dismissible v-if="state.submitError" class="mt-3">
          {{ state.submitError }}
        </b-alert>

        <div class="text-center mt-3">
          Already have an account?
          <router-link to="/login">Login</router-link>
        </div>
      </b-form>
    </b-card>
  </div>
</template>

<script setup>
import { reactive, ref, getCurrentInstance } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, maxLength, alpha, email, helpers } from '@vuelidate/validators';
import rawCountries from '../assets/countries';

const state = reactive({
  username: '',
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmedPassword: '',
  country: '',
  submitError: null,
});

const focusedField = ref(null);

const passwordComplex = helpers.withMessage(
  'Must contain at least one digit and one special character',
  val => /[0-9]/.test(val) && /[^A-Za-z0-9]/.test(val)
);
const matchesPassword = (state) =>
  helpers.withMessage('Passwords do not match', val => val === state.password);

const rules = {
  username: { required, minLength: minLength(3), maxLength: maxLength(8), alpha },
  firstName: { required, alpha },
  lastName: { required, alpha },
  email: { required, email },
  country: { required },
  password: { required, minLength: minLength(5), maxLength: maxLength(10), passwordComplex },
  confirmedPassword: { required, matchesPassword: matchesPassword(state) },
};

const v$ = useVuelidate(rules, state);

const { appContext } = getCurrentInstance();
const { axios, store, $router, toast } = appContext.config.globalProperties;

const countries = ['Select a country', ...rawCountries];

const getValidationState = (field) => {
  if (!field.$dirty) return null;
  return !field.$invalid;
};

const register = async () => {
  const valid = await v$.value.$validate();
  if (!valid) return;

  try {
    await axios.post(store.server_domain + '/api/register', {
      username: state.username,
      firstName: state.firstName,
      lastName: state.lastName,
      email: state.email,
      password: state.password,
      country: state.country,
    }, { withCredentials: true });

    toast('Registration successful', 'You can now login', 'success');
    $router.push('/login');
  } catch (err) {
    if (err.response?.status === 409) {
      toast('Username taken', 'Please choose a different one.', 'danger');
    } else {
      state.submitError = err.response?.data?.message || 'Registration failed.';
    }
  }
};
</script>

<style scoped>
.form-label {
  font-weight: 500;
}
</style>
