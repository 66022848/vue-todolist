<template>
  <div class="container">
    <router-view></router-view>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "DashboardPage", // เปลี่ยนจาก "App" เป็น "DashboardPage"
});
</script>

<style>
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f5f5f5;
}

.container {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style>
