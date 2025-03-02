<template>
  <div class="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-start p-10 overflow-y-auto" :style="{ backgroundColor: selectedColor }">
    <h1 class="text-white text-3xl font-bold mb-10">MEMO</h1>
    <div class="flex flex-col items-center gap-8">
      <div class="bg-white w-[900px] min-h-[350px] rounded-2xl shadow-xl p-10">
        <h2 class="text-gray-900 text-xl font-bold">Title</h2>
        <textarea v-model="title" placeholder="เพิ่มรายละเอียด..." class="w-full p-4 rounded-lg mt-2 border-none focus:outline-none" rows="6"></textarea>
      </div>
      <div class="bg-white w-[900px] min-h-[400px] rounded-2xl shadow-xl p-6">
        <div class="flex flex-col space-y-4">
          <div class="flex items-center space-x-2 mt-2">
            <font-awesome-icon :icon="['far', 'calendar-alt']" class="icon" />
            <span class="font-extrabold text-2xl">Day counter</span>
            <input v-model="dayCounter" class="ml-auto toggle">
          </div>
          <div class="flex items-center space-x-2 mt-6">
            <font-awesome-icon :icon="['far', 'calendar']" class="icon" />
            <VueDatePicker v-model="startDate" :format="'dd/MM/yyyy'" class="border p-2 rounded-lg"/>
          </div>
          <div class="flex items-center space-x-2 mt-2">
            <font-awesome-icon :icon="['far', 'clock']" class="icon" />
            <input type="time" v-model="startTime" class="border p-2 rounded-lg">
          </div>
        </div>
      </div>
      <button class="mt-10 font-bold text-white p-3 rounded-2xl text-xl bg-cyan-500 shadow-lg shadow-cyan-500/50 border-none focus:ring-0 transition-all hover:bg-cyan-700 active:bg-cyan-800" style="width: 250px;" @click="saveMemo">Save</button>
    </div>
  </div>
</template>

<script>
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { emitter } from '@/eventBus';

export default {
  components: { VueDatePicker },
  data() {
    return {
      title: "",
      startDate: new Date(),
      startTime: "06:45",
      dayCounter: 0,
      selectedColor: localStorage.getItem('selectedColor') || "#01579B",
    };
  },
  created() {
    if (this.$route.query.color) {
      this.selectedColor = this.$route.query.color;
    }
  },
  methods: {
    saveMemo() {
      const memoData = {
        title: this.title,
        startDate: this.startDate,
        startTime: this.startTime,
        dayCounter: this.dayCounter,
        selectedColor: this.selectedColor,
      };

      console.log("Memo Data to be sent:", memoData);

      fetch('http://localhost:3001/api/quest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: this.title,
          type: 'Memo',
          memoDetails: memoData,
        }),
        credentials: 'include',
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(response.statusText || 'Failed to save memo');
        }
        return response.json();
      })
      .then(data => {
        console.log('Memo saved successfully:', data);
        alert(`Memo บันทึกสำเร็จ! คุณได้รับ 10 คะแนน รวม: ${data.points} คะแนน`);
        this.$router.push('/dashboard/done');
        this.$nextTick(() => {
          emitter.emit('refresh-dashboard');
        });
      })
      .catch(error => {
        console.error('Error saving memo:', error);
        alert('เกิดข้อผิดพลาดในการบันทึก memo: ' + error.message);
      });
    }
  }
};
</script>

<style scoped>
body {
  font-family: 'Poppins', sans-serif;
}

h2, h3 {
  font-family: 'Poppins', sans-serif;
}

.icon {
  width: 20px;
  height: 20px;
}
</style>