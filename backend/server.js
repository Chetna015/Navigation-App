import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'CSJMU Smart Campus Backend API Service Operational 🚀' });
});

// Campus 360 Locations Endpoint
app.get('/api/360-locations', (req, res) => {
  res.json({
    status: 'success',
    locations: [
      { id: 'main_gate', name: 'CSJMU Main Gate 1', category: 'Campus Gateway', lat: 26.4969, lng: 80.2666 },
      { id: 'auditorium_arena', name: 'CSJMU Grand Auditorium', category: 'Summit Venue', lat: 26.4983, lng: 80.2658 },
      { id: 'uiet_entrance', name: 'UIET School of Engineering', category: 'Academic Block', lat: 26.5005, lng: 80.2675 },
      { id: 'central_library', name: 'Central Library & Digital Hub', category: 'Library Block', lat: 26.4990, lng: 80.2670 }
    ]
  });
});

app.listen(PORT, () => {
  console.log(`CSJMU Backend Server running on port ${PORT}`);
});
