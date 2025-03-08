<template> 
  <div class="dashboard-settings">
    <div>
      <h1 class="title">Profile Setting</h1>
    </div>
    <div class="profile-card" v-if="!loading && user">
      <div v-if="!isEditing" class="profile-display">
        <img :src="user.picture ? user.picture : defaultProfilePicture" alt="Profile" class="profile-image" />
        <div class="profile-details">
          <h2>{{ user.username || 'Unnamed User' }}</h2>
          <p>{{ user.email }}</p>
        </div>
        <button class="edit-button" @click="toggleEditing">🔧</button>
      </div>
      <div v-else class="profile-edit">
        <form @submit.prevent="updateProfile" class="edit-form">
          <div class="edit-field">
            <label for="username">Username:</label>
            <input
              type="text"
              id="username"
              v-model="editedUser.username"
              placeholder="Enter username"
              required
            />
          </div>
          <div class="edit-field">
            <label for="picture">Profile Picture:</label>
            <input
              type="file"
              id="picture"
              @change="handleFileUpload"
              accept="image/*"
            />
            <img v-if="previewImage" :src="previewImage" alt="Preview" class="preview-image" />
          </div>
          <div class="edit-actions">
            <button type="submit" class="save-button">Save</button>
            <button type="button" class="cancel-button" @click="cancelEditing">Cancel</button>
          </div>
        </form>
      </div>
    </div>
    <div v-else-if="loading">Loading...</div>
    <div v-else>
      No user data available. <router-link to="/login">Please log in</router-link>
    </div>
    <div v-if="!user?.username && !loading" class="no-profile-message">
      No profile set. <button @click="toggleEditing">Create Profile</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'DashboardSettings',
  data() {
    return {
      user: { username: '', email: '', picture: '' },
      editedUser: {
        username: '',
        picture: ''
      },
      defaultProfilePicture: 'https://via.placeholder.com/80',
      loading: true,
      isEditing: false,
      previewImage: null,
      uploadedFile: null,
      API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://vue-todolist-backend.onrender.com', // Fallback URL
    };
  },
  created() {
    this.fetchUserData();
  },
  methods: {
    async fetchUserData() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${this.API_BASE_URL}/api/user`, {
          withCredentials: true,
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        console.log('API Response:', response.data);
        if (response.data.user) {
          this.user = response.data.user;
          this.editedUser.username = this.user.username || '';
          this.editedUser.picture = this.user.picture || '';
          console.log('User picture:', this.user.picture);
        } else {
          this.user = { username: '', email: '', picture: '' };
          this.$router.push('/login');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        this.user = { username: 'Error Loading', email: '', picture: '' };
        if (error.response && error.response.status === 401) {
          this.$router.push('/login');
        }
      } finally {
        this.loading = false;
      }
    },
    toggleEditing() {
      this.isEditing = !this.isEditing;
      if (this.isEditing) {
        this.editedUser.username = this.user.username || '';
        this.editedUser.picture = this.user.picture || '';
        this.previewImage = this.user.picture || null;
      }
    },
    cancelEditing() {
      this.isEditing = false;
      this.editedUser.username = this.user.username || '';
      this.editedUser.picture = this.user.picture || '';
      this.previewImage = null;
      this.uploadedFile = null;
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.uploadedFile = file;
        const reader = new FileReader();
        reader.onload = (e) => {
          this.previewImage = e.target.result;
        };
        reader.readAsDataURL(file);
        console.log('Uploaded file:', file);
      }
    },
    async updateProfile() {
      try {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('username', this.editedUser.username);

        if (this.uploadedFile) {
          formData.append('picture', this.uploadedFile);
        }

        const response = await axios.put(`${this.API_BASE_URL}/api/user/update`, formData, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });

        console.log('Profile updated:', response.data);
        this.user = response.data.user;
        this.isEditing = false;
        alert('Profile updated successfully!');
      } catch (error) {
        console.error('Error updating profile:', error);
        if (error.response) {
          alert(`Failed to update profile. Status: ${error.response.status} - ${error.response.data.message || 'Please try again.'}`);
        } else {
          alert('Failed to update profile. Please check your network and try again.');
        }
      }
    }
  }
};
</script>

<style scoped>
.title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: #000;
  text-align: center;
}

.dashboard-settings {
  padding: 20px;
  background-color: #f9f9f9;
  min-height: 0vh;
}

.profile-card {
  background: #ffffff;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 700px;
  display: flex;
  align-items: center;
  gap: 15px;
  margin: 20px auto;
}

.profile-display, .profile-edit {
  display: flex;
  align-items: center;
  gap: 15px;
  width: 100%;
}

.profile-image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.profile-details {
  flex-grow: 1;
}

.profile-details h2 {
  margin: 0 0 5px 0;
  font-size: 18px;
  color: #333;
}

.profile-details p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.edit-button {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
}

.edit-field {
  display: flex;
  flex-direction: column;
}

.edit-field label {
  margin-bottom: 5px;
  font-weight: bold;
}

.edit-field input[type="text"],
.edit-field input[type="file"] {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100%;
}

.preview-image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-top: 10px;
}

.edit-actions {
  margin-top: 15px;
  display: flex;
  gap: 10px;
}

.save-button {
  background-color: #4CAF50;
  color: white;
  padding: 5px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.cancel-button {
  background-color: #f44336;
  color: white;
  padding: 5px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.no-profile-message {
  text-align: center;
  color: #666;
  margin-top: 20px;
}

.no-profile-message button {
  background-color: #4CAF50;
  color: white;
  padding: 5px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>