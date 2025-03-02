<template>
  <div class="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-start p-20 overflow-y-auto" :style="{ backgroundColor: selectedColor }">
    <h1 class="text-white text-3xl font-bold mb-10">Completed</h1>
    <div class="flex flex-col items-center gap-8">
      <div class="bg-white w-[900px] min-h-[200px] rounded-2xl shadow-xl p-10">
        <h2 class="text-gray-900 text-xl font-bold">Task Completed</h2>
        <p class="text-gray-600 text-lg mt-4">Your quest is successfully completed. You can now review or move on to the next task.</p>
      </div>
      <div class="flex gap-6 mt-10">
        <button class="bg-green-500 text-white px-6 py-3 rounded-xl" @click="goBack">Back to Home</button>
        <button class="bg-cyan-500 text-white px-6 py-3 rounded-xl" @click="goNext">Next Task</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedColor: "#01579B",
    };
  },
  methods: {
    goBack() {
      this.$router.push("/dashboard/home");
    },
    goNext() {
      this.$router.push("/dashboard/modal");
    },
  },
};
</script>

<style scoped>
body {
  font-family: 'Poppins', sans-serif;
}

h2, h3 {
  font-family: 'Poppins', sans-serif;
}
</style>
