<template>
  <div class="fixed top-0 left-0 w-screen h-screen flex flex-col items-center justify-center overflow-y-auto" :style="{ backgroundColor: selectedColor }">

    <h1 class="text-white text-shadow text-4xl font-extrabold pb-2 text-center">Create Your Quest</h1>

    <div class="flex flex-col items-center gap-10 mt-10 pt-6">
      <div class="bg-white w-[800px] rounded-2xl shadow-2xl p-6 mt-5">
        <h2 class="text-gray-900 text-3xl font-bold mb-6 pb-3">Title</h2>
        <input
          v-model="title"
          type="text"
          placeholder="เพิ่มรายละเอียด..."
          class="w-full p-4 border border-gray-400 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring--300"
        />
      </div>

      <div class="bg-white w-[800px] rounded-2xl shadow-2xl p-6 mt-6">
        <h2 class="text-gray-900 text-3xl font-bold mb-8 pb-4">Select Type</h2>
        <div
          @click="dropdownOpen = !dropdownOpen"
          class="w-full p-4 border border-gray-400 rounded-xl cursor-pointer flex justify-between items-center text-lg hover:bg-gray-100 transition-all"
        >
          <span>{{ selectedType || "เลือกประเภท" }}</span>
          <span>&#9662;</span>
        </div>

        <div v-if="dropdownOpen" class="absolute bg-white w-[700px] border rounded-xl mt-2 shadow-lg z-10">
          <div v-for="type in types" :key="type.value" @click="selectType(type)"
            class="p-4 hover:bg-gray-200 cursor-pointer flex justify-between items-center text-lg text-gray-700 transition-all">
            <span class="flex items-center space-x-2">
              <span v-html="type.icon"></span>
              <span>{{ type.label }}</span>
            </span>
          </div>
        </div>
      </div>
      <button
        @click="saveAndGoNext"
        class="mt-10 font-bold text-white p-3 rounded-2xl text-xl bg-cyan-500 shadow-lg shadow-cyan-500/50 border-none
               focus:ring-0 transition-all hover:bg-cyan-700 active:bg-cyan-800"
        style="width: 250px;">
        Save
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: "",
      dropdownOpen: false,
      selectedType: "",
      types: [
        { value: "event", label: "Event", icon: "📅" },
        { value: "memo", label: "Memo", icon: "📝" },
      ],
      selectedColor: localStorage.getItem('selectedColor') || '#01579B',
    };
  },
  methods: {
    selectType(type) {
      this.selectedType = type.label;
      this.dropdownOpen = false;
    },
    saveAndGoNext() {
      if (this.title && this.selectedType) {
        const data = {
          title: this.title,
          type: this.selectedType,
        };

        localStorage.setItem("questData", JSON.stringify(data));

        if (this.selectedType === 'Event') {
          this.$router.push("/dashboard/event");
        } else if (this.selectedType === 'Memo') {
          this.$router.push("/dashboard/memo");
        }
      } else {

        alert("กรุณากรอกข้อมูลให้ครบ!");
      }
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

.bg-blue-900 {
  background-color: #01579B;
}

</style>
