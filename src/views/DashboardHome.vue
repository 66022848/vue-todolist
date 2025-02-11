<template>
  <div>
    <h1 class="title">Home</h1>
    <div class="layout">
      <!-- Section to display task counts in a row -->
      <div class="task-cards">
        <div class="card large upcoming">
          <h3>Upcoming Tasks</h3>
          <p>{{ upcomingCount }}</p>
        </div>
        <div class="card large in-progress">
          <h3>In-Progress Tasks</h3>
          <p>{{ inProgressCount }}</p>
        </div>
        <div class="card large completed">
          <h3>Completed Tasks</h3>
          <p>{{ completedCount }}</p>
        </div>
      </div>

      <div class="calendar">
        <Vue3DatePicker v-model="date" :inline="true" locale="en" />
      </div>
    </div>

    <div class="row">
      <div class="card small"></div>
      <div class="card small"></div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import Vue3DatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import axios from 'axios';

export default defineComponent({
  name: "DashboardHome",
  components: {
    Vue3DatePicker,
  },
  data() {
    return {
      date: new Date(),
      upcomingCount: 0,
      inProgressCount: 0,
      completedCount: 0,
    };
  },
  methods: {
    fetchTaskCounts() {
      axios.get('http://localhost:3000/api/tasks/counts') // URL ที่เชื่อมต่อกับ API ของ MongoDB
        .then(response => {
          this.upcomingCount = response.data.upcomingCount;
          this.inProgressCount = response.data.inProgressCount;
          this.completedCount = response.data.completedCount;
        })
        .catch(error => {
          console.error('Error fetching task counts:', error);
        });
    }
  },
  created() {
    this.fetchTaskCounts();
  },
});
</script>

<style scoped>
.title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 20px;
}

.card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
}

.card.large {
  height: 70px; /* เพิ่มความสูงของการ์ด */
  width: 30%; /* กำหนดให้แต่ละการ์ดมีความกว้างที่เหมาะสม */
  margin-right: 20px; /* เพิ่มช่องว่างระหว่างการ์ด */
  margin-bottom: 20px; /* เพิ่มช่องว่างด้านล่าง */
}

.row {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.calendar {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 300px;
}

.layout {
  display: flex;
  justify-content: space-around;
}

.content {
  flex: 1;
}

/* Align the task cards horizontally */
.task-cards {
  display: flex;
  justify-content: space-between; /* จัดการ์ดให้ห่างกัน */
  flex-wrap: nowrap; /* ให้การ์ดแสดงในแถวถัดไปหากมีพื้นที่ไม่พอ */
  gap: 10px; /* เพิ่มช่องว่างระหว่างการ์ด */
}

.card p {
  font-size: 1.5rem; /* Increase the font size */
  font-weight: bold; /* Make the font bold */
  margin-top: 10px; /* Add some margin at the top for better spacing */
}

.card h3 {
  font-size: 1rem; /* Adjust this value to make the font smaller */
  font-weight: normal; /* Optional: to make the font weight normal */
  margin-bottom: 10px; /* Adjust margin if needed */
}

/* Colors for task types */
.upcoming {
  background-color: #f7c6d7; /* Soft Pink */
}

.in-progress {
  background-color: #f9e28e; /* Soft Yellow */
}

.completed {
  background-color: #a8e6a1; /* Soft Green */
}
</style>
