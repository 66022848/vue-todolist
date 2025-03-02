<template>
    <div class="dashboard-awards">
      <div class="bg-gray-200 p-10 rounded-xl text-center">
        <div class="flex justify-center items-center space-x-10">
          <img src="@/assets/tophy.png" alt="Trophy" class="w-24 h-24" />
          <h1 class="text-2xl font-bold bg-white px-6 py-2 rounded-full">Completed</h1>
          <img src="@/assets/tophy.png" alt="Trophy" class="w-24 h-24" />
        </div>
        
        <div class="mt-6 space-y-4">
          <div class="w-full bg-white p-4 rounded-lg"></div>
          <div class="w-full bg-white p-4 rounded-lg"></div>
          <div class="w-full bg-white p-4 rounded-lg"></div>
          <div class="w-full bg-white p-4 rounded-lg"></div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "DashboardAwards",
  };
  </script>
  
  <style scoped>
  .dashboard-awards {
    padding: 20px;
    background-color: #f9f9f9;
    min-height: 100vh;
  }
  </style>
  