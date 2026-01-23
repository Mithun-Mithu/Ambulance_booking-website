// ambulance-backend.js - Ambulance Booking Backend Server
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const WebSocket = require('ws');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// In-memory data storage (in production, use a proper database)
let ambulances = [
    {
        id: 'AMB001',
        driverName: 'Ramanna',
        phone: '7892210283',
        photo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNTAiIGZpbGw9IiM2NjdlZWEiLz48dGV4dCB4PSI1MCIgeT0iNTUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjE0Ij5TYXJhaDwvdGV4dD48L3N2Zz4=',
        status: 'available',
        location: 'Main Street & 5th cross, JCR, Chitradurga',
        type: 'Advanced Life Support',
        eta: '5 mins'
    },
    {
        id: 'AMB002',
        driverName: 'Nandish',
        phone: '91+---------',
        photo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNTAiIGZpbGw9IiMyZWQ1NzMiLz48dGV4dCB4PSI1MCIgeT0iNTUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjE0Ij5NaWtlPC90ZXh0Pjwvc3ZnPg==',
        status: 'en-route',
        location: 'Downtown Medical District',
        type: 'Basic Life Support',
        eta: '12 mins'
    },
    {
        id: 'AMB003',
        driverName: 'Rahul',
        phone: '91+----------',
        photo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNTAiIGZpbGw9IiNmZmE1MDIiLz48dGV4dCB4PSI1MCIgeT0iNTUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjE0Ij5FbWlseTwvdGV4dD48L3N2Zz4=',
        status: 'available',
        location: 'District Hospital, Chitradurga',
        type: 'Speed Ambulance',
        eta: '8 mins'
    },
    {
        id: 'AMB004',
        driverName: 'Wilson',
        phone: '91+----------',
        photo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNTAiIGZpbGw9IiM3NjRiYTIiLz48dGV4dCB4PSI1MCIgeT0iNTUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjE0Ij5KYW1lczwvdGV4dD48L3N2Zz4=',
        status: 'busy',
        location: 'Near Stadium, Chitradurga',
        type: 'Ambari Ambulance',
        eta: 'N/A'
    }
];

let bookings = [];
let hospitals = [
    { id: 'city-hospital', name: 'City General Hospital', address: '123 Medical Center Dr', phone: '+1-555-1000' },
    { id: 'metro-medical', name: 'Metro Medical Center', address: '456 Health Plaza', phone: '+1-555-2000' },
    { id: 'emergency-care', name: 'Emergency Care Hospital', address: '789 Emergency Blvd', phone: '+1-555-3000' },
    { id: 'specialty-clinic', name: 'Specialty Medical Clinic', address: '321 Specialty Way', phone: '+1-555-4000' }
];

// WebSocket connections for real-time updates
let clients = [];

wss.on('connection', (ws) => {
    clients.push(ws);
    console.log('New client connected');

    // Send current ambulance data to new client
    ws.send(JSON.stringify({
        type: 'ambulance_update',
        data: ambulances
    }));

    ws.on('message', (message) => {
        console.log('Received:', message.toString());
    });

    ws.on('close', () => {
        clients = clients.filter(client => client !== ws);
        console.log('Client disconnected');
    });
});

// Broadcast updates to all connected clients
function broadcastUpdate(type, data) {
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type, data }));
        }
    });
}

// API Routes
app.get('/api/ambulances', (req, res) => {
    res.json(ambulances);
});

app.get('/api/ambulances/:id', (req, res) => {
    const ambulance = ambulances.find(a => a.id === req.params.id);
    if (ambulance) {
        res.json(ambulance);
    } else {
        res.status(404).json({ error: 'Ambulance not found' });
    }
});

app.get('/api/ambulances/status/available', (req, res) => {
    const available = ambulances.filter(a => a.status === 'available');
    res.json(available);
});

app.get('/api/hospitals', (req, res) => {
    res.json(hospitals);
});

app.post('/api/bookings', async (req, res) => {
    try {
        const booking = {
            id: uuidv4(),
            ...req.body,
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        bookings.push(booking);

        // Find and update ambulance status
        const ambulance = ambulances.find(a => a.id === req.body.ambulanceId);
        if (ambulance) {
            ambulance.status = 'en-route';
            broadcastUpdate('ambulance_update', ambulances);
        }

        res.status(201).json(booking);
    } catch (error) {
        console.error('Booking creation error:', error);
        res.status(500).json({ error: 'Failed to create booking' });
    }
});

app.get('/api/bookings', (req, res) => {
    res.json(bookings);
});

app.put('/api/bookings/:id/status', (req, res) => {
    const booking = bookings.find(b => b.id === req.params.id);
    if (booking) {
        booking.status = req.body.status;
        res.json(booking);
    } else {
        res.status(404).json({ error: 'Booking not found' });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚑 Ambulance Booking Server running on port ${PORT}`);
    console.log(`📱 WebSocket server ready for real-time updates`);
    console.log(`🌐 Frontend available at: http://localhost:${PORT}`);
    console.log(`📊 API endpoints available at: http://localhost:${PORT}/api`);
});
