const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// สร้าง Task ใหม่
router.post('/tasks', async (req, res) => {
  try {
    const { title, description, status, dueDate } = req.body;

    // ตรวจสอบว่าฟิลด์ title มีค่า
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const task = new Task({
      title,
      description,
      status: status || 'upcoming',  // กำหนดสถานะเริ่มต้น
      dueDate,
    });

    const savedTask = await task.save();
    res.status(201).json(savedTask);  // ส่งคืน task ที่บันทึกเสร็จแล้ว
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ดึง Task ทั้งหมด (GET /api/tasks)
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ลบ Task (DELETE /api/tasks/:id)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Task.findByIdAndDelete(id);
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// นับจำนวน Tasks (GET /api/tasks/counts)
router.get('/counts', async (req, res) => {
    try {
        const totalTasks = await Task.countDocuments();
        const completedTasks = await Task.countDocuments({ completed: true });
        const pendingTasks = totalTasks - completedTasks;

        res.json({
            total: totalTasks,
            completed: completedTasks,
            pending: pendingTasks
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;
