<template>
  <div class="dashboard-home">
    <h1 class="title">Home</h1>

    <div class="overview-section">
      <h2 class="section-title">Overview</h2>
      <div class="task-cards">
        <div class="card large upcoming">
          <i class="fas fa-calendar-alt"></i>
          <h3>Upcoming Tasks</h3>
          <p>{{ upcomingCount }}</p>
        </div>
        <div class="card large in-progress">
          <i class="fas fa-spinner"></i>
          <h3>In-Progress Tasks</h3>
          <p>{{ inProgressCount }}</p>
        </div>
        <div class="card large completed">
          <i class="fas fa-check"></i>
          <h3>Completed Tasks</h3>
          <p>{{ completedCount }}</p>
        </div>
      </div>
    </div>

    <div class="reward-section">
      <div class="card small reward">
        <i class="fas fa-trophy"></i>
        <h3>RewardFlow</h3>
        <p v-if="userPoints !== null">{{ userPoints }} PX</p>
        <p v-else>Loading...</p>
        <small>สะสมแต้มเพื่อแลกรางวัล</small>
      </div>
      <div class="card small template">
        <i class="fas fa-file-alt"></i>
        <h3>Start with templates</h3>
        <small>เริ่มต้นด้วยเทมเพลตพร้อมใช้งาน</small>
      </div>
      <div class="card small blank" @click="goToCreateQuest">
        <i class="fas fa-plus"></i>
        <h3>Start</h3>
        <small>สร้างฐานข้อมูลใหม่ด้วยตาราง, ฟิลด์, และวิว</small>
      </div>
    </div>

    <div class="opened-section">
      <h2 class="section-title">Opened by you <span>▼</span></h2>

      <h3 class="subtitle">Today</h3>
      <div class="quest-cards">
        <div v-for="quest in todayQuests" :key="quest._id" class="quest-card">
          <div class="quest-icon" :style="{ backgroundColor: quest.selectedColor || getQuestColor(quest) }">
            {{ getQuestInitials(quest.title) }}
          </div>
          <div class="quest-info">
            <h4>{{ quest.title }}</h4>
            <small>{{ formatDate(quest.lastModified) || 'No updates' }}</small>
          </div>
          <div class="quest-actions">
            <i class="fas fa-heart"></i>
            <span>{{ quest.likes || 0 }}</span>
          </div>
        </div>
        <div v-if="!todayQuests.length" class="no-quests">No quests today</div>
      </div>

      <h3 class="subtitle">Past 7 days</h3>
      <div class="quest-cards">
        <div v-for="quest in past7DaysQuests" :key="quest._id" class="quest-card">
          <div class="quest-icon" :style="{ backgroundColor: quest.selectedColor || getQuestColor(quest) }">
            {{ getQuestInitials(quest.title) }}
          </div>
          <div class="quest-info">
            <h4>{{ quest.title }}</h4>
            <small>{{ formatDate(quest.lastModified) || 'No updates' }}</small>
          </div>
          <div class="quest-actions">
            <i class="fas fa-heart"></i>
            <span>{{ quest.likes || 0 }}</span>
          </div>
        </div>
        <div v-if="!past7DaysQuests.length" class="no-quests">No quests in the past 7 days</div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { emitter } from '@/eventBus';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default {
  name: "DashboardHome",
  data() {
    return {
      upcomingCount: 0,
      inProgressCount: 0,
      completedCount: 0,
      userPoints: null,
      todayQuests: [],
      past7DaysQuests: [],
    };
  },
  methods: {
    async fetchTaskCounts() {
      try {
        const response = await axios.get('${API_BASE_URL}/api/tasks/counts', { withCredentials: true });
        this.upcomingCount = response.data.upcomingCount || 0;
        this.inProgressCount = response.data.inProgressCount || 0;
        this.completedCount = response.data.completedCount || 0;
      } catch (error) {
        console.error('Error fetching task counts:', error);
        if (error.response && error.response.status === 401) {
          alert('กรุณาล็อกอินก่อนใช้งาน');
          this.$router.push('/login');
        }
      }
    },
    async fetchUserPoints() {
      try {
        const response = await axios.get('${API_BASE_URL}/api/user', { withCredentials: true });
        if (response.data.user) {
          this.userPoints = response.data.user.points || 0;
        } else {
          this.userPoints = 0;
        }
      } catch (error) {
        console.error('Error fetching user points:', error);
        this.userPoints = 0;
        if (error.response && error.response.status === 401) {
          alert('กรุณาล็อกอินก่อนใช้งาน');
          this.$router.push('/login');
        }
      }
    },
    async fetchQuests() {
      try {
        const response = await axios.get('${API_BASE_URL}/api/quest/user', { withCredentials: true });
        const quests = (response.data.todayQuests || []).concat(response.data.past7DaysQuests || []);
        const now = new Date();
        const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));

        this.todayQuests = quests.filter(quest => {
          const questDate = new Date(quest.lastModified || quest.createdAt);
          return questDate.toDateString() === new Date().toDateString();
        });

        this.past7DaysQuests = quests.filter(quest => {
          const questDate = new Date(quest.lastModified || quest.createdAt);
          return questDate > sevenDaysAgo && questDate.toDateString() !== new Date().toDateString();
        });
      } catch (error) {
        console.error('Error fetching quests:', error);
        if (error.response && error.response.status === 401) {
          alert('กรุณาล็อกอินก่อนใช้งาน');
          this.$router.push('/login');
        }
      }
    },
    getQuestInitials(title) {
      return title.charAt(0).toUpperCase() || 'Un';
    },
    getQuestColor(quest) {
      const colors = ['#8B4513', '#808080', '#FFC0CB', '#ADD8E6'];
      return colors[Math.floor(Math.random() * colors.length)];
    },
    formatDate(date) {
      if (!date) return '';
      return new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    },
    async refreshData() {
      await Promise.all([
        this.fetchTaskCounts(),
        this.fetchUserPoints(),
        this.fetchQuests()
      ]);
    },
    goToCreateQuest() {
      this.$router.push('/dashboard/modal');
    }
  },
  created() {
    this.refreshData();
    emitter.on('refresh-dashboard', this.refreshData);
  },
  beforeUnmount() {
    emitter.off('refresh-dashboard', this.refreshData);
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.refreshData();
    });
  },
  beforeRouteUpdate(to, from, next) {
    this.refreshData();
    next();
  }
};
</script>

