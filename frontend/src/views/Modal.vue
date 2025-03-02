<template>
    <div v-if="isOpen" class="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-pink-400 to-red-300">
      <div class="rounded-2xl mb-6 p-6">
        <h2 class="text-6xl font-bold font-sans text-white tracking-wider text-center">
          Welcome to Your Adventure!
        </h2>
      </div>

      <div>
        <button
          @click="startJourney"
          class="bg-indigo-400 border-5 text-white text-3xl font-extrabold py-5 px-10 rounded-3xl hover:bg-blue-800 transition-all mx-auto mb-6">
          Start Your Journey
        </button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        isOpen: true,
      };
    },
    methods: {
      startJourney() {
        this.isOpen = false;
        this.$router.push("/dashboard/color");
      },
    },
  };
  </script>
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

  body {
    font-family: 'Poppins', sans-serif;
  }
  
  :root {
    --vt-c-white: #ffffff;
    --vt-c-white-soft: #f8f8f8;
    --vt-c-white-mute: #f2f2f2;
  
    --vt-c-black: #181818;
    --vt-c-black-soft: #222222;
    --vt-c-black-mute: #282828;
  
    --vt-c-indigo: #2c3e50;
  
    --vt-c-divider-light-1: rgba(60, 60, 60, 0.29);
    --vt-c-divider-light-2: rgba(60, 60, 60, 0.12);
    --vt-c-divider-dark-1: rgba(84, 84, 84, 0.65);
    --vt-c-divider-dark-2: rgba(84, 84, 84, 0.48);
  
    --vt-c-text-light-1: var(--vt-c-indigo);
    --vt-c-text-light-2: rgba(60, 60, 60, 0.66);
    --vt-c-text-dark-1: var(--vt-c-white);
    --vt-c-text-dark-2: rgba(235, 235, 235, 0.64);
  
    --color-background: var(--vt-c-white);
    --color-background-soft: var(--vt-c-white-soft);
    --color-background-mute: var(--vt-c-white-mute);
  
    --color-border: var(--vt-c-divider-light-2);
    --color-border-hover: var(--vt-c-divider-light-1);
  
    --color-heading: var(--vt-c-text-light-1);
    --color-text: var(--vt-c-text-light-1);
  
    --section-gap: 160px;
  }
  
  @media (prefers-color-scheme: dark) {
    :root {
      --color-background: var(--vt-c-black);
      --color-background-soft: var(--vt-c-black-soft);
      --color-background-mute: var(--vt-c-black-mute);
  
      --color-border: var(--vt-c-divider-dark-2);
      --color-border-hover: var(--vt-c-divider-dark-1);
  
      --color-heading: var(--vt-c-text-dark-1);
      --color-text: var(--vt-c-text-dark-2);
    }
  }
  
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    font-weight: normal;
  }
  
  body {
    min-height: 100vh;
    color: var(--color-text);
    background: var(--color-background);
    transition:
      color 0.5s,
      background-color 0.5s;
    line-height: 1.6;
    font-family: 'Poppins', sans-serif;
    font-size: 15px;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  button {
    transition-duration: initial;
  }
  
  h1, h2, h3 {
    font-family: 'Poppins', sans-serif;
    font-weight: 700;
  }
  
  p, ul, li {
    font-family: 'Poppins', sans-serif;
    font-weight: 400;
  }
  
  button {
    transition: background-color 0.3s ease, transform 0.3s ease;
  }
  
  button:hover {
    transform: scale(1.05);
  }
  </style>
  