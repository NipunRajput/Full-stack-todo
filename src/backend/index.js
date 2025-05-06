const express = require('express');
const cors = require('cors');
const connection = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// GET all tasks
app.get('/tasks', (req, res) => {
  connection.query('SELECT * FROM tasks', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// POST a new task
app.post('/tasks', (req, res) => {
  const { title, text } = req.body;
  connection.query('INSERT INTO tasks (title, text) VALUES (?, ?)', [title, text], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Task created', id: results.insertId });
  });
});

app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  await connection.query('DELETE FROM tasks WHERE id = ?', [id]);
  res.json({ message: 'deleted', id: Number(id) });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
