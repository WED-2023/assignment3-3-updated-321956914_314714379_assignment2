<template>
  <div id="app">
    <NavBar />
    <div class="pt-navbar">
      <router-view />
    </div>
    <b-toast-container />
  </div>
</template>

<style>
.pt-navbar {
  padding-top: 100px;
}
</style>

<script>
import NavBar from './components/NavBar.vue';

export default {
  name: "App",
  components: { NavBar },
};
</script>
