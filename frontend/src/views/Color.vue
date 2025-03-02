<template>
    <div class="background" :style="{ background: `linear-gradient(0.55deg, ${selectedColor} -13.57%, #FFFFFF 107.69%)` }"></div>
    <div class="container">
      <div class="color-selection">
        <h1 class="text-4xl font-bold font-sans text-black tracking-wider text-center">
          Start setting your desired color
        </h1>
        <div class="color-options">
          <div v-for="(color, index) in colors" :key="index"
               :class="['color-circle', { selected: selectedColor === color }]"
               :style="{ background: color }"
               @click="selectColor(color)">
          </div>
        </div>
        <button @click="goToNext" class="next-button">Next</button>
      </div>
      <div class="preview">
        <div class="sidebar" :style="{ background: selectedColor }"></div>
        <div class="content">
          <div class="gray-box large"></div>
          <div class="gray-box small" v-for="n in 3" :key="n"></div>
          <div class="gray-box small"></div>
        </div>
      </div>
    </div>
</template>
  
  <script>
  export default {
    data() {
      return {
        colors: ['#01579B', '#FFCDD2', '#FFE57F', '#B9F6CA', '#B3E5FC'],
        selectedColor: '#01579B'
      };
    },
    methods: {
      selectColor(color) {
        this.selectedColor = color;
      },
      goToNext() {
        localStorage.setItem('selectedColor', this.selectedColor);
        this.$router.push('/dashboard/createquest');
      }
    }
  };
  </script>
  
  <style scoped>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  html, body {
    height: 100%;
  }
  
  .background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: -1;
  }
  
  .container {
    display: flex;
    flex-direction: row;
    width: 80vw;
    height: 70vh;
    overflow: hidden;
    justify-content: flex-start;
    gap: 20px;
    margin-top: 100px;
  }
  
  .color-selection {
    flex: 1;
    padding: 10px;
    margin-left: 70px;
  }
  
  .color-options {
    display: flex;
    gap: 20px;
    margin-top: 20px;
  }
  
  .color-circle {
    width: 65px;
    height: 65px;
    border-radius: 100%;
    cursor: pointer;
    border: 3px solid transparent;
    transition: transform 0.3s ease;
  }
  
  .color-circle.selected {
    border: 3px solid white;
  }
  
  .next-button {
    margin-top: 40px;
    padding: 2vh 4vw;
    background: #03121D;
    color: white;
    border-radius: 10px;
    border: none;
    cursor: pointer;
  }
  
  .preview {
    flex: 2;
    display: flex;
    background: white;
    border-radius: 15px 0 0 0;
    padding: 20px;
  }
  
  .sidebar {
    width: 30%;
  }
  
  .content {
    flex: 1;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .gray-box {
    background: rgba(217, 217, 217, 0.69);
    border-radius: 30px;
  }
  
  .gray-box.large {
    width: 90%;
    height: 50px;
  }
  
  .gray-box.small {
    width: 90%;
    height: 10px;
  }
  </style>
  