require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT;
app.use(express.json());

const Student = require('./controllers/StudentController');

app.get('/status', (req, res) => {
  res.json({ message: 'API online!' });
});

app.get('/student', Student.index);
app.post('/student', Student.store);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
