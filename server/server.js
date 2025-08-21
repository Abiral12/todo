const express = require('express');
const connectDb = require('./config/db');
const taskroutes = require('./routes/taskRoutes');
const loginRoutes = require('./routes/logiRoutes');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
}))
app.use(cookieParser());

app.use('/api/tasks', taskroutes);
app.use('/api', loginRoutes);



app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});
connectDb();