<style scoped>
.dashboard-home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0px;
  background-color: #f5f5f5;
  font-family: Arial, sans-serif;
}

.title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: #000;
}

.section-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
}

.subtitle {
  font-size: 1rem;
  font-weight: bold;
  margin: 15px 0 10px;
  color: #666;
}

.task-cards, .reward-section, .quest-cards {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
  justify-content: space-between;
}

.overview-section, .reward-section {
  margin-bottom: 40px;
}

.card {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 10px;
  flex: 1;
  min-width: 200px;
  max-width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  overflow: hidden;
  border: 1px solid #ddd;
  cursor: pointer;
}

.card.large {
  height: 100px;
  width: 30%;
  justify-content: center;
}

.card.small {
  height: 120px;
  width: 30%;
  justify-content: center;
}

.card i {
  font-size: 1.5rem;
  margin-bottom: 2px;
  color: #666;
}

.card h3 {
  font-size: 0.9rem;
  margin: 2px 0;
  color: #333;
  font-weight: 500;
}

.card p {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 2px 0;
  color: #000;
}

.card small {
  font-size: 0.7rem;
  color: #666;
  line-height: 1;
  margin-top: 2px;
}

.upcoming {
  background-color: #f7c6d7;
  border: 1px solid #f7c6d7;
}

.in-progress {
  background-color: #f9e28e;
  border: 1px solid #f9e28e;
}

.completed {
  background-color: #a8e6a1;
  border: 1px solid #a8e6a1;
}

.reward {
  background-color: #fff;
  border: 1px solid #ddd;
}

.template {
  background-color: #ffe4e1;
  border: 1px solid #ffe4e1;
}

.blank {
  background-color: #e6f3ff;
  border: 1px solid #e6f3ff;
}

.quest-card {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
  width: 100%;
  max-width: 300px;
  border: 1px solid #ddd;
}

.quest-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: bold;
  margin-right: 10px;
  font-size: 1rem;
}

.quest-info {
  flex: 1;
  text-align: left;
}

.quest-info h4 {
  font-size: 0.9rem;
  margin: 0 0 2px 0;
  color: #333;
  font-weight: 500;
}

.quest-info small {
  font-size: 0.7rem;
  color: #666;
}

.quest-actions {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #666;
}

.quest-actions i {
  font-size: 0.8rem;
}

.quest-actions span {
  font-size: 0.8rem;
}

.no-quests {
  color: #666;
  font-size: 0.9rem;
  text-align: center;
  width: 100%;
  margin: 10px 0;
  padding: 15px;
  background-color: #fff;
  border-radius: 12px;
  border: 1px solid #ddd;
}

@media (max-width: 768px) {
  .task-cards, .reward-section, .quest-cards {
    flex-direction: column;
    gap: 20px;
  }

  .card.large, .card.small {
    width: 100%;
  }

  .title {
    font-size: 1.5rem;
  }

  .section-title {
    font-size: 1rem;
  }

  .overview-section, .reward-section {
    margin-bottom: 20px;
  }
}
</style>