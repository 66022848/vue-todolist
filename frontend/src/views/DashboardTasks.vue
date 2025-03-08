<template>
    <div class="dashboard-tasks">
      <h1>Task (เช็คสิ่งที่ทำแล้ว/ไม่ได้ทำ)</h1>

      <div class="task-input">
        <input v-model="newTask" @keyup.enter="addTask" placeholder="เพิ่ม Task ใหม่..." />
        <button @click="addTask">เพิ่ม</button>
      </div>

      <ul>
        <li v-for="task in tasks" :key="task._id" :class="{ completed: task.status === 'completed' }">
          <input type="checkbox" v-model="task.done" @change="toggleTask(task)" />
          <span>{{ task.name }}</span>
          <button @click="removeTask(task._id)">ลบ</button>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  export default {
    name: "DashboardTasks",
    data() {
      return {
        newTask: "",
        tasks: [],
      };
    },
    methods: {
      async fetchTasks() {
        try {
          const res = await axios.get("${API_BASE_URL}/api/tasks");
          this.tasks = res.data;
        } catch (err) {
          console.error("Error fetching tasks:", err);
        }
      },
      async addTask() {
        if (this.newTask.trim()) {
          const newTask = {
            title: this.newTask,
            status: 'upcoming',
          };
          try {
            const res = await axios.post("${API_BASE_URL}/api/tasks", newTask);
            console.log('Task added:', res.data);
            this.tasks.push(res.data);
            this.newTask = "";
          } catch (error) {
            console.error('Error adding task:', error);
          }
        }
      },
      async toggleTask(task) {
        try {
          task.done = !task.done;
          await axios.put(`${API_BASE_URL}/api/tasks/${task._id}`, task);
        } catch (err) {
          console.error("Error toggling task:", err);
        }
      },
      async removeTask(id) {
        try {
          await axios.delete(`${API_BASE_URL}/api/tasks/${id}`);
          this.tasks = this.tasks.filter(task => task._id !== id);
        } catch (err) {
          console.error("Error removing task:", err);
        }
      },
    },
    mounted() {
      this.fetchTasks();
    },
  };
  </script>
  
  <style scoped>
  .dashboard-tasks {
    padding: 20px;
    background-color: #f9f9f9;
    min-height: 100vh;
  }
  
  .task-input {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
  }
  
  .task-input input {
    flex: 1;
    padding: 8px;
  }
  
  .task-input button {
    padding: 8px 12px;
    background-color: #28a745;
    color: white;
    border: none;
    cursor: pointer;
  }
  
  ul {
    list-style: none;
    padding: 0;
  }
  
  li {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px;
    border-bottom: 1px solid #ddd;
  }
  
  .completed span {
    text-decoration: line-through;
    color: gray;
  }
  
  button {
    background-color: red;
    color: white;
    border: none;
    cursor: pointer;
    padding: 5px 10px;
  }
  </style>
  