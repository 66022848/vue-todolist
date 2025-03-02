const mongoose = require('mongoose');

// สร้าง Schema สำหรับ Quest
const questSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['Event', 'Memo'],
  },
  eventDetails: {
    startDate: {
      type: Date,
      required: function () { return this.type === 'Event'; },
    },
    endDate: {
      type: Date,
      required: function () { return this.type === 'Event'; },
    },
    startTime: {
      type: String,
      required: function () { return this.type === 'Event'; },
    },
    endTime: {
      type: String,
      required: function () { return this.type === 'Event'; },
    },
    reminderTime: {
      type: String,
      required: function () { return this.type === 'Event'; },
    },
    repeat: {
      type: String,
      required: function () { return this.type === 'Event'; },
      enum: ['none', 'daily', 'weekly', 'monthly'],
    },
    address: String,
    eventURL: String,
    selectedColor: String,
  },
  memoDetails: {
    title: { type: String, required: function () { return this.type === 'Memo'; } },
    selectedColor: { type: String, required: function () { return this.type === 'Memo'; } },
    dayCounter: { type: Number, required: function () { return this.type === 'Memo'; } },
    startTime: { type: String, required: function () { return this.type === 'Memo'; } },
    startDate: { type: Date, required: function () { return this.type === 'Memo'; } },
  },
  userId: { // เพิ่มฟิลด์นี้เพื่อผูกกับผู้ใช้
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastModified: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: Number,
    default: 0,
  },
});

const Quest = mongoose.model('Quest', questSchema);
module.exports = Quest;