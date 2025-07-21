import cors from 'cors';
import express from 'express';
import authRoutes from './routes/authRoutes';
import eventRoutes from './routes/eventRoutes';
import ticketRoutes from './routes/ticketRoutes';
import userOrgRoutes from './routes/userOrgRoutes';
const app = express();
const port = 5001;

// middleware
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://event-grid-2-0-git-main-md-minhajul-haques-projects.vercel.app',
      'https://event-grid-2-0.vercel.app',
    ],
    credentials: true,
  })
);
app.use(express.json());

// routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/users', userOrgRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Event Grid Server!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
