<template>
  <div id="app">
    <NavBar />
    <router-view />
    <b-toast-container />
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue';

export default {
  name: "App",
  components: { NavBar },
};
</script>
