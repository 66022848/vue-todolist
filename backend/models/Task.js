const mongoose = require('mongoose');

// สร้าง schema สำหรับ Task
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['upcoming', 'in-progress', 'completed'], default: 'upcoming' },
  dueDate: { type: Date },
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
