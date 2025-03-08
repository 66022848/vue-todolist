<template>
  <div class="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-start p-10 overflow-y-auto" :style="{ backgroundColor: selectedColor }">
    <h1 class="text-white text-3xl font-bold mb-10">EVENT</h1>
    <div class="flex flex-col items-center gap-8">
      <div class="bg-white w-[900px] min-h-[150px] rounded-2xl shadow-xl p-6">
        <h2 class="text-gray-900 text-xl font-bold">Title</h2>
        <input type="text" v-model="title" placeholder="เพิ่มรายละเอียด..." class="w-full p-2 rounded-lg mt-2">
      </div>
      <div class="bg-white w-[900px] rounded-2xl shadow-xl p-6 space-y-8">
        <div class="mt-6">
          <h3 class="text-lg font-semibold">📅 เลือกวันที่</h3>
          <div class="flex gap-4 mt-2">
            <VueDatePicker v-model="startDate" :format="'dd/MM/yyyy'" class="border p-2 rounded-lg"/>
            <VueDatePicker v-model="endDate" :format="'dd/MM/yyyy'" class="border p-2 rounded-lg"/>
          </div>
        </div>
        <div class="mt-10">
          <h3 class="text-lg font-semibold">⏰ เลือกเวลา</h3>
          <div class="flex gap-4 mt-2">
            <input type="time" v-model="startTime" class="border p-3 rounded-lg">
            <input type="time" v-model="endTime" class="border p-3 rounded-lg">
          </div>
        </div>
        <div class="mt-6">
          <h3 class="text-lg font-semibold">🔔 ตั้งเวลาแจ้งเตือน</h3>
          <select v-model="reminderTime" class="border p-2 rounded-lg w-full mt-2">
            <option value="5">5 นาที</option>
            <option value="10">10 นาที</option>
            <option value="30">30 นาที</option>
            <option value="60">1 ชั่วโมง</option>
            <option value="0">ไม่มีการแจ้งเตือน</option>
          </select>
        </div>
        <div class="mt-6">
          <h3 class="text-lg font-semibold">🔄 การทำซ้ำ</h3>
          <select v-model="repeat" class="border p-2 rounded-lg w-full mt-2">
            <option value="none">ไม่ซ้ำ</option>
            <option value="daily">รายวัน</option>
            <option value="weekly">รายสัปดาห์</option>
            <option value="monthly">รายเดือน</option>
          </select>
        </div>
        <div class="mt-6">
          <h3 class="text-lg font-semibold">📍 Address</h3>
          <input type="text" v-model="address" placeholder="เพิ่มที่อยู่..." class="w-full border p-2 rounded-lg mt-2">
        </div>
        <div class="mt-6">
          <h3 class="text-lg font-semibold">🔗 URL</h3>
          <input type="url" v-model="eventURL" placeholder="เพิ่ม URL..." class="w-full border p-2 rounded-lg mt-2">
        </div>
        <div class="mt-6">
          <h3 class="text-lg font-semibold">🎨 Selected Color</h3>
          <div class="flex items-center gap-4 mt-2">
            <div v-for="color in colors" :key="color" @click="selectedColor = color" class="w-10 h-10 rounded-full border-2 cursor-pointer" :class="{ 'border-black scale-110': selectedColor === color }" :style="{ backgroundColor: color }"></div>
          </div>
        </div>
      </div>
      <div class="mt-12 flex gap-6">
        <button class="bg-red-500 text-white px-6 py-3 rounded-xl" @click="goBack">Cancel</button>
        <button class="bg-green-400 text-white px-6 py-3 rounded-xl" @click="saveEvent">Done</button>
      </div>
    </div>
  </div>
</template>

<script>
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { emitter } from '@/eventBus';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default {
  components: { VueDatePicker },
  data() {
    return {
      title: "",
      startDate: new Date(),
      endDate: new Date(),
      startTime: "06:45",
      endTime: "20:00",
      reminderTime: "0",
      repeat: "none",
      address: "",
      eventURL: "",
      selectedColor: "#01579B",
      colors: ['#01579B', '#FFCDD2', '#FFE57F', '#B9F6CA', '#B3E5FC']
    };
  },
  methods: {
    saveEvent() {
      const eventData = {
        title: this.title,
        type: "Event",
        eventDetails: {
          startDate: this.startDate,
          endDate: this.endDate,
          startTime: this.startTime,
          endTime: this.endTime,
          reminderTime: this.reminderTime,
          repeat: this.repeat,
          address: this.address,
          eventURL: this.eventURL,
          selectedColor: this.selectedColor,
        }
      };

      fetch('${API_BASE_URL}/api/quest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
        credentials: 'include',
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(response.statusText || 'Failed to save event');
        }
        return response.json();
      })
      .then(data => {
        console.log('Data saved:', data);
        alert(`Event บันทึกสำเร็จ! คุณได้รับ 10 คะแนน รวม: ${data.points} คะแนน`);
        this.$router.push('/dashboard/done');
        this.$nextTick(() => {
          emitter.emit('refresh-dashboard');
        });
      })
      .catch(err => {
        console.error('Error saving event:', err);
        alert('เกิดข้อผิดพลาดในการบันทึก event: ' + err.message);
      });
    },
    goBack() {
      this.$router.push("/dashboard/createquest");
    }
  }
};
</script>

<style scoped>
.icon {
  width: 20px;
  height: 20px;
}

.vdp-datepicker {
  z-index: 9999 !important;
}
</style>