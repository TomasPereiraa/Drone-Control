<template>
  <div id="app">
    <DroneControl />
  </div>
</template>

<script>
import DroneControl from './components/DroneControl.vue';

export default {
  components: {
    DroneControl
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
